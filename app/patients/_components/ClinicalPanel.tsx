"use client";

import type { ClinicalEntry, Patient, Selection, Surface, ToothStatus } from "../_domain/types";
import { recommendProcedure } from "../_domain/clinical";

type ClinicalPanelVM = {
    tooth: string;
    surface: Surface;
    surfaceName: string;
    status: ToothStatus;
    diagnosis: string;
    procedure: string;
    note: string;
    procedureManual: boolean;
};

type Props = {
    selection: Selection;

    // view-model computed by domain
    clinicalPanel: ClinicalPanelVM | null;

    // patient + helpers
    activePatient: Patient;
    getOrInitClinicalEntry: (patient: Patient, tooth: string, surface: Surface, status: ToothStatus) => ClinicalEntry;

    // catalogs
    DIAGNOSIS_OPTIONS: string[];
    PROCEDURE_OPTIONS: string[];

    // actions
    setClinicalEntry: (tooth: string, surface: Surface, entry: ClinicalEntry) => void;

    // UI helpers
    statusBorder: (s: ToothStatus) => string;
};

export default function ClinicalPanel({
    selection,
    clinicalPanel,
    activePatient,
    getOrInitClinicalEntry,
    DIAGNOSIS_OPTIONS,
    PROCEDURE_OPTIONS,
    setClinicalEntry,
    statusBorder,
}: Props) {
    return (
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
                                <span className="font-semibold">{clinicalPanel.surfaceName}</span> · Status{" "}
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
                        {/* Diagnosis */}
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

                                    // ✅ If procedure is still AUTO, update recommended procedure for the new diagnosis
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

                        {/* Procedure */}
                        <div className="rounded border border-neutral-800 bg-neutral-900 p-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-neutral-400">Procedure (mock)</p>
                                <span
                                    className="rounded px-2 py-0.5 text-[10px] font-medium"
                                    style={{
                                        background: clinicalPanel.procedureManual ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.12)",
                                        border: `1px solid ${clinicalPanel.procedureManual ? "#2563eb" : "#15803d"}`,
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

                            {/* Revert to AUTO */}
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

                        {/* Notes */}
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
                        Demo mode: this is narrative-only clinical guidance. In production, these mappings come from real
                        diagnostic/procedure catalogs.
                    </p>
                </div>
            )}
        </div>
    );
}
