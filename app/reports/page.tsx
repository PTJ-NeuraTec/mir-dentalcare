export default function ReportsPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

            {/* =========================
         Page Header
         ========================= */}
            <section className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                    Reports
                </h2>
                <p className="max-w-3xl text-sm text-neutral-300">
                    Executive-level dashboards designed to provide consolidated visibility
                    across clinical operations, utilization, and financial performance.
                </p>
            </section>

            {/* =========================
         Executive KPIs (Mock)
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Executive KPIs
                </h3>

                <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Monthly Revenue</p>
                        <p className="mt-2 text-2xl font-semibold">$128,400</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Operational Margin</p>
                        <p className="mt-2 text-2xl font-semibold text-green-400">41%</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Chair Utilization</p>
                        <p className="mt-2 text-2xl font-semibold">81%</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Patient Growth (MoM)</p>
                        <p className="mt-2 text-2xl font-semibold text-green-400">+6.2%</p>
                    </div>
                </div>
            </section>

            {/* =========================
         Performance Summary
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Performance Summary
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                        <h4 className="mb-2 font-medium text-neutral-200">
                            Clinical Operations
                        </h4>
                        <p>
                            Appointment throughput and chair utilization remain within optimal
                            parameters, supporting sustained patient volume without
                            compromising care quality.
                        </p>
                        <p className="mt-2">
                            Follow-up compliance and treatment completion rates indicate strong
                            clinical continuity.
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                        <h4 className="mb-2 font-medium text-neutral-200">
                            Financial Performance
                        </h4>
                        <p>
                            Revenue growth is driven by improved scheduling efficiency and
                            increased treatment acceptance rates.
                        </p>
                        <p className="mt-2">
                            Operational margins reflect balanced cost control and resource
                            utilization.
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================
         Strategic Indicators
         ========================= */}
            <section className="mb-20">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Strategic Indicators
                </h3>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                        <h4 className="mb-1 font-medium text-neutral-200">
                            Capacity Planning
                        </h4>
                        <p>
                            Current utilization trends support expansion planning without
                            immediate infrastructure investment.
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                        <h4 className="mb-1 font-medium text-neutral-200">
                            Multi-Clinic Scalability
                        </h4>
                        <p>
                            Aggregated KPIs demonstrate readiness for multi-location operations
                            under a unified management model.
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                        <h4 className="mb-1 font-medium text-neutral-200">
                            Decision Support
                        </h4>
                        <p>
                            Consolidated reporting enables faster, data-informed executive
                            decisions with reduced operational ambiguity.
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================
         Demo Context
         ========================= */}
            <section className="border-t border-neutral-800 pt-8 text-xs text-neutral-500">
                <p>
                    All reports and KPIs displayed are simulated and provided exclusively
                    for demonstration purposes within the MIR Dental Care demo.
                </p>
            </section>

        </main>
    );
}
