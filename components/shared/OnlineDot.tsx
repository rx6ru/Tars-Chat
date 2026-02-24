export function OnlineDot({ isOnline }: { isOnline: boolean }) {
    if (!isOnline) return null;

    return (
        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#1A1128]">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
        </span>
    );
}
