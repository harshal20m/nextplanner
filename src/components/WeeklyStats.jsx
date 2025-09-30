"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart3,
    CheckCircle,
    Clock,
    Target,
    TrendingUp,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import storage from "../utils/storage";

const WeeklyStats = ({ userId }) => {
    const { theme } = useTheme();
    const [weeklyData, setWeeklyData] = useState({
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        averageTasksPerDay: 0,
        mostProductiveDay: "",
        streak: 0,
        weeklyGoal: 0,
    });
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState(0);

    useEffect(() => {
        calculateWeeklyStats();
        loadNumericGoal();
    }, [userId]);

    const loadNumericGoal = async () => {
        try {
            const response = await fetch(`/api/goals/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setTempGoal(data.weeklyNumericGoal || 10);
            } else {
                // Fallback to localStorage
                const savedGoal = localStorage.getItem(`weeklyGoal_${userId}`);
                if (savedGoal) {
                    setTempGoal(parseInt(savedGoal));
                }
            }
        } catch (error) {
            console.error("Error loading numeric goal:", error);
            // Fallback to localStorage
            const savedGoal = localStorage.getItem(`weeklyGoal_${userId}`);
            if (savedGoal) {
                setTempGoal(parseInt(savedGoal));
            }
        }
    };

    const calculateWeeklyStats = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        let totalTasks = 0;
        let completedTasks = 0;
        const dailyStats = {};
        let currentStreak = 0;
        let maxStreak = 0;

        // Get all planner dates for the user
        const allDates = storage.getPlannerDates(userId);

        // Filter dates for this week
        const weekDates = allDates.filter((date) => {
            const dateObj = new Date(date);
            return dateObj >= startOfWeek && dateObj <= endOfWeek;
        });

        // Calculate stats for each day
        weekDates.forEach((date) => {
            const data = storage.getPlannerData(userId, date);
            const dayTasks = Object.values(data.tasks || {});
            const dayTotal = dayTasks.reduce(
                (sum, task) => sum + (task.subtasks?.length || 0),
                0
            );
            const dayCompleted = dayTasks.reduce(
                (sum, task) =>
                    sum +
                    (task.subtasks?.filter((sub) => sub.done).length || 0),
                0
            );

            totalTasks += dayTotal;
            completedTasks += dayCompleted;

            const dayName = new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
            });
            dailyStats[dayName] = { total: dayTotal, completed: dayCompleted };

            // Calculate streak
            if (dayCompleted > 0) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        // Find most productive day
        const mostProductiveDay = Object.entries(dailyStats).reduce(
            (max, [day, stats]) =>
                stats.completed > max.completed ? { day, ...stats } : max,
            { day: "None", completed: 0 }
        ).day;

        const completionRate =
            totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;
        const averageTasksPerDay =
            weekDates.length > 0
                ? Math.round(totalTasks / weekDates.length)
                : 0;

        // Use the loaded numeric goal
        const weeklyGoal = tempGoal || Math.max(completedTasks, 10);

        setWeeklyData({
            totalTasks,
            completedTasks,
            completionRate,
            averageTasksPerDay,
            mostProductiveDay,
            streak: maxStreak,
            weeklyGoal,
        });
    };

    const getCompletionColor = (rate) => {
        if (rate >= 80) return "text-green-500";
        if (rate >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getStreakColor = (streak) => {
        if (streak >= 5) return "text-orange-500";
        if (streak >= 3) return "text-blue-500";
        return "text-gray-500";
    };

    const handleGoalEdit = () => {
        setTempGoal(weeklyData.weeklyGoal);
        setIsEditingGoal(true);
    };

    const handleGoalSave = async () => {
        try {
            const response = await fetch(`/api/goals/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    weeklyNumericGoal: tempGoal,
                }),
            });

            if (response.ok) {
                setWeeklyData((prev) => ({ ...prev, weeklyGoal: tempGoal }));
                setIsEditingGoal(false);
                // Also save to localStorage as backup
                localStorage.setItem(
                    `weeklyGoal_${userId}`,
                    tempGoal.toString()
                );
            } else {
                const errorData = await response.json();
                if (response.status === 429) {
                    alert(`Goal update cooldown: ${errorData.message}`);
                } else {
                    throw new Error(errorData.error || "Failed to save goal");
                }
            }
        } catch (error) {
            console.error("Error saving numeric goal:", error);
            // Fallback to localStorage
            localStorage.setItem(`weeklyGoal_${userId}`, tempGoal.toString());
            setWeeklyData((prev) => ({ ...prev, weeklyGoal: tempGoal }));
            setIsEditingGoal(false);
        }
    };

    const handleGoalCancel = () => {
        setTempGoal(weeklyData.weeklyGoal);
        setIsEditingGoal(false);
    };

    return (
        <div
            className={`${theme.colors.cardBg} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-4 sm:p-6 backdrop-blur-sm`}
        >
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <BarChart3
                        className={`w-5 h-5 ${theme.colors.primaryText}`}
                    />
                    <h3
                        className={`text-lg font-semibold ${theme.colors.text}`}
                    >
                        This Week's Stats
                    </h3>
                </div>
                <p className={`text-sm ${theme.colors.textSecondary}`}>
                    Your productivity overview
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                    className={`${theme.colors.backgroundSecondary} rounded-lg p-3 text-center`}
                >
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Target
                            className={`w-4 h-4 ${theme.colors.textMuted}`}
                        />
                        <span
                            className={`text-xs ${theme.colors.textSecondary}`}
                        >
                            Total Tasks
                        </span>
                    </div>
                    <div className={`text-xl font-bold ${theme.colors.text}`}>
                        {weeklyData.totalTasks}
                    </div>
                </div>

                <div
                    className={`${theme.colors.backgroundSecondary} rounded-lg p-3 text-center`}
                >
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle
                            className={`w-4 h-4 ${theme.colors.textMuted}`}
                        />
                        <span
                            className={`text-xs ${theme.colors.textSecondary}`}
                        >
                            Completed
                        </span>
                    </div>
                    <div className={`text-xl font-bold ${theme.colors.text}`}>
                        {weeklyData.completedTasks}
                    </div>
                </div>

                <div
                    className={`${theme.colors.backgroundSecondary} rounded-lg p-3 text-center`}
                >
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp
                            className={`w-4 h-4 ${theme.colors.textMuted}`}
                        />
                        <span
                            className={`text-xs ${theme.colors.textSecondary}`}
                        >
                            Completion
                        </span>
                    </div>
                    <div
                        className={`text-xl font-bold ${getCompletionColor(
                            weeklyData.completionRate
                        )}`}
                    >
                        {weeklyData.completionRate}%
                    </div>
                </div>

                <div
                    className={`${theme.colors.backgroundSecondary} rounded-lg p-3 text-center`}
                >
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock
                            className={`w-4 h-4 ${theme.colors.textMuted}`}
                        />
                        <span
                            className={`text-xs ${theme.colors.textSecondary}`}
                        >
                            Avg/Day
                        </span>
                    </div>
                    <div className={`text-xl font-bold ${theme.colors.text}`}>
                        {weeklyData.averageTasksPerDay}
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme.colors.textSecondary}`}>
                        Most Productive Day
                    </span>
                    <span
                        className={`text-sm font-medium ${theme.colors.text}`}
                    >
                        {weeklyData.mostProductiveDay}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme.colors.textSecondary}`}>
                        Best Streak
                    </span>
                    <span
                        className={`text-sm font-medium ${getStreakColor(
                            weeklyData.streak
                        )}`}
                    >
                        {weeklyData.streak} days
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className={`text-xs ${theme.colors.textSecondary}`}
                        >
                            Task Goal Progress
                        </span>
                        <div className="flex items-center gap-2">
                            {isEditingGoal ? (
                                <>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={tempGoal}
                                        onChange={(e) =>
                                            setTempGoal(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className={`w-12 px-1 py-0.5 text-xs text-center border ${theme.colors.borderInput} rounded ${theme.colors.inputBg} ${theme.colors.text} focus:ring-1 ${theme.colors.ring} focus:border-transparent`}
                                    />
                                    <button
                                        onClick={handleGoalSave}
                                        className={`text-xs ${theme.colors.primaryText} hover:${theme.colors.primaryTextHover}`}
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={handleGoalCancel}
                                        className={`text-xs ${theme.colors.textMuted} hover:${theme.colors.textSecondary}`}
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span
                                        className={`text-xs font-medium ${theme.colors.text}`}
                                    >
                                        {weeklyData.completedTasks}/
                                        {weeklyData.weeklyGoal} tasks
                                    </span>
                                    <button
                                        onClick={handleGoalEdit}
                                        className={`text-xs ${theme.colors.textMuted} hover:${theme.colors.textSecondary}`}
                                        title="Edit task goal"
                                    >
                                        ✏️
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div
                        className={`${theme.colors.progressBg} rounded-full h-2`}
                    >
                        <div
                            className={`${theme.colors.progressFill} h-2 rounded-full transition-all duration-500`}
                            style={{
                                width: `${Math.min(
                                    (weeklyData.completedTasks /
                                        weeklyData.weeklyGoal) *
                                        100,
                                    100
                                )}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Motivational Message */}
            <div className="mt-4 text-center">
                {weeklyData.completionRate >= 80 ? (
                    <p
                        className={`text-sm ${theme.colors.primaryText} font-medium`}
                    >
                        🎉 Excellent work this week!
                    </p>
                ) : weeklyData.completionRate >= 60 ? (
                    <p className={`text-sm ${theme.colors.textSecondary}`}>
                        💪 Good progress, keep it up!
                    </p>
                ) : (
                    <p className={`text-sm ${theme.colors.textSecondary}`}>
                        🌟 Every task completed is progress!
                    </p>
                )}
            </div>
        </div>
    );
};

export default WeeklyStats;
