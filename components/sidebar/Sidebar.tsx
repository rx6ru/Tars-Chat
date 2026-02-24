"use client";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { UserList } from "./UserList";

export function Sidebar() {
    return (
        <aside className="relative flex h-full w-full max-w-[320px] flex-col overflow-hidden border-r border-[#1E1530] bg-[#1A1128]">
            <SidebarHeader />
            <SidebarSearch />
            <div className="p-4 pb-2 border-b border-[#1E1530]">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    All Users
                </h3>
            </div>
            <UserList />
        </aside>
    );
}
