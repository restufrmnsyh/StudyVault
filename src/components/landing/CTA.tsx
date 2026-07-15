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
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] px-6 py-16 text-center sm:px-12 sm:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, #0c0c0f 40%, #0c0c0f 60%, rgba(99,102,241,0.08) 100%)",
          }}
        >
          {/* Radial glow — center */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)" }}
            />
          </div>

          {/* Floating blobs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -12, 0], x: [0, 6, 0] }}
            transition={{ y: { repeat: Infinity, duration: 6, ease: "easeInOut" }, x: { repeat: Infinity, duration: 8, ease: "easeInOut" }, opacity: { duration: 1 } }}
            className="pointer-events-none absolute top-[10%] left-[15%] h-32 w-32 rounded-full bg-violet-500/8 blur-[60px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0], x: [0, -8, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut" }, x: { repeat: Infinity, duration: 7, ease: "easeInOut" }, opacity: { duration: 1 } }}
            className="pointer-events-none absolute right-[10%] bottom-[15%] h-40 w-40 rounded-full bg-indigo-500/8 blur-[60px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ y: { repeat: Infinity, duration: 7, ease: "easeInOut" }, opacity: { duration: 1 } }}
            className="pointer-events-none absolute top-[60%] left-[60%] h-24 w-24 rounded-full bg-violet-400/6 blur-[40px]"
          />

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
                href="#/login"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 opacity-40 blur-lg transition-all duration-300 group-hover:opacity-60 group-hover:blur-xl" />
                <span className="relative">{CTA_SECTION.cta}</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}