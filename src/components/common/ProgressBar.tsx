import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    /** 0–100 */
    progress: number;
    /** Delay (seconds) before the fill animation starts, useful for staggering with card entrance */
    delay?: number;
    className?: string;
}

export function ProgressBar({ progress, delay = 0, className }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, progress));

    return (
        <div className={cn("h-2 overflow-hidden rounded-full bg-zinc-800", className)}>
            <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${clamped}%` }}
                transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
            />
        </div>
    );
}
