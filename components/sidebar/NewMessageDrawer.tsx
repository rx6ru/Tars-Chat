"use client";

import { useState } from "react";
import { Search, MessageCirclePlus, X } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function NewMessageDrawer() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const searchResults = useQuery(api.users.searchUsers, { query });
    const getOrCreateDM = useMutation(api.conversations.getOrCreateDM);
    const router = useRouter();

    const onSelect = async (userId: string) => {
        try {
            const conversationId = await getOrCreateDM({ otherUserId: userId as any });
            setOpen(false);
            router.push(`/conversation/${conversationId}`);
        } catch (error) {
            console.error("Failed to start conversation:", error);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-white hover:bg-[#1E1530] hover:text-[#C084FC]"
                >
                    <MessageCirclePlus className="h-5 w-5" />
                    <span className="sr-only">New Message</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-[#1A1128] border-[#1E1530] text-white flex flex-col h-[85vh] outline-none">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1530]">
                    <DrawerTitle className="text-lg font-semibold">New Message</DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-[#1E1530] text-white rounded-full">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DrawerClose>
                </div>

                <div className="p-4 border-b border-[#1E1530]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9 bg-[#0F0A1A] border-[#1E1530] text-white focus-visible:ring-[#6D33AB]"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            // Autofocus doesn't work well directly in Drawer, often needs a slight delay
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="flex flex-col gap-1 p-2">
                            {!query ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Type a name to search for users...
                                </div>
                            ) : searchResults === undefined ? (
                                <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                                    Searching...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No users found matching "{query}"
                                </div>
                            ) : (
                                searchResults.map((user) => (
                                    <button
                                        key={user._id}
                                        onClick={() => onSelect(user._id)}
                                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-[#1E1530]/50 transition-colors"
                                    >
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border border-[#1E1530]">
                                                <AvatarImage src={user.imageUrl} alt={user.name} />
                                                <AvatarFallback className="bg-[#0F0A1A] text-white font-medium text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.isOnline && (
                                                <div className="absolute bottom-0 right-0">
                                                    <OnlineDot isOnline={user.isOnline} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col overflow-hidden">
                                            <span className="truncate text-base font-medium text-white">
                                                {user.name}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
