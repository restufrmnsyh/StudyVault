import { AnimatePresence, motion } from "framer-motion";
import { Download, FileImage, FileText, X } from "lucide-react";
import type { CourseMaterial } from "@/types/courses";

interface MaterialPreviewModalProps {
    material: CourseMaterial | null;
    onClose: () => void;
}

/**
 * Fullscreen preview for PDF/Image materials (Sprint 6.3). Only ever rendered with a
 * material whose type is "pdf" or "image" — CourseDetailPage decides that via
 * material.service.ts's canPreviewInBrowser() before opening this, so this component
 * doesn't re-check the type itself.
 */
export function MaterialPreviewModal({ material, onClose }: MaterialPreviewModalProps) {
    const isImage = material?.type === "image";
    const HeaderIcon = isImage ? FileImage : FileText;

    return (
        <AnimatePresence>
            {material && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop — same treatment as UploadMaterialModal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Panel — same rounded/border/shadow language, just sized for fullscreen media */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                    <HeaderIcon className="h-4.5 w-4.5" />
                                </div>
                                <h2 className="truncate text-[15px] font-bold text-text-primary">{material.name}</h2>
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-1.5">
                                <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[12px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Download</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-zinc-800 hover:text-text-primary"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto bg-black/20">
                            {isImage ? (
                                <div className="flex h-full items-center justify-center p-4">
                                    <img
                                        src={material.fileUrl}
                                        alt={material.name}
                                        className="max-h-full max-w-full rounded-lg object-contain"
                                    />
                                </div>
                            ) : (
                                <iframe
                                    src={material.fileUrl}
                                    title={material.name}
                                    className="h-full w-full border-0"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}