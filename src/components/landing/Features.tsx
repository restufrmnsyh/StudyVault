import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FolderOpen,
  Users,
  Calendar,
  Sparkles,
  Laptop,
} from "lucide-react";
import { Section, Container } from "@/components/common";
import { FEATURES } from "@/constants/landing";

const iconMap: Record<string, LucideIcon> = {
  fileText: FileText,
  folderOpen: FolderOpen,
  users: Users,
  calendar: Calendar,
  sparkles: Sparkles,
  laptop: Laptop,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function Features() {
  return (
    <Section id="features">
      <Container>
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.span
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400"
          >
            {FEATURES.badge}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            {FEATURES.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-text-secondary"
          >
            {FEATURES.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {FEATURES.items.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-surface-hover"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
                </div>

                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                    {Icon && <Icon className="h-5 w-5 text-violet-400" />}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-muted">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
