"use client";

import { useState } from "react";
import { Search, MessageCirclePlus, X, Users, Check } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function NewMessageDrawer() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<Id<"users">[]>([]);

    const searchResults = useQuery(api.users.searchUsers, { query });
    const getOrCreateDM = useMutation(api.conversations.getOrCreateDM);
    const createGroup = useMutation(api.conversations.createGroup);
    const router = useRouter();

    const onSelectDM = async (userId: string) => {
        try {
            const conversationId = await getOrCreateDM({ otherUserId: userId as Id<"users"> });
            setOpen(false);
            router.push(`/conversation/${conversationId}`);
        } catch (error) {
            console.error("Failed to start conversation:", error);
            toast.error("Failed to start conversation");
        }
    };

    const toggleMember = (userId: Id<"users">) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error("Please select at least one member");
            return;
        }

        try {
            const conversationId = await createGroup({
                name: groupName,
                memberIds: selectedMembers,
            });
            setOpen(false);
            setGroupName("");
            setSelectedMembers([]);
            router.push(`/conversation/${conversationId}`);
            toast.success("Group created!");
        } catch (error) {
            console.error("Failed to create group:", error);
            toast.error("Failed to create group");
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-t-bg-item hover:text-t-accent-text"
                >
                    <MessageCirclePlus className="h-5 w-5" />
                    <span className="sr-only">New Message</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-t-bg-item border-t-border text-white flex flex-col h-[85vh] outline-none">
                <div className="flex items-center justify-between px-4 py-3 border-b border-t-border">
                    <DrawerTitle className="text-lg font-semibold">New Message</DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-t-bg-item-active text-t-text-hi rounded-full">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DrawerClose>
                </div>

                <Tabs defaultValue="dm" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 py-2 border-b border-t-border">
                        <TabsList className="grid w-full grid-cols-2 bg-t-bg-app">
                            <TabsTrigger value="dm">Direct Message</TabsTrigger>
                            <TabsTrigger value="group">New Group</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="dm" className="flex-1 flex flex-col overflow-hidden m-0">
                        <div className="p-4 border-b border-t-border">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9 bg-t-bg-app border-t-border text-white focus-visible:ring-t-accent"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="flex flex-col gap-1 p-2">
                                    {searchResults === undefined ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                                            Loading...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            {query ? `No users found matching "${query}"` : "No other users available"}
                                        </div>
                                    ) : (
                                        searchResults.map((user) => (
                                            <button
                                                key={user._id}
                                                onClick={() => onSelectDM(user._id)}
                                                className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-t-bg-item-active transition-colors"
                                            >
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 border border-t-border bg-t-bg-item">
                                                        <AvatarImage src={user.imageUrl} alt={user.name} />
                                                        <AvatarFallback className="bg-transparent text-white font-medium text-lg">
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
                    </TabsContent>

                    <TabsContent value="group" className="flex-1 flex flex-col overflow-hidden m-0">
                        <div className="p-4 space-y-4 border-b border-t-border">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Group Name</label>
                                <Input
                                    placeholder="Enter group name..."
                                    className="bg-t-bg-app border-t-border text-white focus-visible:ring-t-accent"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Add Members</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        className="pl-9 bg-t-bg-app border-t-border text-white focus-visible:ring-t-accent"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {selectedMembers.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {selectedMembers.map(id => {
                                        const user = searchResults?.find(u => u._id === id);
                                        if (!user) return null;
                                        return (
                                            <Badge
                                                key={id}
                                                variant="secondary"
                                                className="bg-t-accent text-white hover:bg-t-accent/80 gap-1 pr-1"
                                            >
                                                {user.name}
                                                <button onClick={() => toggleMember(id)}>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="flex flex-col gap-1 p-2">
                                    {!query ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            Search for users to add to the group...
                                        </div>
                                    ) : searchResults === undefined ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                                            Searching...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No users found matching &quot;{query}&quot;
                                        </div>
                                    ) : (
                                        searchResults.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center gap-3 rounded-lg p-3 hover:bg-t-bg-item-active transition-colors cursor-pointer"
                                                onClick={() => toggleMember(user._id)}
                                            >
                                                <Checkbox
                                                    checked={selectedMembers.includes(user._id)}
                                                    onCheckedChange={() => toggleMember(user._id)}
                                                    className="border-t-border data-[state=checked]:bg-t-accent data-[state=checked]:border-t-accent"
                                                />
                                                <Avatar className="h-10 w-10 border border-t-border bg-t-bg-item">
                                                    <AvatarImage src={user.imageUrl} alt={user.name} />
                                                    <AvatarFallback className="bg-transparent text-white">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="flex-1 truncate text-base font-medium text-white">
                                                    {user.name}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="p-4 border-t border-t-border">
                            <Button
                                className="w-full bg-t-accent hover:bg-t-accent/80 text-white"
                                disabled={!groupName.trim() || selectedMembers.length === 0}
                                onClick={handleCreateGroup}
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Create Group ({selectedMembers.length} members)
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DrawerContent>
        </Drawer>
    );
}
