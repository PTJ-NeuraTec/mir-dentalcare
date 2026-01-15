import type { Surface } from "./types";

export const SURFACES: Surface[] = ["O", "M", "D", "B", "L"];

// FDI layout (very common in odontograms):
// Upper: 18..11 | 21..28
// Lower: 48..41 | 31..38
export const UPPER_LEFT_TO_RIGHT = [
    "18",
    "17",
    "16",
    "15",
    "14",
    "13",
    "12",
    "11",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
];

export const LOWER_LEFT_TO_RIGHT = [
    "48",
    "47",
    "46",
    "45",
    "44",
    "43",
    "42",
    "41",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
];

/** ✅ Mock catalogs for selects (DEMO, no backend) */
export const DIAGNOSIS_OPTIONS = [
    "No findings",
    "Caries (suspected)",
    "Lesion / risk",
    "Sensitivity / wear",
    "Fracture / fissure",
    "Infection / abscess (suspected)",
    "Requires evaluation",
];

export const PROCEDURE_OPTIONS = [
    "Prophylaxis",
    "Sealant",
    "Resin restoration",
    "Evaluation + resin restoration (mock)",
    "Inlay (mock)",
    "Endodontics (mock)",
    "Extraction",
    "Control / Follow-up",
    "Clinical evaluation",
];
