import type { Surface, ToothStatus } from "./types";
import { DIAGNOSIS_OPTIONS, PROCEDURE_OPTIONS } from "./constants";
import { surfaceLabel } from "./utils";

/** =========================
 *  Clinical mock (DEMO only)
 *  =========================
 *  Goal: the odontogram should not be “just colors”,
 *  but should show “what needs to be done” when selected.
 */
export function mockClinical(status: ToothStatus, surface: Surface) {
    // Template by status
    if (status === "alert") {
        return {
            diagnosis: `Lesion / risk detected on ${surfaceLabel(surface)}`,
            procedure: "Evaluation + resin restoration (mock)",
            note: "Conservative treatment suggested. No backend: narrative-only clinical guidance.",
        };
    }
    if (status === "treated") {
        return {
            diagnosis: `Treatment completed on ${surfaceLabel(surface)}`,
            procedure: "Control / Follow-up",
            note: "Surface marked as treated. Visual evidence for decision-making.",
        };
    }
    return {
        diagnosis: `No findings on ${surfaceLabel(surface)}`,
        procedure: "Prophylaxis",
        note: "Normal status. Ideal to explain prevention and continuity of care.",
    };
}

/** ✅ BLOCK 2 (Option C): Status + Diagnosis + Surface recommendation engine */
export function recommendProcedure(params: {
    status: ToothStatus;
    diagnosis: string;
    surface: Surface;
}): string {
    const { status, diagnosis, surface } = params;

    // 1) Treated: always control/follow-up (simple and defendable)
    if (status === "treated") return "Control / Follow-up";

    // 2) Normal: default prevention, but if diagnosis indicates something, do evaluation
    if (status === "normal") {
        if (diagnosis !== "No findings") return "Clinical evaluation";
        // For occlusal we can keep prophylaxis; sealant is also plausible but keep it simple
        return "Prophylaxis";
    }

    // 3) Alert: decide using Diagnosis + Surface (Option C)
    // Surface groups (simple clinical heuristics)
    const isProximal = surface === "M" || surface === "D";
    const isOcclusal = surface === "O";
    const isBuccalLingual = surface === "B" || surface === "L";

    // Diagnosis-driven routing
    if (diagnosis === "Caries (suspected)") {
        // Occlusal caries could be sealant if early; proximal often resin restoration
        if (isOcclusal) return "Sealant";
        if (isProximal) return "Resin restoration";
        if (isBuccalLingual) return "Resin restoration";
        return "Clinical evaluation";
    }

    if (diagnosis === "Lesion / risk") {
        // Risk / early lesion: sealant for occlusal; evaluation otherwise
        if (isOcclusal) return "Sealant";
        if (isProximal) return "Clinical evaluation";
        if (isBuccalLingual) return "Clinical evaluation";
        return "Clinical evaluation";
    }

    if (diagnosis === "Sensitivity / wear") {
        // Usually evaluation first; later could become restoration/inlay
        if (isOcclusal) return "Clinical evaluation";
        if (isProximal) return "Clinical evaluation";
        return "Clinical evaluation";
    }

    if (diagnosis === "Fracture / fissure") {
        // Evaluation; sometimes restoration/inlay
        if (isProximal) return "Clinical evaluation";
        if (isOcclusal) return "Inlay (mock)";
        return "Clinical evaluation";
    }

    if (diagnosis === "Infection / abscess (suspected)") {
        // Endodontics or extraction (mock)
        // If proximal/occlusal could be endo; keep simple
        if (isOcclusal || isProximal) return "Endodontics (mock)";
        return "Clinical evaluation";
    }

    if (diagnosis === "Requires evaluation") {
        return "Clinical evaluation";
    }

    // Fallback for any unexpected diagnosis
    return "Clinical evaluation";
}

/**
 * Optional helper (kept internal here) to normalize diagnosis for recommendation,
 * using the existing DIAGNOSIS_OPTIONS list from constants.
 *
 * NOTE: Not required for correctness; provided for modular safety if you prefer to keep
 * the exact original behavior in page.tsx, you can ignore this export.
 */
export function normalizeDiagnosisForRecommendation(diagnosis: string): string {
    return DIAGNOSIS_OPTIONS.includes(diagnosis) ? diagnosis : "Requires evaluation";
}

/**
 * Optional helper to validate procedure values against PROCEDURE_OPTIONS.
 */
export function isKnownProcedure(procedure: string): boolean {
    return PROCEDURE_OPTIONS.includes(procedure);
}
