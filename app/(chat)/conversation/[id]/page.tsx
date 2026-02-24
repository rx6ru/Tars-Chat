import { ChatPanel } from "@/components/chat/ChatPanel";
import { Id } from "@/convex/_generated/dataModel";

interface ChatPageProps {
    params: {
        id: Id<"conversations">;
    };
}

export default function ChatPage({ params }: ChatPageProps) {
    return (
        <ChatPanel conversationId={params.id} />
    );
}
