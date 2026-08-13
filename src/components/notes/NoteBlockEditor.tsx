import type { NoteContentBlock } from "@/types/notes";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface NoteBlockEditorProps {
    /** The current list of content blocks — controlled from the parent. */
    value: NoteContentBlock[];
    /** Called with a new array any time the user edits, adds, reorders,
     *  or removes a block. Never mutates the original array. */
    onChange: (blocks: NoteContentBlock[]) => void;
}

// ─── Shared field styling ────────────────────────────────────────────────────

const field =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[14px] text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

// ─── Block kind label map ─────────────────────────────────────────────────────

const KIND_LABEL: Record<NoteContentBlock["kind"], string> = {
    heading: "Heading",
    paragraph: "Paragraph",
    "bullet-list": "Bullet List",
    "numbered-list": "Numbered List",
    code: "Code",
    quote: "Quote",
};

// ─── Default (empty) block factory ───────────────────────────────────────────

function createDefaultBlock(kind: NoteContentBlock["kind"]): NoteContentBlock {
    switch (kind) {
        case "heading":
            return { kind: "heading", level: 2, text: "" };
        case "paragraph":
            return { kind: "paragraph", text: "" };
        case "bullet-list":
            return { kind: "bullet-list", items: [""] };
        case "numbered-list":
            return { kind: "numbered-list", items: [""] };
        case "code":
            return { kind: "code", code: "", language: "" };
        case "quote":
            return { kind: "quote", text: "" };
    }
}

// ─── Per-kind block editors ───────────────────────────────────────────────────

function HeadingEditor({
    block,
    onChange,
}: {
    block: Extract<NoteContentBlock, { kind: "heading" }>;
    onChange: (b: NoteContentBlock) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {([2, 3] as const).map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => onChange({ ...block, level })}
                        className={cn(
                            "rounded-md px-2.5 py-1 text-[12px] font-bold transition-colors",
                            block.level === level
                                ? "bg-violet-500/20 text-violet-400"
                                : "text-text-muted hover:bg-white/[0.05] hover:text-text-secondary",
                        )}
                    >
                        H{level}
                    </button>
                ))}
            </div>
            <input
                type="text"
                value={block.text}
                onChange={(e) => onChange({ ...block, text: e.target.value })}
                placeholder={block.level === 2 ? "Section heading..." : "Sub-heading..."}
                className={cn(
                    field,
                    block.level === 2 ? "text-[17px] font-semibold" : "text-[15px] font-semibold",
                )}
            />
        </div>
    );
}

function ParagraphEditor({
    block,
    onChange,
}: {
    block: Extract<NoteContentBlock, { kind: "paragraph" }>;
    onChange: (b: NoteContentBlock) => void;
}) {
    return (
        <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Paragraph text..."
            rows={3}
            className={cn(field, "resize-y leading-relaxed")}
        />
    );
}

function ListItemsEditor({
    block,
    onChange,
}: {
    block: Extract<NoteContentBlock, { kind: "bullet-list" | "numbered-list" }>;
    onChange: (b: NoteContentBlock) => void;
}) {
    const isBullet = block.kind === "bullet-list";

    function updateItem(idx: number, val: string) {
        onChange({ ...block, items: block.items.map((it, i) => (i === idx ? val : it)) });
    }

    function addItem() {
        onChange({ ...block, items: [...block.items, ""] });
    }

    function removeItem(idx: number) {
        if (block.items.length <= 1) return;
        onChange({ ...block, items: block.items.filter((_, i) => i !== idx) });
    }

    return (
        <div className="space-y-1.5">
            {block.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 flex-shrink-0 select-none text-right text-[13px] text-text-muted">
                        {isBullet ? "\u2022" : `${idx + 1}.`}
                    </span>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(idx, e.target.value)}
                        placeholder={`Item ${idx + 1}...`}
                        className={cn(field, "flex-1")}
                    />
                    <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        disabled={block.items.length <= 1}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label="Remove item"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] text-text-muted transition-colors hover:bg-violet-500/[0.05] hover:text-violet-400"
            >
                <Plus className="h-3.5 w-3.5" />
                Add item
            </button>
        </div>
    );
}

function CodeEditor({
    block,
    onChange,
}: {
    block: Extract<NoteContentBlock, { kind: "code" }>;
    onChange: (b: NoteContentBlock) => void;
}) {
    return (
        <div className="space-y-2">
            <input
                type="text"
                value={block.language ?? ""}
                onChange={(e) => onChange({ ...block, language: e.target.value || undefined })}
                placeholder="Language (e.g. python, typescript)"
                className={cn(field, "font-mono text-[12px]")}
            />
            <textarea
                value={block.code}
                onChange={(e) => onChange({ ...block, code: e.target.value })}
                placeholder="// code..."
                rows={5}
                spellCheck={false}
                className="w-full resize-y rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 font-mono text-[12.5px] leading-relaxed text-zinc-200 outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-zinc-600 focus:border-violet-500/30 focus:ring-4"
            />
        </div>
    );
}

function QuoteEditor({
    block,
    onChange,
}: {
    block: Extract<NoteContentBlock, { kind: "quote" }>;
    onChange: (b: NoteContentBlock) => void;
}) {
    return (
        <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Quote text..."
            rows={2}
            className="w-full resize-y rounded-r-lg border-l-2 border-violet-500/50 bg-white/[0.02] py-2 pl-4 pr-3 text-[14px] italic leading-relaxed text-text-secondary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/60 focus:bg-white/[0.04] focus:ring-4"
        />
    );
}

// ─── Block row (header + controls + content) ──────────────────────────────────

function BlockRow({
    block,
    index,
    total,
    onChange,
    onMoveUp,
    onMoveDown,
    onDelete,
}: {
    block: NoteContentBlock;
    index: number;
    total: number;
    onChange: (b: NoteContentBlock) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-3 transition-colors hover:border-white/[0.09]">
            {/* Header: type label + move/delete controls */}
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">
                    {KIND_LABEL[block.kind]}
                </span>
                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        onClick={onMoveUp}
                        disabled={index === 0}
                        className="flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label="Move block up"
                    >
                        <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={onMoveDown}
                        disabled={index === total - 1}
                        className="flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label="Move block down"
                    >
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-3 w-px bg-white/[0.08]" />
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={total <= 1}
                        className="flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label="Delete block"
                        title={total <= 1 ? "Cannot delete the only block" : undefined}
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Block-specific editing widget */}
            {block.kind === "heading" && <HeadingEditor block={block} onChange={onChange} />}
            {block.kind === "paragraph" && <ParagraphEditor block={block} onChange={onChange} />}
            {(block.kind === "bullet-list" || block.kind === "numbered-list") && (
                <ListItemsEditor block={block} onChange={onChange} />
            )}
            {block.kind === "code" && <CodeEditor block={block} onChange={onChange} />}
            {block.kind === "quote" && <QuoteEditor block={block} onChange={onChange} />}
        </div>
    );
}

// ─── Add-block toolbar ────────────────────────────────────────────────────────

const ADD_BLOCK_OPTIONS: Array<{ kind: NoteContentBlock["kind"]; label: string }> = [
    { kind: "paragraph",      label: "Paragraph" },
    { kind: "heading",        label: "Heading" },
    { kind: "bullet-list",   label: "Bullet List" },
    { kind: "numbered-list", label: "Numbered List" },
    { kind: "code",          label: "Code" },
    { kind: "quote",         label: "Quote" },
];

function AddBlockToolbar({ onAdd }: { onAdd: (b: NoteContentBlock) => void }) {
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-white/[0.06] px-3 py-2.5">
            <span className="mr-0.5 text-[11px] font-medium text-text-muted">Add block:</span>
            {ADD_BLOCK_OPTIONS.map(({ kind, label }) => (
                <button
                    key={kind}
                    type="button"
                    onClick={() => onAdd(createDefaultBlock(kind))}
                    className="flex items-center gap-1 rounded-md border border-white/[0.05] bg-white/[0.01] px-2 py-0.5 text-[12px] text-text-muted transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.05] hover:text-violet-400"
                >
                    <Plus className="h-3 w-3 flex-shrink-0" />
                    {label}
                </button>
            ))}
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Controlled block editor for NoteContentBlock[].
 *
 * Operates directly on the structured block model — no conversion to or from
 * plain text. All formatting (heading levels, list items, code language, quote
 * kind) is preserved exactly across edit -> save -> render cycles.
 *
 * Block-level controls (move up, move down, delete) appear in each block header.
 * The delete button is disabled when only one block remains. An Add Block
 * toolbar at the bottom inserts new empty blocks of any supported kind.
 */
export function NoteBlockEditor({ value, onChange }: NoteBlockEditorProps) {
    function updateBlock(index: number, updated: NoteContentBlock) {
        onChange(value.map((b, i) => (i === index ? updated : b)));
    }

    function moveBlock(index: number, direction: -1 | 1) {
        const next = [...value];
        const target = index + direction;
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    }

    function deleteBlock(index: number) {
        if (value.length <= 1) return;
        onChange(value.filter((_, i) => i !== index));
    }

    function addBlock(block: NoteContentBlock) {
        onChange([...value, block]);
    }

    return (
        <div className="space-y-2">
            {value.map((block, i) => (
                <BlockRow
                    key={`${block.kind}-${i}`}
                    block={block}
                    index={i}
                    total={value.length}
                    onChange={(updated) => updateBlock(i, updated)}
                    onMoveUp={() => moveBlock(i, -1)}
                    onMoveDown={() => moveBlock(i, 1)}
                    onDelete={() => deleteBlock(i)}
                />
            ))}
            <AddBlockToolbar onAdd={addBlock} />
        </div>
    );
}

