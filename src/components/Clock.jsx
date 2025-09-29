"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const formatTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const pad = (n) => n.toString().padStart(2, "0");

    return {
        hour: pad(hours),
        min: pad(minutes),
        sec: pad(seconds),
        ampm,
    };
};

const Clock = () => {
    const { theme } = useTheme();
    const [timeParts, setTimeParts] = useState(formatTimeParts(new Date()));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeParts(formatTimeParts(new Date()));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`text-center flex items-baseline justify-center gap-1 ${theme.colors.text}`}
            title={`${timeParts.hour}:${timeParts.min} ${timeParts.ampm}`}
        >
            <span className="text-3xl">{timeParts.hour}</span>
            <span className="text-2xl">:{timeParts.min}</span>
            <span className="text-xs">:{timeParts.sec}</span>
            <span className={`text-sm ml-1 ${theme.colors.textSecondary}`}>
                {timeParts.ampm}
            </span>
        </div>
    );
};

export default Clock;
