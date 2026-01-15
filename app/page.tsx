import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">

      {/* =========================
         Intro / Storytelling
         ========================= */}
      <section className="mb-16">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">
          Digital Dental Management, Reimagined
        </h2>

        <p className="max-w-3xl text-sm text-neutral-300">
          MIR Dental Care is a modern Dental Management System designed to support
          complex clinical workflows, multi-clinic operations, and executive-level
          visibility — without sacrificing usability at chair-side.
        </p>
      </section>

      {/* =========================
         Clinical Workflow
         ========================= */}
      <section className="mb-16">
        <h3 className="mb-6 text-xl font-medium text-neutral-200">
          Clinical Workflow Overview
        </h3>

        <div className="grid gap-6 md:grid-cols-3">

          <Link href="/patients" className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition">
            <h4 className="mb-2 font-medium">Patients</h4>
            <p className="text-sm text-neutral-400">
              Centralized patient records with clinical history, treatments,
              imaging references, and longitudinal traceability.
            </p>
          </Link>

          <Link href="/consultations" className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition">
            <h4 className="mb-2 font-medium">Consultations</h4>
            <p className="text-sm text-neutral-400">
              Structured clinical encounters supporting diagnosis, procedures,
              follow-ups, and professional accountability.
            </p>
          </Link>

          <Link href="/special-cases" className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition">
            <h4 className="mb-2 font-medium">Special Cases</h4>
            <p className="text-sm text-neutral-400">
              Timeline-based case tracking for complex or long-term treatments,
              designed for continuity of care.
            </p>
          </Link>
        </div>
      </section>

      {/* =========================
         Operational Layer
         ========================= */}
      <section className="mb-16">
        <h3 className="mb-6 text-xl font-medium text-neutral-200">
          Operational & Administrative Layer
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <Link href="/schedule" className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition">
            <h4 className="mb-2 font-medium">Scheduling</h4>
            <p className="text-sm text-neutral-400">
              Visual agenda management aligned with clinical availability,
              resource planning, and patient flow optimization.
            </p>
          </Link>

          <Link href="/administration" className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition">
            <h4 className="mb-2 font-medium">Administration</h4>
            <p className="text-sm text-neutral-400">
              High-level operational metrics, cost indicators, and performance
              signals designed for management oversight.
            </p>
          </Link>
        </div>
      </section>

      {/* =========================
         Executive Layer
         ========================= */}
      <section className="mb-20">
        <h3 className="mb-6 text-xl font-medium text-neutral-200">
          Executive & Decision-Making View
        </h3>

        <Link href="/reports" className="block rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition">
          <h4 className="mb-2 font-medium">Reports & Dashboards</h4>
          <p className="text-sm text-neutral-400">
            Consolidated reporting views designed to support strategic decisions,
            financial visibility, and long-term clinic growth.
          </p>
        </Link>
      </section>

      {/* =========================
         Demo Context
         ========================= */}
      <section className="border-t border-neutral-800 pt-8 text-xs text-neutral-500">
        <p>
          This is a frontend-only interactive demo. No real patient data,
          authentication, or backend services are involved.
        </p>
        <p className="mt-1">
          Environment: demo.mirdentalcare.org · Last update: {new Date().toLocaleString()}
        </p>
      </section>

    </main>
  );
}
