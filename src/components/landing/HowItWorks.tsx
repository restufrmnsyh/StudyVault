import { motion } from "framer-motion";
import { Section, Container } from "@/components/common";
import { HOW_IT_WORKS } from "@/constants/landing";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="relative">
      <Container>
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.span
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400"
          >
            {HOW_IT_WORKS.badge}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            {HOW_IT_WORKS.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base text-text-secondary sm:text-lg"
          >
            {HOW_IT_WORKS.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute top-16 right-[16.67%] left-[16.67%] hidden h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent lg:block" />

          {HOW_IT_WORKS.steps.map((step) => (
            <motion.div
              key={step.step}
              variants={fadeInUp}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gradient-from to-gradient-to text-xl font-bold text-white shadow-lg shadow-violet-500/20">
                {step.step}
              </div>

              <h3 className="mb-3 text-xl font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
