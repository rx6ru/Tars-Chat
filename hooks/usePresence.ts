import { useEffect } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

export function usePresence() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const setOnline = useMutation(api.presence?.setOnline || ("" as "mutation"));
    const setOffline = useMutation(api.presence?.setOffline || ("" as "mutation"));
    const storeUser = useMutation(api.users.storeUser);

    useEffect(() => {
        console.log("usePresence: isAuthenticated =", isAuthenticated);
        if (isAuthenticated) {
            console.log("usePresence: calling storeUser...");
            storeUser()
                .then((res) => console.log("usePresence: storeUser success =", res))
                .catch((err) => console.error("usePresence: storeUser error =", err));
        }
    }, [storeUser, isAuthenticated]);

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
    }, [setOffline, setOnline]);
}
