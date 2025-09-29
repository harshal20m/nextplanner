"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, Mail, Settings, Timer, BarChart3 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ProfileDropdown = ({
    user,
    onLogout,
    isGuest = false,
    showTimer,
    onToggleTimer,
    showStats,
    onToggleStats,
}) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle image loading
    useEffect(() => {
        if (user?.image && !isGuest) {
            setImageLoaded(false);
            setShowImage(true);
        } else {
            setImageLoaded(false);
            setShowImage(false);
        }
    }, [user?.image, isGuest]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageLoaded(false);
        setShowImage(false);
    };

    const handleLogout = () => {
        setIsOpen(false);
        onLogout();
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${theme.colors.hoverBg} ${theme.colors.text} hover:opacity-90 touch-manipulation`}
                title="Profile Menu"
            >
                {isGuest ? (
                    <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${theme.colors.primaryLight} flex items-center justify-center`}
                    >
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                ) : user?.image && showImage ? (
                    <img
                        src={user.image}
                        alt={user.name || user.email}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                ) : (
                    <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${theme.colors.primaryLight} flex items-center justify-center`}
                    >
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                )}
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 mt-2 w-56 sm:w-64 rounded-2xl ${theme.colors.shadow} border z-[9999] ${theme.colors.background} ${theme.colors.border}`}
                >
                    {/* Profile Header */}
                    <div className={`p-4 border-b ${theme.colors.border}`}>
                        <div className="flex items-center space-x-3">
                            {isGuest ? (
                                <div
                                    className={`w-12 h-12 rounded-full ${theme.colors.primaryLight} flex items-center justify-center`}
                                >
                                    <User className="w-6 h-6" />
                                </div>
                            ) : user?.image && showImage ? (
                                <img
                                    src={user.image}
                                    alt={user.name || user.email}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            ) : (
                                <div
                                    className={`w-12 h-12 rounded-full ${theme.colors.primaryLight} flex items-center justify-center`}
                                >
                                    <User className="w-6 h-6" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm font-semibold ${theme.colors.text} truncate`}
                                >
                                    {isGuest
                                        ? "Guest User"
                                        : user?.name || "User"}
                                </p>
                                <p
                                    className={`text-xs ${theme.colors.textMuted} truncate`}
                                >
                                    {isGuest ? "Local Mode" : user?.email}
                                </p>
                                {isGuest && (
                                    <p
                                        className={`text-xs ${theme.colors.textLight} mt-1`}
                                    >
                                        Data stored locally
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {!isGuest && (
                            <>
                                <div
                                    className={`px-4 py-2 ${theme.colors.textSecondary} text-xs font-medium uppercase tracking-wider`}
                                >
                                    Account
                                </div>
                                <button
                                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:${theme.colors.hoverBg} transition-colors`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Mail
                                        className={`w-4 h-4 ${theme.colors.textMuted}`}
                                    />
                                    <span
                                        className={`text-sm ${theme.colors.text}`}
                                    >
                                        {user?.email}
                                    </span>
                                </button>
                            </>
                        )}

                        <div
                            className={`px-4 py-2 ${theme.colors.textSecondary} text-xs font-medium uppercase tracking-wider mt-2`}
                        >
                            Features
                        </div>

                        <button
                            onClick={() => {
                                onToggleTimer();
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-left hover:${theme.colors.hoverBg} transition-colors ${theme.colors.text} touch-manipulation`}
                        >
                            <div className="flex items-center space-x-3">
                                <Timer className="w-4 h-4" />
                                <span className="text-sm sm:text-base">
                                    Timer
                                </span>
                            </div>
                            <div
                                className={`w-10 h-5 rounded-full transition-colors ${
                                    showTimer
                                        ? theme.colors.primary
                                        : theme.colors.progressBg
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                        showTimer
                                            ? "translate-x-5"
                                            : "translate-x-0.5"
                                    } mt-0.5`}
                                ></div>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                onToggleStats();
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-left hover:${theme.colors.hoverBg} transition-colors ${theme.colors.text} touch-manipulation`}
                        >
                            <div className="flex items-center space-x-3">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-sm sm:text-base">
                                    Weekly Stats
                                </span>
                            </div>
                            <div
                                className={`w-10 h-5 rounded-full transition-colors ${
                                    showStats
                                        ? theme.colors.primary
                                        : theme.colors.progressBg
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                        showStats
                                            ? "translate-x-5"
                                            : "translate-x-0.5"
                                    } mt-0.5`}
                                ></div>
                            </div>
                        </button>

                        <div
                            className={`px-4 py-2 ${theme.colors.textSecondary} text-xs font-medium uppercase tracking-wider mt-2`}
                        >
                            Actions
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:${theme.colors.hoverBg} transition-colors ${theme.colors.text} hover:text-red-600 touch-manipulation`}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm sm:text-base">
                                {isGuest ? "End Guest Session" : "Sign Out"}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
