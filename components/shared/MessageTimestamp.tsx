import { formatMessageTime } from "@/lib/timeUtils";

interface MessageTimestampProps {
    timestamp: number;
    className?: string;
}

export function MessageTimestamp({ timestamp, className = "" }: MessageTimestampProps) {
    return (
        <span className={`text-xs text-muted-foreground ${className}`}>
            {formatMessageTime(timestamp)}
        </span>
    );
}
