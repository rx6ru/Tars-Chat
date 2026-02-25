import { ChatPanel } from "@/components/chat/ChatPanel";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Id } from "@/convex/_generated/dataModel";

interface ChatPageProps {
    params: {
        id: Id<"conversations">;
    };
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { id } = await params;
    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Sidebar hidden on mobile when in a conversation */}
            <div className="hidden md:flex md:w-[244px] h-full border-r border-t-border flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 h-full overflow-hidden">
                <ChatPanel conversationId={id} />
            </main>
        </div>
    );
}
