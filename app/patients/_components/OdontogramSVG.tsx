"use client";

import type { Surface, ToothStatus } from "../_domain/types";
import { statusBorder, statusFill } from "../_domain/utils";

type Props = {
    upperTeeth: string[];
    lowerTeeth: string[];

    // UI needs these behaviors
    getSurfaceStatus: (tooth: string, surface: Surface) => ToothStatus;
    setSurface: (tooth: string, surface: Surface) => void;
    resetTooth: (tooth: string) => void;
};

export default function OdontogramSVG({
    upperTeeth,
    lowerTeeth,
    getSurfaceStatus,
    setSurface,
    resetTooth,
}: Props) {
    function ToothSVG({
        tooth,
        x,
        y,
        w,
        h,
    }: {
        tooth: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }) {
        const cx = x + w / 2;
        const cy = y + h / 2;

        // tooth "crown" radius
        const outerR = Math.min(w, h) / 2;

        // radius for each surface
        const surfaceR = outerR * 0.22;

        // distance from center to each surface
        const offset = outerR * 0.45;

        const surfaces: Array<{ surface: Surface; sx: number; sy: number }> = [
            { surface: "O", sx: cx, sy: cy }, // Occlusal (center)
            { surface: "M", sx: cx - offset, sy: cy }, // Mesial (left)
            { surface: "D", sx: cx + offset, sy: cy }, // Distal (right)
            { surface: "L", sx: cx, sy: cy - offset }, // Lingual (top)
            { surface: "B", sx: cx, sy: cy + offset }, // Buccal (bottom)
        ];

        return (
            <g>
                {/* Outline (crown) - round */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={outerR}
                    fill="#111827"
                    stroke="#404040"
                    strokeWidth={1.5}
                />

                {/* Surfaces - round */}
                {surfaces.map(({ surface, sx, sy }) => {
                    const s = getSurfaceStatus(tooth, surface);
                    return (
                        <circle
                            key={`${tooth}-${surface}`}
                            cx={sx}
                            cy={sy}
                            r={surfaceR}
                            fill={statusFill(s)}
                            stroke={statusBorder(s)}
                            strokeWidth={1}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSurface(tooth, surface)}
                        />
                    );
                })}

                {/* Tooth number */}
                <text
                    x={cx}
                    y={y + h + 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#a3a3a3"
                >
                    {tooth}
                </text>

                {/* Reset tooth (small dot button) */}
                <circle
                    cx={cx + outerR * 0.7}
                    cy={cy - outerR * 0.7}
                    r={5}
                    fill="#0b1220"
                    stroke="#525252"
                    strokeWidth={1}
                    style={{ cursor: "pointer" }}
                    onClick={() => resetTooth(tooth)}
                />
            </g>
        );
    }

    return (
        <div className="overflow-x-auto">
            <svg
                viewBox="0 0 980 360"
                className="min-w-[980px] rounded border border-neutral-800 bg-[#0b1220]"
            >
                {/* Upper label */}
                <text x="20" y="26" fontSize="12" fill="#a3a3a3">
                    Upper
                </text>

                {/* Upper teeth row */}
                {upperTeeth.map((tooth, i) => {
                    const startX = 40;
                    const gap = 8;
                    const toothW = 48;
                    const toothH = 70;
                    const x = startX + i * (toothW + gap);
                    const y = 40;

                    return (
                        <ToothSVG
                            key={`U-${tooth}`}
                            tooth={tooth}
                            x={x}
                            y={y}
                            w={toothW}
                            h={toothH}
                        />
                    );
                })}

                {/* Divider */}
                <line
                    x1="20"
                    y1="170"
                    x2="960"
                    y2="170"
                    stroke="#262626"
                    strokeWidth="1"
                />

                {/* Lower label */}
                <text x="20" y="196" fontSize="12" fill="#a3a3a3">
                    Lower
                </text>

                {/* Lower teeth row */}
                {lowerTeeth.map((tooth, i) => {
                    const startX = 40;
                    const gap = 8;
                    const toothW = 48;
                    const toothH = 70;
                    const x = startX + i * (toothW + gap);
                    const y = 210;

                    return (
                        <ToothSVG
                            key={`L-${tooth}`}
                            tooth={tooth}
                            x={x}
                            y={y}
                            w={toothW}
                            h={toothH}
                        />
                    );
                })}
            </svg>
        </div>
    );
}
