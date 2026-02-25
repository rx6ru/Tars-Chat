import { ChatPanel } from "@/components/chat/ChatPanel";
import { Id } from "@/convex/_generated/dataModel";

interface ChatPageProps {
    params: {
        id: Id<"conversations">;
    };
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { id } = await params;
    return <ChatPanel conversationId={id} />;
}
