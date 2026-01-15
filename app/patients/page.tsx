"use client";

import { useMemo, useState } from "react";

type ToothStatus = "normal" | "alert" | "treated";
type Surface = "O" | "M" | "D" | "B" | "L"; // Occlusal, Mesial, Distal, Buccal, Lingual

type Odontogram = Record<string, Record<Surface, ToothStatus>>;

/** ✅ NEW: editable clinical data (in-memory, per patient/tooth/surface) */
type ClinicalEntry = {
    diagnosis: string;
    procedure: string;
    note: string;

    /** ✅ NEW (Block 2): if true, user manually selected the procedure; we won't auto-overwrite it */
    procedureManual?: boolean;
};
type ClinicalMap = Record<string, Partial<Record<Surface, ClinicalEntry>>>;

type Patient = {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
    status: "Active" | "Follow-up" | "Inactive";
    odontogram: Odontogram;

    /** ✅ NEW: in-memory persistence for clinical panel */
    clinical: ClinicalMap;
};

const SURFACES: Surface[] = ["O", "M", "D", "B", "L"];

// FDI layout (very common in odontograms):
// Upper: 18..11 | 21..28
// Lower: 48..41 | 31..38
const UPPER_LEFT_TO_RIGHT = [
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
const LOWER_LEFT_TO_RIGHT = [
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

function emptyTooth(): Record<Surface, ToothStatus> {
    return { O: "normal", M: "normal", D: "normal", B: "normal", L: "normal" };
}

function ensureTooth(od: Odontogram, tooth: string): Odontogram {
    if (od[tooth]) return od;
    return { ...od, [tooth]: emptyTooth() };
}

function nextStatus(s: ToothStatus): ToothStatus {
    // simple cycle (demo-friendly) but clinically understandable:
    // normal → alert → treated → normal
    if (s === "normal") return "alert";
    if (s === "alert") return "treated";
    return "normal";
}

function statusFill(s: ToothStatus): string {
    // sober (enterprise), no neon
    if (s === "alert") return "#ef4444"; // red
    if (s === "treated") return "#22c55e"; // green
    return "#d4d4d4"; // neutral
}

function statusBorder(s: ToothStatus): string {
    if (s === "alert") return "#b91c1c";
    if (s === "treated") return "#15803d";
    return "#525252";
}

function surfaceLabel(surface: Surface): string {
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

/** =========================
 *  Clinical mock (DEMO only)
 *  =========================
 *  Goal: the odontogram should not be “just colors”,
 *  but should show “what needs to be done” when selected.
 */
function mockClinical(status: ToothStatus, surface: Surface) {
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

/** ✅ NEW: mock catalogs for selects (DEMO, no backend) */
const DIAGNOSIS_OPTIONS = [
    "No findings",
    "Caries (suspected)",
    "Lesion / risk",
    "Sensitivity / wear",
    "Fracture / fissure",
    "Infection / abscess (suspected)",
    "Requires evaluation",
];

const PROCEDURE_OPTIONS = [
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

/** ✅ BLOCK 2 (Option C): Status + Diagnosis + Surface recommendation engine */
function recommendProcedure(params: {
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

/** =========================
 * ✅ BLOCK 3 (Functional): Treatment Plan + Export (Production-grade scaffold)
 * =========================
 * Goal:
 * - Convert odontogram interactions into a real “Treatment Plan” list per patient
 * - Keep everything in-memory (DEMO), but in a structure ready for backend persistence
 * - Zero breaking changes: ONLY adds functionality; does not remove or alter existing behavior
 */

type TreatmentPlanItem = {
    tooth: string;
    surface: Surface;
    surfaceName: string;
    status: ToothStatus;
    diagnosis: string;
    procedure: string;
    note: string;
    procedureManual: boolean;
};

function shortSurface(surface: Surface): string {
    // for compact table display
    return surface;
}

function safeTrim(s: string, n: number) {
    const t = (s || "").trim();
    if (t.length <= n) return t;
    return t.slice(0, n - 1) + "…";
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([
        {
            id: "PT-0001",
            name: "María González",
            age: 34,
            gender: "Female",
            notes: "Routine checkup",
            status: "Active",
            odontogram: {},
            clinical: {}, // ✅ NEW
        },
        {
            id: "PT-0002",
            name: "Carlos Méndez",
            age: 41,
            gender: "Male",
            notes: "Post-surgery review",
            status: "Follow-up",
            odontogram: {},
            clinical: {}, // ✅ NEW
        },
    ]);

    const [activePatientIndex, setActivePatientIndex] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        notes: "",
    });

    /** ✅ clinical selection for lower panel */
    const [selection, setSelection] = useState<{
        tooth: string;
        surface: Surface;
        status: ToothStatus;
    } | null>(null);

    /** ✅ BLOCK 3: treatment plan UI controls */
    const [planFilter, setPlanFilter] = useState<"all" | "alertsOnly" | "treatedOnly">("all");
    const [planSearch, setPlanSearch] = useState("");
    const [copiedPlan, setCopiedPlan] = useState(false);

    const activePatient = patients[activePatientIndex];

    const upperTeeth = useMemo(() => UPPER_LEFT_TO_RIGHT, []);
    const lowerTeeth = useMemo(() => LOWER_LEFT_TO_RIGHT, []);

    function addPatient() {
        if (!form.name) return;

        const newPatient: Patient = {
            id: `PT-${String(patients.length + 1).padStart(4, "0")}`,
            name: form.name,
            age: Number(form.age || 0),
            gender: form.gender || "",
            notes: form.notes || "",
            status: "Active",
            odontogram: {},
            clinical: {}, // ✅ NEW
        };

        setPatients([...patients, newPatient]);
        setForm({ name: "", age: "", gender: "", notes: "" });
        setShowModal(false);

        // on create, auto-select the new patient
        setActivePatientIndex(patients.length);
        setSelection(null);
    }

    /** ✅ NEW: helper to initialize/read clinical entry per tooth/surface */
    function getOrInitClinicalEntry(
        patient: Patient,
        tooth: string,
        surface: Surface,
        status: ToothStatus
    ): ClinicalEntry {
        const existing = patient.clinical?.[tooth]?.[surface];
        if (existing) return existing;

        // if it does not exist, create it using mockClinical (based on current status)
        const d = mockClinical(status, surface);

        // ✅ BLOCK 2: If we create a new entry, set a recommended procedure (Option C)
        // It starts as AUTO (procedureManual=false)
        const recommended = recommendProcedure({
            status,
            diagnosis: DIAGNOSIS_OPTIONS.includes(d.diagnosis) ? d.diagnosis : "Requires evaluation",
            surface,
        });

        return {
            diagnosis: d.diagnosis,
            procedure: PROCEDURE_OPTIONS.includes(recommended) ? recommended : d.procedure,
            note: d.note,
            procedureManual: false,
        };
    }

    /** ✅ NEW: persist clinical entry in the active patient */
    function setClinicalEntry(tooth: string, surface: Surface, entry: ClinicalEntry) {
        const updatedPatients = [...patients];
        const p = updatedPatients[activePatientIndex];

        const toothMap = p.clinical[tooth] || {};
        p.clinical = {
            ...p.clinical,
            [tooth]: {
                ...toothMap,
                [surface]: entry,
            },
        };

        updatedPatients[activePatientIndex] = { ...p };
        setPatients(updatedPatients);
    }

    /** ✅ BLOCK 2: auto-update procedure if it's still AUTO */
    function maybeAutoUpdateProcedure(
        patient: Patient,
        tooth: string,
        surface: Surface,
        status: ToothStatus
    ) {
        const existing = patient.clinical?.[tooth]?.[surface];
        if (!existing) return;

        // If user set it manually, do not overwrite
        if (existing.procedureManual) return;

        const diagnosis = existing.diagnosis || "Requires evaluation";
        const recommended = recommendProcedure({ status, diagnosis, surface });

        if (!recommended) return;

        // Update only if actually different (avoid useless re-renders)
        if (existing.procedure === recommended) return;

        const updated: ClinicalEntry = {
            ...existing,
            procedure: recommended,
            procedureManual: false,
        };

        // Persist
        const updatedPatients = [...patients];
        const p = updatedPatients[activePatientIndex];

        const toothMap = p.clinical[tooth] || {};
        p.clinical = {
            ...p.clinical,
            [tooth]: {
                ...toothMap,
                [surface]: updated,
            },
        };

        updatedPatients[activePatientIndex] = { ...p };
        setPatients(updatedPatients);
    }

    function setSurface(tooth: string, surface: Surface) {
        const currentOd = activePatient.odontogram;
        const odWithTooth = ensureTooth(currentOd, tooth);
        const currentStatus = odWithTooth[tooth][surface];
        const updatedStatus = nextStatus(currentStatus);

        const updatedPatient: Patient = {
            ...activePatient,
            odontogram: {
                ...odWithTooth,
                [tooth]: {
                    ...odWithTooth[tooth],
                    [surface]: updatedStatus,
                },
            },
        };

        const updatedPatients = [...patients];
        updatedPatients[activePatientIndex] = updatedPatient;
        setPatients(updatedPatients);

        // lower panel
        setSelection({ tooth, surface, status: updatedStatus });

        /** ✅ ensure editable entry exists (if not, create default) */
        const entry = getOrInitClinicalEntry(updatedPatient, tooth, surface, updatedStatus);
        const existing = updatedPatient.clinical?.[tooth]?.[surface];

        if (!existing) {
            const toothMap = updatedPatient.clinical[tooth] || {};
            updatedPatient.clinical = {
                ...updatedPatient.clinical,
                [tooth]: {
                    ...toothMap,
                    [surface]: entry,
                },
            };

            const updatedPatients2 = [...updatedPatients];
            updatedPatients2[activePatientIndex] = { ...updatedPatient };
            setPatients(updatedPatients2);
        } else {
            // ✅ BLOCK 2: status changed; if procedure still AUTO, update recommendation (Option C)
            maybeAutoUpdateProcedure(updatedPatient, tooth, surface, updatedStatus);
        }
    }

    function resetTooth(tooth: string) {
        const currentOd = activePatient.odontogram;
        const updatedPatient: Patient = {
            ...activePatient,
            odontogram: {
                ...currentOd,
                [tooth]: emptyTooth(),
            },
        };

        // ✅ we keep clinical data (not deleted) because in a real system this is history.
        const updatedPatients = [...patients];
        updatedPatients[activePatientIndex] = updatedPatient;
        setPatients(updatedPatients);

        if (selection?.tooth === tooth) setSelection(null);
    }

    function resetAll() {
        const updatedPatient: Patient = {
            ...activePatient,
            odontogram: {},
        };

        // ✅ same: do not delete clinical data by default
        const updatedPatients = [...patients];
        updatedPatients[activePatientIndex] = updatedPatient;
        setPatients(updatedPatients);

        setSelection(null);
    }

    function getSurfaceStatus(tooth: string, surface: Surface): ToothStatus {
        const toothData = activePatient.odontogram[tooth];
        if (!toothData) return "normal";
        return toothData[surface] || "normal";
    }

    /** ✅ BLOCK 3: patient-scoped status helper (for Treatment Plan) */
    function getPatientSurfaceStatus(p: Patient, tooth: string, surface: Surface): ToothStatus {
        const toothData = p.odontogram?.[tooth];
        if (!toothData) return "normal";
        return toothData[surface] || "normal";
    }

    /** ✅ BLOCK 3: remove a single clinical entry (does NOT change odontogram colors/status) */
    function clearClinicalEntry(tooth: string, surface: Surface) {
        const updatedPatients = [...patients];
        const p = updatedPatients[activePatientIndex];

        if (!p.clinical?.[tooth]?.[surface]) return;

        const toothMap = { ...(p.clinical[tooth] || {}) };
        delete toothMap[surface];

        // if toothMap becomes empty, remove tooth key
        const newClinical = { ...p.clinical };
        if (Object.keys(toothMap).length === 0) {
            delete newClinical[tooth];
        } else {
            newClinical[tooth] = toothMap;
        }

        const updatedPatient: Patient = { ...p, clinical: newClinical };
        updatedPatients[activePatientIndex] = updatedPatient;
        setPatients(updatedPatients);

        if (selection?.tooth === tooth && selection?.surface === surface) {
            setSelection(null);
        }
    }

    /** ✅ BLOCK 3: Build Treatment Plan from clinical map + odontogram status */
    const treatmentPlan = useMemo((): TreatmentPlanItem[] => {
        const p = activePatient;
        const items: TreatmentPlanItem[] = [];

        const clinical = p.clinical || {};
        const teeth = Object.keys(clinical);

        for (const tooth of teeth) {
            const perTooth = clinical[tooth] || {};
            for (const surface of SURFACES) {
                const entry = perTooth[surface];
                if (!entry) continue;

                const status = getPatientSurfaceStatus(p, tooth, surface);
                const diagnosis = entry.diagnosis || "Requires evaluation";
                const procedure = entry.procedure || "Clinical evaluation";
                const note = entry.note || "";
                const procedureManual = !!entry.procedureManual;

                items.push({
                    tooth,
                    surface,
                    surfaceName: surfaceLabel(surface),
                    status,
                    diagnosis,
                    procedure,
                    note,
                    procedureManual,
                });
            }
        }

        // Sort: alerts first, then treated, then normal; then by tooth number
        const rankStatus = (s: ToothStatus) => (s === "alert" ? 0 : s === "treated" ? 1 : 2);
        items.sort((a, b) => {
            const rs = rankStatus(a.status) - rankStatus(b.status);
            if (rs !== 0) return rs;
            const ta = Number(a.tooth);
            const tb = Number(b.tooth);
            if (ta !== tb) return ta - tb;
            return a.surface.localeCompare(b.surface);
        });

        return items;
    }, [activePatient]); // stays in sync with patient

    /** ✅ BLOCK 3: Filtered plan view (filter + search) */
    const treatmentPlanView = useMemo(() => {
        const q = planSearch.trim().toLowerCase();

        return treatmentPlan.filter((item) => {
            if (planFilter === "alertsOnly" && item.status !== "alert") return false;
            if (planFilter === "treatedOnly" && item.status !== "treated") return false;

            if (!q) return true;

            const hay = [
                item.tooth,
                item.surface,
                item.surfaceName,
                item.status,
                item.diagnosis,
                item.procedure,
                item.note,
                item.procedureManual ? "manual" : "auto",
            ]
                .join(" ")
                .toLowerCase();

            return hay.includes(q);
        });
    }, [treatmentPlan, planFilter, planSearch]);

    /** ✅ BLOCK 3: Export plan to clipboard (JSON) */
    async function copyPlanToClipboard() {
        try {
            const payload = {
                patient: {
                    id: activePatient.id,
                    name: activePatient.name,
                    status: activePatient.status,
                },
                generatedAt: new Date().toISOString(),
                items: treatmentPlanView,
            };
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            setCopiedPlan(true);
            setTimeout(() => setCopiedPlan(false), 1200);
        } catch {
            // no-op (clipboard may be blocked by browser policy)
            setCopiedPlan(false);
        }
    }

    /**
     * ✅ ONLY CHANGE: ToothSVG is now 100% round (circles),
     * keeping exactly the same logic and handlers.
     */
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

    /** ✅ MODIFIED: clinical panel now uses editable entry (per patient/tooth/surface) */
    const clinicalPanel = useMemo(() => {
        if (!selection) return null;

        const entry = getOrInitClinicalEntry(
            activePatient,
            selection.tooth,
            selection.surface,
            selection.status
        );

        return {
            tooth: selection.tooth,
            surface: selection.surface,
            surfaceName: surfaceLabel(selection.surface),
            status: selection.status,
            diagnosis: entry.diagnosis,
            procedure: entry.procedure,
            note: entry.note,
            procedureManual: !!entry.procedureManual,
        };
    }, [selection, activePatient]);

    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">
            {/* Header */}
            <section className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Patients</h2>
                    <p className="mt-1 max-w-3xl text-sm text-neutral-300">
                        Patient registry with an interactive odontogram by tooth surfaces.
                        This is production-grade UX scaffolding: the data model persists later
                        without rewriting UI logic.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={resetAll}
                        className="rounded border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-neutral-500"
                    >
                        Reset Odontogram
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
                    >
                        + New Patient
                    </button>
                </div>
            </section>

            {/* Patients Table */}
            <div className="mb-12 overflow-hidden rounded-lg border border-neutral-800">
                <table className="w-full bg-neutral-900 text-sm">
                    <thead className="bg-neutral-950 text-neutral-400">
                        <tr>
                            <th className="px-4 py-3 text-left">Patient</th>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Age</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p, idx) => (
                            <tr
                                key={p.id}
                                onClick={() => {
                                    setActivePatientIndex(idx);
                                    setSelection(null);
                                }}
                                className={`cursor-pointer border-t border-neutral-800 ${idx === activePatientIndex ? "bg-neutral-800/60" : ""
                                    }`}
                            >
                                <td className="px-4 py-3">{p.name}</td>
                                <td className="px-4 py-3">{p.id}</td>
                                <td className="px-4 py-3">{p.age}</td>
                                <td className="px-4 py-3">{p.status}</td>
                                <td className="px-4 py-3 text-neutral-300">{p.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Odontogram */}
            <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-xl font-medium">
                            Odontogram · {activePatient.name}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-400">
                            Click any surface to cycle: <span className="text-neutral-200">normal</span> →{" "}
                            <span className="text-red-300">alert</span> →{" "}
                            <span className="text-green-300">treated</span>. Click the small dot on a tooth to reset that tooth.
                        </p>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ background: statusFill("normal") }} />
                            Normal
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ background: statusFill("alert") }} />
                            Alert
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ background: statusFill("treated") }} />
                            Treated
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-400">
                            Surfaces: O (Occlusal), M (Mesial), D (Distal), B (Buccal), L (Lingual)
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* SVG Canvas */}
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
                        <line x1="20" y1="170" x2="960" y2="170" stroke="#262626" strokeWidth="1" />

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

                {/* Lower clinical panel */}
                <div className="mt-6">
                    {!clinicalPanel ? (
                        <div className="rounded border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
                            <p className="text-xs text-neutral-400">Clinical detail</p>
                            <p className="mt-1">
                                Select a tooth surface to see a clinical description (diagnosis + procedure + notes) for decision-making.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs text-neutral-400">Selected</p>
                                    <p className="text-sm text-neutral-100">
                                        Tooth <span className="font-semibold">{clinicalPanel.tooth}</span> ·{" "}
                                        <span className="font-semibold">{clinicalPanel.surfaceName}</span> ·{" "}
                                        Status{" "}
                                        <span
                                            className="rounded px-2 py-0.5 text-xs font-medium"
                                            style={{
                                                background:
                                                    clinicalPanel.status === "alert"
                                                        ? "rgba(239,68,68,0.15)"
                                                        : clinicalPanel.status === "treated"
                                                            ? "rgba(34,197,94,0.15)"
                                                            : "rgba(212,212,212,0.10)",
                                                border: `1px solid ${statusBorder(clinicalPanel.status)}`,
                                                color:
                                                    clinicalPanel.status === "alert"
                                                        ? "#fecaca"
                                                        : clinicalPanel.status === "treated"
                                                            ? "#bbf7d0"
                                                            : "#e5e5e5",
                                            }}
                                        >
                                            {clinicalPanel.status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>

                                <div className="text-xs text-neutral-400">
                                    Tip: click again to cycle status and watch the recommended procedure change.
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <div className="rounded border border-neutral-800 bg-neutral-900 p-3">
                                    <p className="text-xs text-neutral-400">Diagnosis (mock)</p>
                                    <select
                                        value={clinicalPanel.diagnosis}
                                        onChange={(e) => {
                                            if (!selection) return;

                                            const entry = getOrInitClinicalEntry(
                                                activePatient,
                                                selection.tooth,
                                                selection.surface,
                                                selection.status
                                            );

                                            const updated: ClinicalEntry = {
                                                ...entry,
                                                diagnosis: e.target.value,
                                            };

                                            // ✅ BLOCK 2: if procedure is still AUTO, update recommended procedure for the new diagnosis
                                            if (!updated.procedureManual) {
                                                const rec = recommendProcedure({
                                                    status: selection.status,
                                                    diagnosis: updated.diagnosis,
                                                    surface: selection.surface,
                                                });
                                                if (PROCEDURE_OPTIONS.includes(rec)) {
                                                    updated.procedure = rec;
                                                }
                                            }

                                            setClinicalEntry(selection.tooth, selection.surface, updated);
                                        }}
                                        className="mt-2 w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
                                    >
                                        {!DIAGNOSIS_OPTIONS.includes(clinicalPanel.diagnosis) && (
                                            <option value={clinicalPanel.diagnosis}>{clinicalPanel.diagnosis}</option>
                                        )}
                                        {DIAGNOSIS_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="rounded border border-neutral-800 bg-neutral-900 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-neutral-400">Procedure (mock)</p>
                                        <span
                                            className="rounded px-2 py-0.5 text-[10px] font-medium"
                                            style={{
                                                background: clinicalPanel.procedureManual
                                                    ? "rgba(59,130,246,0.15)"
                                                    : "rgba(34,197,94,0.12)",
                                                border: `1px solid ${clinicalPanel.procedureManual ? "#2563eb" : "#15803d"
                                                    }`,
                                                color: clinicalPanel.procedureManual ? "#bfdbfe" : "#bbf7d0",
                                            }}
                                        >
                                            {clinicalPanel.procedureManual ? "MANUAL" : "AUTO"}
                                        </span>
                                    </div>

                                    <select
                                        value={clinicalPanel.procedure}
                                        onChange={(e) => {
                                            if (!selection) return;

                                            const entry = getOrInitClinicalEntry(
                                                activePatient,
                                                selection.tooth,
                                                selection.surface,
                                                selection.status
                                            );

                                            const updated: ClinicalEntry = {
                                                ...entry,
                                                procedure: e.target.value,
                                                procedureManual: true, // ✅ user override
                                            };

                                            setClinicalEntry(selection.tooth, selection.surface, updated);
                                        }}
                                        className="mt-2 w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
                                    >
                                        {!PROCEDURE_OPTIONS.includes(clinicalPanel.procedure) && (
                                            <option value={clinicalPanel.procedure}>{clinicalPanel.procedure}</option>
                                        )}
                                        {PROCEDURE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>

                                    {/* ✅ BLOCK 2: allow user to revert to AUTO */}
                                    <button
                                        onClick={() => {
                                            if (!selection) return;

                                            const entry = getOrInitClinicalEntry(
                                                activePatient,
                                                selection.tooth,
                                                selection.surface,
                                                selection.status
                                            );

                                            const rec = recommendProcedure({
                                                status: selection.status,
                                                diagnosis: entry.diagnosis,
                                                surface: selection.surface,
                                            });

                                            const updated: ClinicalEntry = {
                                                ...entry,
                                                procedure: PROCEDURE_OPTIONS.includes(rec) ? rec : entry.procedure,
                                                procedureManual: false,
                                            };

                                            setClinicalEntry(selection.tooth, selection.surface, updated);
                                        }}
                                        className="mt-2 w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 hover:border-neutral-600"
                                    >
                                        Revert to AUTO recommendation
                                    </button>
                                </div>

                                <div className="rounded border border-neutral-800 bg-neutral-900 p-3">
                                    <p className="text-xs text-neutral-400">Clinical notes</p>
                                    <textarea
                                        value={clinicalPanel.note}
                                        onChange={(e) => {
                                            if (!selection) return;

                                            const entry = getOrInitClinicalEntry(
                                                activePatient,
                                                selection.tooth,
                                                selection.surface,
                                                selection.status
                                            );

                                            const updated: ClinicalEntry = {
                                                ...entry,
                                                note: e.target.value,
                                            };

                                            setClinicalEntry(selection.tooth, selection.surface, updated);
                                        }}
                                        className="mt-2 h-[88px] w-full resize-none rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
                                    />
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-neutral-500">
                                Demo mode: this is narrative-only clinical guidance. In production, these mappings come from real diagnostic/procedure catalogs.
                            </p>
                        </div>
                    )}
                </div>

                {/* ✅ BLOCK 3: Treatment Plan (interactive, per patient) */}
                <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs text-neutral-400">Treatment plan</p>
                            <h4 className="mt-1 text-sm font-semibold text-neutral-100">
                                Active patient · {activePatient.name}
                            </h4>
                            <p className="mt-1 text-xs text-neutral-400">
                                This list is generated from surface-level clinical entries. It’s the production-ready bridge between odontogram and real workflows.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <select
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value as any)}
                                className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-neutral-600"
                            >
                                <option value="all">All entries</option>
                                <option value="alertsOnly">Alerts only</option>
                                <option value="treatedOnly">Treated only</option>
                            </select>

                            <input
                                value={planSearch}
                                onChange={(e) => setPlanSearch(e.target.value)}
                                placeholder="Search tooth / diagnosis / procedure…"
                                className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-neutral-600 sm:w-[260px]"
                            />

                            <button
                                onClick={copyPlanToClipboard}
                                className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 hover:border-neutral-600"
                            >
                                {copiedPlan ? "Copied ✅" : "Copy plan (JSON)"}
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto rounded border border-neutral-800">
                        <table className="w-full bg-neutral-900 text-xs">
                            <thead className="bg-neutral-950 text-neutral-400">
                                <tr>
                                    <th className="px-3 py-2 text-left">Tooth</th>
                                    <th className="px-3 py-2 text-left">Surface</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-left">Diagnosis</th>
                                    <th className="px-3 py-2 text-left">Procedure</th>
                                    <th className="px-3 py-2 text-left">Notes</th>
                                    <th className="px-3 py-2 text-left">Mode</th>
                                    <th className="px-3 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatmentPlanView.length === 0 ? (
                                    <tr>
                                        <td className="px-3 py-3 text-neutral-400" colSpan={8}>
                                            No treatment plan items yet. Click a tooth surface above to create clinical entries.
                                        </td>
                                    </tr>
                                ) : (
                                    treatmentPlanView.map((item) => {
                                        const statusColor =
                                            item.status === "alert"
                                                ? "#fecaca"
                                                : item.status === "treated"
                                                    ? "#bbf7d0"
                                                    : "#e5e5e5";

                                        const statusBg =
                                            item.status === "alert"
                                                ? "rgba(239,68,68,0.12)"
                                                : item.status === "treated"
                                                    ? "rgba(34,197,94,0.12)"
                                                    : "rgba(212,212,212,0.08)";

                                        const statusBr = statusBorder(item.status);

                                        return (
                                            <tr key={`${item.tooth}-${item.surface}`} className="border-t border-neutral-800">
                                                <td className="px-3 py-2 text-neutral-100">{item.tooth}</td>
                                                <td className="px-3 py-2 text-neutral-200">
                                                    {shortSurface(item.surface)} <span className="text-neutral-500">({item.surfaceName})</span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span
                                                        className="rounded px-2 py-0.5 text-[10px] font-medium"
                                                        style={{
                                                            background: statusBg,
                                                            border: `1px solid ${statusBr}`,
                                                            color: statusColor,
                                                        }}
                                                    >
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-neutral-200">{item.diagnosis}</td>
                                                <td className="px-3 py-2 text-neutral-200">{item.procedure}</td>
                                                <td className="px-3 py-2 text-neutral-400">{safeTrim(item.note, 48)}</td>
                                                <td className="px-3 py-2">
                                                    <span
                                                        className="rounded px-2 py-0.5 text-[10px] font-medium"
                                                        style={{
                                                            background: item.procedureManual
                                                                ? "rgba(59,130,246,0.12)"
                                                                : "rgba(34,197,94,0.10)",
                                                            border: `1px solid ${item.procedureManual ? "#2563eb" : "#15803d"}`,
                                                            color: item.procedureManual ? "#bfdbfe" : "#bbf7d0",
                                                        }}
                                                    >
                                                        {item.procedureManual ? "MANUAL" : "AUTO"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelection({
                                                                    tooth: item.tooth,
                                                                    surface: item.surface,
                                                                    status: item.status,
                                                                });
                                                            }}
                                                            className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => clearClinicalEntry(item.tooth, item.surface)}
                                                            className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                        >
                                                            Clear entry
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-3 text-xs text-neutral-500">
                        Demo note: this plan is in-memory only. In production, this becomes the persistent “treatment plan” / “clinical chart” record.
                    </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs text-neutral-400">Interaction model</p>
                        <p className="mt-1 text-sm text-neutral-200">
                            Surface-level states (O/M/D/B/L) are stored per tooth and per patient.
                        </p>
                    </div>
                    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs text-neutral-400">Production path</p>
                        <p className="mt-1 text-sm text-neutral-200">
                            Tomorrow’s demo uses this UI. Later we swap only the SVG shapes for realistic anatomy — same data model, same logic.
                        </p>
                    </div>
                    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs text-neutral-400">Clinical credibility</p>
                        <p className="mt-1 text-sm text-neutral-200">
                            Decision-makers see a real odontogram workflow: not a toy grid, but tooth surfaces that behave like a serious system.
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-xs text-neutral-500">
                    Demo mode: all odontogram data is in-memory (no backend, no persistence). This is intentional and aligns with the approved demo principles.
                </p>
            </section>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="w-full max-w-md rounded-lg bg-neutral-900 p-6">
                        <h3 className="mb-4 text-lg font-medium">New Patient</h3>

                        <div className="space-y-3 text-sm">
                            <input
                                placeholder="Full name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
                            />
                            <input
                                placeholder="Age"
                                type="number"
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                                className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
                            />
                            <input
                                placeholder="Gender"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
                            />
                            <textarea
                                placeholder="Clinical notes"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-sm text-neutral-400 hover:text-neutral-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addPatient}
                                className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
                            >
                                Create
                            </button>
                        </div>

                        <p className="mt-4 text-xs text-neutral-500">
                            Note: patient is created in-memory for demo purposes. The same UI will connect to real persistence later.
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}
