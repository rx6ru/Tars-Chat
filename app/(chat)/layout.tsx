export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-t-bg-app text-t-text-hi">
            {children}
        </div>
    );
}
