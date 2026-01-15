// app/patients/_domain/usePatientsDomain.ts
"use client";

import { useMemo, useState } from "react";

import type {
    ClinicalEntry,
    Patient,
    PlanFilter,
    Selection,
    Surface,
    ToothStatus,
    TreatmentPlanItem,
    TreatmentPlanTotals,
} from "./types";

import {
    DIAGNOSIS_OPTIONS,
    LOWER_LEFT_TO_RIGHT,
    PROCEDURE_OPTIONS,
    SURFACES,
    UPPER_LEFT_TO_RIGHT,
} from "./constants";

import {
    emptyTooth,
    ensureTooth,
    safeTrim,
    shortSurface,
    statusBorder,
    statusFill,
    surfaceLabel,
    nextStatus,
} from "./utils";

import {
    mockClinical,
    recommendProcedure,
    normalizeDiagnosisForRecommendation,
    isKnownProcedure,
} from "./clinical";

import {
    clampMinutes,
    clampMoney,
    estimateCostForProcedure,
} from "./costs";

export type NewPatientForm = {
    name: string;
    age: string;
    gender: string;
    notes: string;
};

export function usePatientsDomain() {
    const [patients, setPatients] = useState<Patient[]>([
        {
            id: "PT-0001",
            name: "María González",
            age: 34,
            gender: "Female",
            notes: "Routine checkup",
            status: "Active",
            odontogram: {},
            clinical: {}, // ✅ in-memory
        },
        {
            id: "PT-0002",
            name: "Carlos Méndez",
            age: 41,
            gender: "Male",
            notes: "Post-surgery review",
            status: "Follow-up",
            odontogram: {},
            clinical: {}, // ✅ in-memory
        },
    ]);

    const [activePatientIndex, setActivePatientIndex] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<NewPatientForm>({
        name: "",
        age: "",
        gender: "",
        notes: "",
    });

    /** ✅ clinical selection for lower panel */
    const [selection, setSelection] = useState<Selection>(null);

    /** ✅ BLOCK 3: treatment plan UI controls */
    const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
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
            clinical: {}, // ✅ in-memory
        };

        setPatients([...patients, newPatient]);
        setForm({ name: "", age: "", gender: "", notes: "" });
        setShowModal(false);

        // on create, auto-select the new patient
        setActivePatientIndex(patients.length);
        setSelection(null);
    }

    /** ✅ helper to initialize/read clinical entry per tooth/surface */
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

        // ✅ BLOCK 2: recommended procedure (Option C) starts as AUTO
        const safeDiagnosis = normalizeDiagnosisForRecommendation(d.diagnosis);
        const recommended = recommendProcedure({
            status,
            diagnosis: safeDiagnosis,
            surface,
        });

        const procedure = isKnownProcedure(recommended) ? recommended : d.procedure;

        // ✅ BLOCK 4: cost estimate defaults to AUTO (not persisted until user overrides)
        // We compute here only to keep the initial experience consistent.
        const ce = estimateCostForProcedure(procedure);

        return {
            diagnosis: d.diagnosis,
            procedure,
            note: d.note,
            procedureManual: false,

            // optional fields: set defaults only when user overrides (but safe to prefill too)
            costManual: false,
            costFee: ce.fee,
            costMinutes: ce.minutes,
        };
    }

    /** ✅ persist clinical entry in the active patient */
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

        // ✅ BLOCK 4: if cost is AUTO, update the estimate when procedure changes
        if (!updated.costManual) {
            const ce = estimateCostForProcedure(updated.procedure);
            updated.costFee = ce.fee;
            updated.costMinutes = ce.minutes;
            updated.costManual = false;
        }

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
        const currentStatus = odWithTooth[tooth][surface] ?? "normal";
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

    /** ✅ patient-scoped status helper (for Treatment Plan) */
    function getPatientSurfaceStatus(p: Patient, tooth: string, surface: Surface): ToothStatus {
        const toothData = p.odontogram?.[tooth];
        if (!toothData) return "normal";
        return toothData[surface] || "normal";
    }

    /** ✅ remove a single clinical entry (does NOT change odontogram colors/status) */
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

    /** ✅ BLOCK 4: set cost override (manual) */
    function setCostOverride(tooth: string, surface: Surface, fee: number, minutes: number) {
        const entry = getOrInitClinicalEntry(
            activePatient,
            tooth,
            surface,
            getSurfaceStatus(tooth, surface)
        );

        const updated: ClinicalEntry = {
            ...entry,
            costManual: true,
            costFee: clampMoney(fee),
            costMinutes: clampMinutes(minutes),
        };

        setClinicalEntry(tooth, surface, updated);
    }

    /** ✅ BLOCK 4: revert cost to AUTO estimate */
    function revertCostToAuto(tooth: string, surface: Surface) {
        const entry = getOrInitClinicalEntry(
            activePatient,
            tooth,
            surface,
            getSurfaceStatus(tooth, surface)
        );

        const auto = estimateCostForProcedure(entry.procedure);

        const updated: ClinicalEntry = {
            ...entry,
            costManual: false,
            costFee: auto.fee,
            costMinutes: auto.minutes,
        };

        setClinicalEntry(tooth, surface, updated);
    }

    /** ✅ Build Treatment Plan from clinical map + odontogram status */
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

                // ✅ BLOCK 4: compute cost (manual override wins)
                const manual = !!entry.costManual;
                const ce = estimateCostForProcedure(procedure);
                let costFee = ce.fee;
                let costMinutes = ce.minutes;
                let costSource: TreatmentPlanItem["costSource"] = ce.source;

                if (manual) {
                    costFee = clampMoney(Number(entry.costFee ?? ce.fee));
                    costMinutes = clampMinutes(Number(entry.costMinutes ?? ce.minutes));
                    costSource = "manual";
                }

                items.push({
                    tooth,
                    surface,
                    surfaceName: surfaceLabel(surface),
                    status,
                    diagnosis,
                    procedure,
                    note,
                    procedureManual,

                    costFee,
                    costMinutes,
                    costManual: manual,
                    costSource,
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

    /** ✅ Filtered plan view (filter + search) */
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
                item.costManual ? "manual" : "auto",
            ]
                .join(" ")
                .toLowerCase();

            return hay.includes(q);
        });
    }, [treatmentPlan, planFilter, planSearch]);

    /** ✅ BLOCK 4: Totals for current view */
    const treatmentPlanTotals = useMemo((): TreatmentPlanTotals => {
        let totalFee = 0;
        let totalMinutes = 0;

        for (const item of treatmentPlanView) {
            totalFee += Number(item.costFee || 0);
            totalMinutes += Number(item.costMinutes || 0);
        }

        return {
            totalFee: clampMoney(totalFee),
            totalMinutes: clampMinutes(totalMinutes),
        };
    }, [treatmentPlanView]);

    /** ✅ Export plan to clipboard (JSON) */
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
                totals: treatmentPlanTotals,
            };
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            setCopiedPlan(true);
            setTimeout(() => setCopiedPlan(false), 1200);
        } catch {
            setCopiedPlan(false);
        }
    }

    /** ✅ Clinical panel view-model */
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

    return {
        // state
        patients,
        setPatients,
        activePatientIndex,
        setActivePatientIndex,
        activePatient,

        showModal,
        setShowModal,
        form,
        setForm,

        selection,
        setSelection,

        planFilter,
        setPlanFilter,
        planSearch,
        setPlanSearch,
        copiedPlan,

        // constants/views
        upperTeeth,
        lowerTeeth,
        treatmentPlan,
        treatmentPlanView,
        treatmentPlanTotals,
        clinicalPanel,

        // helpers (for UI components)
        getSurfaceStatus,
        getPatientSurfaceStatus,

        // actions
        addPatient,
        setSurface,
        resetTooth,
        resetAll,

        getOrInitClinicalEntry,
        setClinicalEntry,
        clearClinicalEntry,
        copyPlanToClipboard,

        // block 4 actions
        setCostOverride,
        revertCostToAuto,

        // re-exported utility functions commonly used by UI
        statusFill,
        statusBorder,
        surfaceLabel,
        shortSurface,
        safeTrim,

        // catalogs (UI uses them in selects)
        DIAGNOSIS_OPTIONS,
        PROCEDURE_OPTIONS,
        SURFACES,
    };
}
