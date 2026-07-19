import { useState } from "react";
import { Check, ListChecks, Plus, X } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/common";
import { cn } from "@/lib/utils";
import type { ChecklistItemRecord } from "@/services/planner.service";

interface ChecklistSectionProps {
    items: ChecklistItemRecord[];
    onToggle: (id: string) => void;
    /** When true, renders rename/add/remove controls (Sprint 3.5C — Task Edit Mode).
     *  Toggle behaves the same either way; only structural edits are gated behind this. */
    editable?: boolean;
    onRename?: (id: string, label: string) => void;
    onAdd?: (label: string) => void;
    onRemove?: (id: string) => void;
}

function Checkbox({ done, onClick, label }: { done: boolean; onClick: () => void; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={done}
            aria-label={done ? `Mark "${label}" as not done` : `Mark "${label}" as done`}
            className={cn(
                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                done ? "border-violet-500 bg-violet-500" : "border-zinc-700",
            )}
        >
            {done && <Check className="h-3 w-3 text-white" />}
        </button>
    );
}

export function ChecklistSection({
    items,
    onToggle,
    editable = false,
    onRename,
    onAdd,
    onRemove,
}: ChecklistSectionProps) {
    const [newItemText, setNewItemText] = useState("");
    const doneCount = items.filter((item) => item.done).length;
    const title = items.length > 0 ? `Checklist (${doneCount}/${items.length})` : "Checklist";

    function handleAdd() {
        const label = newItemText.trim();
        if (label === "") return;
        onAdd?.(label);
        setNewItemText("");
    }

    return (
        <SectionCard icon={ListChecks} title={editable ? `Edit ${title}` : title}>
            {items.length > 0 ? (
                <div className="divide-y divide-zinc-800/60">
                    {items.map((item) =>
                        editable ? (
                            // Edit mode: checkbox, rename input, and remove button are three
                            // independent controls, so the row is a <div> — a <button> can't
                            // contain another <button>/<input> per HTML semantics.
                            <div key={item.id} className="flex w-full items-center gap-3 px-5 py-3">
                                <Checkbox done={item.done} onClick={() => onToggle(item.id)} label={item.label} />
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => onRename?.(item.id, e.target.value)}
                                    aria-label="Checklist item label"
                                    className={cn(
                                        "flex-1 bg-transparent text-[13px] text-text-secondary outline-none focus:text-text-primary",
                                        item.done && "text-text-muted line-through",
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemove?.(item.id)}
                                    aria-label={`Remove "${item.label}"`}
                                    className="flex-shrink-0 text-text-muted transition-colors hover:text-rose-400"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            // View mode: unchanged from before — the whole row is one button.
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onToggle(item.id)}
                                aria-pressed={item.done}
                                aria-label={item.done ? `Mark "${item.label}" as not done` : `Mark "${item.label}" as done`}
                                className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.03]"
                            >
                                <span
                                    className={cn(
                                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                                        item.done ? "border-violet-500 bg-violet-500" : "border-zinc-700",
                                    )}
                                >
                                    {item.done && <Check className="h-3 w-3 text-white" />}
                                </span>
                                <span
                                    className={cn(
                                        "text-[13px] text-text-secondary",
                                        item.done && "text-text-muted line-through",
                                    )}
                                >
                                    {item.label}
                                </span>
                            </button>
                        ),
                    )}
                </div>
            ) : !editable ? (
                <EmptyState
                    icon={ListChecks}
                    title="No checklist items"
                    description="Steps for this task will show up here."
                />
            ) : null}

            {editable && (
                <div
                    className={cn(
                        "flex items-center gap-3 px-5 py-3",
                        items.length > 0 && "border-t border-zinc-800/60",
                    )}
                >
                    <Plus className="h-4 w-4 flex-shrink-0 text-text-muted" />
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                        placeholder="Add checklist item..."
                        aria-label="New checklist item"
                        className="flex-1 bg-transparent text-[13px] text-text-secondary outline-none placeholder:text-text-muted"
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={newItemText.trim() === ""}
                        className="flex-shrink-0 text-[12px] font-medium text-violet-400 transition-colors hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Add
                    </button>
                </div>
            )}
        </SectionCard>
    );
}
