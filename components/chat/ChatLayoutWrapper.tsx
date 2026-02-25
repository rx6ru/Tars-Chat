"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";

export function ChatLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRoot = pathname === "/" || pathname === "/chat";

    return (
        <div className="flex h-screen w-full overflow-hidden bg-t-bg-app text-t-text-hi">
            {/* Sidebar wrapper. On mobile: visible only if on root. On desktop: always visible. */}
            <div
                className={`flex-shrink-0 h-full border-r border-t-border
                    ${isRoot ? "w-full md:w-[244px]" : "hidden md:flex md:w-[244px]"}
                `}
            >
                <Sidebar />
            </div>

            {/* Main content area. On mobile: hidden if on root. On desktop: always visible. */}
            <main
                className={`flex-1 h-full overflow-hidden
                    ${isRoot ? "hidden md:flex" : "flex"}
                `}
            >
                {children}
            </main>
        </div>
    );
}
