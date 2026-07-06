🛡️ DevComply: AI Regulatory & Security Code Scanner

TypeScriptNext.jsNestJSPrismaLangChain

    Shift-left security and compliance automation powered by Multi-Agent AI.

DevComply is a production-grade DevSecOps platform that integrates directly into a developer's GitHub workflow. It listens for Pull Request webhooks, securely parses code diffs, and uses a Multi-Agent AI pipeline to identify security vulnerabilities (OWASP Top 10) and regulatory compliance violations. It then posts actionable, AI-generated code fixes directly as inline PR comments.
🚀 The Problem

Security and compliance reviews are retroactive bottlenecks. Existing static analysis tools (SAST) generate massive false-positive rates and lack business context. Developers are blocked from merging critical features because compliance gates are manual, leading to delayed releases and developer frustration.
💡 The Solution

DevComply shifts security left by automating the review process at the exact moment code is written. Instead of just flagging vulnerabilities, the AI Remediator Agent writes the secure fix, keeping developers in their flow without requiring them to leave GitHub.
✨ Key Features

    🤖 Multi-Agent AI Pipeline: An Analyzer Agent identifies vulnerabilities, a Remediator Agent writes the secure fix, and a Reviewer Agent validates the logic.
    🔒 Zero-Trust Webhook Security: Strict HMAC SHA-256 signature verification ensures no malicious payloads can trigger the AI pipeline.
    ⚡ Asynchronous Background Processing: Webhooks are processed instantly via Redis-backed BullMQ queues to prevent GitHub timeouts during heavy AI operations.
    🔐 Secure Auth Architecture: GitHub OAuth with HttpOnly, SameSite=Strict cookies to prevent XSS token theft.
    📊 Premium SaaS Dashboard: A fully responsive, light-mode Next.js dashboard with a collapsible sidebar, real-time scan tables, and Monaco Code Editor integration.
    🐳 Multi-Tenant Database Design: Strict Row Level Security patterns using Prisma and PostgreSQL to isolate organization data.

🏗️ System Architecture

[GitHub PR Webhook]       │       ▼[NestJS API] ──(HMAC Verify)──▶ [Redis / BullMQ Queue]                                      │                                      ▼                               [Scan Worker]                                      │                   ┌──────────────────┼──────────────────┐                   ▼                  ▼                  ▼             [Analyzer Agent]   [RAG Context]    [Remediator Agent]                   │                  │                  │                   └──────────────────┴──────────────────┘                                      │                                      ▼                               [PostgreSQL]                                 (pgvector)                                      │                                      ▼                             [GitHub PR Comment]

🛠️ Tech Stack

Frontend

     Next.js 14 (App Router, React Server Components)
     TypeScript
     Tailwind CSS & Shadcn UI
     Zustand
     Monaco Editor

Backend

     NestJS (Modular Monolith)
     TypeScript
     Prisma ORM
     PostgreSQL (with pgvector extension)
     Redis & BullMQ
     JWT & Cookie Parser

AI Engineering

     LangChain / LangGraph
     Groq API (Llama 3.1)
     Zod (Structured Output Parsing)

Infrastructure

     Docker (Postgres, Redis)
     Turborepo (Monorepo)
     GitHub Actions (CI/CD Ready)

🏁 Getting Started (Local Development)
Prerequisites

     Node.js v20 LTS
     Docker & Docker Compose
     A GitHub OAuth App (Set callback to http://localhost:3000/api/auth/callback)
     A Groq API Key (Free tier available)

1. Clone & Install

   git clone https://github.com/yourusername/devcomply.git
   cd devcomply
   npm install

2. Environment Variables

Create a .env file in the root directory:

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devcomply?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/devcomply?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth
JWT_SECRET="your_super_long_random_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
FRONTEND_URL="http://localhost:3000"

# AI
GROQ_API_KEY="gsk_your_groq_key"

# GitHub Webhook Security
GITHUB_WEBHOOK_SECRET="your_generated_hex_secret"

# Testing Token (For fetching private PR diffs)
GITHUB_PAT_FOR_TESTING="github_pat_your_token"

3. Start Infrastructure

Start the PostgreSQL and Redis containers:
docker compose up -d

4. Run Database Migrations
npm run db:migrate --workspace @devcomply/db -- --name init

5. Start the Application
npm run dev

📸 Screenshots

(Add your screenshots here! Drag and drop images of your Landing Page, Dashboard, and the GitHub PR Bot Comment)

Landing Page:
 

Dashboard Overview:
 

GitHub PR Bot Comment:


🧠 What I Learned

     Designing asynchronous background job queues with BullMQ to handle long-running AI tasks without blocking HTTP requests.
     Implementing Zero-Trust architecture by verifying GitHub Webhook payloads using cryptographic HMAC signatures.
     Orchestrating Multi-Agent AI systems using LangChain and structured output parsing (Zod) to ensure reliable, schema-valid responses.
     Hardening authentication by avoiding localStorage JWTs in favor of HttpOnly session cookies.

🔮 Future Enhancements

     GitLab & Bitbucket webhook support.
     VSCode extension for pre-commit scanning.
     Advanced RAG implementation using pgvector to embed and query historical organization vulnerabilities.
     Terraform/IaC security scanning.

Built with ❤️ by Rohith Bairi