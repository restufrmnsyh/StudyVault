import { useState, useEffect, useRef, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, X, UploadCloud, FileText } from "lucide-react";
import type { MaterialRecord } from "@/services/material.service";
import { formatBytes, getMaterialType } from "@/services/material.service";
import { useToast } from "@/hooks/useToast";

type EditTab = "details" | "replace";

interface EditMaterialModalProps {
    open: boolean;
    material: MaterialRecord | null;
    onClose: () => void;
    onUpdate: (id: string, updates: { title?: string; description?: string | null }) => Promise<unknown>;
    onReplaceFile: (material: MaterialRecord, file: File) => Promise<unknown>;
    /** Which tab/section to focus when the modal opens */
    initialTab?: EditTab;
}

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "zip"];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

function validateFile(file: File): string | null {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        return "Unsupported file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, ZIP.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return "File exceeds 25 MB size limit.";
    }
    return null;
}

export function EditMaterialModal({
    open,
    material,
    onClose,
    onUpdate,
    onReplaceFile,
    initialTab = "details",
}: EditMaterialModalProps) {
    const { showToast } = useToast();
    const [tab, setTab] = useState<EditTab>(initialTab);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ title?: string }>({});

    // Replace file state
    const [replaceFile, setReplaceFile] = useState<File | null>(null);
    const [replaceError, setReplaceError] = useState<string | null>(null);
    const [replacing, setReplacing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && material) {
            const timer = setTimeout(() => {
                setTitle(material.title);
                setDescription(material.description || "");
                setErrors({});
                setReplaceFile(null);
                setReplaceError(null);
                setTab(initialTab);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [open, material, initialTab]);

    async function handleSaveDetails(e: FormEvent) {
        e.preventDefault();
        if (!material) return;

        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setErrors({ title: "Title is required." });
            return;
        }

        setSubmitting(true);
        try {
            await onUpdate(material.id, {
                title: trimmedTitle,
                description: description.trim() || null,
            });
            showToast("Material updated successfully", "success");
            onClose();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update material", "error");
        } finally {
            setSubmitting(false);
        }
    }

    function handleFileSelect(file: File) {
        const err = validateFile(file);
        if (err) {
            setReplaceError(err);
            setReplaceFile(null);
            return;
        }
        setReplaceError(null);
        setReplaceFile(file);
    }

    async function handleReplaceFile() {
        if (!material || !replaceFile) return;

        setReplacing(true);
        try {
            await onReplaceFile(material, replaceFile);
            showToast("File replaced successfully", "success");
            onClose();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to replace file", "error");
        } finally {
            setReplacing(false);
        }
    }

    const isWorking = submitting || replacing;

    return (
        <AnimatePresence>
            {open && material && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={isWorking ? undefined : onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                    <Pencil className="h-4 w-4" />
                                </div>
                                <h2 className="text-[15px] font-bold text-text-primary">Edit Material</h2>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isWorking}
                                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-zinc-800 hover:text-text-primary disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setTab("details")}
                                className={`flex-1 py-2.5 text-[12px] font-medium transition-colors ${
                                    tab === "details"
                                        ? "border-b-2 border-violet-500 text-violet-400"
                                        : "text-text-muted hover:text-text-secondary"
                                }`}
                            >
                                Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab("replace")}
                                className={`flex-1 py-2.5 text-[12px] font-medium transition-colors ${
                                    tab === "replace"
                                        ? "border-b-2 border-violet-500 text-violet-400"
                                        : "text-text-muted hover:text-text-secondary"
                                }`}
                            >
                                Replace File
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5">
                            {tab === "details" ? (
                                <form onSubmit={handleSaveDetails} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label htmlFor="edit-material-title" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                                            Title
                                        </label>
                                        <input
                                            id="edit-material-title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
                                            disabled={submitting}
                                            className="w-full rounded-xl border border-zinc-800 bg-black/20 px-3.5 py-2.5 text-[13px] text-text-primary placeholder-text-muted outline-none transition-colors focus:border-violet-500/50 disabled:opacity-50"
                                            placeholder="Material title"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-[11px] text-rose-400">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="edit-material-desc" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                                            Description
                                        </label>
                                        <textarea
                                            id="edit-material-desc"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            disabled={submitting}
                                            rows={3}
                                            className="w-full resize-none rounded-xl border border-zinc-800 bg-black/20 px-3.5 py-2.5 text-[13px] text-text-primary placeholder-text-muted outline-none transition-colors focus:border-violet-500/50 disabled:opacity-50"
                                            placeholder="Optional description"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-2.5 pt-1">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={submitting}
                                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-4 py-2 text-[13px] font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-60"
                                        >
                                            {submitting && (
                                                <span className="h-3.5 w-3.5 flex-shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    {/* Current file info */}
                                    <div className="rounded-xl border border-zinc-800 bg-black/20 p-3">
                                        <p className="text-[11px] font-medium text-text-muted mb-1">Current file</p>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 flex-shrink-0 text-text-muted" />
                                            <span className="truncate text-[13px] text-text-primary">{material.fileName}</span>
                                            <span className="flex-shrink-0 text-[11px] text-text-muted">
                                                {formatBytes(material.fileSize)} · {getMaterialType(material.mimeType, material.fileName).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* File picker */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",")}
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleFileSelect(f);
                                            e.target.value = "";
                                        }}
                                    />

                                    {replaceFile ? (
                                        <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.03] p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <UploadCloud className="h-4 w-4 flex-shrink-0 text-violet-400" />
                                                    <span className="truncate text-[13px] text-text-primary">{replaceFile.name}</span>
                                                    <span className="flex-shrink-0 text-[11px] text-text-muted">{formatBytes(replaceFile.size)}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setReplaceFile(null)}
                                                    className="rounded p-1 text-text-muted hover:text-text-primary"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-black/10 py-6 text-[13px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                                        >
                                            <UploadCloud className="h-4 w-4" />
                                            Choose replacement file
                                        </button>
                                    )}

                                    {replaceError && (
                                        <p className="text-[11px] text-rose-400">{replaceError}</p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-end gap-2.5 pt-1">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={replacing}
                                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReplaceFile}
                                            disabled={!replaceFile || replacing}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-4 py-2 text-[13px] font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-60"
                                        >
                                            {replacing && (
                                                <span className="h-3.5 w-3.5 flex-shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            )}
                                            Replace File
                                        </button>
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
