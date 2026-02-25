import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageTimestamp } from "@/components/shared/MessageTimestamp";
import { Reply, Trash2, Smile } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { EMOJI_REACTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

interface MessageBubbleProps {
    message: MessageWithSender;
    isGroup?: boolean;
    onReply?: (message: MessageWithSender) => void;
}

export function MessageBubble({ message, isGroup, onReply }: MessageBubbleProps) {
    const me = useQuery(api.users.getMe);
    const deleteMessage = useMutation(api.messages.deleteMessage);
    const toggleReaction = useMutation(api.reactions.toggleReaction);
    const reactions = useQuery(api.reactions.getReactionsForMessage, { messageId: message._id });
    const isMine = me?._id === message.senderId;

    if (!me) return null;

    const groupedReactions = reactions?.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = { count: 0, me: false, users: [] };
        }
        acc[reaction.emoji].count++;
        if (reaction.isMe) acc[reaction.emoji].me = true;
        acc[reaction.emoji].users.push(reaction.userName);
        return acc;
    }, {} as Record<string, { count: number, me: boolean, users: string[] }>);

    return (
        <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"} motion-preset-slide-up motion-duration-200 mb-2`}>
            <div className={cn(
                "group flex w-fit max-w-[85%] gap-2",
                isMine ? "flex-row-reverse" : "flex-row"
            )}>

                {/* Avatar for received messages */}
                {!isMine && (
                    <Avatar className="h-8 w-8 shrink-0 mt-auto border-none bg-t-bg-item">
                        <AvatarImage src={message.sender.imageUrl} alt={message.sender.name} />
                        <AvatarFallback className="bg-t-bg-item text-xs text-t-text-mid font-medium">
                            {message.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )}

                {/* Message Content Bubble Container */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className={cn(
                        "relative flex flex-col rounded-2xl px-4 py-2",
                        isMine
                            ? "bg-t-bg-bubble-sent text-t-text-hi rounded-br-[4px]"
                            : "bg-t-bg-bubble-recv text-t-text-hi rounded-bl-[4px]"
                    )}>

                        {/* Sender Name in Group Chats */}
                        {!isMine && isGroup && (
                            <div className="text-[11px] font-semibold text-t-accent-text mb-0.5 ml-1">
                                {message.sender.name}
                            </div>
                        )}

                        {/* Reply Context (if any) */}
                        {message.replyToMessage && (
                            <div className={cn(
                                "mb-1 flex flex-col border-l-2 pl-2 text-xs",
                                isMine ? "border-t-text-mid" : "border-t-accent"
                            )}>
                                <span className="font-semibold opacity-80">
                                    {message.replyToMessage.senderName}
                                </span>
                                <span className="truncate opacity-70">
                                    {message.replyToMessage.content}
                                </span>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="text-sm break-words whitespace-pre-wrap">
                            {message.isDeleted ? (
                                <em className="text-t-text-mid">This message was deleted</em>
                            ) : (
                                message.content
                            )}
                        </div>

                        {/* Timestamp */}
                        <div className={`flex items-center gap-1 mt-1 justify-end opacity-70`}>
                            <MessageTimestamp
                                timestamp={message.createdAt}
                                className="text-[10px] text-t-text-mid"
                            />
                        </div>
                    </div>

                    {/* Reactions Display */}
                    {groupedReactions && Object.keys(groupedReactions).length > 0 && (
                        <div className={cn(
                            "flex flex-wrap gap-1 mt-1",
                            isMine ? "justify-end" : "justify-start"
                        )}>
                            {Object.entries(groupedReactions).map(([emoji, data]) => (
                                <button
                                    key={emoji}
                                    onClick={() => toggleReaction({ messageId: message._id, emoji })}
                                    className={cn(
                                        "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-colors",
                                        data.me
                                            ? "bg-t-bg-item border-t-accent text-t-text-hi"
                                            : "bg-t-bg-app border-t-border text-t-text-mid hover:border-t-accent/50 hover:bg-t-bg-item"
                                    )}
                                    title={data.users.join(", ")}
                                >
                                    <span>{emoji}</span>
                                    {data.count > 1 && <span>{data.count}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Bar (Hover) */}
                {!message.isDeleted && (
                    <div className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 mt-auto mb-2",
                        isMine ? "flex-row-reverse" : "flex-row"
                    )}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className="p-1.5 rounded-full bg-t-bg-app hover:bg-t-bg-item text-t-text-mid hover:text-t-text-hi transition-colors"
                                    title="React"
                                >
                                    <Smile className="h-4 w-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-fit p-1 bg-t-bg-sidebar border border-t-border flex gap-1 shadow-lg"
                                side="top"
                                align={isMine ? "end" : "start"}
                            >
                                {EMOJI_REACTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => toggleReaction({ messageId: message._id, emoji })}
                                        className="p-2 hover:bg-t-bg-item rounded-lg transition-colors text-xl"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </PopoverContent>
                        </Popover>

                        <button
                            onClick={() => onReply && onReply(message)}
                            className="p-1.5 rounded-full bg-t-bg-app hover:bg-t-bg-item text-t-text-mid hover:text-t-text-hi transition-colors"
                            title="Reply"
                        >
                            <Reply className="h-4 w-4" />
                        </button>

                        {isMine && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="p-1.5 rounded-full bg-t-bg-app hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-t-bg-app border border-t-border text-t-text-hi">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-t-text-mid">
                                            This action will remove the message content for everyone in the conversation.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-transparent border-t-border hover:bg-t-bg-item text-t-text-hi">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteMessage({ messageId: message._id }).catch(console.error)}
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
