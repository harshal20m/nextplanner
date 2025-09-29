"use client";

import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const DayStrip = () => {
    const { theme } = useTheme();

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1; // Convert Sunday (0) to 6, others shift by 1

    return (
        <div
            className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-3 sm:p-4 backdrop-blur-sm`}
        >
            <div className="flex justify-between items-center">
                {days.map((day, index) => (
                    <div
                        key={day}
                        className={`flex items-center justify-center transition-all duration-200 ${
                            index === todayIndex
                                ? `${theme.colors.primaryLight} rounded-xl px-3 py-2 shadow-sm`
                                : "hover:opacity-80"
                        }`}
                    >
                        <span
                            className={`text-sm font-semibold ${
                                index === todayIndex
                                    ? theme.colors.primaryText
                                    : theme.colors.textSecondary
                            }`}
                        >
                            {day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DayStrip;
