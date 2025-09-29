"use client";

import React, { useState, useRef, useEffect } from "react";
import storage from "../utils/storage";
import { Settings, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";

const SyncControls = ({ onPlannerLoad, isGuest = false, user }) => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [canSync, setCanSync] = useState(true);
    const [canLoad, setCanLoad] = useState(true);
    const [syncTimeLeft, setSyncTimeLeft] = useState(0);
    const [loadTimeLeft, setLoadTimeLeft] = useState(0);
    const [isServerReady, setIsServerReady] = useState(false);
    const menuRef = useRef(null);

    const SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour in ms for sync
    const LOAD_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in ms for load

    const pingServer = async () => {
        try {
            const res = await fetch("/api/health", {
                method: "HEAD", // Use HEAD request to minimize data transfer
                cache: "no-cache",
            });
            if (res.ok) {
                setIsServerReady(true);
                localStorage.setItem("lastHealthCheck", Date.now().toString());
            } else {
                throw new Error("Health check failed");
            }
        } catch {
            console.warn("Server not ready, retrying in 5s...");
            setTimeout(pingServer, 5000); // Increased retry interval to reduce calls
        }
    };

    useEffect(() => {
        // Assume server is ready - only check when user actually tries to sync/load
        setIsServerReady(true);

        // Check sync interval
        const lastSync = parseInt(
            localStorage.getItem("lastSyncTime") || "0",
            10
        );
        const now = Date.now();
        const syncRemaining = SYNC_INTERVAL - (now - lastSync);
        if (syncRemaining > 0) {
            setCanSync(false);
            setSyncTimeLeft(Math.ceil(syncRemaining / 1000));
        }

        // Check load interval
        const lastLoad = parseInt(
            localStorage.getItem("lastLoadTime") || "0",
            10
        );
        const loadRemaining = LOAD_INTERVAL - (now - lastLoad);
        if (loadRemaining > 0) {
            setCanLoad(false);
            setLoadTimeLeft(Math.ceil(loadRemaining / 1000));
        }
    }, []);

    useEffect(() => {
        const intervals = [];

        // Sync timer
        if (!canSync && syncTimeLeft > 0) {
            const syncInterval = setInterval(() => {
                setSyncTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(syncInterval);
                        setCanSync(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            intervals.push(syncInterval);
        }

        // Load timer
        if (!canLoad && loadTimeLeft > 0) {
            const loadInterval = setInterval(() => {
                setLoadTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(loadInterval);
                        setCanLoad(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            intervals.push(loadInterval);
        }

        return () => intervals.forEach(clearInterval);
    }, [canSync, canLoad, syncTimeLeft, loadTimeLeft]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSync = async () => {
        if (isGuest) {
            toast.error("Sync not available", {
                description: "Guest users cannot sync data to the server.",
            });
            return;
        }

        if (!canSync) {
            toast.warning("Sync cooldown", {
                description: `Please wait ${Math.ceil(
                    syncTimeLeft / 60
                )} more minutes to sync.`,
            });
            return;
        }
        if (!user) {
            toast.error("No user logged in");
            return;
        }

        // Check server readiness only when user actually tries to sync
        if (!isServerReady) {
            toast.info("Checking server connection...");
            await pingServer();
            if (!isServerReady) {
                toast.error("Server unavailable", {
                    description: "Please try again later.",
                });
                return;
            }
        }

        const dates = storage.getAllPlannerDates(user.id);
        const planner = dates.reduce((acc, date) => {
            const dayData = storage.getPlannerData(user.id, date);
            acc[date] = dayData;
            return acc;
        }, {});

        const fullUserData = { user, planner };

        try {
            // Compress data before sending to reduce bandwidth
            const compressedData = JSON.stringify(fullUserData);
            const res = await fetch("/api/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Encoding": "gzip",
                },
                body: compressedData,
            });
            const data = await res.json();
            toast.success("Data synced successfully", {
                description: "Your planner data has been saved to the server.",
            });
            console.log("Sync Success:", data);

            localStorage.setItem("lastSyncTime", Date.now().toString());
            setCanSync(false);
            setSyncTimeLeft(Math.ceil(SYNC_INTERVAL / 1000));
        } catch (error) {
            console.error("Sync Error:", error);
            toast.error("Sync failed", {
                description:
                    "Unable to sync data to the server. Please try again.",
            });
        }
    };

    const handleLoad = async () => {
        if (isGuest) {
            toast.error("Load not available", {
                description: "Guest users cannot load data from the server.",
            });
            return;
        }

        if (!canLoad) {
            toast.warning("Load cooldown", {
                description: `Please wait ${Math.ceil(
                    loadTimeLeft / 3600
                )} more hours to load data.`,
            });
            return;
        }

        if (!user) {
            toast.error("No user logged in");
            return;
        }

        // Check server readiness only when user actually tries to load
        if (!isServerReady) {
            toast.info("Checking server connection...");
            await pingServer();
            if (!isServerReady) {
                toast.error("Server unavailable", {
                    description: "Please try again later.",
                });
                return;
            }
        }

        try {
            const res = await fetch(`/api/planner/${user.id}`);
            if (!res.ok) throw new Error("No planner found on server");

            const planner = await res.json();
            Object.entries(planner).forEach(([date, data]) => {
                storage.savePlannerData(user.id, date, data);
            });

            toast.success("Planner loaded successfully", {
                description:
                    "Your planner data has been loaded from the server.",
            });

            // Set load cooldown
            localStorage.setItem("lastLoadTime", Date.now().toString());
            setCanLoad(false);
            setLoadTimeLeft(Math.ceil(LOAD_INTERVAL / 1000));

            if (onPlannerLoad) onPlannerLoad();
            window.location.reload();
        } catch (error) {
            console.error("Load Error:", error);
            toast.error("Failed to load planner", {
                description:
                    "Unable to load data from the server. Please try again.",
            });
        }
    };

    const formatTime = (seconds, isHours = false) => {
        if (isHours) {
            const hours = Math.floor(seconds / 3600);
            const min = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${min}m`;
        } else {
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            return `${min}m ${sec}s`;
        }
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`p-2 rounded-full transition-colors ${theme.colors.backgroundSecondary} ${theme.colors.shadow} ${theme.colors.text} hover:opacity-90 touch-manipulation`}
                title="Sync Settings"
            >
                <Settings size={18} className="sm:w-5 sm:h-5" />
            </button>

            {open && (
                <div
                    className={`absolute right-0 mt-2 w-48 sm:w-56 rounded-2xl ${theme.colors.shadow} border z-[9999] ${theme.colors.background} ${theme.colors.border} backdrop-blur-sm`}
                >
                    <button
                        onClick={handleSync}
                        className={`block w-full text-left px-3 py-2 sm:px-4 rounded-t-lg text-sm sm:text-base touch-manipulation ${
                            canSync
                                ? `hover:${theme.colors.hoverBg} ${theme.colors.text}`
                                : `cursor-not-allowed ${theme.colors.textSecondary}`
                        }`}
                        disabled={!canSync}
                    >
                        {canSync
                            ? "Save in Server"
                            : `Wait: ${formatTime(syncTimeLeft)}`}
                    </button>
                    <button
                        onClick={handleLoad}
                        className={`block w-full text-left px-3 py-2 sm:px-4 rounded-b-lg text-sm sm:text-base touch-manipulation ${
                            canLoad
                                ? `hover:${theme.colors.hoverBg} ${theme.colors.text}`
                                : `cursor-not-allowed ${theme.colors.textSecondary}`
                        }`}
                        disabled={!canLoad}
                    >
                        {canLoad
                            ? "Load from Server"
                            : `Wait: ${formatTime(loadTimeLeft, true)}`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SyncControls;
