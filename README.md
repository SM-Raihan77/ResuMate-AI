# ResuMate AI

ResuMate AI is a career preparation platform that helps users improve their resumes, identify skill gaps, prepare for interviews, and plan their learning path.

## Live Demo

[ResuMate AI](https://resu-mate-ai-client.vercel.app/)

---

## Features

### Resume Builder

Create and manage resumes from the application.

* Create and edit resume sections
* Manage education and experience
* Add skills and projects
* Update resume information
* Keep resume data saved for future editing

### Resume Analyzer

Analyze a resume and get feedback based on the selected career or job role.

* Resume score
* ATS-related feedback
* Missing keywords
* Skill suggestions
* Improvement recommendations

### Career Recommendation

Get career suggestions based on skills, experience, and career interests.

* Recommended career paths
* Required skills
* Skill gaps
* Suggested areas to learn

### Interview Practice

Practice interviews for different job roles.

* Role-based interview questions
* Technical and behavioral questions
* Answer evaluation
* Feedback and improvement suggestions

### Learning Roadmap

Get a structured learning path for a selected career.

* Required skills
* Learning topics
* Recommended progression
* Skill-based learning goals

### Skill Gap Analysis

Compare current skills with the skills required for a target role.

* Existing skills
* Missing skills
* Priority areas
* Recommended skills to learn

### Career Assistant

A chat-based assistant for career-related questions.

Users can ask about:

* Resume improvement
* Career choices
* Interview preparation
* Skills to learn
* Job preparation

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* TanStack Query

### Backend

* Node.js
* Express.js
* REST API

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* Authentication and protected routes
* User session management

### AI Integration

LLM integration is used for features such as:

* Resume analysis
* Career recommendations
* Interview questions and evaluation
* Learning roadmaps
* Career assistance

---

## Project Structure

```text
ResuMate-AI/
│
├── client/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── services/
│   └── types/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL

---

### Clone the Repository

```bash
git clone <your-repository-url>
cd ResuMate-AI
```

---

### Install Dependencies

For the client:

```bash
cd client
npm install
```

For the server:

```bash
cd ../server
npm install
```

---

## Environment Variables

Create the required environment files for the client and server.

### Client

```env
NEXT_PUBLIC_API_URL=
```

### Server

```env
DATABASE_URL=
JWT_SECRET=
LLM_API_KEY=
CLIENT_URL=
```

Use the actual variable names from your project if they are different.

Do not commit `.env` files or secret API keys to the repository.

---

## Database Setup

If Prisma is used in the project:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate dev
```

To open Prisma Studio:

```bash
npx prisma studio
```

---

## Run Locally

Start the client:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

Start the server:

```bash
npm run dev
```

Make sure the backend API URL and database configuration are correctly set before running the application.

---

## How It Works

The main application flow is:

```text
User
 │
 ▼
Next.js Frontend
 │
 ▼
Express API
 │
 ├── Authentication
 ├── Resume Management
 ├── Career Features
 └── Interview Features
 │
 ├───────────────┐
 ▼               ▼
PostgreSQL      LLM API
 │               │
 └───────┬───────┘
         ▼
     Application
         │
         ▼
        User
```

---

## Screenshots

### Home Page

Add screenshot here.

### Dashboard

Add screenshot here.

### Resume Builder

Add screenshot here.

### Resume Analyzer

Add screenshot here.

### Interview Practice

Add screenshot here.

### Career Roadmap

Add screenshot here.

---

## Future Improvements

* Job matching
* Job application tracking
* Cover letter generation
* More resume templates
* LinkedIn profile analysis
* Voice interview practice
* Interview performance history
* Resume version management
* Job alerts
* More detailed career analytics

---

## License

This project is developed for educational and portfolio purposes.
