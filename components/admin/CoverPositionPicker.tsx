"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface CoverPositionPickerProps {
    src: string;
    /** CSS `object-position` value, e.g. "50% 50%". */
    position: string;
    onChange: (position: string) => void;
    /** Called once dragging ends, so callers can persist the final value. */
    onCommit?: (position: string) => void;
}

function parsePosition(position: string): { x: number; y: number } {
    const [xRaw, yRaw] = position.split(/\s+/);
    const x = Number.parseFloat(xRaw);
    const y = Number.parseFloat(yRaw);
    return {
        x: Number.isFinite(x) ? x : 50,
        y: Number.isFinite(y) ? y : 50,
    };
}

export default function CoverPositionPicker({ src, position, onChange, onCommit }: CoverPositionPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const { x, y } = parsePosition(position);

    const updateFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const nextX = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
            const nextY = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
            onChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
        },
        [onChange]
    );

    return (
        <div>
            <div
                ref={containerRef}
                className={`relative w-full aspect-21/9 overflow-hidden rounded-lg border border-slate-300 select-none bg-slate-100 ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onPointerDown={(e) => {
                    draggingRef.current = true;
                    setIsDragging(true);
                    (e.target as Element).setPointerCapture(e.pointerId);
                    updateFromPointer(e.clientX, e.clientY);
                }}
                onPointerMove={(e) => {
                    if (draggingRef.current) updateFromPointer(e.clientX, e.clientY);
                }}
                onPointerUp={(e) => {
                    if (!draggingRef.current) return;
                    draggingRef.current = false;
                    setIsDragging(false);
                    const el = containerRef.current;
                    if (!el || !onCommit) return;
                    const rect = el.getBoundingClientRect();
                    const nextX = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                    const nextY = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
                    onCommit(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
                }}
            >
                <Image
                    src={src}
                    alt="Cover position preview"
                    fill
                    draggable={false}
                    className="object-cover pointer-events-none"
                    style={{ objectPosition: position }}
                />
                <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md bg-purple-600/80 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Click or drag inside the frame to set the image&apos;s focal point.</p>
        </div>
    );
}
