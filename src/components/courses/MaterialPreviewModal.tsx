import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, ExternalLink, FileImage, FileText, X } from "lucide-react";
import type { CourseMaterial } from "@/types/courses";

interface MaterialPreviewModalProps {
    material: CourseMaterial | null;
    onClose: () => void;
}

/**
 * Fullscreen preview for PDF/Image materials (Sprint 6.3).
 * Only ever rendered with a material whose type is "pdf" or "image" —
 * CourseDetailPage decides that via canPreviewInBrowser() before opening this.
 *
 * Sprint 7.2: Added error states for broken images, empty URLs, and load failures.
 */
export function MaterialPreviewModal({ material, onClose }: MaterialPreviewModalProps) {
    const isImage = material?.type === "image";
    const HeaderIcon = isImage ? FileImage : FileText;

    // Reset previewError whenever the material being shown changes.
    // useEffect is correct here: the reset runs once after the new material is committed,
    // not during render. The lint rule (react-hooks/set-state-in-effect) flags setState
    // calls inside effects as a performance concern, but this is a one-shot reset that
    // causes exactly one follow-up render — not a cascade. The inline render-phase
    // alternative (prevId comparison) caused an infinite loop when material is null
    // because material?.id (undefined) !== prevMaterialId (null) is always true.
    const [previewError, setPreviewError] = useState(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setPreviewError(false); }, [material]);

    // Treat a missing URL as an immediate error
    const hasUrl = Boolean(material?.fileUrl);

    return (
        <AnimatePresence>
            {material && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Panel */}
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
                                {material.fileUrl && (
                                    <a
                                        href={material.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[12px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Download</span>
                                    </a>
                                )}
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
                            {/* Error state: missing URL or image load failure */}
                            {(!hasUrl || previewError) ? (
                                <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                                        <AlertTriangle className="h-7 w-7 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-semibold text-text-primary">
                                            Preview unavailable
                                        </p>
                                        <p className="mt-1.5 max-w-xs text-[13px] text-text-muted">
                                            {!hasUrl
                                                ? "This file does not have a valid URL. It may have been removed from storage."
                                                : "The file could not be loaded for preview. It may have been moved, deleted, or is temporarily unavailable."}
                                        </p>
                                    </div>
                                    {material.fileUrl && (
                                        <div className="flex gap-2.5">
                                            <a
                                                href={material.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                Open in new tab
                                            </a>
                                            <a
                                                href={material.fileUrl}
                                                download
                                                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Download
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : isImage ? (
                                <div className="flex h-full items-center justify-center p-4">
                                    <img
                                        src={material.fileUrl}
                                        alt={material.name}
                                        className="max-h-full max-w-full rounded-lg object-contain"
                                        onError={() => setPreviewError(true)}
                                    />
                                </div>
                            ) : (
                                /* PDF in iframe — can't detect load errors reliably via onError.
                                   Provide a fallback "Trouble viewing?" bar at the bottom. */
                                <div className="flex h-full flex-col">
                                    <iframe
                                        src={material.fileUrl}
                                        title={material.name}
                                        className="h-full w-full flex-1 border-0"
                                    />
                                    <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/80 px-5 py-2.5 text-[12px] text-text-muted">
                                        <span>Trouble viewing?</span>
                                        <div className="flex gap-3">
                                            <a
                                                href={material.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                Open in new tab
                                            </a>
                                            <a
                                                href={material.fileUrl}
                                                download
                                                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                                            >
                                                <Download className="h-3 w-3" />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}