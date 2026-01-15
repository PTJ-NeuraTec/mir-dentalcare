import type { Odontogram, Surface, ToothStatus } from "./types";

export function emptyTooth(): Record<Surface, ToothStatus> {
    return { O: "normal", M: "normal", D: "normal", B: "normal", L: "normal" };
}

export function ensureTooth(od: Odontogram, tooth: string): Odontogram {
    if (od[tooth]) return od;
    return { ...od, [tooth]: emptyTooth() };
}

export function nextStatus(s: ToothStatus): ToothStatus {
    // simple cycle (demo-friendly) but clinically understandable:
    // normal → alert → treated → normal
    if (s === "normal") return "alert";
    if (s === "alert") return "treated";
    return "normal";
}

export function statusFill(s: ToothStatus): string {
    // sober (enterprise), no neon
    if (s === "alert") return "#ef4444"; // red
    if (s === "treated") return "#22c55e"; // green
    return "#d4d4d4"; // neutral
}

export function statusBorder(s: ToothStatus): string {
    if (s === "alert") return "#b91c1c";
    if (s === "treated") return "#15803d";
    return "#525252";
}

export function surfaceLabel(surface: Surface): string {
    switch (surface) {
        case "O":
            return "Occlusal";
        case "M":
            return "Mesial";
        case "D":
            return "Distal";
        case "B":
            return "Buccal";
        case "L":
            return "Lingual";
        default:
            return surface;
    }
}

export function shortSurface(surface: Surface): string {
    // for compact table display
    return surface;
}

export function safeTrim(s: string, n: number) {
    const t = (s || "").trim();
    if (t.length <= n) return t;
    return t.slice(0, n - 1) + "…";
}
