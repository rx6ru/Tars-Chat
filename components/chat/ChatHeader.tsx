import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { Users, ArrowLeft } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ConversationWithDetails extends Doc<"conversations"> {
    otherMember?: Doc<"users"> | null;
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
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#1E1530] bg-[#0F0A1A] px-4 shadow-sm">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="md:hidden text-white hover:bg-[#1A1128] hover:text-[#C084FC]">
                    <Link href="/">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div className="relative">
                    <Avatar className="h-10 w-10 border border-[#1E1530] bg-[#1A1128]">
                        {imageUrl ? (
                            <AvatarImage src={imageUrl} alt={name || "User"} />
                        ) : isGroup ? (
                            <div className="flex h-full w-full items-center justify-center text-[#6D33AB]">
                                <Users className="h-5 w-5" />
                            </div>
                        ) : (
                            <AvatarFallback className="bg-[#1A1128] text-white">
                                {(name || "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    {isOnline && (
                        <div className="absolute bottom-0 right-0">
                            <OnlineDot isOnline={isOnline} />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-white">{name}</span>
                    {/* Add typing status here later */}
                </div>
            </div>
        </div>
    );
}
