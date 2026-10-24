<p align="center">
  <img src="assets/readme/hero-header.svg" alt="Atlas Career OS Hero" width="100%" />
</p>

<p align="center">
  <a href="https://suryachalam.vercel.app"><img src="https://img.shields.io/badge/LIVE%20SITE-suryachalam.vercel.app-E3000F?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js%2016-Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React%2019-Concurrent-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://prisma.io/"><img src="https://img.shields.io/badge/Prisma%207-Turso%20LibSQL-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://resend.com/"><img src="https://img.shields.io/badge/Resend-SMTP%20CRM-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" /></a>
</p>

---

## Executive Overview

**Atlas** is a production-grade personal portfolio and full-stack career management operating system designed for software engineers. Beyond a standard static developer site, Atlas pairs a high-contrast **Neo-Brutalist WebGL portfolio** with a secured **12-module telemetry dashboard (Atlas Console)**, an integrated **two-way email CRM** with automated inbound threading, and a background **proactive deadline intelligence daemon**.

### Key System Metrics
* **Production Status:** Live at [suryachalam.vercel.app](https://suryachalam.vercel.app)
* **Architecture:** Next.js 16 (App Router), React 19, Server Actions, Edge Route Handlers
* **Database:** SQLite (local development) / Turso LibSQL (edge-replicated production) via Prisma ORM
* **Modules:** 12 unified career management workflows in a protected administrator console
* **Telemetry:** 0-cookie, privacy-preserving SHA-256 IP hashing for visits, downloads, and project clicks
* **Email Infrastructure:** Resend transactional mail with SMTP `In-Reply-To` header resolution and local IST timezone scheduling

---

<p align="center">
  <img src="assets/readme/modules.svg" alt="Atlas Console 12 Modules" width="100%" />
</p>

---

## Why Atlas Stands Out

| Engineering Dimension | Production Implementation |
| :--- | :--- |
| **Product & Lead Funnel** | Converts passive portfolio visitors and recruiters into an active lead funnel with automated acknowledgment receipts and two-way CRM tracking. |
| **Two-Way Threading** | Resolves inbound replies to recruiter emails via Resend webhooks using SMTP `In-Reply-To` message identifiers, linking conversations seamlessly. |
| **Proactive Intelligence** | Background scheduler audits 43 warning windows across applications and hackathons, automatically firing reminders and status transitions. |
| **Privacy-First Analytics** | Captures real-time visitor telemetry without invasive tracking cookies by hashing remote IPs with SHA-256 and salt. |
| **Bespoke Visual Craft** | Kinetic Neo-Brutalist UI equipped with 38 custom 2D pixel art skill badges generated with Python and Aseprite. |
| **Enterprise Data Layer** | Relational schema with 17 Prisma models powered by `@prisma/adapter-libsql` for instant zero-downtime edge failover. |

---

## System Integration Topology

```mermaid
flowchart TD
    subgraph Client Layer
        Visitor[Public Visitor]
        Recruiter[Recruiter / Tech Lead]
        Admin[Administrator: Surya]
    end

    subgraph Presentation & API Layer
        PublicUI[Public Portfolio UI // WebGL]
        AdminUI[Atlas Console // /admin]
        APIRoute[Serverless Route Handlers]
        SrvAction[Next.js Server Actions]
    end

    subgraph Data & Services Layer
        DAL[Unified Data Access Layer: lib/db.ts]
        Prisma[Prisma Client / LibSQL Adapter]
        Turso[(Turso Edge LibSQL DB)]
        Daemon[lib/deadlineEngine.ts Cron]
    end

    subgraph External Cloud Services
        ResendAPI[Resend Transactional Email]
        InboundHook[Inbound Webhook Receiver]
        GitHubAPI[GitHub GraphQL / REST API]
    end

    Visitor -->|Views Projects & Resume| PublicUI
    Recruiter -->|Submits Contact Form| PublicUI
    Admin -->|Authenticates via Password| AdminUI

    PublicUI -->|Telemetry Pings| APIRoute
    AdminUI -->|Dispatches Mutations| SrvAction
    InboundHook -->|Posts Inbound Replies| APIRoute

    APIRoute -->|Reads / Writes| DAL
    SrvAction -->|Performs State Changes| DAL
    DAL -->|Type-Safe Queries| Prisma
    Prisma --> Turso

    APIRoute -->|Dispatches SMTP Receipts| ResendAPI
    ResendAPI -->|Delivers Email to Inbox| Recruiter
    Recruiter -->|Replies via Email App| InboundHook

    Daemon -->|Audits Expiries & Deadlines| Turso
    Daemon -->|Dispatches Morning / Evening Digest| ResendAPI
    APIRoute -->|Fetches & Caches Repos| GitHubAPI
```

---

## Core Engineering Capabilities

### 1. Recruiter CRM & Two-Way Threading Engine
When a visitor or recruiter reaches out through the contact form, Atlas treats it as a first-class CRM lead:
1. **Validation & Spam Defense:** The payload passes client-side validation, a hidden bot honeypot (`hp_field`), an in-memory IP rate limiter, and a strict Zod schema.
2. **Outbound Receipt & Metadata Tagging:** Atlas generates a contact record, assigns a message UUID, and sends an automated confirmation via Resend while capturing the outbound SMTP `Message-ID`.
3. **Inbound Reply Resolution:** When the recruiter replies in their email client, Resend forwards the webhook payload to `/api/webhook/email`. Atlas extracts the `In-Reply-To` header, pairs it with the existing thread, updates the contact status to `NEW`, and triggers a critical dashboard alert.

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter
    participant Web as Contact Form
    participant API as /api/contact
    participant DB as LibSQL (via db.ts)
    participant Resend as Resend Mail
    actor Admin as Surya (Admin)

    Recruiter->>Web: Submits message with role & company
    Web->>API: POST /api/contact (checks honeypot & IP rate-limit)
    API->>DB: upsertContact() & saveContactSubmission()
    DB-->>API: Returns Contact ID & Conversation ID
    API->>Resend: sendEmail() with auto-reply
    Resend-->>API: Returns SMTP Message-ID
    API->>DB: updateMessage(emailMessageId = SMTP ID)
    API->>Resend: Dispatches lead alert to Surya
    
    Note over Recruiter: Receives email & replies in Gmail / Outlook
    Recruiter->>Resend: Inbound email reply
    Resend->>API: Webhook -> /api/webhook/email (In-Reply-To header)
    API->>DB: Maps In-Reply-To to Conversation, saves message
    API->>DB: Updates Contact Status to 'NEW'
    API->>Admin: Triggers Critical Alert on Atlas Console
```

---

### 2. Proactive Deadline Intelligence Daemon
The deadline engine ([`lib/deadlineEngine.ts`](file:///c:/projects/SGK18_Portfolio/lib/deadlineEngine.ts)) operates as an autonomous background daemon:
* **Warning Windows:** Continuously evaluates upcoming deadlines across Applications, Hackathons, Goals, and Follow-ups across 43 active warning windows.
* **Auto-Expiry Transitions:** Automatically flips stale deadlines to `EXPIRED` or `ARCHIVED`, recording an immutable event in `activity_logs`.
* **Timezone-Aligned Digests:** Computes UTC+05:30 (IST) relative offsets to deliver morning briefings (8:00 AM IST) and evening summaries (8:00 PM IST) directly to Surya's inbox.

---

### 3. Zero-Cookie Telemetry Analytics
Atlas respects visitor privacy while gathering high-fidelity engagement insights:
* **SHA-256 IP Hashing:** Remote IP addresses are extracted on the server, salted, and hashed using SHA-256. Raw IP addresses are never saved to disk.
* **Granular Telemetry:** Captures unique daily visits, total page impressions, resume downloads (`/public/resume.pdf`), and clicks on specific project case studies.

---

## Database Architecture (Prisma & Turso LibSQL)

The relational schema is defined in [`prisma/schema.prisma`](file:///c:/projects/SGK18_Portfolio/prisma/schema.prisma) across 17 models:

```mermaid
erDiagram
    CONTACTS ||--o{ CONVERSATIONS : "has"
    CONVERSATIONS ||--o{ MESSAGES : "contains"
    CONTACTS ||--o{ REMINDERS : "notifies"
    HACKATHONS ||--o{ REMINDERS : "schedules"
    APPLICATIONS ||--o{ REMINDERS : "schedules"
    GOALS ||--o{ REMINDERS : "schedules"

    CONTACTS {
        String id PK
        String name
        String email UK
        String company
        String role
        String linkedin
        String status "NEW | CONTACTED | REPLIED | NETWORKING | CLOSED"
        String source "PORTAL | INBOUND_EMAIL"
        DateTime nextFollowUp
    }

    CONVERSATIONS {
        String id PK
        String contactId FK
        String subject
        DateTime lastMessageAt
    }

    MESSAGES {
        String id PK
        String conversationId FK
        String senderType "CONTACT | SURYA"
        String content
        String emailMessageId UK
    }

    APPLICATIONS {
        String id PK
        String company
        String role
        String location
        String status "SAVED | APPLIED | OA | INTERVIEW | OFFER | REJECTED"
        DateTime nextFollowUp
    }

    HACKATHONS {
        String id PK
        String name
        DateTime deadline
        DateTime eventDate
        String status "REGISTERED | SUBMITTED | COMPLETED | WON"
        String prize
    }

    REMINDERS {
        String id PK
        String title
        DateTime reminderDate
        String type "EMAIL | DASHBOARD | BOTH"
        Boolean completed
    }

    VISITS {
        String id PK
        String page
        String referrer
        String ipHash
        DateTime createdAt
    }

    RESUME_DOWNLOADS {
        String id PK
        DateTime createdAt
    }
```

---

## Tech Stack & 38 Equipped 2D Pixel Sprites

Every technology badge on the live site is accompanied by a bespoke 20x20 retro pixel sprite generated via Python and Aseprite:

### Languages
| Sprite | Skill | Category | Notes |
| :---: | :--- | :--- | :--- |
| <img src="public/sprites/skills/typescript.png" width="18" height="18" /> | **TypeScript** | Language | Strict typings across App Router & DAL |
| <img src="public/sprites/skills/javascript.png" width="18" height="18" /> | **JavaScript** | Language | ESNext standards, Node.js scripts |
| <img src="public/sprites/skills/python.png" width="18" height="18" /> | **Python** | Language | Sprite generation scripts & automation |
| <img src="public/sprites/skills/java.png" width="18" height="18" /> | **Java** | Language | Object-oriented systems & DSA |
| <img src="public/sprites/skills/dart.png" width="18" height="18" /> | **Dart** | Language | Flutter mobile client architectures |
| <img src="public/sprites/skills/sql.png" width="18" height="18" /> | **SQL** | Language | Relational schemas, indexing, joins |
| <img src="public/sprites/skills/plsql.png" width="18" height="18" /> | **PL/SQL** | Language | Stored procedures & triggers |
| <img src="public/sprites/skills/cpp.png" width="18" height="18" /> | **C++** | Language | Systems programming, algorithms |

### Frontend & Mobile
| Sprite | Skill | Category | Notes |
| :---: | :--- | :--- | :--- |
| <img src="public/sprites/skills/react.png" width="18" height="18" /> | **React 19** | Frontend | Server Components, Concurrent Mode |
| <img src="public/sprites/skills/nextjs.png" width="18" height="18" /> | **Next.js 16** | Frontend | App Router, Turbopack, Server Actions |
| <img src="public/sprites/skills/flutter.png" width="18" height="18" /> | **Flutter** | Mobile | Riverpod state, cross-platform apps |
| <img src="public/sprites/skills/capacitor.png" width="18" height="18" /> | **Capacitor** | Mobile | Native Android plugins, camera, sensors |
| <img src="public/sprites/skills/tailwindcss.png" width="18" height="18" /> | **Tailwind CSS** | Styling | v4 CSS variables, Neo-brutalist theme |
| <img src="public/sprites/skills/framermotion.png" width="18" height="18" /> | **Framer Motion** | Animation | Scroll-triggered entry sequences & reveals |
| <img src="public/sprites/skills/pwa.png" width="18" height="18" /> | **PWA** | Mobile | Offline web apps, web manifest |
| <img src="public/sprites/skills/serviceworkers.png" width="18" height="18" /> | **Service Workers** | Mobile | Background caching, push event listeners |

### Backend, Databases & Infra
| Sprite | Skill | Category | Notes |
| :---: | :--- | :--- | :--- |
| <img src="public/sprites/skills/nodejs.png" width="18" height="18" /> | **Node.js** | Backend | Serverless runtimes & background daemons |
| <img src="public/sprites/skills/express.png" width="18" height="18" /> | **Express 5** | Backend | REST microservices & middleware routing |
| <img src="public/sprites/skills/postgresql.png" width="18" height="18" /> | **PostgreSQL** | Database | Relational production storage |
| <img src="public/sprites/skills/supabase.png" width="18" height="18" /> | **Supabase** | Backend | Auth, Row-Level Security (RLS), real-time |
| <img src="public/sprites/skills/prisma.png" width="18" height="18" /> | **Prisma** | ORM | Type-safe schema migrations & LibSQL client |
| <img src="public/sprites/skills/neo4j.png" width="18" height="18" /> | **Neo4j** | Graph DB | Graph algorithms, node/edge modeling |
| <img src="public/sprites/skills/valkey.png" width="18" height="18" /> | **Valkey** | Caching | Redis-compatible distributed cache layer |
| <img src="public/sprites/skills/mysqlheatwave.png" width="18" height="18" /> | **MySQL HeatWave** | Database | Analytics & OLAP query acceleration |
| <img src="public/sprites/skills/docker.png" width="18" height="18" /> | **Docker** | DevOps | Containerized local and deployment images |

### Cloud, Integrations & Tools
| Sprite | Skill | Category | Notes |
| :---: | :--- | :--- | :--- |
| <img src="public/sprites/skills/aws.png" width="18" height="18" /> | **AWS** | Cloud | Cloud architecture, S3, IAM |
| <img src="public/sprites/skills/oci.png" width="18" height="18" /> | **OCI** | Cloud | Oracle Cloud Infrastructure services |
| <img src="public/sprites/skills/cicd.png" width="18" height="18" /> | **CI/CD** | DevOps | Automated linting, test suites, deployments |
| <img src="public/sprites/skills/resend.png" width="18" height="18" /> | **Resend** | Email | Transactional emails & inbound webhook parsing |
| <img src="public/sprites/skills/jwt.png" width="18" height="18" /> | **JWT / JOSE** | Security | Edge Middleware stateless tokens & claims |
| <img src="public/sprites/skills/fcm.png" width="18" height="18" /> | **FCM** | Push | Firebase Cloud Messaging push channels |
| <img src="public/sprites/skills/onesignal.png" width="18" height="18" /> | **OneSignal** | Push | Cross-platform web & mobile notifications |
| <img src="public/sprites/skills/gitgithub.png" width="18" height="18" /> | **Git & GitHub** | Tools | Structured version control workflows |
| <img src="public/sprites/skills/vercel.png" width="18" height="18" /> | **Vercel** | Hosting | Edge caching, analytics, serverless functions |
| <img src="public/sprites/skills/figma.png" width="18" height="18" /> | **Figma** | Design | UI/UX design systems & wireframing |

---

## Security Audit & Hardening

Atlas implements four concentric rings of defensive design:

```mermaid
flowchart TD
    Request[Incoming HTTP Request] --> L1{Layer 1: Bot & Rate Defense}
    L1 -->|Honeypot Triggered| Drop[Silently Drop Request]
    L1 -->|Exceeds 5 req/min| Err429[429 Rate Limit Exceeded]
    L1 -->|Legitimate| L2{Layer 2: Payload Sanitization}
    
    L2 -->|Malformed JSON / Field Overflows| Err400[400 Validation Error]
    L2 -->|Strict Zod Schema Pass| L3{Layer 3: Privacy Anonymization}
    
    L3 -->|Hash IP with Salt| Hash[SHA-256 ipHash]
    Hash --> Save[Persist to LibSQL Data Store]
    
    AdminReq[Admin API Access] --> L4{Layer 4: Access Control}
    L4 -->|Invalid Header Token| Err401[401 Unauthorized]
    L4 -->|Valid Admin Passkey| Execute[Execute Server Action Mutation]
```

1. **Honeypot Trap:** Forms include hidden honeypot fields (`hp_field`). Automated scrapers and spam bots populate this input, causing the server to silently discard the payload without database writes.
2. **IP Sliding-Window Rate Limiting:** Form submissions and analytics pings are rate-limited per IP hash to prevent flooding attacks.
3. **Zod Schema Sanitization:** Strict input schemas enforce maximum lengths (e.g., 5,000 characters for messages, validated RFC-compliant emails) to block SQL or script injection attempts.
4. **Header-Authenticated Admin Sessions:** The Atlas Console requires passkey validation via encrypted Server Actions, preventing unauthorized access to telemetry or candidate data.

---

## Developer Runbook & Local Setup

### Prerequisites
* **Node.js:** `v20.x` or higher
* **npm:** `v10.x` or higher
* **Python:** `v3.10+` (optional, for regenerating retro pixel sprites)
* **pdfLaTeX:** MiKTeX or TeX Live (optional, for compiling `resume.tex`)

### 1. Clone & Install
```bash
git clone https://github.com/sgk18/SGK18_Portfolio.git
cd SGK18_Portfolio
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
ADMIN_PASSWORD=your_secure_console_password
RESEND_API_KEY=re_your_resend_api_token
RESEND_FROM_EMAIL=Atlas <onboarding@resend.dev>
RESEND_INBOUND_EMAIL=your_email@gmail.com
CRON_SECRET=your_background_scheduler_cron_key
WEBHOOK_SECRET=your_resend_inbound_webhook_token
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public portfolio.  
Access the authenticated control suite at [http://localhost:3000/admin](http://localhost:3000/admin).

### 5. Build for Production
```bash
npm run build
```

---

## Repository Map

```
SGK18_Portfolio/
├── app/                        # Next.js 16 App Router Core
│   ├── actions/                # Server Actions (Atlas mutations & CRM triggers)
│   ├── admin/                  # Protected Atlas Console UI & CRM workspace
│   ├── api/                    # Serverless APIs (telemetry, contact, cron, webhook)
│   ├── globals.css             # Tailwind v4 theme tokens & Neo-brutalist styles
│   └── page.tsx                # Public Portfolio Home
├── assets/                     # Project branding & README visual system
│   └── readme/                 # Hero SVG, module diagrams, architecture banners
├── components/                 # Reusable UI component modules
│   ├── layout/                 # Navbar, Footer, StaggeredMenu, PillNav
│   ├── sections/               # Hero, About, Skills, Experience, Projects, etc.
│   └── ui/                     # CaseStudyModal, ScrollReveal, RetroBadges
├── lib/                        # Architecture & DAL Utilities
│   ├── db.ts                   # Centralized Data Access Layer
│   ├── deadlineEngine.ts       # Proactive deadline background scheduler
│   └── prisma.ts               # Prisma singleton with LibSQL adapter
├── prisma/                     # Relational Database Model
│   └── schema.prisma           # 17 entity definitions & indexes
├── public/                     # Static production assets
│   ├── resume.pdf              # Compiled 1-page ATS LaTeX resume
│   └── sprites/skills/         # 38 bespoke PNG & Aseprite skill badges
├── resume/                     # Resume LaTeX Source
│   └── resume.tex              # Jake's Resume ATS source
└── scripts/                    # Automation utilities
    └── build_skill_sprites.py  # Python + Aseprite 2D pixel sprite generator
```

---

## Author & Connect

* **Engineer:** Suryachalam V M
* **Portfolio:** [suryachalam.vercel.app](https://suryachalam.vercel.app)
* **GitHub:** [@sgk18](https://github.com/sgk18)
* **LinkedIn:** [linkedin.com/in/suryachalam](https://linkedin.com/in/suryachalam)
* **Email:** [suryachalam18@gmail.com](mailto:suryachalam18@gmail.com)

---

<p align="center">
  <b>Atlas // SGK18 Portfolio</b> · Engineered with Next.js 16, React 19, Prisma &amp; LibSQL · Licensed under MIT
</p>
