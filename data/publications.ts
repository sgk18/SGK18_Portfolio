export interface Publication {
  readonly id: string;
  readonly title: string;
  readonly venue: string;
  readonly role: string;
  readonly status: string;
  readonly coAuthors: readonly string[];
  readonly institution: string;
  readonly tags: readonly string[];
  readonly oneLineSummary: string;
  readonly shortDescription: string;
  readonly highlights: readonly string[];
  readonly caseStudySlug: string;
}

export const publicationsData: readonly Publication[] = [
  {
    id: "icsdi-2026-institutional-intelligence",
    title:
      "A Unified AI-Driven Institutional Intelligence Platform for Accreditation, Ranking, and ESG Reporting in Higher Education",
    venue:
      "2nd International Conference on Sustainable Development and Innovation (ICSDI 2026), hosted by Gulf University, Bahrain · 16–17 November 2026",
    role: "Co-author & Presenter",
    status: "Accepted & Presented · Proceedings with Taylor & Francis to follow",
    coAuthors: [
      "Dr. Kavitha Jayakumar",
      "Dr. Rohini V",
      "Dr. Vinnarasi B",
      "Bhargav Shree Raj G",
      "Dhinesh Karthik R",
    ],
    institution: "CHRIST (Deemed to be University), Bengaluru",
    tags: [
      "Research",
      "NAAC",
      "NIRF",
      "ESG",
      "Higher Education",
      "Data Architecture",
      "AI",
    ],
    oneLineSummary:
      "A design paper for a platform that stores each institutional fact once, with its evidence, and derives NAAC, NIRF and sustainability-framework figures from it by versioned rules.",
    shortDescription:
      "Colleges report to several accreditation and ranking frameworks as if it were one dataset. We mapped NAAC's 2024 data validation items against NIRF 2025 and found that only 15 of 57 share an underlying data element, and that definitions often differ — for example, NAAC's enrolment excludes Ph.D. students while NIRF includes them. The paper proposes a four-layer platform that collects each data element once, validates it in five levels, and computes each framework's figure by a versioned rule, with a named person approving anything reported.",
    highlights: [
      "Co-authored a research paper accepted at an international conference, presented 16 November 2026",
      "Revised the paper through double-blind peer review",
      "Designed a four-layer data architecture with a five-level validation pipeline",
      "Built an effort-sensitivity model with a break-even condition",
    ],
    caseStudySlug: "institutional-intelligence-platform",
  },
];
