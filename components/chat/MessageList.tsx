import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

interface MessageWithSender {
    _id: Id<"messages">;
    content: string;
    senderId: Id<"users">;
    sender: {
        name: string;
        imageUrl: string;
    };
    replyToMessage?: {
        senderName: string;
        content: string;
    } | null;
    isDeleted: boolean;
    createdAt: number;
}

interface MessageListProps {
    messages: MessageWithSender[];
    conversationId: Id<"conversations">;
}

export function MessageList({ messages, conversationId }: MessageListProps) {
    if (messages.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center bg-[#0F0A1A]">
                <div className="rounded-full bg-[#1A1128] p-4 text-[#6D33AB]">
                    <MessageCircle className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">No messages yet</h3>
                    <p className="text-sm text-muted-foreground">Be the first to say something</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1 px-4 py-4 bg-[#0F0A1A]">
            <div className="flex flex-col gap-4 pb-4">
                {messages.map((message) => (
                    <MessageBubble key={message._id} message={message} />
                ))}
            </div>
        </ScrollArea>
    );
}
