"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, LogIn, User, AlertTriangle } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { toast } from "sonner";

export default function SignIn() {
    const { theme } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if user is already signed in
        getSession().then((session) => {
            if (session) {
                router.push("/");
            }
        });
    }, [router]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signIn("google", {
                callbackUrl: "/",
                redirect: false,
            });

            if (result?.ok) {
                router.push("/");
            } else {
                console.error("Sign in failed:", result?.error);
            }
        } catch (error) {
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestMode = () => {
        router.push("/?guest=true");
    };

    return (
        <div
            className={`min-h-screen ${theme.colors.backgroundGradient} flex items-center justify-center p-3 sm:p-4`}
        >
            <div className="w-full max-w-sm sm:max-w-md">
                <div
                    className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-6 sm:p-8 backdrop-blur-sm`}
                >
                    <div className="text-center mb-8">
                        <div
                            className={`${theme.colors.primaryLight} rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                        >
                            <Calendar
                                className={`w-8 h-8 sm:w-10 sm:h-10 ${theme.colors.primaryText}`}
                            />
                        </div>
                        <h1
                            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mb-2 sm:mb-3`}
                        >
                            Day Planner
                        </h1>
                        <p
                            className={`${theme.colors.textSecondary} text-base sm:text-lg`}
                        >
                            Organize your day, achieve your goals
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-3 ${
                                theme.colors.primary
                            } text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg ${
                                theme.colors.primaryHover
                            } transition-all duration-200 focus:ring-2 ${
                                theme.colors.ring
                            } focus:ring-offset-2 shadow-lg hover:shadow-xl touch-manipulation ${
                                isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                            ) : (
                                <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                            {isLoading
                                ? "Signing in..."
                                : "Continue with Google"}
                        </button>

                        <div className="flex items-center space-x-3">
                            <div
                                className={`flex-1 h-px ${theme.colors.borderInput}`}
                            ></div>
                            <span
                                className={`text-sm ${theme.colors.textMuted}`}
                            >
                                OR
                            </span>
                            <div
                                className={`flex-1 h-px ${theme.colors.borderInput}`}
                            ></div>
                        </div>

                        <button
                            onClick={handleGuestMode}
                            className={`w-full flex items-center justify-center gap-3 ${theme.colors.progressBg} ${theme.colors.textSecondary} py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg hover:${theme.colors.borderInput} transition-all duration-200 focus:ring-2 ${theme.colors.ring} focus:ring-offset-2 shadow-md hover:shadow-lg touch-manipulation`}
                        >
                            <User className="w-5 h-5 sm:w-6 sm:h-6" />
                            Continue as Guest
                        </button>

                        <div className="flex items-center justify-center mt-6">
                            <button
                                onClick={() => {
                                    toast.warning("Guest Mode Notice", {
                                        description:
                                            "Your data will be stored locally and may be lost if you clear your browser data or use a different device.",
                                        duration: 6000,
                                    });
                                }}
                                className={`flex items-center gap-2 ${theme.colors.textMuted} hover:${theme.colors.textSecondary} transition-colors text-xs sm:text-sm touch-manipulation`}
                                title="Click for guest mode information"
                            >
                                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Guest Mode Info</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
