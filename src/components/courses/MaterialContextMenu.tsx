import { useState, useRef, useEffect } from "react";
import {
    MoreVertical,
    Eye,
    Pencil,
    FileText,
    RefreshCw,
    Download,
    Link2,
    Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CourseMaterial } from "@/types/courses";
import { canPreviewInBrowser } from "@/services/material.service";

interface MaterialContextMenuProps {
    material: CourseMaterial;
    onOpen: (material: CourseMaterial) => void;
    onRename: (material: CourseMaterial) => void;
    onEditDescription: (material: CourseMaterial) => void;
    onReplaceFile: (material: CourseMaterial) => void;
    onDownload: (material: CourseMaterial) => void;
    onCopyLink: (material: CourseMaterial) => void;
    onDelete: (material: CourseMaterial) => void;
}

interface MenuItem {
    label: string;
    icon: typeof Eye;
    onClick: () => void;
    destructive?: boolean;
    dividerBefore?: boolean;
}

export function MaterialContextMenu({
    material,
    onOpen,
    onRename,
    onEditDescription,
    onReplaceFile,
    onDownload,
    onCopyLink,
    onDelete,
}: MaterialContextMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!menuOpen) return;
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

    // Close on Escape
    useEffect(() => {
        if (!menuOpen) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [menuOpen]);

    const items: MenuItem[] = [
        {
            label: canPreviewInBrowser(material.type) ? "Preview" : "Open",
            icon: Eye,
            onClick: () => onOpen(material),
        },
        {
            label: "Rename",
            icon: Pencil,
            onClick: () => onRename(material),
        },
        {
            label: "Edit Description",
            icon: FileText,
            onClick: () => onEditDescription(material),
        },
        {
            label: "Replace File",
            icon: RefreshCw,
            onClick: () => onReplaceFile(material),
        },
        {
            label: "Download",
            icon: Download,
            onClick: () => onDownload(material),
            dividerBefore: true,
        },
        {
            label: "Copy Link",
            icon: Link2,
            onClick: () => onCopyLink(material),
        },
        {
            label: "Delete",
            icon: Trash2,
            onClick: () => onDelete(material),
            destructive: true,
            dividerBefore: true,
        },
    ];

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary"
            >
                <MoreVertical className="h-3.5 w-3.5" />
            </button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-xl shadow-black/40"
                    >
                        {items.map((item) => (
                            <div key={item.label}>
                                {item.dividerBefore && (
                                    <div className="my-1 border-t border-zinc-800" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        item.onClick();
                                    }}
                                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors ${
                                        item.destructive
                                            ? "text-rose-400 hover:bg-rose-500/[0.08]"
                                            : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                                    }`}
                                >
                                    <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                                    {item.label}
                                </button>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
