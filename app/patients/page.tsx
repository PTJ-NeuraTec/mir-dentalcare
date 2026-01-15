
"use client";

import PatientsTable from "./_components/PatientsTable";
import NewPatientModal from "./_components/NewPatientModal";
import OdontogramSVG from "./_components/OdontogramSVG";
import ClinicalPanel from "./_components/ClinicalPanel";
import TreatmentPlan from "./_components/TreatmentPlan";

import { usePatientsDomain } from "./_domain/usePatientsDomain";

export default function PatientsPage() {
    const {
        // core state
        patients,
        activePatientIndex,
        setActivePatientIndex,
        activePatient,

        // modal + form
        showModal,
        setShowModal,
        form,
        setForm,
        addPatient,

        // odontogram actions
        resetAll,
        upperTeeth,
        lowerTeeth,
        getSurfaceStatus,
        setSurface,
        resetTooth,

        // clinical panel
        selection,
        setSelection,
        clinicalPanel,
        getOrInitClinicalEntry,
        setClinicalEntry,
        DIAGNOSIS_OPTIONS,
        PROCEDURE_OPTIONS,
        statusBorder,
        statusFill,

        // treatment plan
        planFilter,
        setPlanFilter,
        planSearch,
        setPlanSearch,
        copiedPlan,
        copyPlanToClipboard,
        treatmentPlanView,
        treatmentPlanTotals,
        clearClinicalEntry,

        // block 4 actions
        setCostOverride,
        revertCostToAuto,
    } = usePatientsDomain();

    return (
        <main className="mx-auto max-w-7xl px-6 py-12 text-neutral-100">
            {/* Header */}
            <section className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Patients</h2>
                    <p className="mt-1 max-w-3xl text-sm text-neutral-300">
                        Patient registry with an interactive odontogram by tooth surfaces. This is production-grade UX scaffolding:
                        the data model persists later without rewriting UI logic.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={resetAll}
                        className="rounded border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-neutral-500"
                    >
                        Reset Odontogram
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
                    >
                        + New Patient
                    </button>
                </div>
            </section>

            {/* Patients Table */}
            <PatientsTable
                patients={patients}
                activePatientIndex={activePatientIndex}
                setActivePatientIndex={setActivePatientIndex}
                setSelection={setSelection}
            />

            {/* Odontogram */}
            <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-xl font-medium">Odontogram · {activePatient.name}</h3>
                        <p className="mt-1 text-xs text-neutral-400">
                            Click any surface to cycle: <span className="text-neutral-200">normal</span> →{" "}
                            <span className="text-red-300">alert</span> → <span className="text-green-300">treated</span>. Click the
                            small dot on a tooth to reset that tooth.
                        </p>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ background: statusFill("normal") }} />
                            Normal
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ background: statusFill("alert") }} />
                            Alert
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ background: statusFill("treated") }} />
                            Treated
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-400">
                            Surfaces: O (Occlusal), M (Mesial), D (Distal), B (Buccal), L (Lingual)
                        </span>
                    </div>
                </div>

                {/* SVG */}
                <OdontogramSVG
                    upperTeeth={upperTeeth}
                    lowerTeeth={lowerTeeth}
                    getSurfaceStatus={getSurfaceStatus}
                    setSurface={setSurface}
                    resetTooth={resetTooth}
                />

                {/* Clinical Panel */}
                <ClinicalPanel
                    selection={selection}
                    clinicalPanel={clinicalPanel}
                    activePatient={activePatient}
                    getOrInitClinicalEntry={getOrInitClinicalEntry}
                    DIAGNOSIS_OPTIONS={DIAGNOSIS_OPTIONS}
                    PROCEDURE_OPTIONS={PROCEDURE_OPTIONS}
                    setClinicalEntry={setClinicalEntry}
                    statusBorder={statusBorder}
                />

                {/* Treatment Plan */}
                <TreatmentPlan
                    activePatient={activePatient}
                    planFilter={planFilter}
                    setPlanFilter={setPlanFilter}
                    planSearch={planSearch}
                    setPlanSearch={setPlanSearch}
                    copiedPlan={copiedPlan}
                    copyPlanToClipboard={copyPlanToClipboard}
                    treatmentPlanView={treatmentPlanView}
                    treatmentPlanTotals={treatmentPlanTotals}
                    setSelection={setSelection}
                    clearClinicalEntry={clearClinicalEntry}
                    setCostOverride={setCostOverride}
                    revertCostToAuto={revertCostToAuto}
                />

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs text-neutral-400">Interaction model</p>
                        <p className="mt-1 text-sm text-neutral-200">
                            Surface-level states (O/M/D/B/L) are stored per tooth and per patient.
                        </p>
                    </div>
                    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs text-neutral-400">Production path</p>
                        <p className="mt-1 text-sm text-neutral-200">
                            Tomorrow’s demo uses this UI. Later we swap only the SVG shapes for realistic anatomy — same data model,
                            same logic.
                        </p>
                    </div>
                    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs text-neutral-400">Clinical credibility</p>
                        <p className="mt-1 text-sm text-neutral-200">
                            Decision-makers see a real odontogram workflow: not a toy grid, but tooth surfaces that behave like a
                            serious system.
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-xs text-neutral-500">
                    Demo mode: all odontogram data is in-memory (no backend, no persistence). This is intentional and aligns with
                    the approved demo principles.
                </p>
            </section>

            {/* New Patient Modal */}
            <NewPatientModal
                showModal={showModal}
                setShowModal={setShowModal}
                form={form}
                setForm={setForm}
                addPatient={addPatient}
            />
        </main>
    );
}
