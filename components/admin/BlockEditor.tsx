"use client";

import type { BlogBlock } from "@/lib/types";

interface BlockEditorProps {
    value: BlogBlock[];
    onChange: (blocks: BlogBlock[]) => void;
}

const emptyBlocks: BlogBlock[] = [{ type: "paragraph", text: "" }];

export default function BlockEditor({ value, onChange }: BlockEditorProps) {
    const blocks = value.length > 0 ? value : emptyBlocks;

    const updateBlock = (index: number, block: BlogBlock) => {
        onChange(blocks.map((b, i) => (i === index ? block : b)));
    };

    const removeBlock = (index: number) => {
        onChange(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= blocks.length) return;
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const addBlock = (type: BlogBlock["type"]) => {
        onChange([...blocks, { type, text: "" }]);
    };

    return (
        <div className="space-y-3">
            {blocks.map((block, index) => (
                <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <select
                            value={block.type}
                            onChange={(e) =>
                                updateBlock(index, {
                                    type: e.target.value as BlogBlock["type"],
                                    text: block.text,
                                })
                            }
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="paragraph">Paragraph</option>
                            <option value="heading">Heading</option>
                        </select>

                        <span className="text-xs text-slate-400">
                            Block {index + 1}
                        </span>

                        <div className="flex items-center gap-1 ml-auto">
                            <button
                                type="button"
                                onClick={() => moveBlock(index, -1)}
                                disabled={index === 0}
                                aria-label="Move up"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => moveBlock(index, 1)}
                                disabled={index === blocks.length - 1}
                                aria-label="Move down"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => removeBlock(index)}
                                aria-label="Remove block"
                                className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <textarea
                        value={block.text}
                        onChange={(e) =>
                            updateBlock(index, { type: block.type, text: e.target.value })
                        }
                        rows={block.type === "heading" ? 2 : 4}
                        placeholder={block.type === "heading" ? "Heading text…" : "Write your paragraph…"}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            ))}

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => addBlock("paragraph")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add paragraph
                </button>
                <button
                    type="button"
                    onClick={() => addBlock("heading")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add heading
                </button>
            </div>
        </div>
    );
}