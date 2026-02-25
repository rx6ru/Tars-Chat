import { ChatLayoutWrapper } from "@/components/chat/ChatLayoutWrapper";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ChatLayoutWrapper>
            {children}
        </ChatLayoutWrapper>
    );
}
