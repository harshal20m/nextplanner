"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Check } from "lucide-react";
import storage from "../utils/storage";
import { parseTimeForSorting } from "../utils/timeUtils";
import { useTheme } from "../contexts/ThemeContext"; // Import useTheme

const HistoryView = ({ userId }) => {
    const { theme } = useTheme(); // Use the theme hook
    const [historyData, setHistoryData] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const dates = storage.getAllPlannerDates(userId);
        const data = dates.map((date) => {
            const plannerData = storage.getPlannerData(userId, date);
            const tasks = plannerData.tasks || {};

            let totalTasks = 0;
            let completedTasks = 0;

            for (const slot of Object.values(tasks)) {
                const subtasks = slot?.subtasks || [];
                totalTasks += subtasks.length;
                completedTasks += subtasks.filter((s) => s.done).length;
            }

            return {
                date,
                tasks,
                totalTasks,
                completedTasks,
                completionRate:
                    totalTasks > 0
                        ? Math.round((completedTasks / totalTasks) * 100)
                        : 0,
            };
        });
        setHistoryData(data);
    }, [userId]);

    const filteredData = historyData.filter((day) => {
        if (filter === "completed") return day.completedTasks > 0;
        if (filter === "incomplete") return day.totalTasks > day.completedTasks;
        return true;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${theme.colors.text}`}>
                    Task History
                </h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`px-3 py-2 border ${theme.colors.borderInput} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent ${theme.colors.inputBg} ${theme.colors.text}`}
                >
                    <option value="all">All Days</option>
                    <option value="completed">Days with Completed Tasks</option>
                    <option value="incomplete">
                        Days with Incomplete Tasks
                    </option>
                </select>
            </div>

            {filteredData.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar
                        className={`w-16 h-16 ${theme.colors.textLight} mx-auto mb-4`}
                    />
                    <p className={`${theme.colors.textMuted}`}>
                        No planner history found
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredData.map((day) => (
                        <div
                            key={day.date}
                            className={`${theme.colors.cardBg} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-6 backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3
                                        className={`font-semibold ${theme.colors.text}`}
                                    >
                                        {day.date}
                                    </h3>
                                    <p
                                        className={`text-sm ${theme.colors.textSecondary}`}
                                    >
                                        {day.completedTasks} of {day.totalTasks}{" "}
                                        tasks completed ({day.completionRate}%)
                                    </p>
                                </div>
                                <div
                                    className={`${theme.colors.progressBg} rounded-full h-2 w-24`}
                                >
                                    <div
                                        className={`${theme.colors.progressFill} h-2 rounded-full`}
                                        style={{
                                            width: `${day.completionRate}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {Object.keys(day.tasks).length > 0 && (
                                <div className="space-y-3">
                                    {Object.entries(day.tasks)
                                        .sort(
                                            ([a], [b]) =>
                                                parseTimeForSorting(a) -
                                                parseTimeForSorting(b)
                                        )
                                        .map(([time, task]) => (
                                            <div key={time}>
                                                <p
                                                    className={`text-sm font-medium ${theme.colors.textSecondary} mb-1`}
                                                >
                                                    {time}
                                                </p>
                                                {(task.subtasks || []).map(
                                                    (subtask, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center space-x-3 p-2 ${theme.colors.inputBg} rounded`}
                                                        >
                                                            <div
                                                                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                                                    subtask.done
                                                                        ? `${theme.colors.success} border-transparent`
                                                                        : `${theme.colors.borderInput}`
                                                                }`}
                                                            >
                                                                {subtask.done && (
                                                                    <Check className="w-2 h-2 text-white" />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={`text-sm flex-1 ${
                                                                    subtask.done
                                                                        ? `line-through ${theme.colors.textMuted}`
                                                                        : `${theme.colors.text}`
                                                                }`}
                                                            >
                                                                {subtask.text}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryView;
