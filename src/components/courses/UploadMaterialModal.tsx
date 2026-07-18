import { useState, useEffect, useRef, type FormEvent, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, X, FileText, FileArchive, FileImage, FileSpreadsheet, Presentation, FileType2 } from "lucide-react";
import type { Course } from "@/types/courses";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { formatBytes, getMaterialType } from "@/services/material.service";

interface UploadMaterialModalProps {
    open: boolean;
    onClose: () => void;
    course: Course;
    onUpload: (title: string, description: string, file: File) => Promise<unknown>;
}

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "zip"];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

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

const iconMap = {
    pdf: FileText,
    ppt: Presentation,
    doc: FileType2,
    xls: FileSpreadsheet,
    zip: FileArchive,
    image: FileImage,
    video: FileText, // fallback
};

export function UploadMaterialModal({ open, onClose, course, onUpload }: UploadMaterialModalProps) {
    const { showToast } = useToast();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    
    const [isDragOver, setIsDragOver] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<{ title?: string; file?: string }>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Simulate progress bar increment during upload
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (submitting) {
            const timer = setTimeout(() => {
                setUploadProgress(10);
                interval = setInterval(() => {
                    setUploadProgress((prev) => {
                        if (prev >= 90) return prev;
                        return prev + 5;
                    });
                }, 100);
            }, 0);
            return () => {
                clearTimeout(timer);
                if (interval) clearInterval(interval);
            };
        }
    }, [submitting]);

    // Reset fields when opening modal
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setTitle("");
                setDescription("");
                setFile(null);
                setErrors({});
                setUploadProgress(0);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [open]);

    function handleClose() {
        if (submitting) return;
        onClose();
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        setIsDragOver(true);
    }

    function handleDragLeave() {
        setIsDragOver(false);
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        setIsDragOver(false);
        if (submitting) return;

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    }

    function triggerFileInput() {
        if (submitting) return;
        fileInputRef.current?.click();
    }

    function handleFileChange(e: FormEvent<HTMLInputElement>) {
        const selectedFile = (e.target as HTMLInputElement).files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    }

    function handleFileSelect(selectedFile: File) {
        const validationError = validateFile(selectedFile);
        if (validationError) {
            setErrors((prev) => ({ ...prev, file: validationError }));
            setFile(null);
        } else {
            setErrors((prev) => ({ ...prev, file: undefined }));
            setFile(selectedFile);
            // Autofill title if empty
            if (title.trim() === "") {
                const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf("."));
                setTitle(nameWithoutExt);
            }
        }
    }

    function removeFile(e: FormEvent) {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (submitting) return;

        const validationErrors: { title?: string; file?: string } = {};
        if (title.trim() === "") {
            validationErrors.title = "Material title is required.";
        }
        if (!file) {
            validationErrors.file = "Please select or drop a file to upload.";
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitting(true);
        try {
            await onUpload(title, description, file!);
            setUploadProgress(100);
            showToast("Material uploaded successfully.", "success");
            // Delay closing slightly so the user sees 100% completion
            setTimeout(() => {
                onClose();
            }, 300);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to upload material.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    const fileType = file ? getMaterialType(file.type, file.name) : "pdf";
    const FileIcon = iconMap[fileType as keyof typeof iconMap] || FileText;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                    <UploadCloud className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-text-primary">Upload Material</h2>
                                    <p className="text-[11px] text-text-muted">Add course notes, slides, or study documents</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={submitting}
                                className="rounded-lg p-1 text-text-muted transition-colors hover:bg-zinc-800 hover:text-text-primary disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {/* Course Display */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                    Course
                                </label>
                                <input
                                    type="text"
                                    value={`${course.code} — ${course.name}`}
                                    disabled
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[13px] text-text-muted cursor-not-allowed opacity-80"
                                />
                            </div>

                            {/* Dropzone area */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                    File Upload
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                                    disabled={submitting}
                                />

                                {!file ? (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={triggerFileInput}
                                        className={cn(
                                            "group flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center cursor-pointer transition-colors duration-200",
                                            isDragOver
                                                ? "border-violet-500/50 bg-violet-500/[0.04]"
                                                : "border-zinc-800 bg-white/[0.01] hover:border-zinc-700 hover:bg-white/[0.02]"
                                        )}
                                    >
                                        <UploadCloud className="h-8 w-8 text-text-muted mb-2 group-hover:text-text-secondary transition-colors" />
                                        <p className="text-[13px] font-medium text-text-secondary">
                                            Drag and drop your file here, or <span className="text-violet-400 hover:text-violet-300">browse</span>
                                        </p>
                                        <p className="mt-1 text-[11.5px] text-text-muted">
                                            PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, ZIP up to 25 MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                            <FileIcon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[13px] font-medium text-text-primary">
                                                {file.name}
                                            </p>
                                            <p className="text-[11.5px] text-text-muted">
                                                {formatBytes(file.size)} · {file.type || "Unknown type"}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            disabled={submitting}
                                            className="rounded-lg p-1.5 text-text-muted hover:bg-zinc-800 hover:text-text-primary disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {errors.file && (
                                    <p className="mt-1.5 text-[12px] text-rose-400 font-medium">{errors.file}</p>
                                )}
                            </div>

                            {/* Title input */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                    Title <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter file title"
                                    disabled={submitting}
                                    className={cn(
                                        "w-full rounded-lg border bg-zinc-950 px-3 py-2 text-[13px] text-text-primary placeholder-zinc-600 focus:outline-none focus:ring-1",
                                        errors.title
                                            ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/25"
                                            : "border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/25"
                                    )}
                                />
                                {errors.title && (
                                    <p className="mt-1.5 text-[12px] text-rose-400 font-medium">{errors.title}</p>
                                )}
                            </div>

                            {/* Description textarea */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add any notes or context about this file..."
                                    disabled={submitting}
                                    rows={3}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[13px] text-text-primary placeholder-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/25"
                                />
                            </div>

                            {/* Upload Progress Indicator */}
                            {submitting && (
                                <div className="space-y-1.5 pt-2">
                                    <div className="flex items-center justify-between text-[11.5px] text-text-muted">
                                        <span>Uploading material...</span>
                                        <span className="font-semibold tabular-nums text-text-secondary">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                                        <motion.div
                                            className="h-full bg-violet-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.1 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="rounded-lg border border-zinc-800 bg-transparent px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-zinc-800 hover:text-text-primary disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center justify-center rounded-lg bg-violet-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-violet-600 disabled:bg-violet-500/50 disabled:cursor-not-allowed"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
