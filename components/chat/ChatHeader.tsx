import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { Users, ArrowLeft } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
                    <Link href="/chat">
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="text-xs text-t-accent-text font-medium hover:underline text-left">
                                    {conversation.memberCount} members
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-t-bg-app border-t-border">
                                <DialogHeader>
                                    <DialogTitle className="text-t-text-hi">Group Members</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 mt-4 max-h-[60vh] overflow-y-auto">
                                    <GroupMembersList conversationId={conversation._id} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    {!isGroup && isOnline && (
                        <span className="text-xs text-t-green font-medium">Online</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function GroupMembersList({ conversationId }: { conversationId: Doc<"conversations">["_id"] }) {
    const members = useQuery(api.conversations.getGroupMembers, { conversationId });

    if (members === undefined) {
        return <div className="text-sm text-t-text-mid animate-pulse p-4 text-center">Loading members...</div>;
    }

    if (members.length === 0) {
        return <div className="text-sm text-t-text-mid p-4 text-center">No members found.</div>;
    }

    return (
        <div className="flex flex-col gap-1">
            {members.map((member) => (
                <div key={member._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-t-bg-item transition-colors">
                    <div className="relative">
                        <Avatar className="h-8 w-8 border border-t-border">
                            {member.imageUrl ? (
                                <AvatarImage src={member.imageUrl} alt={member.name} className="object-cover" />
                            ) : (
                                <AvatarFallback className="bg-t-bg-item text-xs text-t-text-mid">
                                    {member.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        {member.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5">
                                <span className="flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-t-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-t-green border-[1.5px] border-t-bg-app"></span>
                                </span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium text-t-text-hi">{member.name}</span>
                </div>
            ))}
        </div>
    );
}
