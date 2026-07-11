import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap } from "lucide-react";
import { Container } from "@/components/common";
import { NAV } from "@/constants/landing";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 16);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Navbar glass pane */}
      <div
        className={`transition-all duration-500 ease-out ${
          isScrolled
            ? "border-b border-white/[0.06] bg-background/60 shadow-[0_1px_8px_rgba(0,0,0,0.15)] backdrop-blur-2xl backdrop-saturate-150"
            : "bg-transparent"
        }`}
      >
        <Container>
          <nav className="flex h-14 items-center justify-between">
            {/* Logo */}
            <a href="/" className="group flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm shadow-violet-500/20 transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-violet-500/30">
                <GraduationCap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                StudyVault
              </span>
            </a>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group relative px-3.5 py-2 text-[13px] font-medium text-text-muted transition-colors duration-200 hover:text-text-primary"
                >
                  {link.label}
                  {/* Hover underline */}
                  <span className="absolute inset-x-3.5 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-violet-500 to-indigo-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              ))}
            </div>

            {/* Desktop CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="group relative hidden overflow-hidden rounded-lg px-4 py-1.5 text-[13px] font-semibold text-white md:inline-flex"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute -inset-px -z-10 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 opacity-40 blur-md transition-all duration-300 group-hover:opacity-60 group-hover:blur-lg" />
                <span className="relative">{NAV.cta}</span>
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary md:hidden"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMobileOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isMobileOpen ? (
                      <X className="h-[18px] w-[18px]" />
                    ) : (
                      <Menu className="h-[18px] w-[18px]" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </Container>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl backdrop-saturate-150 md:hidden"
          >
            <Container>
              <div className="flex flex-col gap-0.5 py-3">
                {NAV.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-text-secondary transition-colors duration-200 hover:bg-white/[0.04] hover:text-text-primary"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 border-t border-white/[0.06] pt-3">
                  <a
                    href="#"
                    onClick={closeMobile}
                    className="block w-full rounded-lg bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 py-2.5 text-center text-[14px] font-semibold text-white transition-shadow duration-300 hover:shadow-lg hover:shadow-violet-500/20"
                  >
                    {NAV.cta}
                  </a>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
