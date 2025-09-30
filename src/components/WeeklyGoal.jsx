"use client";

import React, { useState, useEffect } from "react";
import { Target, Edit3, Check, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";

const WeeklyGoal = ({ userId }) => {
    const { theme } = useTheme();
    const [goal, setGoal] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [tempGoal, setTempGoal] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(true);

    useEffect(() => {
        loadWeeklyGoal();
    }, [userId]);

    const loadWeeklyGoal = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/goals/${userId}`);

            if (response.ok) {
                const data = await response.json();
                setGoal(data.weeklyTextGoal || "Set your weekly goal...");

                // Check if user can edit (24-hour cooldown)
                if (data.lastGoalUpdate) {
                    const lastUpdate = new Date(data.lastGoalUpdate);
                    const now = new Date();
                    const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours
                    const timeSinceUpdate = now - lastUpdate;

                    if (timeSinceUpdate < cooldownPeriod) {
                        setCanEdit(false);
                    } else {
                        setCanEdit(true);
                    }
                }
            } else {
                // Fallback to localStorage if API fails
                const savedGoal = localStorage.getItem(
                    `weeklyTextGoal_${userId}`
                );
                setGoal(savedGoal || "Set your weekly goal...");
            }
        } catch (error) {
            console.error("Error loading weekly goal:", error);
            // Fallback to localStorage
            const savedGoal = localStorage.getItem(`weeklyTextGoal_${userId}`);
            setGoal(savedGoal || "Set your weekly goal...");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        if (!canEdit) {
            toast.warning("Goal Update Cooldown", {
                description:
                    "You can only update your weekly goal once every 24 hours. Please try again later.",
                duration: 4000,
            });
            return;
        }
        setTempGoal(goal === "Set your weekly goal..." ? "" : goal);
        setIsEditing(true);
    };

    const handleSave = async () => {
        const newGoal = tempGoal.trim() || "Set your weekly goal...";

        try {
            const response = await fetch(`/api/goals/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    weeklyTextGoal: newGoal,
                }),
            });

            if (response.ok) {
                setGoal(newGoal);
                setIsEditing(false);
                setCanEdit(false);
                toast.success("Goal Updated", {
                    description:
                        "Your weekly goal has been saved to the database.",
                    duration: 3000,
                });

                // Also save to localStorage as backup
                localStorage.setItem(`weeklyTextGoal_${userId}`, newGoal);
            } else {
                const errorData = await response.json();
                if (response.status === 429) {
                    toast.warning("Cooldown Active", {
                        description: errorData.message,
                        duration: 4000,
                    });
                    setCanEdit(false);
                } else {
                    throw new Error(errorData.error || "Failed to save goal");
                }
            }
        } catch (error) {
            console.error("Error saving goal:", error);
            // Fallback to localStorage
            setGoal(newGoal);
            localStorage.setItem(`weeklyTextGoal_${userId}`, newGoal);
            setIsEditing(false);
            toast.error("Save Failed", {
                description: "Goal saved locally. Will sync to server later.",
                duration: 3000,
            });
        }
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
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            <span
                                className={`text-sm ${theme.colors.textMuted}`}
                            >
                                Loading goal...
                            </span>
                        </div>
                    ) : isEditing ? (
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
