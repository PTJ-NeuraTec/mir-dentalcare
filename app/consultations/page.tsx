export default function ConsultationsPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

            {/* =========================
         Page Header
         ========================= */}
            <section className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                    Consultations
                </h2>
                <p className="max-w-3xl text-sm text-neutral-300">
                    Structured clinical encounters designed to document diagnoses,
                    procedures, follow-ups, and professional accountability across visits.
                </p>
            </section>

            {/* =========================
         Consultations List (Mock)
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Consultation History
                </h3>

                <div className="overflow-hidden rounded-lg border border-neutral-800">
                    <table className="w-full border-collapse bg-neutral-900 text-sm">
                        <thead className="bg-neutral-950 text-neutral-400">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-left font-medium">Patient</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-left font-medium">Clinician</th>
                                <th className="px-4 py-3 text-left font-medium">Outcome</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-300">
                            <tr className="border-t border-neutral-800">
                                <td className="px-4 py-3">2025-01-12</td>
                                <td className="px-4 py-3">María González</td>
                                <td className="px-4 py-3">Routine Checkup</td>
                                <td className="px-4 py-3">Dr. A. Rivera</td>
                                <td className="px-4 py-3 text-green-400">Completed</td>
                            </tr>
                            <tr className="border-t border-neutral-800">
                                <td className="px-4 py-3">2024-12-03</td>
                                <td className="px-4 py-3">Carlos Méndez</td>
                                <td className="px-4 py-3">Post-Surgery Review</td>
                                <td className="px-4 py-3">Dr. L. Torres</td>
                                <td className="px-4 py-3 text-yellow-400">Follow-up Required</td>
                            </tr>
                            <tr className="border-t border-neutral-800">
                                <td className="px-4 py-3">2024-11-21</td>
                                <td className="px-4 py-3">Lucía Herrera</td>
                                <td className="px-4 py-3">Treatment Evaluation</td>
                                <td className="px-4 py-3">Dr. M. Salazar</td>
                                <td className="px-4 py-3 text-red-400">Paused</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* =========================
         Consultation Detail (Mock)
         ========================= */}
            <section className="mb-20">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Consultation Detail (Preview)
                </h3>

                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-medium">Routine Checkup</h4>
                        <p className="text-sm text-neutral-400">
                            María González · 2025-01-12 · Dr. A. Rivera
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 text-sm text-neutral-300">
                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Clinical Notes</h5>
                            <p>
                                No abnormalities detected. Patient maintains good oral hygiene.
                            </p>
                        </div>

                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Procedures</h5>
                            <p>Standard dental cleaning</p>
                            <p>Preventive evaluation</p>
                        </div>

                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Next Steps</h5>
                            <p>Routine six-month follow-up recommended.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================
         Demo Context
         ========================= */}
            <section className="border-t border-neutral-800 pt-8 text-xs text-neutral-500">
                <p>
                    Consultation data shown is fictional and intended solely to demonstrate
                    clinical workflow structure within the MIR Dental Care demo.
                </p>
            </section>

        </main>
    );
}
