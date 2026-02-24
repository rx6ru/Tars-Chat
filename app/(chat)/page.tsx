import { Sidebar } from "@/components/sidebar/Sidebar";

export default function ChatPage() {
    return (
        <>
            <Sidebar />
            <main className="flex flex-1 flex-col items-center justify-center bg-[#0F0A1A]">
                <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto p-8">
                    <div className="rounded-full bg-[#1A1128] border border-[#1E1530] p-4 text-[#6D33AB]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Tars Chat</h2>
                    <p className="text-muted-foreground">
                        Select a conversation or find a user to start messaging securely.
                    </p>
                </div>
            </main>
        </>
    );
}
