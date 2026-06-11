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
    title: 'Atlas — Personal Portfolio & Career OS',
    tagline: 'This site — a full-stack Next.js portfolio with a 12-module career management admin dashboard',
    period: 'May 2026 – Present',
    role: 'Solo Engineer & Designer',
    problem:
      'Standard portfolio sites show static project cards. There was no system to actively manage the job search: no CRM for recruiter conversations, no pipeline for opportunities, no deadline alerts, and no analytics on who was visiting the site. Everything was tracked manually in scattered notes.',
    motivation:
      'Build the portfolio itself as a production-grade engineering showcase — one that demonstrates database design, full-stack architecture, background jobs, transactional email, and a polished admin dashboard all in a single deployable system.',
    solution:
      'A Next.js 16 portfolio with a password-protected admin console (Atlas) containing 12 career management modules: Recruiter CRM with email reply via Resend, Opportunity pipeline, Job Application tracker, Hackathon logger, Events calendar, Learning Roadmap, Goal tracker, Networking directory, Notes system, Reminder engine, Activity timeline, and Site analytics (page views, unique visitors, referrers). The database runs on Turso (LibSQL) via Prisma with a @libsql/client adapter for edge-compatible queries on Vercel.',
    architecture: `graph TD
  subgraph Portfolio Site
    A[Next.js 16 App Router] --> B[Landing Page Components]
    A --> C[/admin — Atlas Console]
  end

  subgraph Admin Console
    C --> D[TanStack Query Cache]
    D --> E[Server Actions — careeros.ts]
    E --> F[(Turso LibSQL via Prisma)]
  end

  subgraph Automation
    G[/api/cron/reminders — Vercel Cron] --> F
    G --> H[Resend Email API]
    I[/api/cron/digest — Daily Brief] --> F
    I --> H
  end

  subgraph Analytics
    J[VisitTracker Component] --> K[/api/analytics/visit]
    K --> F
    L[Atlas Analytics Tab] --> M[/api/admin/analytics]
    M --> F
  end`,
    databaseDesign: `erDiagram
  Contact {
    string id PK
    string name
    string email
    string status
    string notes
    datetime lastContact
    datetime nextFollowUp
  }
  Conversation {
    string id PK
    string contactId FK
    string subject
    datetime lastMessageAt
  }
  Message {
    string id PK
    string conversationId FK
    string senderType
    string content
  }
  Opportunity {
    string id PK
    string title
    string company
    string status
    string type
    datetime deadline
  }
  Application {
    string id PK
    string role
    string company
    string status
    datetime appliedDate
  }
  Visit {
    string id PK
    string page
    string ipHash
    string referrer
    datetime createdAt
  }
  Reminder {
    string id PK
    string title
    datetime reminderDate
    boolean completed
    boolean emailSent
  }
  Contact ||--o{ Conversation : has
  Conversation ||--o{ Message : contains`,
    technologiesUsed: [
      {
        name: 'Next.js 16 (App Router)',
        why: 'Server Components for zero-JS landing page sections, Server Actions for all admin mutations, and API Routes for analytics tracking. Turbopack for fast local development.',
      },
      {
        name: 'Prisma + Turso (LibSQL)',
        why: 'Turso is a distributed SQLite-on-the-edge database. Prisma provides type-safe schema and migrations. The @libsql/client adapter makes Prisma compatible with Turso\'s HTTP API, enabling edge-compatible queries on Vercel serverless functions.',
      },
      {
        name: 'TanStack Query (React Query)',
        why: 'All admin dashboard data is fetched via useQuery with a single "dashboardData" query key. Mutations use queryClient.invalidateQueries() to refetch stale data, giving optimistic UI updates without manual state management.',
      },
      {
        name: 'Resend',
        why: 'Transactional email for the CRM reply system (replies to recruiters), daily digest briefs, and deadline warning alerts. The from-email uses a custom domain for deliverability.',
      },
      {
        name: 'Vercel Cron Jobs',
        why: 'Runs deadline scans, daily brief emails, and evening summaries on a schedule without a separate job queue or worker process. Configured via vercel.json cron expressions.',
      },
      {
        name: 'Framer Motion',
        why: 'Page scroll animations via useInView, staggered card entrances, and the Command Palette overlay animation. ScrollReveal wrapper keeps animation logic separate from content components.',
      },
      {
        name: 'Neo-Brutalist Design System',
        why: 'Custom CSS design language with thick borders, no border-radius, red/black palette, and offset shadow utility (shadow-[4px_4px_0px_#0A0A0A]). The admin console has a light/dark mode toggle preserving the brutalist aesthetic in both themes.',
      },
    ],
    technicalChallenges: [
      {
        challenge: 'Making Prisma work with Turso (LibSQL) on Vercel edge',
        resolution:
          'Turso uses the libsql:// protocol which is not supported by standard Prisma drivers. Solved by using the @prisma/adapter-libsql package with the @libsql/client HTTP client. The prisma.config.ts sets the adapter conditionally — falling back to a local SQLite file for development and using the Turso URL + auth token in production.',
      },
      {
        challenge: 'Admin dashboard data freshness without full-page reloads',
        resolution:
          'Used a single TanStack Query key ("dashboardData") that fetches all 12 modules in one Server Action call. Every mutation (create, update, delete) calls queryClient.invalidateQueries({ queryKey: ["dashboardData"] }), which triggers a background refetch of only the stale data, keeping the UI in sync without page reloads.',
      },
      {
        challenge: 'Automated deadline alerts without a persistent worker',
        resolution:
          'The deadline engine runs as a Vercel Cron-triggered API route (/api/cron/reminders). It queries all items with upcoming deadlines, computes urgency (CRITICAL < 24h, HIGH < 72h, MEDIUM < 7 days), and sends Resend emails. A deadlineEngine.ts module handles the scoring logic and HTML email templates, keeping the cron handler thin.',
      },
      {
        challenge: 'Privacy-preserving site analytics without a third-party tracker',
        resolution:
          'Built a custom visit tracking system that stores a SHA-256 hash of the visitor\'s IP (not the IP itself) in the Visit table. Unique visitor count is computed as the count of distinct ipHash values. Referrer domains are extracted server-side from the Referer header. Zero cookies, zero third-party scripts.',
      },
    ],
    lessonsLearned: [
      'Turso\'s distributed SQLite is fast for read-heavy workloads but write operations go through a primary replica — for a portfolio with occasional writes, this is ideal.',
      'TanStack Query\'s single-key invalidation pattern works well for admin dashboards where data is holistic (all modules reload together), but could cause overfetching on larger datasets — in that case, per-module query keys would be better.',
      'Vercel Cron is simpler than a dedicated job queue for low-frequency background tasks, but has a 60-second execution limit — long-running email batches need to be chunked.',
      'Building the portfolio itself as an engineering project is more impressive than describing past projects — it\'s live, inspectable, and demonstrates taste in both engineering and design.',
    ],
    futureImprovements: [
      'Add AI-powered recruiter reply drafting using the OpenAI API inside the CRM reply box.',
      'Replace the custom analytics tracker with a page-level heatmap using canvas overlays.',
      'Add a public /changelog page that reads from the ActivityLog table to show project updates.',
      'Implement WebSocket-based live visitor count in the admin analytics tab using Turso\'s real-time subscriptions.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/sgk18/SGK18_Portfolio' },
      { label: 'Live Site', url: 'https://suryachalam.vercel.app' },
      { label: 'Admin Console', url: 'https://suryachalam.vercel.app/admin' },
    ],
    tags: ['Next.js 16', 'TypeScript', 'Prisma', 'Turso', 'LibSQL', 'Resend', 'TanStack Query', 'Framer Motion', 'Vercel Cron'],
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
