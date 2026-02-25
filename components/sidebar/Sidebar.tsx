"use client";

import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { ConversationList } from "./ConversationList";
import { UserList } from "./UserList";

export function Sidebar() {
    const [view, setView] = useState<"conversations" | "users">("conversations");

    return (
        <aside className="relative flex h-full w-full md:max-w-[244px] flex-col overflow-hidden border-r border-t-border bg-t-bg-sidebar">
            <SidebarHeader />
            <div className="hidden md:flex flex-col border-b border-t-border pb-2">
                <SidebarSearch />
            </div>
            <div className="p-3 flex gap-2">
                <button
                    onClick={() => setView("conversations")}
                    className={`flex-1 text-xs font-medium uppercase tracking-wider py-1.5 rounded-md transition ${view === "conversations" ? "bg-t-bg-item-active text-t-text-hi" : "bg-transparent text-t-text-mid hover:bg-t-bg-item hover:text-t-text-hi"
                        }`}
                >
                    Chats
                </button>
                <button
                    onClick={() => setView("users")}
                    className={`flex-1 text-xs font-medium uppercase tracking-wider py-1.5 rounded-md transition ${view === "users" ? "bg-t-bg-item-active text-t-text-hi" : "bg-transparent text-t-text-mid hover:bg-t-bg-item hover:text-t-text-hi"
                        }`}
                >
                    Users
                </button>
            </div>

            {view === "conversations" ? <ConversationList /> : <UserList />}
        </aside>
    );
}
