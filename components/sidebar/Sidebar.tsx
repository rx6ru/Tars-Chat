"use client";

import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { ConversationList } from "./ConversationList";

export function Sidebar() {
    const [view, setView] = useState<"dms" | "groups">("dms");

    return (
        <aside className="relative flex h-full w-full md:max-w-[244px] flex-col overflow-hidden border-r border-t-border bg-t-bg-sidebar">
            <SidebarHeader />
            <div className="hidden md:flex flex-col border-b border-t-border pb-2">
                <SidebarSearch />
            </div>
            <div className="p-3 flex gap-2">
                <button
                    onClick={() => setView("dms")}
                    className={`flex-1 text-xs font-medium uppercase tracking-wider py-1.5 rounded-md transition ${view === "dms" ? "bg-t-bg-item-active text-t-text-hi" : "bg-transparent text-t-text-mid hover:bg-t-bg-item hover:text-t-text-hi"
                        }`}
                >
                    Chats
                </button>
                <button
                    onClick={() => setView("groups")}
                    className={`flex-1 text-xs font-medium uppercase tracking-wider py-1.5 rounded-md transition ${view === "groups" ? "bg-t-bg-item-active text-t-text-hi" : "bg-transparent text-t-text-mid hover:bg-t-bg-item hover:text-t-text-hi"
                        }`}
                >
                    Groups
                </button>
            </div>

            <ConversationList filter={view} />
        </aside>
    );
}
