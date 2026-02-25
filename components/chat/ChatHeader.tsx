import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { Users, ArrowLeft } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ConversationWithDetails extends Doc<"conversations"> {
    otherMember?: Doc<"users"> | null;
    memberCount?: number;
}

interface ChatHeaderProps {
    conversation: ConversationWithDetails;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
    const isGroup = conversation.isGroup;
    const name = isGroup ? conversation.name : conversation.otherMember?.name || "Unknown User";
    const imageUrl = !isGroup ? conversation.otherMember?.imageUrl : undefined;
    const isOnline = !isGroup ? conversation.otherMember?.isOnline : false;

    return (
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-t-border bg-t-bg-app px-4">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="md:hidden text-t-text-hi hover:bg-t-bg-item hover:text-t-text-hi">
                    <Link href="/">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div className="relative">
                    <Avatar className="h-10 w-10 border border-t-border bg-t-bg-item">
                        {imageUrl ? (
                            <AvatarImage src={imageUrl} alt={name || "User"} />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-t-bg-item text-t-text-mid font-medium text-sm">
                                {(name || "?").charAt(0).toUpperCase()}
                            </div>
                        )}
                    </Avatar>
                    {isOnline && (
                        <div className="absolute bottom-0 right-0">
                            <OnlineDot isOnline={isOnline} />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-t-text-hi text-sm tracking-tight">{name}</span>
                    {isGroup && (
                        <span className="text-xs text-t-accent-text font-medium">
                            {conversation.memberCount} members
                        </span>
                    )}
                    {!isGroup && isOnline && (
                        <span className="text-xs text-t-green font-medium">Online</span>
                    )}
                </div>
            </div>
        </div>
    );
}
