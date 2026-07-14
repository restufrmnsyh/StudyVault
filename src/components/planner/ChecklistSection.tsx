import { Check, ListChecks } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/common";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types/planner";

interface ChecklistSectionProps {
    items: ChecklistItem[];
    onToggle: (id: string) => void;
}

export function ChecklistSection({ items, onToggle }: ChecklistSectionProps) {
    const doneCount = items.filter((item) => item.done).length;
    const title = items.length > 0 ? `Checklist (${doneCount}/${items.length})` : "Checklist";

    return (
        <SectionCard icon={ListChecks} title={title}>
            {items.length > 0 ? (
                <div className="divide-y divide-zinc-800/60">
                    {items.map((item) => (
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
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={ListChecks}
                    title="No checklist items"
                    description="Steps for this task will show up here."
                />
            )}
        </SectionCard>
    );
}