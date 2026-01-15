export type ToothStatus = "normal" | "alert" | "treated";

export type Surface = "O" | "M" | "D" | "B" | "L"; // Occlusal, Mesial, Distal, Buccal, Lingual

export type Odontogram = Record<string, Record<Surface, ToothStatus>>;

/** ✅ Editable clinical data (in-memory, per patient/tooth/surface) */
export type ClinicalEntry = {
    diagnosis: string;
    procedure: string;
    note: string;

    /** ✅ Block 2: if true, user manually selected the procedure; we won't auto-overwrite it */
    procedureManual?: boolean;
};

export type ClinicalMap = Record<string, Partial<Record<Surface, ClinicalEntry>>>;

export type Patient = {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
    status: "Active" | "Follow-up" | "Inactive";
    odontogram: Odontogram;

    /** ✅ In-memory persistence for clinical panel */
    clinical: ClinicalMap;
};

/** ✅ Block 3: Treatment plan row */
export type TreatmentPlanItem = {
    tooth: string;
    surface: Surface;
    surfaceName: string;
    status: ToothStatus;
    diagnosis: string;
    procedure: string;
    note: string;
    procedureManual: boolean;
};

/** Optional but useful for the hook */
export type PlanFilter = "all" | "alertsOnly" | "treatedOnly";

export type Selection = {
    tooth: string;
    surface: Surface;
    status: ToothStatus;
} | null;
