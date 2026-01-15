export default function PatientsPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

            {/* =========================
         Page Header
         ========================= */}
            <section className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                    Patients
                </h2>
                <p className="max-w-3xl text-sm text-neutral-300">
                    Centralized view of patient records designed for clinical traceability,
                    continuity of care, and multi-visit management.
                </p>
            </section>

            {/* =========================
         Patients List (Mock)
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Patient Registry
                </h3>

                <div className="overflow-hidden rounded-lg border border-neutral-800">
                    <table className="w-full border-collapse bg-neutral-900 text-sm">
                        <thead className="bg-neutral-950 text-neutral-400">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Patient</th>
                                <th className="px-4 py-3 text-left font-medium">ID</th>
                                <th className="px-4 py-3 text-left font-medium">Last Visit</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-300">
                            <tr className="border-t border-neutral-800">
                                <td className="px-4 py-3">María González</td>
                                <td className="px-4 py-3">PT-0001</td>
                                <td className="px-4 py-3">2025-01-12</td>
                                <td className="px-4 py-3 text-green-400">Active</td>
                                <td className="px-4 py-3">Routine checkup</td>
                            </tr>
                            <tr className="border-t border-neutral-800">
                                <td className="px-4 py-3">Carlos Méndez</td>
                                <td className="px-4 py-3">PT-0002</td>
                                <td className="px-4 py-3">2024-12-03</td>
                                <td className="px-4 py-3 text-yellow-400">Follow-up</td>
                                <td className="px-4 py-3">Post-surgery review</td>
                            </tr>
                            <tr className="border-t border-neutral-800">
                                <td className="px-4 py-3">Lucía Herrera</td>
                                <td className="px-4 py-3">PT-0003</td>
                                <td className="px-4 py-3">2024-11-21</td>
                                <td className="px-4 py-3 text-red-400">Inactive</td>
                                <td className="px-4 py-3">Treatment paused</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* =========================
         Patient Record (Mock Preview)
         ========================= */}
            <section className="mb-20">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Patient Clinical Record (Preview)
                </h3>

                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-medium">María González</h4>
                        <p className="text-sm text-neutral-400">
                            Patient ID: PT-0001 · Active
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 text-sm text-neutral-300">
                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">General Info</h5>
                            <p>Age: 34</p>
                            <p>Gender: Female</p>
                            <p>Primary Clinic: Downtown</p>
                        </div>

                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Clinical Summary</h5>
                            <p>Last Procedure: Cleaning</p>
                            <p>Ongoing Treatment: None</p>
                            <p>Risk Flags: None</p>
                        </div>

                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Notes</h5>
                            <p>
                                Patient presents good oral health. Recommended routine
                                six-month follow-up.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================
         Demo Context
         ========================= */}
            <section className="border-t border-neutral-800 pt-8 text-xs text-neutral-500">
                <p>
                    Patient data shown is fictional and for demonstration purposes only.
                    No real clinical information is stored or processed.
                </p>
            </section>

        </main>
    );
}
