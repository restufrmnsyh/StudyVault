import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section, Container } from "@/components/common";
import { CTA_SECTION } from "@/constants/landing";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function CTA() {
  return (
    <Section>
      <Container>
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-surface to-indigo-500/10 px-6 py-16 text-center sm:px-12 sm:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px]" />
          </div>

          <div className="relative z-10">
            <motion.h2
              variants={fadeInUp}
              className="mx-auto mb-4 max-w-xl text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
            >
              {CTA_SECTION.title}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-8 max-w-lg text-lg text-text-secondary"
            >
              {CTA_SECTION.subtitle}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a
                href="#"
                className="glow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gradient-from to-gradient-to px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/25"
              >
                {CTA_SECTION.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
