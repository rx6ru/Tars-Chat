import { UserButton } from "@clerk/nextjs";

export function SidebarHeader() {
    return (
        <div className="flex items-center justify-between p-4 border-b border-[#1E1530]">
            <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
            <UserButton
                appearance={{
                    elements: {
                        userButtonAvatarBox: "h-8 w-8 rounded-full ring-2 ring-[#1E1530] hover:ring-[#6D33AB] transition-all",
                    }
                }}
            />
        </div>
    );
}
