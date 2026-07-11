export interface NavLink {
  label: string;
  href: string;
}

export interface NavContent {
  links: NavLink[];
  cta: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  badge: string;
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  badge: string;
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
}

export interface PreviewContent {
  badge: string;
  title: string;
  subtitle: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  badge: string;
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export interface CTAContent {
  title: string;
  subtitle: string;
  cta: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  columns: FooterColumn[];
  copyright: string;
}
