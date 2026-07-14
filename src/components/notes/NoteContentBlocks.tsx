import type { NoteContentBlock } from "@/types/notes";

interface NoteContentBlocksProps {
    blocks: NoteContentBlock[];
}

export function NoteContentBlocks({ blocks }: NoteContentBlocksProps) {
    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                switch (block.kind) {
                    case "heading":
                        return block.level === 2 ? (
                            <h2 key={i} className="pt-2 text-[17px] font-semibold text-text-primary first:pt-0">
                                {block.text}
                            </h2>
                        ) : (
                            <h3 key={i} className="pt-1 text-[15px] font-semibold text-text-primary">
                                {block.text}
                            </h3>
                        );
                    case "paragraph":
                        return (
                            <p key={i} className="text-[14px] leading-relaxed text-text-secondary">
                                {block.text}
                            </p>
                        );
                    case "bullet-list":
                        return (
                            <ul key={i} className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-text-secondary">
                                {block.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                ))}
                            </ul>
                        );
                    case "numbered-list":
                        return (
                            <ol key={i} className="list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-text-secondary">
                                {block.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                ))}
                            </ol>
                        );
                    case "code":
                        return (
                            <pre
                                key={i}
                                className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/40 p-4 text-[12.5px] leading-relaxed text-zinc-200"
                            >
                                <code>{block.code}</code>
                            </pre>
                        );
                    case "quote":
                        return (
                            <blockquote
                                key={i}
                                className="border-l-2 border-violet-500/50 bg-white/[0.02] py-2 pl-4 text-[14px] italic leading-relaxed text-text-secondary"
                            >
                                {block.text}
                            </blockquote>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}