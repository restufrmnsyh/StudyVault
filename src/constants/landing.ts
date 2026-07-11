import type {
  NavContent,
  HeroContent,
  FeaturesContent,
  HowItWorksContent,
  PreviewContent,
  FAQContent,
  CTAContent,
  FooterContent,
} from "@/types/landing";

export const NAV: NavContent = {
  links: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Get Started",
};

export const HERO: HeroContent = {
  badge: "Built for University Students",
  title: "Your Academic Knowledge, Finally Organized.",
  subtitle:
    "Stop losing notes across apps and semesters. StudyVault is the all-in-one hub to capture, organize, and master your coursework — so you can focus on what matters.",
  primaryCTA: "Start for Free",
  secondaryCTA: "See How It Works",
};

export const FEATURES: FeaturesContent = {
  badge: "Features",
  title: "Everything You Need to Ace Your Courses",
  subtitle:
    "Purpose-built tools that work the way students actually study. No bloat, no learning curve — just results.",
  items: [
    {
      icon: "fileText",
      title: "Smart Notes",
      description:
        "Rich-text notes with markdown support, code blocks, and LaTeX. Organize by course, topic, or tag — and find anything in seconds.",
    },
    {
      icon: "folderOpen",
      title: "Course Vault",
      description:
        "A dedicated space for every course. Upload lecture slides, readings, and assignments — all structured and searchable by semester.",
    },
    {
      icon: "users",
      title: "Study Collaboration",
      description:
        "Share notes with classmates, create study groups, and build a collective knowledge base that makes everyone smarter.",
    },
    {
      icon: "calendar",
      title: "Study Planner",
      description:
        "Plan your week, track deadlines, and schedule study sessions. Visual timelines keep you ahead of every exam and assignment.",
    },
    {
      icon: "sparkles",
      title: "AI Summaries",
      description:
        "Let AI distill lengthy lectures and readings into concise summaries. Generate flashcards and practice questions automatically.",
    },
    {
      icon: "laptop",
      title: "Cross-Platform",
      description:
        "Access your vault from any device — laptop, tablet, or phone. Your knowledge syncs seamlessly so you can study anywhere.",
    },
  ],
};

export const HOW_IT_WORKS: HowItWorksContent = {
  badge: "How It Works",
  title: "From Chaos to Clarity in Three Steps",
  subtitle:
    "StudyVault fits into your existing workflow. No complicated setup — just start and watch your academic life transform.",
  steps: [
    {
      step: 1,
      title: "Upload Your Materials",
      description:
        "Drag in lecture slides, PDFs, and notes. StudyVault automatically organizes them by course and topic.",
    },
    {
      step: 2,
      title: "Organize & Connect",
      description:
        "Tag, link, and structure your knowledge. Build connections between concepts across courses and semesters.",
    },
    {
      step: 3,
      title: "Study & Master",
      description:
        "Review with AI-powered summaries, collaborate with peers, and track your progress as you master every subject.",
    },
  ],
};

export const PREVIEW: PreviewContent = {
  badge: "Preview",
  title: "A Workspace Designed for Students",
  subtitle:
    "Clean, focused, and built around how you actually study. Everything you need, nothing you don't.",
};

export const FAQ: FAQContent = {
  badge: "FAQ",
  title: "Questions? We've Got Answers.",
  subtitle:
    "Everything you need to know about StudyVault before you dive in.",
  items: [
    {
      question: "Is StudyVault free for students?",
      answer:
        "Yes — StudyVault offers a generous free tier that covers everything a student needs. We believe great tools should be accessible. Premium features like AI summaries and unlimited storage are available for power users.",
    },
    {
      question: "Can I import notes from other apps?",
      answer:
        "Absolutely. StudyVault supports imports from Notion, Google Docs, Evernote, and plain Markdown files. Your existing notes transfer in minutes, not hours.",
    },
    {
      question: "Does it work offline?",
      answer:
        "Yes. StudyVault works offline so you can study without an internet connection. Your changes sync automatically when you reconnect — no data lost, ever.",
    },
    {
      question: "How is my data kept secure?",
      answer:
        "Your data is encrypted at rest and in transit. We use industry-standard security practices and never sell your information. You own your data — export everything anytime.",
    },
    {
      question: "Can I collaborate with classmates?",
      answer:
        "Yes — share individual notes, entire course vaults, or create study groups. Real-time collaboration means you can work together on shared materials during study sessions.",
    },
  ],
};

export const CTA_SECTION: CTAContent = {
  title: "Ready to Transform Your Study Game?",
  subtitle:
    "Join thousands of students who've stopped losing notes and started mastering their courses. It's free to start.",
  cta: "Get Started for Free",
};

export const FOOTER: FooterContent = {
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Community", href: "#" },
        { label: "Support", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} StudyVault. All rights reserved.`,
};
