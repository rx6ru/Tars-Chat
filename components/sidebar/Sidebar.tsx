"use client";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { ConversationList } from "./ConversationList";

export function Sidebar() {
    return (
        <aside className="relative flex h-full w-full max-w-[320px] flex-col overflow-hidden border-r border-[#1E1530] bg-[#1A1128]">
            <SidebarHeader />
            <div className="hidden md:flex flex-col">
                <SidebarSearch />
            </div>
            <div className="p-4 flex gap-2">
                <button className="flex-1 bg-[#1E1530] text-white text-xs font-semibold uppercase tracking-wider py-1.5 rounded-full hover:bg-[#1E1530]/80 transition">
                    Conversations
                </button>
            </div>

            <ConversationList />
        </aside>
    );
}
