"use client";

import React, { useState, useEffect } from "react";
import { Target, Edit3, Check, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const WeeklyGoal = ({ userId }) => {
    const { theme } = useTheme();
    const [goal, setGoal] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [tempGoal, setTempGoal] = useState("");

    useEffect(() => {
        // Load saved weekly goal
        const savedGoal = localStorage.getItem(`weeklyTextGoal_${userId}`);
        if (savedGoal) {
            setGoal(savedGoal);
        } else {
            setGoal("Set your weekly goal...");
        }
    }, [userId]);

    const handleEdit = () => {
        setTempGoal(goal === "Set your weekly goal..." ? "" : goal);
        setIsEditing(true);
    };

    const handleSave = () => {
        const newGoal = tempGoal.trim() || "Set your weekly goal...";
        setGoal(newGoal);
        localStorage.setItem(`weeklyTextGoal_${userId}`, newGoal);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempGoal(goal);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    return (
        <div
            className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-4 sm:p-5 backdrop-blur-sm mb-4 sm:mb-6`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`${theme.colors.primaryLight} rounded-xl p-2 flex-shrink-0`}
                >
                    <Target className={`w-5 h-5 ${theme.colors.primaryText}`} />
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tempGoal}
                                onChange={(e) => setTempGoal(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="What do you want to achieve this week?"
                                className={`flex-1 px-3 py-2 border ${theme.colors.borderInput} rounded-lg ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 ${theme.colors.ring} focus:border-transparent text-sm sm:text-base`}
                                autoFocus
                            />
                            <button
                                onClick={handleSave}
                                className={`${theme.colors.primaryText} hover:${theme.colors.primaryTextHover} p-2 rounded-lg transition-colors`}
                                title="Save goal"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleCancel}
                                className={`${theme.colors.textMuted} hover:${theme.colors.textSecondary} p-2 rounded-lg transition-colors`}
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p
                                className={`flex-1 text-sm sm:text-base font-medium ${
                                    goal === "Set your weekly goal..."
                                        ? theme.colors.textMuted
                                        : theme.colors.text
                                }`}
                            >
                                {goal}
                            </p>
                            <button
                                onClick={handleEdit}
                                className={`${theme.colors.textMuted} hover:${theme.colors.textSecondary} p-2 rounded-lg transition-colors`}
                                title="Edit weekly goal"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyGoal;
