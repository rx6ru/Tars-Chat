"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: "#6D33AB",
                    colorBackground: "#111116",
                    colorInputBackground: "#1A1A22",
                },
                elements: {
                    card: "bg-[#111116] border border-[#2A2A33] shadow-xl",
                    userButtonPopoverFooter: "hidden",
                }
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
