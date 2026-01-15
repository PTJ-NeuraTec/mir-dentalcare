export default function SchedulePage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

            {/* =========================
         Page Header
         ========================= */}
            <section className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                    Schedule
                </h2>
                <p className="max-w-3xl text-sm text-neutral-300">
                    Visual agenda designed to coordinate clinical availability, chair usage,
                    and patient flow across the day.
                </p>
            </section>

            {/* =========================
         Daily Agenda (Mock)
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Today · January 14, 2026
                </h3>

                <div className="grid grid-cols-12 gap-4 text-sm">

                    {/* Time Column */}
                    <div className="col-span-2 space-y-6 text-neutral-400">
                        <div>08:00</div>
                        <div>09:00</div>
                        <div>10:00</div>
                        <div>11:00</div>
                        <div>12:00</div>
                        <div>13:00</div>
                        <div>14:00</div>
                        <div>15:00</div>
                        <div>16:00</div>
                    </div>

                    {/* Chair 1 */}
                    <div className="col-span-5 space-y-4">
                        <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                            <h4 className="font-medium">Chair 1 · Dr. A. Rivera</h4>
                            <p className="text-xs text-neutral-400">
                                08:00 – 09:00 · María González · Routine Checkup
                            </p>
                        </div>

                        <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                            <h4 className="font-medium">Chair 1 · Dr. A. Rivera</h4>
                            <p className="text-xs text-neutral-400">
                                10:00 – 11:30 · Carlos Méndez · Post-Surgery Review
                            </p>
                        </div>

                        <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                            <h4 className="font-medium">Chair 1 · Dr. A. Rivera</h4>
                            <p className="text-xs text-neutral-400">
                                14:00 – 15:00 · Lucía Herrera · Orthodontic Adjustment
                            </p>
                        </div>
                    </div>

                    {/* Chair 2 */}
                    <div className="col-span-5 space-y-4">
                        <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                            <h4 className="font-medium">Chair 2 · Dr. L. Torres</h4>
                            <p className="text-xs text-neutral-400">
                                09:00 – 10:30 · New Patient · Initial Assessment
                            </p>
                        </div>

                        <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                            <h4 className="font-medium">Chair 2 · Dr. L. Torres</h4>
                            <p className="text-xs text-neutral-400">
                                11:30 – 12:30 · Follow-up · Periodic Evaluation
                            </p>
                        </div>

                        <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                            <h4 className="font-medium">Chair 2 · Dr. L. Torres</h4>
                            <p className="text-xs text-neutral-400">
                                15:00 – 16:00 · Available Slot
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* =========================
         Operational Context
         ========================= */}
            <section className="mb-20">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Operational Notes
                </h3>

                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                    <p>
                        The agenda view illustrates chair-level scheduling, clinician
                        allocation, and patient flow management. This mock layout represents
                        the operational layer of MIR Dental Care.
                    </p>
                </div>
            </section>

            {/* =========================
         Demo Context
         ========================= */}
            <section className="border-t border-neutral-800 pt-8 text-xs text-neutral-500">
                <p>
                    Schedule data shown is fictional and intended solely to demonstrate
                    operational workflow visualization within the MIR Dental Care demo.
                </p>
            </section>

        </main>
    );
}
