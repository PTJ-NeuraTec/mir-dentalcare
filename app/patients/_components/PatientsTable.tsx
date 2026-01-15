"use client";

import type { Patient, Selection } from "../_domain/types";

type Props = {
    patients: Patient[];
    activePatientIndex: number;
    setActivePatientIndex: (idx: number) => void;
    setSelection: (s: Selection) => void;
};

export default function PatientsTable({
    patients,
    activePatientIndex,
    setActivePatientIndex,
    setSelection,
}: Props) {
    return (
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
    );
}
