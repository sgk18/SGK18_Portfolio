export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  period: string;
  role: string;
  problem: string;
  motivation: string;
  solution: string;
  architecture: string; // Mermaid diagram or prose
  databaseDesign: string; // Mermaid entity diagram or prose
  technologiesUsed: { name: string; why: string }[];
  technicalChallenges: { challenge: string; resolution: string }[];
  lessonsLearned: string[];
  futureImprovements: string[];
  links: { label: string; url: string }[];
  tags: string[];
}

export const caseStudies: Record<string, CaseStudy> = {
  'atlas-portfolio': {
    id: 'atlas-portfolio',
    title: 'Atlas — Portfolio, Recruiter CRM & Career Management Platform',
    tagline: 'Production-grade career OS — WebGL portfolio + 12-module admin console, two-way CRM, automated deadline engine & privacy-first analytics',
    period: 'May 2026 – Present',
    role: 'Solo Engineer & Designer',
    problem:
      'Standard portfolio sites show static project cards with no active career management. There was no unified system for recruiter relationship management, application pipelines, deadline alerts, or engagement analytics. Everything was tracked manually across scattered notes and spreadsheets with zero visibility into who was visiting the portfolio or responding to outreach.',
    motivation:
      'Build the portfolio itself as a production-grade engineering showcase — demonstrating database design, full-stack architecture, background automation, transactional email threading, and a polished admin dashboard all within a single deployable system. The goal was to combine a client-facing developer presence with a recruiter lead-capture funnel that converts cold contacts into threaded conversations and dynamic pipeline trackers.',
    solution:
      'A Next.js 16 App Router portfolio with a password-protected admin console (Atlas) containing 12 career management modules: Recruiter CRM with two-way email threading via Resend inbound webhooks, Opportunity pipeline, Job Application tracker, Hackathon logger, Events calendar, Learning Roadmap, Goal tracker, Networking directory, Notes system, automated Reminder engine, Activity timeline, and Site analytics (page views, unique visitors, referrers, resume downloads). The database runs on Turso (LibSQL) via Prisma with a @libsql/client adapter for edge-compatible queries on Vercel serverless functions.',
    architecture: `graph TD
  subgraph Client Layer
    Visitor[Public Visitor]
    Recruiter[Recruiter / Hiring Lead]
    Admin[Administrator]
  end

  subgraph Presentation and API Router
    PortClient[Public Portfolio UI]
    AdminPanel[Admin Atlas Console]
    APIRoute[API Route Handlers]
    SrvAction[Server Actions]
  end

  subgraph Data and Services Layer
    DBService[Data Access Layer: lib/db.ts]
    Prisma[Prisma Client / LibSQL Adapter]
    SQLite[(SQLite / Turso DB)]
    Deadline[lib/deadlineEngine.ts]
  end

  subgraph Integrations
    Resend[Resend Email API]
    InboundWebhook[Inbound Email Webhook]
    GitHubAPI[GitHub Developer API]
  end

  Visitor -->|Interacts / Views| PortClient
  Recruiter -->|Submits Form / Emails| PortClient
  Admin -->|Authenticates and Manages| AdminPanel
  PortClient -->|Telemetry API Pings| APIRoute
  AdminPanel -->|Invokes Mutations| SrvAction
  InboundWebhook -->|Receives Replies| APIRoute
  APIRoute -->|Reads / Writes| DBService
  SrvAction -->|Performs Writes| DBService
  DBService -->|ORM Queries| Prisma
  Prisma --> SQLite
  APIRoute -->|Outbound Transactional Email| Resend
  Resend -->|Delivers Email| Recruiter
  Recruiter -->|Replies| InboundWebhook
  Deadline -->|Periodic Audits| SQLite
  Deadline -->|Send Warnings / Digests| Resend
  APIRoute -->|Query and Cache Repos| GitHubAPI`,
    databaseDesign: `erDiagram
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
    String status "NEW|CONTACTED|REPLIED|NETWORKING|CLOSED"
    String source "PORTAL|INBOUND_EMAIL"
    String notes
    DateTime lastContact
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
    String senderType "CONTACT|SURYA"
    String content
    String emailMessageId UK
  }
  OPPORTUNITIES {
    String id PK
    String title
    String company
    String type "INTERNSHIP|JOB|FREELANCE|STARTUP"
    String status "DISCOVERED|APPLIED|INTERVIEW|OFFER|REJECTED"
    String priority "HIGH|MEDIUM|LOW"
    DateTime deadline
  }
  APPLICATIONS {
    String id PK
    String company
    String role
    DateTime appliedDate
    DateTime nextFollowUp
    String status "SAVED|APPLIED|OA|INTERVIEW|OFFER|REJECTED"
  }
  REMINDERS {
    String id PK
    String title
    DateTime reminderDate
    String type "EMAIL|DASHBOARD|BOTH"
    Boolean completed
    String targetType
    String targetId
  }
  NOTIFICATION_LOGS {
    String id PK
    String entityType
    String entityId
    String notificationType UK
    DateTime sentAt
    String status "SENT|FAILED"
  }
  DASHBOARD_ALERTS {
    String id PK
    String title
    String urgency "CRITICAL|HIGH|MEDIUM|LOW"
    Boolean read
    Boolean dismissed
  }
  VISITS {
    String id PK
    String page
    String ipHash
    String referrer
    DateTime createdAt
  }`,
    technologiesUsed: [
      {
        name: 'Next.js 16 (App Router)',
        why: 'Server Components for zero-JS landing page sections (About, Experience, Skills). Server Actions for all admin mutations — eliminates REST boilerplate and triggers instant TanStack Query cache invalidation. Turbopack for fast local development.',
      },
      {
        name: 'Prisma + Turso (LibSQL)',
        why: 'Turso is a distributed SQLite-on-the-edge database. The @prisma/adapter-libsql package makes Prisma compatible with Turso\'s HTTP API, enabling edge-compatible queries on Vercel serverless functions. Falls back to local dev.db with zero code changes.',
      },
      {
        name: 'TanStack Query (React Query)',
        why: 'All admin dashboard data is fetched via a single "dashboardData" query key. Mutations call queryClient.invalidateQueries() to trigger background refetch, giving optimistic UI updates across all 12 modules without page reloads.',
      },
      {
        name: 'Resend (Email & Inbound Webhooks)',
        why: 'Handles both outbound transactional email (CRM replies, daily digests, deadline alerts) and inbound reply threading via webhook. The inbound webhook parses the In-Reply-To SMTP header to link recruiter replies to the correct conversation thread automatically.',
      },
      {
        name: 'Vercel Cron Jobs',
        why: 'Runs deadline scans, daily brief emails at 8:00 AM IST, and evening summaries at 8:00 PM IST on a schedule — no separate worker process or job queue needed. Configured via vercel.json cron expressions with a CRON_SECRET header for protection.',
      },
      {
        name: 'Three.js (WebGL Hyperspeed)',
        why: 'The 3D hyperspeed background is initialized lazily and runs in a lightweight WebGL canvas using requestAnimationFrame loops. Reduces CPU usage by only running when the canvas is in the viewport.',
      },
      {
        name: 'Framer Motion + GSAP',
        why: 'Scroll-triggered entry animations via Framer Motion useInView. GSAP choreographs structural reveals and the Command Palette overlay animation. ScrollReveal wrapper isolates animation logic from content components.',
      },
      {
        name: 'Neo-Brutalist Design System',
        why: 'Custom CSS design language with thick borders, zero border-radius, red/black palette (#E3000F accent), and offset shadow utility (shadow-[4px_4px_0px_#0A0A0A]). The admin console preserves the brutalist aesthetic in both light and dark mode toggle states.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Two-way email threading with In-Reply-To SMTP header matching',
        resolution:
          'When Atlas sends an outbound reply to a recruiter, Resend returns a unique SMTP Message-ID which is stored in Message.emailMessageId. When the recruiter replies, Resend\'s inbound webhook fires a POST to /api/webhook/email. The handler extracts the In-Reply-To header, queries Message where emailMessageId matches, and routes the reply to the correct Conversation. If no match is found, it falls back to email address lookup on the latest conversation.',
      },
      {
        challenge: 'Making Prisma work with Turso (LibSQL) on Vercel serverless',
        resolution:
          'Turso uses the libsql:// protocol which is incompatible with standard Prisma drivers. Solved with @prisma/adapter-libsql + @libsql/client HTTP client. prisma.config.ts detects TURSO_DATABASE_URL in the environment and switches adapters — local SQLite for development, Turso edge DB for production — with zero code changes in the application layer.',
      },
      {
        challenge: 'Preventing duplicate cron-triggered deadline emails',
        resolution:
          'The notification_logs table maintains a composite unique index on [entityType, entityId, notificationType]. Before sending any email, the deadline engine queries this index. If a matching record exists, the email is skipped. This makes the cron job fully idempotent — even if it fires multiple times within a window, each notification is dispatched exactly once.',
      },
      {
        challenge: 'Privacy-preserving analytics without cookies or third-party scripts',
        resolution:
          'Built a custom visit tracking system: the visitor\'s remote IP is extracted server-side, salted, and hashed via SHA-256 to generate an anonymous ipHash stored in the Visit table. Unique visitor count is computed as COUNT(DISTINCT ipHash). Referrer domains are extracted from the Referer header server-side. Zero cookies, zero client fingerprinting, zero third-party analytics scripts.',
      },
      {
        challenge: 'GitHub API rate limiting on the stats panel',
        resolution:
          'Implemented a custom in-memory cache with a 30-minute TTL in the /api/github route. If the GitHub API returns an error or rate limit response, the handler falls back to the last known stale cache value, ensuring zero downtime for visitors. Language percentages are aggregated across the top 20 repos by summing raw byte counts per language.',
      },
      {
        challenge: 'Automated deadline expiry without a persistent worker process',
        resolution:
          'The deadline engine (deadlineEngine.ts) runs as a Vercel Cron-triggered API route. It classifies urgency dynamically: CRITICAL (<24h), HIGH (<72h), MEDIUM (<7 days). Items that pass their deadline without resolution are automatically transitioned to EXPIRED status, logged in activity_logs, and generate a CRITICAL dashboard alert. Local timezone alignment (UTC+05:30 IST) is computed at runtime using offset arithmetic.',
      },
    ],
    lessonsLearned: [
      'Turso\'s distributed SQLite is ideal for read-heavy portfolio workloads — writes go through a primary replica with ~50ms added latency, which is imperceptible for an admin dashboard used by one person.',
      'TanStack Query\'s single-key invalidation works well when all modules load holistically. For larger datasets, per-module query keys with selective invalidation would reduce overfetching significantly.',
      'Vercel Cron has a 60-second execution limit per invocation — long-running deadline scans across hundreds of entities need to be chunked into batches per cron trigger.',
      'SMTP header-based email threading (In-Reply-To) is far more reliable than email subject line matching. Storing the Resend Message-ID immediately after send is the correct architectural decision.',
      'Building the portfolio itself as a production engineering project is more impressive than describing past projects — it\'s live, inspectable, and demonstrates both engineering judgment and design taste.',
      'Idempotent background jobs are non-negotiable — the composite unique index on notification_logs saved from double-email bugs during cron testing multiple times.',
    ],
    futureImprovements: [
      'AI-powered recruiter reply drafting using OpenAI API inside the CRM reply textarea.',
      'Calendar integration: sync application follow-up reminders with Google Calendar / Outlook via OAuth.',
      'AI Resume Parser: automatically match recruiter job descriptions against career goals and rank opportunities.',
      'Public /changelog page that reads from the ActivityLog table to surface project updates.',
      'WebSocket-based live visitor count in the admin analytics tab using Turso real-time subscriptions.',
      'Phase 2 scalability: migrate analytics writes to Redis (Upstash) and move deadline emails to QStash event scheduler for high-volume runs.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/sgk18/SGK18_Portfolio' },
      { label: 'Live Site', url: 'https://suryachalam.vercel.app' },
      { label: 'Admin Console', url: 'https://suryachalam.vercel.app/admin' },
    ],
    tags: ['Next.js 16', 'TypeScript', 'Prisma', 'Turso', 'LibSQL', 'Resend', 'TanStack Query', 'Three.js', 'Framer Motion', 'GSAP', 'Vercel Cron', 'WebGL'],
  },

  'socio-website': {
    id: 'socio-website',
    title: 'SOCIO — Official Website',
    tagline: 'Full-scale university event platform — production system serving real users',
    period: 'Apr 2026 – Present',
    role: 'Product Engineering Intern (Full Stack)',
    problem:
      'CHRIST University had no unified platform for event discovery, team registrations, ticketing, or role-based operations. Event organizers relied on manual spreadsheets and WhatsApp groups, attendance was tracked with paper, and there was no audit trail for critical workflows like CFO approvals or venue allocation.',
    motivation:
      'The internship opportunity through CICF required shipping real production features fast. The goal was to demonstrate that a single engineer could own complex, multi-surface features — offline-first mobile sync, push notification delivery, and an in-memory caching layer — all under agile sprint workflows.',
    solution:
      'A monorepo platform built on Next.js 15 and Express 5 with Supabase (PostgreSQL) as the database. The platform spans 9+ role-gated dashboards (HOD, Dean, CFO, Volunteer, Catering, Venue), automated QR ticketing with attendance tracking, and a push notification pipeline across OneSignal, FCM, and Web Push/VAPID. Valkey (Redis-compatible) serves as the in-memory caching and session management layer.',
    architecture: `graph TD
  subgraph Client
    A[Next.js 15 Web App] -->|HTTPS| B[Express 5 API]
    C[Capacitor Android APK] -->|HTTPS| B
  end

  subgraph Backend
    B --> D[(PostgreSQL / Supabase)]
    B --> E[Valkey Cache]
    B --> F[OneSignal]
    B --> G[FCM]
    B --> H[VAPID Web Push]
  end

  subgraph Offline
    C --> I[IndexedDB / Dexie.js]
    I -->|Background Sync| B
  end`,
    databaseDesign: `erDiagram
  USER {
    uuid id PK
    string email
    string role
    timestamp created_at
  }
  EVENT {
    uuid id PK
    string title
    uuid organizer_id FK
    timestamp starts_at
    int capacity
  }
  REGISTRATION {
    uuid id PK
    uuid user_id FK
    uuid event_id FK
    string ticket_code
    boolean attended
    timestamp registered_at
  }
  USER ||--o{ REGISTRATION : creates
  EVENT ||--o{ REGISTRATION : has`,
    technologiesUsed: [
      {
        name: 'Next.js 15',
        why: 'App Router for nested layouts, Server Actions for form mutations, and React Server Components to reduce client-side JS bundle size.',
      },
      {
        name: 'Express 5',
        why: 'Lightweight REST API layer with middleware-based role validation, separate from the Next.js frontend to allow independent scaling.',
      },
      {
        name: 'Supabase / PostgreSQL',
        why: 'Managed PostgreSQL with row-level security, real-time subscriptions for live attendance counters, and S3-compatible storage for ticket assets.',
      },
      {
        name: 'Valkey',
        why: 'Redis-compatible open-source in-memory store for session caching, notification queuing, and reducing PostgreSQL query load under high concurrency.',
      },
      {
        name: 'Capacitor',
        why: 'Wraps the Next.js web app into a native Android APK with access to device camera, torch, and accelerometer APIs without writing native code.',
      },
      {
        name: 'IndexedDB / Dexie.js',
        why: 'Client-side offline storage with typed schemas and background sync for QR scanner data to survive network interruptions during events.',
      },
      {
        name: 'OneSignal + FCM + VAPID',
        why: 'Multi-channel push delivery ensures notifications reach users on native Android, Chrome, Safari PWA, and Firefox simultaneously.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Offline-first QR scanning with duplicate detection across reconnects',
        resolution:
          'Used IndexedDB/Dexie to buffer scan events locally with a composite key on (ticketCode + eventId). On reconnect, a background sync worker replays unsynced events, and the server applies an idempotency check using the composite key to reject duplicates without creating race conditions.',
      },
      {
        challenge: 'Fan-out push notifications to thousands of devices with low latency',
        resolution:
          'Queued notification jobs in Valkey with channel priority. OneSignal handles segmented Android/iOS delivery, FCM handles Chrome PWA, and a direct VAPID endpoint handles Safari. Valkey queuing decoupled notification creation from delivery, preventing API timeouts during large events.',
      },
      {
        challenge: 'Role-based dashboard rendering without leaking data between roles',
        resolution:
          'Row-Level Security in Supabase enforces data access at the database layer, independent of API logic. Even if an API route were misconfigured, a user without a matching RLS policy would receive no data. Role claims are stored in the JWT and validated server-side on every request.',
      },
    ],
    lessonsLearned: [
      'In-memory caching is easy to add but hard to invalidate correctly. Valkey TTL-based expiry works well for read-heavy session data, but write-through invalidation patterns need to be designed upfront.',
      'Offline-first is an architectural decision, not a feature. Retrofitting IndexedDB sync into an existing app is painful — it needs to be a first-class concern from day one.',
      'RLS at the database layer is a much stronger security guarantee than API-level authorization checks alone.',
    ],
    futureImprovements: [
      'Replace manual Valkey TTL tuning with adaptive cache warming based on event schedules.',
      'Add WebSocket-based real-time attendance feed to organizer dashboards.',
      'Explore end-to-end testing with Playwright across the full role-based workflow.',
    ],
    links: [
      { label: 'GitHub (Web)', url: 'https://github.com/sgk18/socio2026v2' },
      { label: 'GitHub (Mobile)', url: 'https://github.com/sgk18/sociomobilev2' },
      { label: 'Live Site', url: 'https://socio.christuniversity.in' },
    ],
    tags: ['Next.js 15', 'Express 5', 'Supabase', 'Valkey', 'Capacitor', 'OneSignal', 'FCM', 'VAPID', 'IndexedDB'],
  },

  'socio-mobile': {
    id: 'socio-mobile',
    title: 'SOCIO Mobile',
    tagline: 'Hybrid Android app — offline-first QR, push notifications, native device APIs',
    period: 'Apr 2026 – Present',
    role: 'Mobile Engineer (Hybrid)',
    problem:
      'Event organizers needed a native Android app for QR attendance scanning that worked in basements and auditoriums with zero internet connectivity. Existing web-only flows required a stable connection and had no push notification support.',
    motivation:
      'Instead of building a separate React Native or Flutter app, we needed to ship fast on a shared codebase. Capacitor allowed wrapping the existing Next.js web app into a native APK, giving native device access with minimal duplication.',
    solution:
      'A Next.js 16 web app wrapped via Capacitor into a native Android APK. The app spans 22 routes and features a WebRTC-based QR scanner bound to the device camera, shake-to-scan via the accelerometer, offline ticket caching via IndexedDB/Dexie.js, VAPID/OneSignal push notifications, and role-gated dashboards.',
    architecture: `graph LR
  subgraph Native Shell
    A[Android APK via Capacitor]
    A --> B[Camera Plugin]
    A --> C[Torch Plugin]
    A --> D[Accelerometer Plugin]
  end

  subgraph Web Layer
    E[Next.js 16 Web App]
    E --> F[WebRTC QR Scanner]
    E --> G[IndexedDB / Dexie.js]
    E --> H[Service Worker + Push]
  end

  A --> E
  G -->|Background Sync| I[Express API]`,
    databaseDesign: `erDiagram
  SCAN_QUEUE {
    string ticket_code PK
    uuid event_id PK
    string status
    timestamp scanned_at
    boolean synced
  }
  CACHED_TICKET {
    string ticket_code PK
    uuid event_id FK
    string holder_name
    timestamp cached_at
  }
  SCAN_QUEUE ||--|| CACHED_TICKET : validates`,
    technologiesUsed: [
      {
        name: 'Capacitor',
        why: 'Native shell wrapping the existing Next.js codebase. Saved weeks of platform-specific code compared to React Native or Flutter.',
      },
      {
        name: 'WebRTC',
        why: 'Browser-native camera access for QR code scanning without requiring a native plugin, giving consistent behavior across web and native contexts.',
      },
      {
        name: 'IndexedDB / Dexie.js',
        why: 'Typed, schema-managed client-side database. Dexie\'s compound index support was essential for the duplicate-detection logic on (ticketCode, eventId).',
      },
      {
        name: 'OneSignal',
        why: 'Handles Android push segmentation, subscription management, and analytics out-of-the-box. Reduced the notification infrastructure to a single SDK call.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Shake-to-scan accelerometer binding in a web context',
        resolution:
          'Used the Web DeviceMotionEvent API to detect shake gestures. Calibrated threshold values by testing on multiple Android devices. The Capacitor Motion plugin provided a consistent API across OS versions.',
      },
      {
        challenge: 'Safari PWA push notifications without OneSignal SDK support',
        resolution:
          'Implemented direct VAPID Web Push from the backend for Safari on iOS 17+. Managed subscription lifecycle manually using the Push API and stored subscription objects in Supabase per user.',
      },
    ],
    lessonsLearned: [
      "Capacitor's native plugin bridge adds a small but measurable latency to camera initialization. Pre-warming the camera on route mount significantly improved perceived scanner speed.",
      'Dexie.js compound indexes must be declared in the schema definition, not added later — designing the offline schema before writing sync logic prevents painful migrations.',
    ],
    futureImprovements: [
      'Migrate WebRTC QR scanning to a native Capacitor barcode plugin for better low-light performance.',
      'Add background geofencing to auto-open the scanner when a user enters a registered event venue.',
    ],
    links: [
      { label: 'GitHub (Mobile)', url: 'https://github.com/sgk18/sociomobilev2' },
      { label: 'Live App', url: 'https://app.withsocio.com' },
    ],
    tags: ['Next.js 16', 'Capacitor', 'WebRTC', 'IndexedDB', 'OneSignal', 'VAPID', 'PWA'],
  },

  'notenova': {
    id: 'notenova',
    title: 'NoteNova — Academic Resource Sharing Platform',
    tagline: 'Full-stack monorepo: resource library, AI study tools, SRS flashcards, mock exams, real-time DM, bounty board, and Android app — for students, by students.',
    period: '2025',
    role: 'Full Stack Developer (Solo)',
    problem:
      'College students had no unified, searchable, socially-aware platform for academic resources. Notes lived in personal WhatsApp chats, question papers were buried in Google Drive folders, and knowledge was siloed within departments and batches. There was no incentive system to reward contributors or a way to surface high-quality material automatically.',
    motivation:
      'Build a production-grade multi-user platform from scratch that combines a social resource library, a gamified contribution economy (Nova Points), and AI-powered study tools — while exploring real-time messaging architecture, spaced repetition algorithms, and LLM integration in a single monorepo.',
    solution:
      'A Next.js monorepo running two concurrent servers: the main App Router application on port 3000 (24+ REST API routes, JWT auth, Cloudinary + UploadThing file storage, Groq + Bytez AI integration) and a standalone Socket.io microservice on port 3001 (real-time DM with read receipts, typing indicators, online presence, and doubt chat rooms). MongoDB via Mongoose stores 11 collections. An Android app is shipped via Capacitor wrapping the Vercel deployment.',
    architecture: `graph TD
  subgraph Client
    Browser[Next.js App Router + React 19]
    Android[Capacitor Android APK]
  end

  subgraph Servers
    Next[Next.js App - Port 3000]
    Socket[Socket.io Server - Port 3001]
  end

  subgraph Data
    MongoDB[(MongoDB - 11 Collections)]
  end

  subgraph AI
    Groq[Groq - Llama 3.1-8b]
    Bytez[Bytez SDK - LLM + TTS + OCR]
    UT[UploadThing CDN]
  end

  Browser -->|HTTP REST| Next
  Android -->|HTTPS| Next
  Browser -->|WebSocket| Socket
  Next --> MongoDB
  Socket --> MongoDB
  Next --> Groq
  Next --> Bytez
  Next --> UT`,
    databaseDesign: `erDiagram
  USER {
    ObjectId _id PK
    String name
    String email UK
    String password
    String college
    String department
    String semester
    Number points
    String role
    Date createdAt
  }
  RESOURCE {
    ObjectId _id PK
    String title
    String resourceType
    String subject
    String department
    String semester
    String fileUrl
    Boolean isPublic
    Number downloads
    Number avgRating
    Object smartNotes
    ObjectId uploadedBy FK
    Date createdAt
  }
  BOUNTY {
    ObjectId _id PK
    String title
    String rewardType
    Number rewardAmount
    String status
    ObjectId postedBy FK
    ObjectId solvedBy FK
    Date expiresAt
  }
  CONVERSATION {
    ObjectId _id PK
    ObjectId[] participants FK
    Object lastMessage
    Date updatedAt
  }
  MESSAGE {
    ObjectId _id PK
    ObjectId conversationId FK
    ObjectId sender FK
    String text
    ObjectId[] readBy FK
    Date createdAt
  }
  FLASHCARDPROGRESS {
    ObjectId _id PK
    ObjectId userId FK
    ObjectId resourceId FK
    CardState[] cards
    Object stats
    Date updatedAt
  }
  USER ||--o{ RESOURCE : uploads
  USER ||--o{ BOUNTY : posts
  USER }o--o{ CONVERSATION : participates
  CONVERSATION ||--o{ MESSAGE : contains
  USER ||--o{ FLASHCARDPROGRESS : tracks
  RESOURCE ||--o{ FLASHCARDPROGRESS : has`,
    technologiesUsed: [
      {
        name: 'Next.js 16 + React 19 (App Router)',
        why: 'Unified frontend and 24+ REST API routes in a single deployable monorepo. App Router file-based routing for all 14 page routes. Dynamic [id] segments for resource and user profiles.',
      },
      {
        name: 'MongoDB + Mongoose 9',
        why: 'Document model maps naturally to heterogeneous resource metadata (different fields per resource type). Mongoose ODM provides schema validation, virtuals, and index definitions. 11 collections with compound indexes for notification and SRS queries.',
      },
      {
        name: 'Socket.io 4 + Express 5 (server.js)',
        why: 'Standalone real-time microservice decoupled from the Next.js process. In-memory Map<userId, Set<socketId>> tracks online presence across multiple browser tabs. Persists DM messages directly to MongoDB via Mongoose schemas defined inline.',
      },
      {
        name: 'Groq API (Llama 3.1-8b-instant)',
        why: 'Sub-second inference for Ask Nova (academic Q&A) and Smart Notes generation. Llama 3.1-8b returns strict JSON for the Smart Notes object (summary, flashcards, MCQs, mind map, exam questions) in a single call with regex fallback parsing.',
      },
      {
        name: 'Bytez SDK (Meta-Llama-3-8B + TTS + BLIP-2)',
        why: 'Three separate Bytez model endpoints: Llama 3-8B for study material and mock exam generation, facebook/mms-tts-eng for text-to-speech audio overview, and kkatiz/THAI-BLIP-2 for image-to-text OCR. Allows AI-powered processing of uploaded image-based notes.',
      },
      {
        name: 'UploadThing',
        why: 'CDN file hosting for PDFs and images with server-side webhook verification. Eliminates self-managed S3 infrastructure while providing signed URLs and file type enforcement.',
      },
      {
        name: 'Capacitor 8 (Android)',
        why: 'Wraps the production Vercel deployment into a native Android APK. Device access (camera, status bar) via Capacitor plugins without writing native code, enabling a single codebase to target web and Android.',
      },
      {
        name: 'JWT + bcryptjs (Auth)',
        why: 'Stateless 7-day JWT tokens signed with HS256. bcrypt cost factor 10 for password hashing. authenticate() middleware extracts and verifies the Bearer token on every protected route, returning null on failure rather than throwing — allowing graceful degradation for optional-auth routes.',
      },
      {
        name: 'Three.js + @react-three/fiber',
        why: 'Custom WebGL particle field on the hero section. Theme-aware particle color changes (blue/violet/grey) based on the active CSS theme. Loaded lazily via next/dynamic with ssr: false to prevent SSR canvas conflicts.',
      },
      {
        name: 'Tailwind CSS v4 + shadcn/ui',
        why: 'Utility-first CSS with CSS custom properties for three switchable themes (Ion dark blue, Galaxy violet, White minimal). shadcn/ui provides accessible Radix-based primitives styled to match each theme.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Multi-tab online presence tracking in the Socket.io DM system',
        resolution:
          'Tracked online users with Map<userId, Set<socketId>> rather than Map<userId, socketId>. When a user opens a second tab, a new socket is added to their Set. Disconnect only broadcasts "offline" when the Set becomes empty after removing the disconnected socket — preventing false offline events when users switch browser tabs.',
      },
      {
        challenge: 'Smart Notes JSON parsing with LLM hallucination handling',
        resolution:
          'Groq Llama 3.1 is prompted with strict JSON schema instructions and a temperature of 0. The response is first attempted with JSON.parse(). On failure, a regex extracts the first {...} block from the raw string. If regex also fails, the API falls back to the resource\'s existing stored smartNotes (if cached) or returns a structured error — preventing 500s from surfacing to the UI.',
      },
      {
        challenge: 'Idempotent resource download counting with point rewards',
        resolution:
          'The GET /api/resources endpoint accepts a ?download=<resourceId> param. On match, it uses MongoDB $inc to atomically increment downloads and the uploader\'s points (+2) in a single findByIdAndUpdate call. This prevents race conditions between concurrent download requests and ensures the point reward is atomic with the counter increment.',
      },
      {
        challenge: 'Spaced repetition scheduling across four learning buckets',
        resolution:
          'Each flashcard stores bucket (new/learning/review/mastered), correctStreak, lastReviewed, and nextReview. On each answer, the API computes the next review time: 0ms for new, 1min for learning, 10min for review, 1440min for mastered. A compound unique index on {userId, resourceId} ensures one progress document per user per resource. The SRS UI only shows cards where nextReview <= now.',
      },
      {
        challenge: 'Mock exam generation with AI fallback to cached Smart Notes',
        resolution:
          'The Bytez Llama 3-8B model is prompted to return a 20-question JSON array (12 MCQ + 4 T/F + 4 Short Answer). If the AI response fails JSON parsing, the endpoint constructs the exam deterministically from resource.smartNotes: MCQs fill question slots first, then flashcards are converted to T/F questions, then examQuestions fill short-answer slots — ensuring the exam endpoint never returns a 500 even on total AI failure.',
      },
      {
        challenge: 'Trending score computation without a dedicated analytics store',
        resolution:
          'The GET /api/resources?sort=trending endpoint uses a MongoDB aggregation pipeline that adds a computed trendingScore field: { $add: [ { $multiply: ["$downloads", 2] }, { $multiply: ["$avgRating", 5] } ] }. This runs entirely in-database with no separate analytics write path, sorts by the computed field, and projects it out of the response to keep the payload clean.',
      },
    ],
    lessonsLearned: [
      'Running two concurrent processes (Next.js + Socket.io) in development requires npm-run-all or concurrently — documenting this upfront in the README prevents significant contributor confusion.',
      'Mongoose singleton connection caching (global.mongoose) is essential in Next.js serverless environments. Without it, cold starts create new connections on every invocation and exhaust the MongoDB Atlas connection pool within minutes under moderate load.',
      'The SRS algorithm must be designed before the data model — the bucket transitions and review intervals are business logic that dictate required index structures (compound {userId, resourceId} + sparse {nextReview}).',
      'Groq\'s Llama 3.1-8b-instant is genuinely fast enough for real-time UX (sub-2s for Smart Notes) but requires a robust fallback chain for when it returns malformed JSON — production AI endpoints must never assume valid structured output.',
      'Per-user point balances should use atomic $inc operations, not read-modify-write patterns — the download endpoint originally used find() → modify → save(), which lost point updates under concurrent downloads.',
      'The Bytez SDK\'s TTS model returns base64-encoded audio. Streaming the base64 string directly to the AudioPlayer avoids creating blob URLs and simplifies cleanup, but the browser decodes it synchronously on long texts — chunking the text before TTS calls is necessary for documents over 2000 characters.',
    ],
    futureImprovements: [
      'Vector embeddings for semantic resource search using MongoDB Atlas Vector Search or pgvector.',
      'Study group rooms with shared real-time document annotation via Yjs CRDT.',
      'AI Resume Parser: match uploaded question papers against subject syllabi to surface the most relevant resources automatically.',
      'Rate limiting per-IP on AI endpoints (Ask Nova, Smart Notes) using Redis/Upstash to prevent abuse without blocking legitimate users.',
      'Replace client-side localStorage auth with HttpOnly cookie + CSRF token pattern for improved XSS resilience.',
      'Migrate the Socket.io server to a managed WebSocket provider (Ably / Pusher) to eliminate the two-process dev setup and simplify Vercel deployment.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/sgk18/NoteNova' },
      { label: 'Live Demo', url: 'https://note-nova-khaki.vercel.app' },
    ],
    tags: ['Next.js 16', 'React 19', 'MongoDB', 'Mongoose', 'Socket.io', 'Express 5', 'Groq', 'Llama 3.1', 'Bytez', 'UploadThing', 'Capacitor', 'JWT', 'Three.js', 'Tailwind CSS v4', 'SRS', 'AI'],
  },

  'facultyapp': {
    id: 'facultyapp',
    title: 'FacultyApp',
    tagline: 'Institutional workflow platform — Flutter mobile + Next.js web, role-based access',
    period: '2025',
    role: 'Full Stack Developer',
    problem:
      'Faculty at university departments had no mobile-first system for managing timetables, event approvals, student communications, and internal workflows. Processes relied on in-person meetings and paper forms.',
    motivation:
      'Wanted to explore cross-platform mobile development with Flutter and build a production-grade institutional system with real role hierarchies (ADMIN, HOD, FACULTY).',
    solution:
      'A Flutter + Riverpod/GoRouter mobile app paired with a Next.js web portal. Backed by Supabase with Prisma as the ORM. Integrates Google OAuth, Gmail/Calendar API for academic scheduling, FCM push notifications, and Resend for transactional emails.',
    architecture: `graph TD
  A[Flutter App] --> B[Next.js API]
  C[Next.js Web Portal] --> B
  B --> D[(Supabase / PostgreSQL via Prisma)]
  B --> E[Google OAuth]
  B --> F[Gmail API]
  B --> G[Google Calendar API]
  B --> H[FCM Push]
  B --> I[Resend Email]`,
    databaseDesign: `erDiagram
  FACULTY {
    uuid id PK
    string email
    string role
    string department
  }
  EVENT_REQUEST {
    uuid id PK
    uuid requester_id FK
    string title
    string status
    timestamp created_at
  }
  APPROVAL {
    uuid id PK
    uuid event_request_id FK
    uuid approver_id FK
    string decision
    timestamp decided_at
  }
  FACULTY ||--o{ EVENT_REQUEST : submits
  FACULTY ||--o{ APPROVAL : grants
  EVENT_REQUEST ||--o{ APPROVAL : requires`,
    technologiesUsed: [
      {
        name: 'Flutter + Riverpod',
        why: 'Flutter for true cross-platform mobile from a single Dart codebase. Riverpod for reactive state management with dependency injection, avoiding the boilerplate of Provider.',
      },
      {
        name: 'GoRouter',
        why: 'Declarative URL-based navigation for Flutter with deep linking support and role-based route guards.',
      },
      {
        name: 'Prisma',
        why: 'Type-safe ORM for complex relational queries across faculty, departments, and event approval chains. Prisma migrations provided a safe schema evolution workflow.',
      },
      {
        name: 'Google Calendar API',
        why: 'Approved events are automatically created as Google Calendar entries for all relevant faculty, eliminating manual calendar management.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Approval chain workflows with multiple required approvers',
        resolution:
          'Modeled approval chains as a linked list of required approvers per event type. Each approval record stores its state independently, and a trigger function computes overall event status from the chain to avoid costly joins on every read.',
      },
    ],
    lessonsLearned: [
      'Prisma schema-first development forces you to think about data relationships early, which catches modeling mistakes before they become migration headaches.',
      'Google API OAuth scopes are broad — requesting the minimum viable scope upfront makes token refresh and user trust significantly easier.',
    ],
    futureImprovements: [
      'Add AI-powered meeting scheduling that suggests optimal times across faculty calendars.',
      'Introduce an audit log system for all approval decisions to support institutional compliance.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/sgk18/Facultyapp' },
    ],
    tags: ['Flutter', 'Riverpod', 'GoRouter', 'Next.js', 'Supabase', 'Prisma', 'Google APIs', 'FCM'],
  },
};
