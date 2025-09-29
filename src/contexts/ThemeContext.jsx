"use client";

// src/contexts/ThemeContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const themes = {
    light: {
        name: "Light",
        colors: {
            primary: "bg-indigo-600",
            primaryHover: "hover:bg-indigo-700",
            primaryLight: "bg-indigo-100",
            primaryText: "text-indigo-600",
            primaryTextHover: "hover:text-indigo-700",
            background:
                "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
            backgroundSecondary: "bg-white/80 backdrop-blur-sm",
            backgroundGradient:
                "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
            text: "text-slate-900",
            textSecondary: "text-slate-700",
            textMuted: "text-slate-600",
            textLight: "text-slate-500",
            border: "border-slate-200/60",
            borderInput: "border-slate-300/60",
            borderHover: "hover:border-indigo-400",
            shadow: "shadow-lg shadow-slate-200/50",
            shadowHover: "hover:shadow-xl hover:shadow-slate-300/50",
            ring: "focus:ring-indigo-500/50",
            progressBg: "bg-slate-200/60",
            progressFill: "bg-indigo-500",
            success: "bg-emerald-500",
            error: "bg-red-50 text-red-800 border border-red-200",
            cardBg: "bg-white/80 backdrop-blur-sm",
            inputBg: "bg-white/70 backdrop-blur-sm",
            hoverBg: "hover:bg-slate-50/80",
        },
    },
    dark: {
        name: "Dark",
        colors: {
            primary: "bg-indigo-600",
            primaryHover: "hover:bg-indigo-700",
            primaryLight: "bg-indigo-900/50",
            primaryText: "text-indigo-400",
            primaryTextHover: "hover:text-indigo-300",
            background:
                "bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950",
            backgroundSecondary: "bg-slate-800/80 backdrop-blur-sm",
            backgroundGradient:
                "bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950",
            text: "text-slate-100",
            textSecondary: "text-slate-300",
            textMuted: "text-slate-400",
            textLight: "text-slate-500",
            border: "border-slate-700/60",
            borderInput: "border-slate-600/60",
            borderHover: "hover:border-indigo-500",
            shadow: "shadow-2xl shadow-slate-900/50",
            shadowHover: "hover:shadow-2xl hover:shadow-slate-800/50",
            ring: "focus:ring-indigo-500/50",
            progressBg: "bg-slate-700/60",
            progressFill: "bg-indigo-500",
            success: "bg-emerald-500",
            error: "bg-red-900/50 text-red-200 border border-red-800/50",
            cardBg: "bg-slate-800/80 backdrop-blur-sm",
            inputBg: "bg-slate-700/70 backdrop-blur-sm",
            hoverBg: "hover:bg-slate-700/80",
        },
    },
    goldish: {
        name: "Goldish",
        colors: {
            primary: "bg-amber-500",
            primaryHover: "hover:bg-amber-600",
            primaryLight: "bg-amber-100",
            primaryText: "text-amber-600",
            primaryTextHover: "hover:text-amber-700",
            background:
                "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100",
            backgroundSecondary: "bg-white/80 backdrop-blur-sm",
            backgroundGradient:
                "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100",
            text: "text-amber-900",
            textSecondary: "text-amber-700",
            textMuted: "text-amber-600",
            textLight: "text-amber-500",
            border: "border-amber-200/60",
            borderInput: "border-amber-300/60",
            borderHover: "hover:border-amber-400",
            shadow: "shadow-lg shadow-amber-200/50",
            shadowHover: "hover:shadow-xl hover:shadow-amber-300/50",
            ring: "focus:ring-amber-500/50",
            progressBg: "bg-amber-200/60",
            progressFill: "bg-gradient-to-r from-amber-500 to-orange-500",
            success: "bg-gradient-to-r from-emerald-500 to-green-500",
            error: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200",
            cardBg: "bg-white/80 backdrop-blur-sm",
            inputBg: "bg-white/70 backdrop-blur-sm",
            hoverBg: "hover:bg-amber-50/80",
        },
    },
    blueish: {
        name: "Blueish",
        colors: {
            primary: "bg-gradient-to-r from-cyan-500 to-blue-500",
            primaryHover: "hover:from-cyan-600 hover:to-blue-600",
            primaryLight: "bg-gradient-to-r from-cyan-100 to-blue-100",
            primaryText: "text-cyan-600",
            primaryTextHover: "hover:text-cyan-700",
            background:
                "bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100",
            backgroundSecondary: "bg-white/80 backdrop-blur-sm",
            backgroundGradient:
                "bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100",
            text: "text-cyan-900",
            textSecondary: "text-cyan-700",
            textMuted: "text-cyan-600",
            textLight: "text-cyan-500",
            border: "border-cyan-200/60",
            borderInput: "border-cyan-300/60",
            borderHover: "hover:border-cyan-400",
            shadow: "shadow-lg shadow-cyan-200/50",
            shadowHover: "hover:shadow-xl hover:shadow-cyan-300/50",
            ring: "focus:ring-cyan-500/50",
            progressBg: "bg-cyan-200/60",
            progressFill: "bg-gradient-to-r from-cyan-500 to-blue-500",
            success: "bg-gradient-to-r from-emerald-500 to-green-500",
            error: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200",
            cardBg: "bg-white/80 backdrop-blur-sm",
            inputBg: "bg-white/70 backdrop-blur-sm",
            hoverBg: "hover:bg-cyan-50/80",
        },
    },
    midnight: {
        name: "Midnight",
        colors: {
            primary: "bg-gradient-to-r from-purple-600 to-indigo-600",
            primaryHover: "hover:from-purple-700 hover:to-indigo-700",
            primaryLight:
                "bg-gradient-to-r from-purple-900/50 to-indigo-900/50",
            primaryText: "text-purple-400",
            primaryTextHover: "hover:text-purple-300",
            background:
                "bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950",
            backgroundSecondary: "bg-slate-800/80 backdrop-blur-sm",
            backgroundGradient:
                "bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950",
            text: "text-slate-100",
            textSecondary: "text-slate-300",
            textMuted: "text-slate-400",
            textLight: "text-slate-500",
            border: "border-slate-700/60",
            borderInput: "border-slate-600/60",
            borderHover: "hover:border-purple-500",
            shadow: "shadow-2xl shadow-slate-900/50",
            shadowHover: "hover:shadow-2xl hover:shadow-slate-800/50",
            ring: "focus:ring-purple-500/50",
            progressBg: "bg-slate-700/60",
            progressFill: "bg-gradient-to-r from-purple-500 to-indigo-500",
            success: "bg-gradient-to-r from-emerald-500 to-green-500",
            error: "bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-200 border border-red-800/50",
            cardBg: "bg-slate-800/80 backdrop-blur-sm",
            inputBg: "bg-slate-700/70 backdrop-blur-sm",
            hoverBg: "hover:bg-slate-700/80",
        },
    },
    pinkish: {
        name: "Pinkish",
        colors: {
            primary: "bg-gradient-to-r from-rose-500 to-pink-500",
            primaryHover: "hover:from-rose-600 hover:to-pink-600",
            primaryLight: "bg-gradient-to-r from-rose-100 to-pink-100",
            primaryText: "text-rose-600",
            primaryTextHover: "hover:text-rose-700",
            background:
                "bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100",
            backgroundSecondary: "bg-white/80 backdrop-blur-sm",
            backgroundGradient:
                "bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100",
            text: "text-pink-900",
            textSecondary: "text-pink-700",
            textMuted: "text-pink-600",
            textLight: "text-pink-500",
            border: "border-rose-200/60",
            borderInput: "border-rose-300/60",
            borderHover: "hover:border-rose-400",
            shadow: "shadow-lg shadow-rose-200/50",
            shadowHover: "hover:shadow-xl hover:shadow-rose-300/50",
            ring: "focus:ring-rose-500/50",
            progressBg: "bg-rose-200/60",
            progressFill: "bg-gradient-to-r from-rose-500 to-pink-500",
            success: "bg-gradient-to-r from-emerald-500 to-green-500",
            error: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200",
            cardBg: "bg-white/80 backdrop-blur-sm",
            inputBg: "bg-white/70 backdrop-blur-sm",
            hoverBg: "hover:bg-rose-50/80",
        },
    },
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState("light");

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem("theme") || "light";
        setCurrentTheme(savedTheme);
    }, []);

    const changeTheme = (themeName) => {
        setCurrentTheme(themeName);
        localStorage.setItem("theme", themeName);
    };

    const theme = themes[currentTheme];

    return (
        <ThemeContext.Provider
            value={{ theme, currentTheme, changeTheme, themes }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
