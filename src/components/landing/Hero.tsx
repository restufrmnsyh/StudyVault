import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/common";
import { HERO } from "@/constants/landing";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Container>
        <motion.div
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            {HERO.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="gradient-text">{HERO.title}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <a
              href="#"
              className="glow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gradient-from to-gradient-to px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/25"
            >
              {HERO.primaryCTA}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-medium text-text-primary transition-all duration-300 hover:border-violet-500/30 hover:bg-surface"
            >
              {HERO.secondaryCTA}
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
