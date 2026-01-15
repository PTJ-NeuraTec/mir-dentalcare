export default function SpecialCasesPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

            {/* =========================
         Page Header
         ========================= */}
            <section className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                    Special Cases
                </h2>
                <p className="max-w-3xl text-sm text-neutral-300">
                    Longitudinal clinical cases requiring extended follow-up, multi-step
                    treatments, and cross-visit traceability over time.
                </p>
            </section>

            {/* =========================
         Timeline Overview
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Case Timeline Overview
                </h3>

                <div className="space-y-6 border-l border-neutral-800 pl-6">

                    {/* Timeline Item */}
                    <div className="relative">
                        <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500" />
                        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="font-medium">Orthodontic Treatment Initiation</h4>
                                <span className="text-xs text-neutral-400">2024-09-15</span>
                            </div>
                            <p className="text-sm text-neutral-400">
                                Initial assessment and treatment plan definition for long-term
                                orthodontic correction.
                            </p>
                            <p className="mt-2 text-xs text-neutral-500">
                                Patient: Lucía Herrera · Case ID: SC-1021
                            </p>
                        </div>
                    </div>

                    {/* Timeline Item */}
                    <div className="relative">
                        <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-yellow-500" />
                        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="font-medium">Mid-Treatment Evaluation</h4>
                                <span className="text-xs text-neutral-400">2024-11-21</span>
                            </div>
                            <p className="text-sm text-neutral-400">
                                Progress review showing partial alignment improvement. Adjustments
                                to treatment plan recommended.
                            </p>
                            <p className="mt-2 text-xs text-neutral-500">
                                Patient: Lucía Herrera · Case ID: SC-1021
                            </p>
                        </div>
                    </div>

                    {/* Timeline Item */}
                    <div className="relative">
                        <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500" />
                        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="font-medium">Treatment Stabilization Phase</h4>
                                <span className="text-xs text-neutral-400">2025-01-08</span>
                            </div>
                            <p className="text-sm text-neutral-400">
                                Structural stabilization achieved. Patient transitioned to
                                monitoring and retention phase.
                            </p>
                            <p className="mt-2 text-xs text-neutral-500">
                                Patient: Lucía Herrera · Case ID: SC-1021
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* =========================
         Case Summary
         ========================= */}
            <section className="mb-20">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Case Summary (Preview)
                </h3>

                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                    <div className="grid gap-6 md:grid-cols-3 text-sm text-neutral-300">
                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Patient</h5>
                            <p>Lucía Herrera</p>
                            <p>Case ID: SC-1021</p>
                        </div>

                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Case Type</h5>
                            <p>Orthodontic Long-Term Treatment</p>
                            <p>Status: Ongoing</p>
                        </div>

                        <div>
                            <h5 className="mb-1 font-medium text-neutral-200">Clinical Notes</h5>
                            <p>
                                Treatment progressing within expected parameters. Continued
                                monitoring required.
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
                    Special cases shown are fictional and illustrate longitudinal clinical
                    tracking capabilities within the MIR Dental Care demo.
                </p>
            </section>

        </main>
    );
}
