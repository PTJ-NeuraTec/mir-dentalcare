"use client";

import type { PlanFilter, Selection, Surface, TreatmentPlanItem, ToothStatus } from "../_domain/types";
import { safeTrim, shortSurface, statusBorder } from "../_domain/utils";

function isPlanFilter(v: string): v is PlanFilter {
    return v === "all" || v === "alertsOnly" || v === "treatedOnly";
}

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

    setSelection: (s: Selection) => void;
    clearClinicalEntry: (tooth: string, surface: Surface) => void;
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
    setSelection,
    clearClinicalEntry,
}: Props) {
    return (
        <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs text-neutral-400">Treatment plan</p>
                    <h4 className="mt-1 text-sm font-semibold text-neutral-100">
                        Active patient · {activePatient.name}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-400">
                        This list is generated from surface-level clinical entries. It’s the production-ready bridge between
                        odontogram and real workflows.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                        value={planFilter}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (isPlanFilter(v)) setPlanFilter(v);
                        }}
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
                                const status = item.status as ToothStatus;

                                const statusColor = status === "alert" ? "#fecaca" : status === "treated" ? "#bbf7d0" : "#e5e5e5";

                                const statusBg =
                                    status === "alert"
                                        ? "rgba(239,68,68,0.12)"
                                        : status === "treated"
                                            ? "rgba(34,197,94,0.12)"
                                            : "rgba(212,212,212,0.08)";

                                const statusBr = statusBorder(status);

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
                                                {status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-neutral-200">{item.diagnosis}</td>
                                        <td className="px-3 py-2 text-neutral-200">{item.procedure}</td>
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
                                                            status: status,
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
                Demo note: this plan is in-memory only. In production, this becomes the persistent “treatment plan” / “clinical
                chart” record.
            </p>
        </div>
    );
}
