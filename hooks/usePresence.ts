import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function usePresence() {
    const setOnline = useMutation(api.presence?.setOnline || ("" as any));
    const setOffline = useMutation(api.presence?.setOffline || ("" as any));

    useEffect(() => {
        if (!api.presence) return;

        // Set online when mounting
        let mounted = true;

        const updateOnline = () => {
            if (mounted) {
                setOnline().catch(console.error);
            }
        };

        const updateOffline = () => {
            if (mounted) {
                setOffline().catch(console.error);
            }
        };

        updateOnline();

        // Listen for visibility changes (tab switching, minimizing)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                updateOnline();
            } else {
                updateOffline();
            }
        };

        // Listen for window focus/blur
        const handleFocus = () => updateOnline();
        const handleBlur = () => updateOffline();

        // Listen for beforeunload (closing tab/window)
        const handleBeforeUnload = () => {
            updateOffline();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            mounted = false;
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            updateOffline();
        };
    }, []);
}
