import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture || (profile as any).image || null,
        };
      },
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      mapProfileToUser: (profile) => {
        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url || (profile as any).avatar || (profile as any).image || null,
        };
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const image =
            user.image ||
            (user as any).picture ||
            (user as any).avatar_url ||
            (user as any).avatar;
          return {
            data: {
              ...user,
              image: image || null,
            },
          };
        },
      },
      update: {
        before: async (user) => {
          const image =
            user.image ||
            (user as any).picture ||
            (user as any).avatar_url ||
            (user as any).avatar;
          return {
            data: {
              ...user,
              image: image || user.image || null,
            },
          };
        },
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      let image =
        user.image ||
        (user as any).picture ||
        (user as any).avatar ||
        (user as any).avatar_url ||
        null;
      if (!image && user.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { image: true },
          });
          if (dbUser?.image) {
            image = dbUser.image;
          }
        } catch {
          // ignore lookup error
        }
      }
      return {
        user: {
          ...user,
          image: image || null,
          picture: image || null,
          avatar: image || null,
        },
        session,
      };
    }),
  ],
});

