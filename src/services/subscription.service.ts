import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  FREE_LIMITS,
  FeatureType,
  PremiumRequiredError,
} from "@/lib/subscription-constants";
import Stripe from "stripe";

export interface SubscriptionStatusInfo {
  isPremium: boolean;
  plan: "FREE" | "PREMIUM";
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface UserUsageInfo {
  isPremium: boolean;
  plan: "FREE" | "PREMIUM";
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  resumes: {
    current: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
  };
  analyses: {
    current: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
  };
  interviews: {
    current: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
  };
}

export class SubscriptionService {
  /**
   * Retrieves user's authoritative active subscription details.
   * Premium access is granted ONLY if an active/trialing subscription exists and is within current billing period.
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionStatusInfo> {
    if (!userId) {
      return {
        isPremium: false,
        plan: "FREE",
        status: "INACTIVE",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      };
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ["ACTIVE", "TRIALING"] },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!subscription) {
      // Check if there is any subscription record (e.g. canceled, past_due)
      const latestSub = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      return {
        isPremium: false,
        plan: "FREE",
        status: latestSub?.status || "INACTIVE",
        currentPeriodEnd: latestSub?.currentPeriodEnd || null,
        cancelAtPeriodEnd: latestSub?.cancelAtPeriodEnd || false,
        stripeCustomerId: latestSub?.stripeCustomerId || null,
        stripeSubscriptionId: latestSub?.stripeSubscriptionId || null,
      };
    }

    const now = new Date();
    // Valid if currentPeriodEnd is not set or in the future
    const isPeriodValid = !subscription.currentPeriodEnd || subscription.currentPeriodEnd > now;
    const isPremium = subscription.plan === "PREMIUM" && isPeriodValid;

    return {
      isPremium,
      plan: isPremium ? "PREMIUM" : "FREE",
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    };
  }

  /**
   * Fast server-side boolean check for premium status.
   */
  static async isPremiumUser(userId: string): Promise<boolean> {
    const sub = await this.getUserSubscription(userId);
    return sub.isPremium;
  }

  /**
   * Returns comprehensive usage breakdown and limits for candidate dashboard & billing views.
   */
  static async getUserUsage(userId: string): Promise<UserUsageInfo> {
    const sub = await this.getUserSubscription(userId);

    const [resumeCount, analysisCount, interviewCount] = await Promise.all([
      // Count builder resumes
      prisma.resume.count({
        where: {
          userId,
          OR: [{ source: "builder" }, { source: null }],
        },
      }),
      // Count analysis reports
      prisma.resumeAnalysis.count({
        where: { userId },
      }),
      // Count mock interview sessions
      prisma.interviewSession.count({
        where: { userId },
      }),
    ]);

    return {
      isPremium: sub.isPremium,
      plan: sub.plan,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      resumes: {
        current: resumeCount,
        limit: FREE_LIMITS.resumes,
        remaining: sub.isPremium ? Infinity : Math.max(0, FREE_LIMITS.resumes - resumeCount),
        isUnlimited: sub.isPremium,
      },
      analyses: {
        current: analysisCount,
        limit: FREE_LIMITS.analyses,
        remaining: sub.isPremium ? Infinity : Math.max(0, FREE_LIMITS.analyses - analysisCount),
        isUnlimited: sub.isPremium,
      },
      interviews: {
        current: interviewCount,
        limit: FREE_LIMITS.interviews,
        remaining: sub.isPremium ? Infinity : Math.max(0, FREE_LIMITS.interviews - interviewCount),
        isUnlimited: sub.isPremium,
      },
    };
  }

  /**
   * Concurrency-safe quota enforcement and transactional execution.
   * Acquires a PostgreSQL transaction-scoped advisory lock per user & feature
   * to guarantee parallel requests cannot bypass free tier limits.
   */
  static async executeWithQuotaCheck<T>(
    userId: string,
    feature: FeatureType,
    callback: (tx: any) => Promise<T>
  ): Promise<T> {
    const isPremium = await this.isPremiumUser(userId);
    if (isPremium) {
      return callback(prisma);
    }

    return await prisma.$transaction(async (tx) => {
      // Advisory transaction lock prevents concurrent requests for this user+feature
      const lockKey = `${userId}:${feature}`;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      let currentCount = 0;
      let limit = 0;

      if (feature === "resume") {
        currentCount = await tx.resume.count({
          where: {
            userId,
            OR: [{ source: "builder" }, { source: null }],
          },
        });
        limit = FREE_LIMITS.resumes;
      } else if (feature === "analysis") {
        currentCount = await tx.resumeAnalysis.count({
          where: { userId },
        });
        limit = FREE_LIMITS.analyses;
      } else if (feature === "interview") {
        currentCount = await tx.interviewSession.count({
          where: { userId },
        });
        limit = FREE_LIMITS.interviews;
      }

      if (currentCount >= limit) {
        throw new PremiumRequiredError(feature);
      }

      return await callback(tx);
    });
  }

  /**
   * Retrieves or creates a Stripe Customer linked to the user account.
   */
  static async getOrCreateStripeCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string> {
    // 1. Check if we already have a customer ID in DB
    const existingSub = await prisma.subscription.findFirst({
      where: { userId, stripeCustomerId: { not: null } },
      select: { stripeCustomerId: true },
    });

    if (existingSub?.stripeCustomerId) {
      // Ensure customer metadata is synced on Stripe
      try {
        await stripe.customers.update(existingSub.stripeCustomerId, {
          metadata: { userId },
        });
      } catch {
        // Non-blocking if customer is already updated or archived
      }
      return existingSub.stripeCustomerId;
    }

    // 2. Search Stripe for existing customer with same email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const customerId = existingCustomers.data[0].id;
      try {
        await stripe.customers.update(customerId, {
          metadata: { userId },
        });
      } catch {
        // Non-blocking
      }

      // Update existing subscription record if present
      const record = await prisma.subscription.findFirst({ where: { userId } });
      if (record) {
        await prisma.subscription.update({
          where: { id: record.id },
          data: { stripeCustomerId: customerId },
        });
      }
      return customerId;
    }

    // 3. Create new customer on Stripe
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        userId,
      },
    });

    return customer.id;
  }

  /**
   * Creates a Stripe Checkout Session for recurring monthly Premium subscription.
   */
  static async createCheckoutSession(params: {
    userId: string;
    email: string;
    name?: string;
    origin?: string;
  }): Promise<{ url: string; sessionId: string }> {
    const priceId =
      process.env.STRIPE_PREMIUM_PRICE_ID || process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error("STRIPE_PREMIUM_PRICE_ID (or STRIPE_PRICE_ID) is not configured on the server.");
    }

    const customerId = await this.getOrCreateStripeCustomer(
      params.userId,
      params.email,
      params.name
    );

    const baseUrl = params.origin || process.env.BETTER_AUTH_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: params.userId,
      subscription_data: {
        metadata: {
          userId: params.userId,
        },
      },
      metadata: {
        userId: params.userId,
      },
      success_url: `${baseUrl}/dashboard?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?billing=canceled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session URL.");
    }

    console.log(`[Stripe Checkout] Session created: ${session.id} for user ${params.userId}`);

    return { url: session.url, sessionId: session.id };
  }

  /**
   * Creates a Stripe Customer Portal session for managing subscriptions / cancellation.
   */
  static async createPortalSession(userId: string, origin?: string): Promise<{ url: string }> {
    const sub = await this.getUserSubscription(userId);
    let customerId = sub.stripeCustomerId;

    if (!customerId) {
      // Attempt recovery by looking up user email
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        customerId = await this.getOrCreateStripeCustomer(userId, user.email, user.name);
      }
    }

    if (!customerId) {
      throw new Error("No Stripe customer record found for this account. Please subscribe first.");
    }

    const baseUrl = origin || process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    });

    console.log(`[Stripe Portal] Created portal session for user: ${userId}, customer: ${customerId}`);

    return { url: portalSession.url };
  }

  /**
   * Authoritative server-side sync when user returns from Checkout with session_id.
   * Verifies payment/subscription status with Stripe and updates the local database.
   */
  static async syncSessionFromCheckout(
    sessionId: string,
    authenticatedUserId: string
  ): Promise<UserUsageInfo> {
    try {
      if (!sessionId || !sessionId.startsWith("cs_")) {
        return await this.getUserUsage(authenticatedUserId);
      }

      console.log(`[Stripe Sync] Verifying checkout session: ${sessionId} for user ${authenticatedUserId}`);

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });

      // Verify session belongs to the requesting user
      const matchesUser =
        session.client_reference_id === authenticatedUserId ||
        session.metadata?.userId === authenticatedUserId;

      if (!matchesUser) {
        console.warn(`[Stripe Sync] Session ${sessionId} user mismatch. Expected ${authenticatedUserId}`);
        return await this.getUserUsage(authenticatedUserId);
      }

      if (session.subscription) {
        const stripeSub =
          typeof session.subscription === "string"
            ? await stripe.subscriptions.retrieve(session.subscription)
            : (session.subscription as Stripe.Subscription);

        await this.syncStripeSubscription(stripeSub, authenticatedUserId);
      }

      return await this.getUserUsage(authenticatedUserId);
    } catch (error) {
      console.error(`[Stripe Sync] Error verifying session ${sessionId}:`, error);
      return await this.getUserUsage(authenticatedUserId);
    }
  }

  /**
   * Idempotent Stripe Webhook Event Processor.
   * Guarantees duplicate webhook deliveries are safely deduplicated.
   */
  static async processWebhookEvent(event: Stripe.Event): Promise<{ handled: boolean; duplicate?: boolean }> {
    console.log(`[Stripe Webhook] Received event: ${event.type} (ID: ${event.id})`);

    // 1. Idempotency check via stripe_event table
    const existingEvent = await prisma.stripeEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingEvent) {
      console.log(`[Stripe Webhook] Deduplicated duplicate event: ${event.id}`);
      return { handled: true, duplicate: true };
    }

    // 2. Record event in database
    await prisma.stripeEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        status: "PROCESSED",
        data: event.data.object as any,
      },
    });

    // 3. Process lifecycle event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
          await this.syncStripeSubscription(
            stripeSub,
            session.client_reference_id || session.metadata?.userId || undefined
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const stripeSub = event.data.object as Stripe.Subscription;
        await this.syncStripeSubscription(stripeSub);
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(stripeSub);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        // Other events logged and skipped safely
        break;
    }

    console.log(`[Stripe Webhook] Successfully processed event: ${event.type} (ID: ${event.id})`);
    return { handled: true };
  }

  /**
   * Synchronizes Stripe Subscription state into PostgreSQL database.
   */
  private static async syncStripeSubscription(
    stripeSub: Stripe.Subscription,
    fallbackUserId?: string
  ) {
    const customerId =
      typeof stripeSub.customer === "string" ? stripeSub.customer : stripeSub.customer?.id;

    // ── Multi-Tier User Resolution ──────────────────────────────────────────
    let userId = stripeSub.metadata?.userId || fallbackUserId;

    // Check DB subscription by stripeSubscriptionId
    if (!userId) {
      const existingBySub = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: stripeSub.id },
        select: { userId: true },
      });
      userId = existingBySub?.userId;
    }

    // Check DB subscription by stripeCustomerId
    if (!userId && customerId) {
      const userByCustomer = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
        select: { userId: true },
      });
      userId = userByCustomer?.userId;
    }

    // Check Stripe Customer metadata & email
    if (!userId && customerId) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
          if (customer.metadata?.userId) {
            userId = customer.metadata.userId;
          } else if (customer.email) {
            const dbUser = await prisma.user.findUnique({
              where: { email: customer.email },
              select: { id: true },
            });
            userId = dbUser?.id;
          }
        }
      } catch (err) {
        console.warn(`[Stripe Webhook] Customer retrieve lookup failed:`, err);
      }
    }

    if (!userId) {
      console.warn(`[Stripe Webhook] Unable to match subscription ${stripeSub.id} (customer: ${customerId}) to a local user.`);
      return;
    }

    // Ensure Stripe customer metadata has userId
    if (customerId && userId) {
      stripe.customers
        .update(customerId, {
          metadata: { userId },
        })
        .catch(() => {});
    }

    const priceId = stripeSub.items?.data?.[0]?.price?.id || null;

    const statusMap: Record<
      string,
      "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" | "INCOMPLETE_EXPIRED" | "TRIALING" | "UNPAID" | "INACTIVE"
    > = {
      active: "ACTIVE",
      trialing: "TRIALING",
      past_due: "PAST_DUE",
      canceled: "CANCELED",
      unpaid: "UNPAID",
      incomplete: "INCOMPLETE",
      incomplete_expired: "INCOMPLETE_EXPIRED",
      paused: "INACTIVE",
    };

    const status = statusMap[stripeSub.status] || "INACTIVE";
    const isActive = status === "ACTIVE" || status === "TRIALING";
    const plan = isActive ? "PREMIUM" : "FREE";

    // Period timestamps: support modern Stripe SDK format + items fallback
    const item = stripeSub.items?.data?.[0];
    const currentPeriodStartSec =
      (stripeSub as any).current_period_start ?? item?.current_period_start ?? stripeSub.start_date;
    const currentPeriodEndSec =
      (stripeSub as any).current_period_end ?? item?.current_period_end;

    const currentPeriodStart = currentPeriodStartSec
      ? new Date(currentPeriodStartSec * 1000)
      : new Date();
    const currentPeriodEnd = currentPeriodEndSec
      ? new Date(currentPeriodEndSec * 1000)
      : null;
    const startDate = stripeSub.start_date
      ? new Date(stripeSub.start_date * 1000)
      : new Date();
    const canceledAt = stripeSub.canceled_at
      ? new Date(stripeSub.canceled_at * 1000)
      : null;
    const endedAt = stripeSub.ended_at
      ? new Date(stripeSub.ended_at * 1000)
      : null;

    // ── Upsert / Update Subscription Record ─────────────────────────────────
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSub.id },
    });

    if (existing) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: stripeSub.id },
        data: {
          userId,
          status,
          plan,
          stripeCustomerId: customerId,
          stripePriceId: priceId,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
          canceledAt,
          endedAt,
        },
      });
    } else {
      // Check if user has an existing record with null/old subscription ID
      const userSub = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (userSub && (!userSub.stripeSubscriptionId || userSub.stripeSubscriptionId === stripeSub.id)) {
        await prisma.subscription.update({
          where: { id: userSub.id },
          data: {
            status,
            plan,
            stripeCustomerId: customerId,
            stripeSubscriptionId: stripeSub.id,
            stripePriceId: priceId,
            startDate,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
            canceledAt,
            endedAt,
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId,
            plan,
            status,
            stripeCustomerId: customerId,
            stripeSubscriptionId: stripeSub.id,
            stripePriceId: priceId,
            startDate,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
            canceledAt,
            endedAt,
          },
        });
      }
    }

    console.log(
      `[Stripe Sync] Synced subscription ${stripeSub.id} for user ${userId}: status=${status}, plan=${plan}, cancelAtPeriodEnd=${stripeSub.cancel_at_period_end}`
    );
  }

  /**
   * Handles subscription termination / cancellation.
   */
  private static async handleSubscriptionDeleted(stripeSub: Stripe.Subscription) {
    const endedAt = stripeSub.ended_at ? new Date(stripeSub.ended_at * 1000) : new Date();

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: stripeSub.id },
      data: {
        status: "CANCELED",
        plan: "FREE",
        endedAt,
        cancelAtPeriodEnd: false,
      },
    });

    console.log(`[Stripe Sync] Subscription ${stripeSub.id} marked CANCELED and reset to Free Plan.`);
  }

  /**
   * Records payment history on successful invoice.
   */
  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (!invoice.id) return;

    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

    // Find local user by customer ID
    const userSub = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      select: { userId: true },
    });

    if (!userSub?.userId) return;

    const paymentIntentId =
      typeof (invoice as any).payment_intent === "string"
        ? (invoice as any).payment_intent
        : (invoice as any).payment_intent?.id || null;

    await prisma.payment.upsert({
      where: { stripeInvoiceId: invoice.id },
      update: {
        status: "PAID",
        amount: invoice.amount_paid || 0,
        currency: invoice.currency || "usd",
        hostedInvoiceUrl: invoice.hosted_invoice_url || null,
      },
      create: {
        userId: userSub.userId,
        stripeInvoiceId: invoice.id,
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId: customerId,
        amount: invoice.amount_paid || 0,
        currency: invoice.currency || "usd",
        status: "PAID",
        hostedInvoiceUrl: invoice.hosted_invoice_url || null,
      },
    });

    console.log(`[Stripe Payment] Recorded PAID invoice ${invoice.id} for user ${userSub.userId}`);
  }

  /**
   * Records payment failure for audit.
   */
  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (!invoice.id) return;

    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

    const userSub = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      select: { userId: true },
    });

    if (!userSub?.userId) return;

    await prisma.payment.upsert({
      where: { stripeInvoiceId: invoice.id },
      update: {
        status: "FAILED",
      },
      create: {
        userId: userSub.userId,
        stripeInvoiceId: invoice.id,
        stripeCustomerId: customerId,
        amount: invoice.amount_due || 0,
        currency: invoice.currency || "usd",
        status: "FAILED",
      },
    });

    console.warn(`[Stripe Payment] Recorded FAILED invoice ${invoice.id} for user ${userSub.userId}`);
  }
}
