import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="w-full border-b border-neutral-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Left: Main Navigation */}
                <ul className="flex items-center gap-8 text-sm font-medium text-neutral-700">

                    <li>
                        <Link href="/" className="hover:text-neutral-900">
                            Home
                        </Link>
                    </li>

                    <li className="relative group">
                        <span className="cursor-pointer hover:text-neutral-900">
                            Clinical
                        </span>
                        <ul className="absolute left-0 top-full z-10 mt-2 w-56 rounded-md border border-neutral-200 bg-white p-2 text-sm shadow-md opacity-0 group-hover:opacity-100 transition">
                            <li>
                                <Link href="/patients" className="block rounded px-3 py-2 hover:bg-neutral-100">
                                    Patients
                                </Link>
                            </li>
                            <li>
                                <Link href="/consultations" className="block rounded px-3 py-2 hover:bg-neutral-100">
                                    Consultations
                                </Link>
                            </li>
                            <li>
                                <Link href="/special-cases" className="block rounded px-3 py-2 hover:bg-neutral-100">
                                    Special Cases
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="relative group">
                        <span className="cursor-pointer hover:text-neutral-900">
                            Operations
                        </span>
                        <ul className="absolute left-0 top-full z-10 mt-2 w-56 rounded-md border border-neutral-200 bg-white p-2 text-sm shadow-md opacity-0 group-hover:opacity-100 transition">
                            <li>
                                <Link href="/schedule" className="block rounded px-3 py-2 hover:bg-neutral-100">
                                    Schedule
                                </Link>
                            </li>
                            <li>
                                <Link href="/administration" className="block rounded px-3 py-2 hover:bg-neutral-100">
                                    Administration
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="relative group">
                        <span className="cursor-pointer hover:text-neutral-900">
                            Executive
                        </span>
                        <ul className="absolute left-0 top-full z-10 mt-2 w-56 rounded-md border border-neutral-200 bg-white p-2 text-sm shadow-md opacity-0 group-hover:opacity-100 transition">
                            <li>
                                <Link href="/reports" className="block rounded px-3 py-2 hover:bg-neutral-100">
                                    Reports
                                </Link>
                            </li>
                        </ul>
                    </li>

                </ul>

                {/* Right: Context */}
                <div className="text-sm text-neutral-500">
                    MIR Dental Care · Interactive Demo
                </div>
            </div>
        </nav>
    );
}
