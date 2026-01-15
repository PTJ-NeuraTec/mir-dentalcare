"use client";

import { useState } from "react";

import type { Selection, Surface, TreatmentPlanItem, TreatmentPlanTotals, PlanFilter } from "../_domain/types";
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

    /** Block 4 actions */
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
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [feeDraft, setFeeDraft] = useState<string>("");
    const [minutesDraft, setMinutesDraft] = useState<string>("");

    function parsePlanFilter(value: string): PlanFilter {
        if (value === "alertsOnly" || value === "treatedOnly" || value === "all") return value;
        return "all";
    }

    function startEdit(item: TreatmentPlanItem) {
        const key = `${item.tooth}-${item.surface}`;
        setEditingKey(key);
        setFeeDraft(String(item.costFee ?? 0));
        setMinutesDraft(String(item.costMinutes ?? 0));
    }

    function cancelEdit() {
        setEditingKey(null);
        setFeeDraft("");
        setMinutesDraft("");
    }

    function saveEdit(item: TreatmentPlanItem) {
        const fee = Number(feeDraft);
        const minutes = Number(minutesDraft);

        // allow 0, but prevent NaN
        const safeFee = Number.isFinite(fee) ? fee : 0;
        const safeMinutes = Number.isFinite(minutes) ? minutes : 0;

        setCostOverride(item.tooth, item.surface, safeFee, safeMinutes);
        cancelEdit();
    }

    return (
        <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs text-neutral-400">Treatment plan</p>
                    <h4 className="mt-1 text-sm font-semibold text-neutral-100">
                        Active patient · {activePatient.name}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-400">
                        This list is generated from surface-level clinical entries. Block 4 adds deterministic cost/time estimates
                        per procedure with manual override.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(parsePlanFilter(e.target.value))}
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

                            <th className="px-3 py-2 text-right">Est. time</th>
                            <th className="px-3 py-2 text-right">Fee</th>
                            <th className="px-3 py-2 text-left">Cost mode</th>

                            <th className="px-3 py-2 text-left">Notes</th>
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
                                const key = `${item.tooth}-${item.surface}`;
                                const rowEditing = editingKey === key;

                                const statusColor =
                                    item.status === "alert" ? "#fecaca" : item.status === "treated" ? "#bbf7d0" : "#e5e5e5";

                                const statusBg =
                                    item.status === "alert"
                                        ? "rgba(239,68,68,0.12)"
                                        : item.status === "treated"
                                            ? "rgba(34,197,94,0.12)"
                                            : "rgba(212,212,212,0.08)";

                                const statusBr = statusBorder(item.status);

                                return (
                                    <tr key={key} className="border-t border-neutral-800 align-top">
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

                                        <td className="px-3 py-2 text-right text-neutral-200">
                                            {rowEditing ? (
                                                <input
                                                    value={minutesDraft}
                                                    onChange={(e) => setMinutesDraft(e.target.value)}
                                                    inputMode="numeric"
                                                    className="w-[84px] rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-right text-xs text-neutral-100 outline-none focus:border-neutral-600"
                                                />
                                            ) : (
                                                <span className="font-medium">{formatMinutes(item.costMinutes)}</span>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 text-right text-neutral-200">
                                            {rowEditing ? (
                                                <input
                                                    value={feeDraft}
                                                    onChange={(e) => setFeeDraft(e.target.value)}
                                                    inputMode="decimal"
                                                    className="w-[96px] rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-right text-xs text-neutral-100 outline-none focus:border-neutral-600"
                                                />
                                            ) : (
                                                <span className="font-semibold">{formatUSD(item.costFee)}</span>
                                            )}
                                        </td>

                                        <td className="px-3 py-2">
                                            <span
                                                className="rounded px-2 py-0.5 text-[10px] font-medium"
                                                style={{
                                                    background: item.costManual ? "rgba(59,130,246,0.12)" : "rgba(34,197,94,0.10)",
                                                    border: `1px solid ${item.costManual ? "#2563eb" : "#15803d"}`,
                                                    color: item.costManual ? "#bfdbfe" : "#bbf7d0",
                                                }}
                                            >
                                                {item.costManual ? "MANUAL" : "AUTO"}
                                            </span>
                                            <span className="ml-2 text-[10px] text-neutral-500">
                                                {item.costSource === "catalog"
                                                    ? "catalog"
                                                    : item.costSource === "default"
                                                        ? "default"
                                                        : item.costSource === "manual"
                                                            ? "manual"
                                                            : "none"}
                                            </span>
                                        </td>

                                        <td className="px-3 py-2 text-neutral-400">{safeTrim(item.note, 48)}</td>

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

                                                {!rowEditing ? (
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                    >
                                                        Edit cost
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(item)}
                                                            className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {item.costManual && !rowEditing && (
                                                    <button
                                                        onClick={() => revertCostToAuto(item.tooth, item.surface)}
                                                        className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-200 hover:border-neutral-600"
                                                    >
                                                        Revert cost (AUTO)
                                                    </button>
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

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-neutral-500">
                    Demo note: costs are deterministic estimates for demo. In production, these come from fee schedules and provider rules.
                </p>

                <div className="flex items-center gap-3 rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs">
                    <span className="text-neutral-400">Totals (current view):</span>
                    <span className="text-neutral-200">
                        <span className="font-medium">{formatMinutes(treatmentPlanTotals.totalMinutes)}</span>
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-neutral-200">
                        <span className="font-semibold">{formatUSD(treatmentPlanTotals.totalFee)}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
