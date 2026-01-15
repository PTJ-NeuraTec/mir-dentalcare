export default function Header() {
    return (
        <header className="w-full bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Brand + Claim */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        MIR Dental Care
                        <span className="ml-2 text-sm font-normal text-neutral-400">
                            Demo
                        </span>
                    </h1>

                    <p className="max-w-3xl text-sm text-neutral-300">
                        Digital Dental Management System designed for multi-clinic operations,
                        clinical traceability, and executive-level decision making.
                    </p>
                </div>

                {/* Context Line */}
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-400">
                    <span>Frontend demo — no real patient data</span>
                    <span>Architecture-first approach</span>
                    <span>Enterprise clinical workflow vision</span>
                </div>

            </div>
        </header>
    );
}
