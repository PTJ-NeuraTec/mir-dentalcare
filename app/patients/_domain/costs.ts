// app/patients/_domain/costs.ts
import type { CostEstimate, KnownProcedure } from "./types";

/**
 * Block 4 — Cost / Estimate
 * Deterministic demo catalog:
 * - Map KnownProcedure -> minutes + fee (USD)
 * - Unknown procedure falls back to a generic estimate
 */

export type ProcedureCostCatalogItem = {
    minutes: number;
    fee: number; // USD
};

export const PROCEDURE_COST_CATALOG: Record<KnownProcedure, ProcedureCostCatalogItem> = {
    "Clinical evaluation": { minutes: 20, fee: 75 },
    "Dental cleaning": { minutes: 45, fee: 120 },
    "Filling (composite)": { minutes: 45, fee: 220 },
    "Filling (amalgam)": { minutes: 45, fee: 200 },
    "Root canal therapy": { minutes: 90, fee: 950 },
    "Crown placement": { minutes: 90, fee: 1200 },
    Extraction: { minutes: 45, fee: 280 },
    "Periodontal scaling": { minutes: 60, fee: 350 },
    "Fluoride treatment": { minutes: 15, fee: 35 },
    "Sealant application": { minutes: 20, fee: 60 },
    "X-rays": { minutes: 15, fee: 45 },
};

function isKnownProcedure(p: string): p is KnownProcedure {
    // Safe runtime check (no any)
    return Object.prototype.hasOwnProperty.call(PROCEDURE_COST_CATALOG, p);
}

export function estimateCostForProcedure(procedure: string | null | undefined): CostEstimate {
    const p = (procedure || "").trim();
    if (!p) return { minutes: 0, fee: 0, costManual: false, source: "none" };

    if (isKnownProcedure(p)) {
        const hit = PROCEDURE_COST_CATALOG[p];
        return { minutes: hit.minutes, fee: hit.fee, costManual: false, source: "catalog" };
    }

    // Fallback: unknown procedure (still returns numbers for demo)
    return { minutes: 30, fee: 150, costManual: false, source: "default" };
}

export function clampMoney(n: number): number {
    if (!Number.isFinite(n)) return 0;
    if (n < 0) return 0;
    return Math.round(n * 100) / 100;
}

export function clampMinutes(n: number): number {
    if (!Number.isFinite(n)) return 0;
    if (n < 0) return 0;
    return Math.round(n);
}

export function formatUSD(amount: number): string {
    const v = clampMoney(amount);
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
    } catch {
        return `$${v.toFixed(2)}`;
    }
}


export function formatMinutes(min: number): string {
    const m = clampMinutes(min);
    if (m === 0) return "—";
    return `${m} min`;
}
