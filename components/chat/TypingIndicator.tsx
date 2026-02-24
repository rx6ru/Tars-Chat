import { Doc } from "@/convex/_generated/dataModel";

interface TypingIndicatorProps {
    typingUsers: Doc<"users">[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
    if (typingUsers.length === 0) return null;

    const names = typingUsers.map((u) => u.name);
    let text = "";
    if (names.length === 1) {
        text = `${names[0]} is typing`;
    } else if (names.length === 2) {
        text = `${names[0]} and ${names[1]} are typing`;
    } else {
        text = "Several people are typing";
    }

    return (
        <div className="flex items-center gap-2 px-6 py-2 pb-0 text-sm italic text-muted-foreground motion-preset-fade motion-duration-300">
            <span>{text}</span>
            <div className="flex gap-1 items-center justify-center mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground motion-preset-blink motion-duration-1000"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground motion-preset-blink motion-duration-1000 motion-delay-200"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground motion-preset-blink motion-duration-1000 motion-delay-400"></div>
            </div>
        </div>
    );
}
