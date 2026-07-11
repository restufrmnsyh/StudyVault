import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section, Container } from "@/components/common";
import { FAQ as FAQ_DATA } from "@/constants/landing";

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

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <Section id="faq">
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
            {FAQ_DATA.badge}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            {FAQ_DATA.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-text-secondary"
          >
            {FAQ_DATA.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-3xl divide-y divide-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {FAQ_DATA.items.map((item, index) => (
            <motion.div key={index} variants={fadeInUp} className="py-5">
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="pr-4 text-base font-medium text-text-primary transition-colors hover:text-violet-400">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-text-muted" />
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-text-muted">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
