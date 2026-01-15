// app/patients/_components/TreatmentPlan.tsx
"use client";

import { useMemo, useState } from "react";
import type { PlanFilter, Selection, Surface, TreatmentPlanItem, ToothStatus, TreatmentPlanTotals } from "../_domain/types";
import { safeTrim, shortSurface, statusBorder } from "../_domain/utils";
import { formatMinutes, formatUSD } from "../_domain/costs";

type Props = {
    activePatient: {
        id: string;
        name: string;
        status: string;
    };

    planFilter: PlanFilter;
    setPlanFilter: (v: PlanFilter) => void;

    planSearch: string;
    setPlanSearch: (v: string) => void;

    copiedPlan: boolean;
    copyPlanToClipboard: () => void;

    treatmentPlanView: TreatmentPlanItem[];
    treatmentPlanTotals: TreatmentPlanTotals;

    setSelection: (s: Selection) => void;
    clearClinicalEntry: (tooth: string, surface: Surface) => void;

    /** Block 4 */
    setCostOverride: (tooth: string, surface: Surface, fee: number, minutes: number) => void;
    revertCostToAuto: (tooth: string, surface: Surface) => void;
};

export default function TreatmentPlan({
    activePatient,
    planFilter,
    setPlanFilter,
    planSearch,
    setPlanSearch,
    copiedPlan,
    copyPlanToClipboard,
    treatmentPlanView,
    treatmentPlanTotals,
    setSelection,
    clearClinicalEntry,
    setCostOverride,
    revertCostToAuto,
}: Props) {
    // Inline editor state per row (kept local/UI-only; real persistence is in domain clinical entries)
    const [editRow, setEditRow] = useState<string | null>(null);
    const [editFee, setEditFee] = useState<string>("");
    const [editMin, setEditMin] = useState<string>("");

    const rowCount = treatmentPlanView.length;

    const totalsLabel = useMemo(() => {
        if (rowCount === 0) return "No items";
        const fee = formatUSD(treatmentPlanTotals.totalFee);
        const mins = formatMinutes(treatmentPlanTotals.totalMinutes);
        return `${rowCount} item(s) · ${mins} · ${fee}`;
    }, [rowCount, treatmentPlanTotals.totalFee, treatmentPlanTotals.totalMinutes]);

    return (
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
                    <p className="mt-2 text-xs text-neutral-300">
                        <span className="text-neutral-500">View totals:</span>{" "}
                        <span className="font-medium text-neutral-100">{totalsLabel}</span>
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
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

                            {/* ✅ Block 4 */}
                            <th className="px-3 py-2 text-left">Est. Time</th>
                            <th className="px-3 py-2 text-left">Est. Cost</th>
                            <th className="px-3 py-2 text-left">Cost mode</th>

                            <th className="px-3 py-2 text-left">Mode</th>
                            <th className="px-3 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {treatmentPlanView.length === 0 ? (
                            <tr>
                                <td className="px-3 py-3 text-neutral-400" colSpan={11}>
                                    No treatment plan items yet. Click a tooth surface above to create clinical entries.
                                </td>
                            </tr>
                        ) : (
                            treatmentPlanView.map((item) => {
                                const rowKey = `${item.tooth}-${item.surface}`;

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

                                const statusBr = statusBorder(item.status as ToothStatus);

                                const costBadgeBg = item.costManual ? "rgba(59,130,246,0.12)" : "rgba(34,197,94,0.10)";
                                const costBadgeBr = item.costManual ? "#2563eb" : "#15803d";
                                const costBadgeTx = item.costManual ? "#bfdbfe" : "#bbf7d0";

                                return (
                                    <tr key={rowKey} className="border-t border-neutral-800 align-top">
                                        <td className="px-3 py-2 text-neutral-100">{item.tooth}</td>
                                        <td className="px-3 py-2 text-neutral-200">
                                            {shortSurface(item.surface)}{" "}
                                            <span className="text-neutral-500">({item.surfaceName})</span>
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

                                        {/* ✅ Block 4 columns */}
                                        <td className="px-3 py-2 text-neutral-200">{formatMinutes(item.costMinutes)}</td>
                                        <td className="px-3 py-2 text-neutral-200">{formatUSD(item.costFee)}</td>
                                        <td className="px-3 py-2">
                                            <span
                                                className="rounded px-2 py-0.5 text-[10px] font-medium"
                                                style={{
                                                    background: costBadgeBg,
                                                    border: `1px solid ${costBadgeBr}`,
                                                    color: costBadgeTx,
                                                }}
                                            >
                                                {item.costManual ? "MANUAL" : "AUTO"}
                                            </span>
                                            <div className="mt-1 text-[10px] text-neutral-500">
                                                Source: {item.costSource}
                                            </div>
                                        </td>

                                        {/* Procedure mode (existing) */}
                                        <td className="px-3 py-2">
                                            <span
                                                className="rounded px-2 py-0.5 text-[10px] font-medium"
                                                style={{
                                                    background: item.procedureManual ? "rgba(59,130,246,0.12)" : "rgba(34,197,94,0.10)",
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

                                                {/* Inline cost editor */}
                                                <button
                                                    onClick={() => {
                                                        if (editRow === rowKey) {
                                                            setEditRow(null);
                                                            setEditFee("");
                                                            setEditMin("");
                                                            return;
                                                        }
                                                        setEditRow(rowKey);
                                                        setEditFee(String(item.costFee ?? ""));
                                                        setEditMin(String(item.costMinutes ?? ""));
                                                    }}
                                                    className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                >
                                                    {editRow === rowKey ? "Close cost" : "Adjust cost"}
                                                </button>

                                                {editRow === rowKey && (
                                                    <div className="mt-2 w-full rounded border border-neutral-800 bg-neutral-950 p-2">
                                                        <div className="grid gap-2 sm:grid-cols-3">
                                                            <div>
                                                                <label className="text-[10px] text-neutral-400">Fee (USD)</label>
                                                                <input
                                                                    value={editFee}
                                                                    onChange={(e) => setEditFee(e.target.value)}
                                                                    className="mt-1 w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 outline-none focus:border-neutral-600"
                                                                    placeholder="e.g. 220"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-neutral-400">Minutes</label>
                                                                <input
                                                                    value={editMin}
                                                                    onChange={(e) => setEditMin(e.target.value)}
                                                                    className="mt-1 w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 outline-none focus:border-neutral-600"
                                                                    placeholder="e.g. 45"
                                                                />
                                                            </div>
                                                            <div className="flex items-end gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const fee = Number(editFee);
                                                                        const min = Number(editMin);
                                                                        setCostOverride(item.tooth, item.surface, fee, min);
                                                                        setEditRow(null);
                                                                    }}
                                                                    className="w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 hover:border-neutral-600"
                                                                >
                                                                    Set manual
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        revertCostToAuto(item.tooth, item.surface);
                                                                        setEditRow(null);
                                                                    }}
                                                                    className="w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 hover:border-neutral-600"
                                                                >
                                                                    Revert AUTO
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="mt-2 text-[10px] text-neutral-500">
                                                            Manual cost overrides are stored in-memory per patient, per tooth surface (demo behavior).
                                                        </p>
                                                    </div>
                                                )}
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
    );
}
