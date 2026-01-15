export default function AdministrationPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

            {/* =========================
         Page Header
         ========================= */}
            <section className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                    Administration
                </h2>
                <p className="max-w-3xl text-sm text-neutral-300">
                    Operational and financial overview designed to support clinic
                    management, cost control, and performance monitoring.
                </p>
            </section>

            {/* =========================
         Key Metrics (Mock)
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Key Operational Metrics
                </h3>

                <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Daily Appointments</p>
                        <p className="mt-2 text-2xl font-semibold">24</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Chair Utilization</p>
                        <p className="mt-2 text-2xl font-semibold">78%</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Avg. Visit Duration</p>
                        <p className="mt-2 text-2xl font-semibold">42 min</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Cancellation Rate</p>
                        <p className="mt-2 text-2xl font-semibold text-yellow-400">6%</p>
                    </div>
                </div>
            </section>

            {/* =========================
         Financial Snapshot (Mock)
         ========================= */}
            <section className="mb-16">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Financial Snapshot
                </h3>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Estimated Daily Revenue</p>
                        <p className="mt-2 text-xl font-semibold">$4,800</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Operational Costs</p>
                        <p className="mt-2 text-xl font-semibold">$2,150</p>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                        <p className="text-xs text-neutral-400">Net Operational Margin</p>
                        <p className="mt-2 text-xl font-semibold text-green-400">
                            $2,650
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================
         Management Notes
         ========================= */}
            <section className="mb-20">
                <h3 className="mb-6 text-xl font-medium text-neutral-200">
                    Management Notes
                </h3>

                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
                    <p>
                        Administrative insights combine operational efficiency indicators
                        with financial estimates to provide decision-makers with a clear,
                        high-level understanding of clinic performance.
                    </p>
                    <p className="mt-2">
                        This view supports cost optimization, capacity planning, and strategic
                        growth analysis.
                    </p>
                </div>
            </section>

            {/* =========================
         Demo Context
         ========================= */}
            <section className="border-t border-neutral-800 pt-8 text-xs text-neutral-500">
                <p>
                    All metrics displayed are simulated and intended solely for
                    demonstration purposes within the MIR Dental Care demo.
                </p>
            </section>

        </main>
    );
}
