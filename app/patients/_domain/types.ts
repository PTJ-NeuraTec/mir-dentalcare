// app/patients/_domain/types.ts

export type Surface = "O" | "M" | "D" | "B" | "L";
export type ToothStatus = "normal" | "alert" | "treated";

/** ✅ Canonical odontogram types (fixes build error in utils.ts) */
export type ToothSurfaces = Partial<Record<Surface, ToothStatus>>;
export type Odontogram = Record<string, ToothSurfaces>;

export type Selection =
    | {
        tooth: string;
        surface: Surface;
        status: ToothStatus;
    }
    | null;

export type PlanFilter = "all" | "alertsOnly" | "treatedOnly";

export type ClinicalEntry = {
    diagnosis: string;
    procedure: string;
    note: string;

    /** Block 2: procedure override */
    procedureManual: boolean;

    /** ✅ Block 4: cost override (in-memory) */
    costManual?: boolean;
    costFee?: number; // USD
    costMinutes?: number; // minutes
};

export type Patient = {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
    status: string;

    /** ✅ Use Odontogram type instead of inline Record */
    odontogram: Odontogram;

    clinical: Record<string, Partial<Record<Surface, ClinicalEntry>>>;
};

/** Existing plan item */
export type TreatmentPlanItem = {
    tooth: string;
    surface: Surface;
    surfaceName: string;
    status: ToothStatus;

    diagnosis: string;
    procedure: string;
    note: string;

    procedureManual: boolean;

    /** ✅ Block 4: cost estimate in the plan view */
    costFee: number; // USD
    costMinutes: number; // minutes
    costManual: boolean; // AUTO / MANUAL
    costSource: "catalog" | "default" | "manual" | "none";
};

export type CostEstimate = {
    minutes: number;
    fee: number;
    costManual: boolean;
    source: "catalog" | "default" | "manual" | "none";
};

export type TreatmentPlanTotals = {
    totalMinutes: number;
    totalFee: number;
};

export type KnownProcedure =
    | "Clinical evaluation"
    | "Dental cleaning"
    | "Filling (composite)"
    | "Filling (amalgam)"
    | "Root canal therapy"
    | "Crown placement"
    | "Extraction"
    | "Periodontal scaling"
    | "Fluoride treatment"
    | "Sealant application"
    | "X-rays";
