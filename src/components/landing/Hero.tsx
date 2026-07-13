import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/common";
import { HERO } from "@/constants/landing";

const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const pulseGlow = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden">
      {/* Layered background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary radial gradient — violet center bloom */}
        <motion.div
          variants={pulseGlow}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-[20%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(99,102,241,0.3) 40%, transparent 70%)",
          }}
        />

        {/* Secondary glow — offset indigo */}
        <motion.div
          variants={pulseGlow}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="absolute top-[60%] right-[15%] h-[500px] w-[500px] rounded-full opacity-10 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 60%)",
          }}
        />

        {/* Tertiary glow — subtle warm accent */}
        <motion.div
          variants={pulseGlow}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="absolute bottom-[20%] left-[10%] h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 60%)",
          }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top edge fade for navbar blending */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

        {/* Bottom edge fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        <motion.div
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center py-32 text-center lg:py-40"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-4 py-1.5 text-[13px] font-medium tracking-wide text-violet-400 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            {HERO.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-[2.5rem] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            <span className="gradient-text">{HERO.title}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mb-12 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg sm:leading-relaxed"
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          >
            {/* Primary CTA */}
            <a
              href="#/dashboard"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
            >
              {/* Button gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500" />
              {/* Hover shimmer overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Glow effect behind button */}
              <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 opacity-40 blur-lg transition-all duration-300 group-hover:opacity-60 group-hover:blur-xl" />
              <span className="relative">{HERO.primaryCTA}</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>

            {/* Secondary CTA */}
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-[15px] font-medium text-text-secondary backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-text-primary"
            >
              {HERO.secondaryCTA}
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
