import { Sidebar } from "@/components/sidebar/Sidebar";

export default function ChatPage() {
    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Sidebar takes full width on mobile, 244px on desktop */}
            <div className="w-full md:w-[244px] h-full border-r border-t-border flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main empty chat area is hidden on mobile, visible on desktop */}
            <main className="hidden md:flex flex-1 flex-col items-center justify-center bg-t-bg-app">
                <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto p-8">
                    <div className="rounded-full bg-t-bg-item active border border-t-border p-4 text-t-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-t-text-hi">Tars Chat</h2>
                    <p className="text-t-text-mid">
                        Select a conversation or find a user to start messaging securely.
                    </p>
                </div>
            </main>
        </div>
    );
}
