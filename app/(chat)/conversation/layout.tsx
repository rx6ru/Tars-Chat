import { Sidebar } from "@/components/sidebar/Sidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#0F0A1A]">
            {/* Desktop Sidebar (hidden on mobile when inside a chat, handled via responsive classes later) */}
            <div className="hidden md:flex flex-col w-80 h-full border-r border-[#1E1530]">
                <Sidebar />
            </div>

            {/* Main Chat Area */}
            <main className="flex flex-1 flex-col h-full bg-[#0F0A1A]">
                {children}
            </main>
        </div>
    );
}
