import Link from "next/link";
import { MessageSquare, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0F0A1A] text-white overflow-hidden selection:bg-[#6D33AB]/30">
            {/* Header */}
            <header className="fixed top-0 w-full border-b border-[#1E1530] bg-[#0F0A1A]/80 backdrop-blur-md z-50">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D33AB]">
                            <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Tars Chat</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/sign-in" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Sign in
                        </Link>
                        <Button asChild className="bg-[#6D33AB] hover:bg-[#59298c] text-white">
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
                    {/* Subtle background glow */}
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6D33AB] to-[#22D3EE] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
                            Fast, secure communication for modern teams.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                            Tars Chat provides a sleek, zero-compromise real-time messaging experience. Designed for focused discussions, immediate syncs, and crystal clear cross-team collaboration.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button asChild size="lg" className="bg-[#6D33AB] hover:bg-[#59298c] text-white px-8">
                                <Link href="/chat">Join the Workspace</Link>
                            </Button>
                            <Link href="https://github.com/rx6ru/Tars-Chat" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors" target="_blank" rel="noopener noreferrer">
                                View Documentation <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 sm:py-32 bg-[#111116] border-t border-[#1E1530]">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-base font-semibold leading-7 text-[#22D3EE]">Professional Grade</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to collaborate</p>
                            <p className="mt-6 text-lg leading-8 text-gray-400">
                                Built on high-performance web architecture, Tars Chat delivers messages instantly without visual clutter.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                        <Zap className="h-5 w-5 flex-none text-[#22D3EE]" aria-hidden="true" />
                                        Lightning Fast
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                        <p className="flex-auto">Experience zero-latency messaging powered by real-time WebSocket protocol and instant database indexing.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                        <Shield className="h-5 w-5 flex-none text-[#6D33AB]" aria-hidden="true" />
                                        Secure & Private
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                        <p className="flex-auto">Enterprise-grade authentication and strict database row-level security completely isolates your workspace data.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                        <Users className="h-5 w-5 flex-none text-[#22D3EE]" aria-hidden="true" />
                                        Organized Groups
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                        <p className="flex-auto">Keep conversations context-rich with dedicated multi-user group channels and 1-on-1 direct messaging threads.</p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#1E1530] bg-[#0F0A1A]">
                <div className="mx-auto max-w-7xl px-6 py-12 flex items-center justify-between lg:px-8">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-400">Tars Chat Platform</span>
                    </div>
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; {new Date().getFullYear()} Tars Chat Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
