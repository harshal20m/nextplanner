"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Quote, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";

const DailyThought = ({ userId }) => {
    const { theme } = useTheme();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canRefresh, setCanRefresh] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showTimeLeft, setShowTimeLeft] = useState(false);

    const QUOTE_REFRESH_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours in ms

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "https://api.realinspire.live/v1/quotes/random"
            );
            if (!response.ok) throw new Error("Failed to fetch quote");

            const data = await response.json();
            if (data && data.length > 0) {
                setQuote(data[0]);
                // Save quote and timestamp to localStorage
                localStorage.setItem(
                    `dailyQuote_${userId}`,
                    JSON.stringify({
                        quote: data[0],
                        timestamp: Date.now(),
                    })
                );

                // Set refresh cooldown
                localStorage.setItem(
                    `lastQuoteRefresh_${userId}`,
                    Date.now().toString()
                );
                setCanRefresh(false);
                setTimeLeft(Math.ceil(QUOTE_REFRESH_INTERVAL / 1000));

                toast.success("New inspiration loaded!", {
                    description: "Fresh motivation for your day",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            toast.error("Failed to load inspiration", {
                description: "Please try again later",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const loadStoredQuote = () => {
        try {
            const stored = localStorage.getItem(`dailyQuote_${userId}`);
            if (stored) {
                const { quote: storedQuote } = JSON.parse(stored);
                setQuote(storedQuote);
                return storedQuote; // Return the quote to check if it exists
            }
        } catch (error) {
            console.error("Error loading stored quote:", error);
        }
        return null; // Return null if no stored quote
    };

    const checkRefreshCooldown = () => {
        try {
            const lastRefresh = parseInt(
                localStorage.getItem(`lastQuoteRefresh_${userId}`) || "0",
                10
            );
            const now = Date.now();
            const remaining = QUOTE_REFRESH_INTERVAL - (now - lastRefresh);

            if (remaining > 0) {
                setCanRefresh(false);
                setTimeLeft(Math.ceil(remaining / 1000));
            } else {
                setCanRefresh(true);
                setTimeLeft(0);
            }
        } catch (error) {
            console.error("Error checking refresh cooldown:", error);
        }
    };

    useEffect(() => {
        // Load stored quote first
        const storedQuote = loadStoredQuote();

        // Check refresh cooldown
        checkRefreshCooldown();

        // Only fetch if no stored quote exists
        if (!storedQuote) {
            fetchQuote();
        }
    }, [userId]);

    useEffect(() => {
        // Timer for refresh cooldown
        if (!canRefresh && timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setCanRefresh(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [canRefresh, timeLeft]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    if (!quote) {
        return (
            <div
                className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-4 sm:p-6 backdrop-blur-sm`}
            >
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className={`ml-2 ${theme.colors.textSecondary}`}>
                        Loading inspiration...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
            <div
                className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-4 sm:p-6 backdrop-blur-sm relative overflow-hidden`}
            >
                {/* Decorative background elements */}
                <div className="absolute top-2 right-2 opacity-20">
                    <Sparkles
                        className={`w-6 h-6 ${theme.colors.primaryText}`}
                    />
                </div>

                <div className="flex items-start space-x-3">
                    <div
                        className={`${theme.colors.primaryLight} rounded-full p-2 shrink-0`}
                    >
                        <Quote
                            className={`w-5 h-5 ${theme.colors.primaryText}`}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-sm font-semibold ${theme.colors.text} mb-2`}
                        >
                            Daily Inspiration
                        </h3>

                        <blockquote
                            className={`${theme.colors.text} text-sm sm:text-base leading-relaxed mb-3 italic relative overflow-hidden`}
                        >
                            <span className="relative z-10">
                                "{quote.content}"
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent animate-shimmer"></div>
                        </blockquote>

                        <cite
                            className={`${theme.colors.textSecondary} text-xs sm:text-sm font-medium`}
                        >
                            — {quote.author}
                        </cite>
                    </div>

                    <div className="shrink-0">
                        <button
                            onClick={() => {
                                if (canRefresh) {
                                    fetchQuote();
                                } else {
                                    setShowTimeLeft(!showTimeLeft);
                                }
                            }}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-colors touch-manipulation ${
                                canRefresh && !loading
                                    ? `${theme.colors.hoverBg} ${theme.colors.textSecondary} ${theme.colors.primaryTextHover}`
                                    : `cursor-pointer ${theme.colors.textMuted} hover:${theme.colors.hoverBg}`
                            }`}
                            title={
                                canRefresh
                                    ? "Get new inspiration"
                                    : "Click to see remaining time"
                            }
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${
                                    loading ? "animate-spin" : ""
                                }`}
                            />
                        </button>

                        {!canRefresh && showTimeLeft && (
                            <div
                                className={`text-xs ${theme.colors.textMuted} text-center mt-1 animate-fade-in`}
                            >
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DailyThought;
