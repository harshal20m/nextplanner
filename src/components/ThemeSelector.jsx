"use client";

// src/components/ThemeSelector.jsx

import React, { useState } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeSelector = () => {
    const { theme, currentTheme, changeTheme, themes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themePreviewColors = {
        light: "bg-gradient-to-r from-blue-50 to-indigo-100",
        dark: "bg-gradient-to-r from-gray-900 to-indigo-900",
        goldish: "bg-gradient-to-r from-yellow-50 to-amber-100",
        blueish: "bg-gradient-to-r from-blue-50 to-cyan-100",
        pinkish: "bg-gradient-to-r from-pink-50 to-rose-100",
        midnight: "bg-gradient-to-r from-slate-900 to-purple-900",
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${theme.colors.textMuted} ${theme.colors.hoverBg}`}
                title="Change Theme"
            >
                <Palette className="w-5 h-5" />
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 mt-2 w-48 ${theme.colors.cardBg} rounded-2xl ${theme.colors.shadow} ${theme.colors.border} border z-[9999] backdrop-blur-sm`}
                >
                    <div className={`p-3 border-b ${theme.colors.border}`}>
                        <h3 className={`font-medium ${theme.colors.text}`}>
                            Choose Theme
                        </h3>
                    </div>
                    <div className="p-2">
                        {Object.entries(themes).map(([key, themeData]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    changeTheme(key);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-opacity-50 transition-colors ${
                                    currentTheme === key
                                        ? theme.colors.primaryLight
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full ${themePreviewColors[key]} border border-gray-300`}
                                ></div>
                                <span
                                    className={`flex-1 text-left ${theme.colors.text}`}
                                >
                                    {themeData.name}
                                </span>
                                {currentTheme === key && (
                                    <Check
                                        className={`w-4 h-4 ${theme.colors.primaryText}`}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
