import { UserButton } from "@clerk/nextjs";
import { NewMessageDrawer } from "./NewMessageDrawer";

export function SidebarHeader() {
    return (
        <div className="h-16 flex items-center px-4 border-b border-t-border justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-t-text-hi font-medium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
            </div>
            <div className="flex items-center gap-4">
                <NewMessageDrawer />
                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "h-8 w-8 rounded-full ring-2 ring-t-border hover:ring-t-accent transition-all",
                        }
                    }}
                />
            </div>
        </div>
    );
}
