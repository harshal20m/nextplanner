"use client";

// src/components/App.jsx

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Planner from "./Planner";
import storage from "../utils/storage";
import { toast } from "sonner";

const App = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const guestMode = searchParams.get("guest");
        if (guestMode === "true") {
            setIsGuest(true);
            toast.warning("Guest Mode", {
                description:
                    "Your data will be stored locally and may be lost if you clear browser data.",
                duration: 5000,
            });
        }
        setIsLoading(false);
    }, [searchParams]);

    // Handle redirect to sign-in page
    useEffect(() => {
        if (!isLoading && status !== "loading" && !session && !isGuest) {
            router.push("/auth/signin");
        }
    }, [isLoading, status, session, isGuest, router]);

    const handleLogout = async () => {
        if (isGuest) {
            // Clear guest data
            storage.clearAllData();
            setIsGuest(false);
            toast.success("Guest session ended", {
                description: "All local data has been cleared.",
            });
            router.push("/");
        } else {
            // Only clear user session data, keep planner data in localStorage
            if (user?.id) {
                // Mark that this user has loaded data from server (prevents reload tricks)
                storage.markServerDataLoaded(user.id);
                // Clear only current user, not planner data
                storage.clearCurrentUser();
            }

            // Clear NextAuth related data
            localStorage.removeItem("next-auth.session-token");
            localStorage.removeItem("next-auth.csrf-token");
            localStorage.removeItem("next-auth.callback-url");

            // Clear only auth-related keys, not planner data
            Object.keys(localStorage).forEach((key) => {
                if (
                    key.startsWith("next-auth") ||
                    key === "planner-current-user"
                ) {
                    localStorage.removeItem(key);
                }
            });

            // Sign out from NextAuth
            await signOut({ callbackUrl: "/" });
        }
    };

    const createGuestUser = () => {
        const guestUser = {
            id: "guest_" + Date.now(),
            email: "guest@example.com",
            name: "Guest User",
            isGuest: true,
        };
        storage.setCurrentUser(guestUser);
        return guestUser;
    };

    // Show loading while checking authentication
    if (isLoading || status === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is not authenticated and not in guest mode, show loading (redirect will happen in useEffect)
    if (!session && !isGuest) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    // Get user data
    let user = null;
    if (session?.user) {
        user = {
            id: session.user.id || session.user.email,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
        };
        // Store user data in localStorage for SyncControls
        storage.setCurrentUser(user);
    } else if (isGuest) {
        user = createGuestUser();
    }

    return (
        <div className="App">
            {user && (
                <Planner
                    user={user}
                    onLogout={handleLogout}
                    isGuest={isGuest}
                />
            )}
        </div>
    );
};

export default App;
