"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: "#6D33AB", // brand-primary
                    colorBackground: "#1A1128", // popover
                    colorText: "#ffffff",
                    colorInputBackground: "#0F0A1A", // background
                    colorInputText: "#ffffff",
                    colorDanger: "#FB7185", // brand-rose
                },
                elements: {
                    card: "bg-[#1A1128] border border-[#1E1530] shadow-xl",
                    headerTitle: "text-white",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "border-[#1E1530] hover:bg-[#1E1530] text-white",
                    socialButtonsBlockButtonText: "text-white",
                    dividerLine: "bg-[#1E1530]",
                    dividerText: "text-muted-foreground",
                    formFieldLabel: "text-white",
                    formFieldInput: "bg-[#0F0A1A] border-[#1E1530] text-white focus:border-[#6D33AB]",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-[#22D3EE] hover:text-[#22D3EE]/80", // brand-cyan
                    userButtonPopoverActionButtonText: "text-white font-medium",
                    userButtonPopoverActionButtonIcon: "text-white",
                    userButtonPopoverFooter: "hidden", // Hide the "Secured by Clerk" footer if requested or just ensure it's readable. Keeping for now but ensuring text is okay isn't possible with just CSS classes if it's deeply nested.
                    userButtonBox: "flex-row-reverse", // Optional: just cleaning up
                    navbarButton: "text-muted-foreground hover:text-white transition-colors",
                    actionCard: "bg-[#0F0A1A] border-[#1E1530]",
                }
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
