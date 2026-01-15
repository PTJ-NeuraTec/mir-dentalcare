"use client";

import type { NewPatientForm } from "../_domain/usePatientsDomain";

type Props = {
    showModal: boolean;
    setShowModal: (v: boolean) => void;

    form: NewPatientForm;
    setForm: (f: NewPatientForm) => void;

    addPatient: () => void;
};

export default function NewPatientModal({
    showModal,
    setShowModal,
    form,
    setForm,
    addPatient,
}: Props) {
    if (!showModal) return null;

    return (
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
                    Note: patient is created in-memory for demo purposes. The same UI will
                    connect to real persistence later.
                </p>
            </div>
        </div>
    );
}
