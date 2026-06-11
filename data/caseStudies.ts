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
    title: 'NoteNova',
    tagline: 'Multi-user academic resource sharing platform with real-time DM and AI tools',
    period: '2025',
    role: 'Full Stack Developer',
    problem:
      'University students had no structured platform to share notes, collaborate on academic resources, or access AI-powered study tools. Resources were fragmented across WhatsApp, Google Drive, and email chains with no organization or discoverability.',
    motivation:
      'Build a production-grade multi-user platform from scratch to understand the architecture of social platforms: auth, real-time messaging, feed systems, and AI integration.',
    solution:
      'A Next.js full-stack application backed by Supabase (PostgreSQL) with real-time Direct Messaging via Supabase Realtime, AI-powered note summarization and Q&A, secure JWT authentication, and a scalable resource upload and tagging system.',
    architecture: `graph TD
  A[Next.js Frontend] --> B[Next.js API Routes]
  B --> C[(Supabase PostgreSQL)]
  B --> D[Supabase Realtime]
  D --> A
  B --> E[OpenAI / AI Integration]
  C --> F[Supabase Storage]`,
    databaseDesign: `erDiagram
  USER {
    uuid id PK
    string email
    string display_name
    timestamp created_at
  }
  RESOURCE {
    uuid id PK
    uuid author_id FK
    string title
    string[] tags
    string storage_path
    timestamp created_at
  }
  MESSAGE {
    uuid id PK
    uuid sender_id FK
    uuid receiver_id FK
    string content
    timestamp sent_at
  }
  USER ||--o{ RESOURCE : uploads
  USER ||--o{ MESSAGE : sends`,
    technologiesUsed: [
      {
        name: 'Next.js',
        why: 'Unified frontend and API in a single deployable unit. Server Actions simplified data mutations without building a separate REST API.',
      },
      {
        name: 'Supabase Realtime',
        why: 'PostgreSQL-backed websocket subscriptions for Direct Messaging with no additional infrastructure (Redis pub/sub, socket.io servers).',
      },
      {
        name: 'PostgreSQL Row-Level Security',
        why: 'Messages are only readable by the sender and receiver at the database layer, independent of API logic.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Real-time DM with read receipts at scale',
        resolution:
          'Used Supabase Realtime channel subscriptions filtered by (sender_id, receiver_id) pairs. Read receipts are UPDATE operations on the messages table, which trigger Realtime events on the receiver\'s subscription.',
      },
    ],
    lessonsLearned: [
      'Supabase Realtime is powerful but has connection limits per project. For large-scale DM systems, consider sharding across channels or using a dedicated pub/sub layer.',
      'AI integration is most useful when it reduces user friction (one-click summarize) rather than adding UI complexity.',
    ],
    futureImprovements: [
      'Add vector embeddings for semantic resource search using pgvector.',
      'Implement study group rooms with shared real-time document editing via Yjs.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/sgk18/NoteNova' },
      { label: 'Live', url: 'https://note-nova-khaki.vercel.app' },
    ],
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'AI', 'Realtime'],
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
