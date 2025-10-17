"use client";

import React from "react";
import { useTheme } from "../contexts/ThemeContext";

// Renders Mon..Sun for the week of the provided selectedDate (YYYY-MM-DD)
// Clicking a day will call onSelectDate with that day's YYYY-MM-DD
const DayStrip = ({ selectedDate, onSelectDate }) => {
    const { theme } = useTheme();

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Parse selectedDate safely in local time to avoid UTC shifts
    const parseLocalDate = (ymd) => {
        if (!ymd) return new Date();
        const [y, m, d] = ymd.split("-").map((v) => parseInt(v, 10));
        return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
    };

    const selDate = selectedDate ? parseLocalDate(selectedDate) : new Date();
    // Compute Monday of the selected week
    const selDay = selDate.getDay(); // 0..6 (Sun..Sat)
    const offsetToMonday = selDay === 0 ? -6 : 1 - selDay; // move to Monday
    const monday = new Date(selDate);
    monday.setDate(selDate.getDate() + offsetToMonday);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });

    // Format date as YYYY-MM-DD in local time
    const toKey = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };
    const selectedKey = toKey(selDate);

    return (
        <div
            className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-2 sm:p-3 backdrop-blur-sm`}
        >
            <div className="grid grid-cols-7 gap-1 items-center">
                {weekDates.map((dateObj, index) => {
                    const dayLabel = days[index];
                    const isSelected = toKey(dateObj) === selectedKey;
                    return (
                        <button
                            key={dayLabel}
                            onClick={() =>
                                onSelectDate && onSelectDate(toKey(dateObj))
                            }
                            className={`w-full flex items-center justify-center transition-all duration-200 rounded-xl px-2 py-1 sm:px-3 sm:py-2 touch-manipulation ${
                                isSelected
                                    ? `${theme.colors.primaryLight} shadow-sm`
                                    : `hover:${theme.colors.hoverBg}`
                            }`}
                            title={toKey(dateObj)}
                        >
                            <span
                                className={`text-xs sm:text-sm font-semibold ${
                                    isSelected
                                        ? theme.colors.primaryText
                                        : theme.colors.textSecondary
                                }`}
                            >
                                {dayLabel}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DayStrip;
