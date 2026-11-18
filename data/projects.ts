export type ProjectCategory =
  | "Full-Stack"
  | "Mobile & PWA"
  | "Frontend"
  | "Systems & Graphics"
  | "Research";

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ProjectCategory;
  readonly image?: string;
  readonly imageFit?: "cover" | "contain";
  readonly imageBg?: string;
  readonly previewLabel?: string;
  readonly tags: readonly string[];
  readonly github: string;
  readonly live: string;
  readonly featured?: boolean;
  readonly hasCaseStudy?: boolean;
}

export const projects: readonly Project[] = [
  {
    id: "institutional-intelligence-platform",
    title: "Unified Institutional Intelligence Platform (ICSDI 2026)",
    description:
      "Colleges report to several accreditation and ranking frameworks as if it were one dataset. We mapped NAAC's 2024 data validation items against NIRF 2025 and found that only 15 of 57 share an underlying data element, and that definitions often differ (e.g., NAAC enrolment excludes Ph.D. students while NIRF includes them). Proposes a four-layer platform that collects each fact once, validates it in five levels, and derives each framework's figure by a versioned rule with named human approval.",
    category: "Research",
    previewLabel: "ICSDI 2026 · TAYLOR & FRANCIS",
    tags: ["Research", "NAAC", "NIRF", "ESG", "Higher Education", "Data Architecture", "AI"],
    github: "https://github.com/sgk18",
    live: "#",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "atlas-portfolio",
    title: "Atlas — Personal Portfolio & Career OS",
    description:
      "This site. A full-stack Next.js 16 portfolio with a 12-module career management dashboard (Atlas Console) — recruiter CRM with email threads, opportunity pipeline, job application tracker, hackathon logger, live site analytics, goal tracker, and an automated deadline reminder engine with Resend email delivery.",
    category: "Full-Stack",
    image: "/atlas.png",
    imageFit: "cover",
    tags: ["Next.js 16", "TypeScript", "Prisma", "Turso (LibSQL)", "Resend", "TanStack Query", "Framer Motion"],
    github: "https://github.com/sgk18/SGK18_Portfolio",
    live: "https://suryachalam.vercel.app",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "socio-website",
    title: "SOCIO — Official Website",
    description:
      "Full-scale hybrid campus event platform — event discovery, QR ticketing, role-gated dashboards, and push notification infrastructure serving real users at CHRIST University.",
    category: "Full-Stack",
    image: "/socio.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js 15", "Express 5", "Supabase", "Valkey", "PostgreSQL", "Capacitor"],
    github: "https://github.com/sgk18",
    live: "https://socio.christuniversity.in",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "socio-mobile",
    title: "SOCIO Mobile",
    description:
      "Capacitor hybrid Android app spanning 22 routes — offline-first QR scanner with IndexedDB sync, shake-to-scan, VAPID/OneSignal push notifications, and native device integrations.",
    category: "Mobile & PWA",
    image: "/socio.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js 16", "Capacitor", "IndexedDB", "WebRTC", "OneSignal", "PWA"],
    github: "https://github.com/sgk18/sociomobilev2",
    live: "https://app.withsocio.com",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "facultyapp",
    title: "FacultyApp",
    description:
      "Institutional workflow platform — Flutter + Riverpod mobile app and Next.js web portal with Prisma/Supabase, JWT auth, Google OAuth, Calendar API integrations, FCM, and role-based access.",
    category: "Mobile & PWA",
    image: "/Faculty.ico",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Flutter", "Riverpod", "Next.js", "Supabase", "Prisma", "Google APIs"],
    github: "https://github.com/sgk18/Facultyapp",
    live: "https://github.com/sgk18/Facultyapp",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "labyrinth-portal",
    title: "Labyrinth — Official CS Club Platform",
    description:
      "Full-stack student developer club platform (Next.js 16, Supabase PostgreSQL with RLS) with dynamic form builder, applicant evaluation pipeline, auto-failover dual-storage engine, JWT (JOSE) session security, and client-side .docx report generator.",
    category: "Full-Stack",
    image: "/labyrinth.jpg",
    imageFit: "cover",
    tags: ["Next.js 16", "TypeScript", "Supabase", "PostgreSQL", "RLS", "JWT/JOSE"],
    github: "https://github.com/sgk18/labyrinth",
    live: "https://labyrinth.christuniversity.in",
    featured: true,
  },
  {
    id: "notenova",
    title: "NoteNova",
    description:
      "Multi-user academic resource sharing with real-time Direct Messaging, AI-powered tools, and a scalable PostgreSQL/Supabase architecture.",
    category: "Full-Stack",
    image: "/notenova.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "AI Integrations"],
    github: "https://github.com/sgk18/NoteNova",
    live: "https://note-nova-khaki.vercel.app",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "cpp",
    title: "Centre for Peace Praxis",
    description:
      "Multi-page institutional site for a university peace research centre — event schedules, alumni directories, faculty database, dashboard with authentication, and full PWA support.",
    category: "Frontend",
    image: "/cpp_logo.png",
    imageFit: "contain",
    imageBg: "bg-[#0a1628]",
    tags: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "TypeScript", "PWA"],
    github: "https://github.com/sgk18/Centre-for-Peace-Praxis",
    live: "https://sgk18.github.io/CPP",
  },
  {
    id: "studio-tfa",
    title: "Studio TFA",
    description:
      "Creative studio e-commerce platform — modular frontend architecture, adaptive layouts, built for a freelance client.",
    category: "Frontend",
    previewLabel: "STUDIO TFA",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/sgk18/Studio-TFA",
    live: "#",
  },
  {
    id: "aegis",
    title: "Aegis",
    description:
      "Modular productivity platform with a highly scalable frontend architecture and integrated backend database.",
    category: "Full-Stack",
    previewLabel: "AEGIS WEB",
    tags: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    github: "https://github.com/sgk18/aegis-web",
    live: "#",
  },
  {
    id: "arcadia",
    title: "Arcadia RPG",
    description:
      "Fantasy RPG in two layers: native C with custom DSA (linked lists, graphs, priority queues, circular buffers) and Win32 GUI, plus a browser port via Next.js API and HTML5 Canvas renderer.",
    category: "Systems & Graphics",
    previewLabel: "ARCADIA C99 + CANVAS",
    tags: ["C99", "Win32 API", "Next.js", "TypeScript", "HTML5 Canvas"],
    github: "https://github.com/sgk18/Arcadia",
    live: "#",
  },
  {
    id: "techleons",
    title: "Techleons Event Platform",
    description:
      "Immersive Stranger Things-themed event landing page — custom cursor, canvas particle effects, glitch text, flashlight effect, and CRT overlay.",
    category: "Frontend",
    previewLabel: "TECHLEONS",
    tags: ["Next.js", "TypeScript", "React Context", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/sgk18/Techleons",
    live: "https://techleons-weld.vercel.app",
  },
];
