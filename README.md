# ResuMate AI

ResuMate AI is a career preparation platform focused on resume building, ATS resume analysis, and AI-powered mock interviews.

The application combines resume management, AI feedback, interview practice, authentication, persistent user data, and subscription-based usage limits in a single Next.js application.

## Live Demo

[ResuMate AI](https://resu-mate-ai-client.vercel.app/)

## Features

### Resume Builder

Create and manage professional resumes directly from the application.

* Create multiple resumes
* Edit personal information
* Add work experience
* Add education
* Add skills
* Add projects
* Add certifications
* Add custom sections
* Choose resume templates
* Customize accent color, font, spacing, and border style
* Save resume data to PostgreSQL
* Update and delete existing resumes
* Generate printable/downloadable resume output

### AI Resume Analyzer

Analyze a resume using Google Gemini and receive structured ATS-focused feedback.

The analyzer can work with:

* Uploaded resume documents
* Pasted resume text
* Resumes already saved in the database
* Optional job descriptions

Analysis includes:

* ATS score
* Keyword matching
* Missing keywords
* Formatting issues
* Experience relevance
* Matched skills
* Resume strengths
* Bullet-point improvement suggestions
* Target role detection
* Experience-level detection
* Overall feedback

The application also validates uploaded content before sending it for analysis to reduce incorrect results from non-resume documents.

### Resume Optimization

The application provides AI-assisted resume improvement functionality, including:

* Missing keyword integration
* Experience bullet rewrites
* Summary improvements
* Achievement-focused wording
* ATS-oriented improvements

### AI Mock Interviews

Practice interviews based on a selected role and difficulty level.

Supported interview types include:

* Technical
* Behavioral
* System Design
* Situational
* Mixed interviews

Interview sessions can include:

* AI-generated questions
* Expected concepts and keywords
* Interview context
* Hints
* Sample answers
* Real-time answer evaluation
* Individual question scores
* Strengths and weaknesses
* Ideal answers
* Final interview reports
* Overall interview score
* Category-based scores
* Interview history

The answer evaluation also checks whether an answer is meaningful, professional, and relevant to the question instead of giving positive scores to random or unrelated responses.

### Career Assistant

A chat-based AI assistant is available for career-related questions, including:

* Resume improvement
* Interview preparation
* Technical career questions
* Skills to learn
* Career preparation

### Authentication

Authentication is handled with Better Auth.

Supported authentication includes:

* Email and password
* Google
* GitHub
* Session management
* Protected application routes

User-related data is connected to the authenticated account through PostgreSQL.

### Dashboard

The dashboard provides user-specific information such as:

* Resume data
* Resume analysis history
* Interview sessions
* Usage information
* Subscription status

### Subscription System

ResuMate AI includes a Stripe-based monthly subscription system.

#### Free Plan

The current free-tier limits are:

| Feature         | Free Limit |
| --------------- | ---------: |
| Resume Builder  |  3 resumes |
| Resume Analysis | 3 analyses |
| Mock Interviews | 3 sessions |

#### Premium Plan

The Premium plan provides:

* Unlimited resume creation
* Unlimited resume analysis
* Unlimited mock interviews

Usage limits are enforced on the server rather than relying only on the frontend.

The application also uses a PostgreSQL transaction and advisory lock when checking free-tier quotas so concurrent requests cannot easily bypass the limits.

### Stripe Billing

Stripe is used for:

* Monthly recurring subscriptions
* Checkout sessions
* Customer management
* Subscription synchronization
* Billing portal
* Payment records
* Webhook processing

Stripe webhook events are stored in the database to prevent duplicate event processing.

Handled subscription/payment events include:

* `checkout.session.completed`
* `customer.subscription.created`
* `customer.subscription.updated`
* `customer.subscription.deleted`
* `invoice.payment_succeeded`
* `invoice.payment_failed`

---

## Tech Stack

### Application

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

### UI

* shadcn/ui
* Base UI
* Lucide React
* React Icons
* Recharts
* tsParticles

### Backend

The application uses the Next.js App Router and Route Handlers for backend functionality.

* Next.js Route Handlers
* Server-side services
* REST-style API endpoints
* Zod validation

There is no separate Express server in the current repository.

### Database

* PostgreSQL
* Prisma ORM
* `@prisma/adapter-pg`

### Authentication

* Better Auth
* Email/password authentication
* Google OAuth
* GitHub OAuth

### AI

* Google Gemini
* `@google/genai`
* Gemini 2.5 Flash

AI functionality is used for:

* Resume analysis
* Resume optimization
* Interview question generation
* Interview answer evaluation
* Interview reports
* Career assistance

### Payments

* Stripe
* Stripe Checkout
* Stripe Customer Portal
* Stripe Webhooks

### Document Processing

* Mammoth
* unpdf

These are used to extract content from supported uploaded documents for resume analysis.

---

## Application Architecture

ResuMate AI is structured as a single Next.js application.

```text
User
 │
 ▼
Next.js App Router
 │
 ├── UI / Pages
 │
 ├── Authentication
 │     └── Better Auth
 │
 ├── API Route Handlers
 │     ├── Resume APIs
 │     ├── Resume Analysis
 │     ├── Interview APIs
 │     ├── Career Chat
 │     ├── Dashboard
 │     ├── Subscription
 │     └── Stripe
 │
 ├── Services
 │     ├── ResumeService
 │     ├── InterviewService
 │     ├── SubscriptionService
 │     ├── ChatService
 │     └── DashboardService
 │
 ├── Google Gemini
 │
 ├── Prisma ORM
 │
 ▼
PostgreSQL
```

---

## Project Structure

```text
ResuMate-AI/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze-resume/
│   │   │   ├── auth/
│   │   │   ├── builder/
│   │   │   ├── chat/
│   │   │   ├── dashboard/
│   │   │   ├── interview/
│   │   │   ├── optimize-resume/
│   │   │   ├── resumes/
│   │   │   ├── stripe/
│   │   │   └── subscription/
│   │   │
│   │   ├── dashboard/
│   │   ├── interview/
│   │   ├── pricing/
│   │   ├── resume/
│   │   └── ...
│   │
│   ├── components/
│   │   ├── features/
│   │   ├── shared/
│   │   └── ui/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── db.ts
│   │   ├── document-parser.ts
│   │   ├── gemini.ts
│   │   ├── prisma.ts
│   │   ├── rate-limit.ts
│   │   ├── resume-validator.ts
│   │   ├── stripe.ts
│   │   ├── subscription-constants.ts
│   │   └── validations.ts
│   │
│   ├── services/
│   │   ├── ai-builder.service.ts
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── interview.service.ts
│   │   ├── resume.service.ts
│   │   └── subscription.service.ts
│   │
│   ├── types/
│   │
│   └── utils/
│
├── package.json
├── prisma.config.ts
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Database

The application uses PostgreSQL with Prisma.

The main database models include:

* `User`
* `Session`
* `Account`
* `Verification`
* `Resume`
* `ResumeAnalysis`
* `InterviewSession`
* `InterviewQuestion`
* `Subscription`
* `Payment`
* `StripeEvent`

### Resume Data

Resume information is stored using a combination of normal relational fields and JSON sections.

Examples include:

* Personal information
* Experience
* Education
* Skills
* Projects
* Certifications
* Custom sections
* Resume styling
* ATS score

### Interview Data

Interview sessions and individual questions are persisted so users can return to previous interview sessions and review their performance.

### Subscription Data

Stripe-related subscription and payment information is synchronized with PostgreSQL.

---

## API Routes

The application exposes API functionality through Next.js Route Handlers.

### Authentication

```text
/api/auth/[...all]
```

### Resume

```text
GET    /api/resumes
POST   /api/resumes

GET    /api/resumes/[id]
PATCH  /api/resumes/[id]
DELETE /api/resumes/[id]

POST   /api/resumes/upload
```

### Resume Analysis

```text
POST /api/analyze-resume
GET  /api/analyze-resume
```

### Resume Optimization

```text
POST /api/optimize-resume
```

### AI Resume Builder

```text
POST /api/builder/ai-assist
```

### Interview

```text
POST /api/interview
POST /api/interview/generate-questions
POST /api/interview/evaluate-answer
POST /api/interview/final-report
```

### Career Chat

```text
POST /api/chat
```

### Dashboard

```text
GET /api/dashboard
```

### Subscription

```text
GET /api/subscription/status
```

### Stripe

```text
POST /api/stripe/checkout
POST /api/stripe/portal
POST /api/stripe/webhook
```

---

## Getting Started

### Requirements

Before running the project locally, install:

* Node.js
* npm
* PostgreSQL
* A Google Gemini API key

Stripe and OAuth credentials are only required when using those features.

### Clone the Repository

```bash
git clone https://github.com/SM-Raihan77/ResuMate-AI.git

cd ResuMate-AI
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root.

A typical configuration looks like this:

```env
DATABASE_URL="your-postgresql-connection-string"

BETTER_AUTH_URL="http://localhost:3000"

BETTER_AUTH_SECRET="your-better-auth-secret"

GEMINI_API_KEY="your-gemini-api-key"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PREMIUM_PRICE_ID="price_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

The Gemini integration also accepts:

```env
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

or:

```env
GOOGLE_API_KEY="your-api-key"
```

The application checks these names when resolving the Gemini API key.

> Never commit `.env` or other files containing secret credentials.

---

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Push the current Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
```

For local database inspection:

```bash
npx prisma studio
```

If you modify the Prisma schema during development, regenerate the client after schema changes:

```bash
npx prisma generate
```

---

## Run the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Lint

```bash
npm run lint
```

---

## Stripe Configuration

The Premium subscription uses a monthly recurring Stripe Price.

The application expects the Price ID through:

```env
STRIPE_PREMIUM_PRICE_ID="price_xxxxxxxxxxxxx"
```

### Webhook

Create a Stripe webhook endpoint pointing to:

```text
https://your-domain.com/api/stripe/webhook
```

For local development, Stripe CLI can be used to forward webhook events to:

```text
http://localhost:3000/api/stripe/webhook
```

The webhook signing secret must be configured as:

```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

The webhook endpoint is responsible for keeping the local subscription state synchronized with Stripe.

---

## Usage Limits

Free-tier limits are centralized in:

```text
src/lib/subscription-constants.ts
```

Current limits:

```text
Resumes       → 3
Analyses      → 3
Interviews    → 3
```

Premium users receive unlimited access.

Quota enforcement is performed server-side through `SubscriptionService`, so changing frontend counters does not bypass the actual limits.

---

## Resume Analysis Flow

The resume analysis process follows this general flow:

```text
Upload Resume / Enter Text
          │
          ▼
   Extract Resume Text
          │
          ▼
   Validate Document
          │
          ├── Invalid
          │      └── Reject
          │
          ▼
    Gemini Analysis
          │
          ▼
   Generate ATS Report
          │
          ▼
   Save Analysis
          │
          ▼
      PostgreSQL
```

The validation step helps prevent unrelated documents such as invoices, identification documents, certificates, or random text from being treated as resumes.

---

## Mock Interview Flow

```text
Select Role
    │
    ▼
Choose Difficulty
    │
    ▼
Choose Interview Type
    │
    ▼
Generate Questions
    │
    ▼
Answer Questions
    │
    ▼
AI Answer Evaluation
    │
    ├── Relevance Check
    ├── Validity Check
    ├── Score
    ├── Strengths
    └── Weaknesses
    │
    ▼
Final Interview Report
    │
    ▼
PostgreSQL
```

The evaluation system checks for:

* Empty or extremely short responses
* Abusive responses
* Random/gibberish responses
* Completely unrelated answers
* Lack of knowledge
* Relevant technical or behavioral answers

---

## Security and Data Handling

The application includes several server-side protections:

* Authentication checks on protected API routes
* User ownership checks when accessing resumes and interview sessions
* Zod request validation
* Resume document validation
* Rate limiting for resume analysis
* Server-side subscription enforcement
* Stripe webhook signature verification
* Stripe webhook event deduplication
* PostgreSQL transaction-based quota checks
* PostgreSQL advisory locks for concurrent quota requests

Sensitive environment variables should always remain outside the repository.

---

## Deployment

The application can be deployed as a Next.js application on platforms such as Vercel.

For production deployment, configure:

* PostgreSQL database
* Better Auth production URL and secret
* Gemini API key
* Google/GitHub OAuth credentials if enabled
* Stripe secret key
* Stripe Premium Price ID
* Stripe webhook secret

The Stripe webhook must point to the deployed application's:

```text
/api/stripe/webhook
```

After deployment, verify the complete flow:

```text
Sign Up
   ↓
Create Resume
   ↓
Analyze Resume
   ↓
Start Mock Interview
   ↓
Free Usage Limit
   ↓
Stripe Checkout
   ↓
Premium Subscription
   ↓
Unlimited Usage
```

---

## Important Production Consideration

The current profile-photo upload implementation writes files to:

```text
/public/uploads
```

This works during local development, but serverless deployments should use persistent object storage for production file uploads because local server filesystem storage is not guaranteed to persist between deployments or instances.

A future implementation can move image storage to a service such as:

* Cloudinary
* AWS S3
* Cloudflare R2
* Vercel Blob

---

## Future Improvements

Possible future improvements include:

* Persistent cloud file storage
* More resume templates
* Resume version history
* Cover letter generation
* Job matching
* Job application tracking
* LinkedIn profile analysis
* Interview performance analytics
* Voice-based interview practice
* More detailed career recommendations
* Email notifications
* Additional subscription plans
* Improved billing history UI

---

## Project Status

ResuMate AI is an actively developed project.

The core application currently includes:

* Resume Builder
* Resume persistence
* Resume ATS analysis
* Resume validation
* AI resume assistance
* AI mock interviews
* Interview answer evaluation
* Interview reports
* Authentication
* PostgreSQL persistence
* Free-tier usage limits
* Stripe subscription infrastructure
* Stripe webhooks
* Customer billing portal

## Repository

[ResuMate AI on GitHub](https://github.com/SM-Raihan77/ResuMate-AI?utm_source=chatgpt.com)

## Live Application

[ResuMate AI Live Demo](https://resu-mate-ai-client.vercel.app/?utm_source=chatgpt.com)
