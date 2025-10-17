"use client";

import React, { useEffect, useState } from "react";
import { Calendar, History, AlertTriangle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import TimeSlot from "./TimeSlot";
import AddTimeSlot from "./AddTimeSlot";
import HistoryView from "./History";
import storage from "../utils/storage";
import { parseTimeForSorting } from "../utils/timeUtils";
import SyncControls from "./SyncControls";
import Clock from "./Clock";
import ProfileDropdown from "./ProfileDropdown";
import Timer from "./Timer";
import WeeklyStats from "./WeeklyStats";
import WeeklyGoal from "./WeeklyGoal";
import DayStrip from "./DayStrip";
import { toast } from "sonner";

const Planner = ({ user, onLogout, isGuest = false }) => {
    const { theme } = useTheme();
    const [currentDate, setCurrentDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [tasks, setTasks] = useState({});
    const [view, setView] = useState("today");

    const [showUsePreviousModal, setShowUsePreviousModal] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [showTimer, setShowTimer] = useState(false);
    const [showStats, setShowStats] = useState(false);

    // Default slot is now optional; do not force it into the UI list
    const defaultTimeSlots = [];

    useEffect(() => {
        const data = storage.getPlannerData(user.id, currentDate);
        setTasks(data.tasks || {});
    }, [currentDate, user.id]);

    useEffect(() => {
        if (showUsePreviousModal) {
            const allDates = storage.getPlannerDates(user.id);
            const pastDates = allDates
                .filter((d) => d < currentDate)
                .sort((a, b) => new Date(b) - new Date(a)) // sort descending
                .slice(0, 7); // take last 7
            setAvailableDates(pastDates);
        }
    }, [showUsePreviousModal, currentDate, user.id]);

    const saveTasksToStorage = (newTasks) => {
        const data = storage.getPlannerData(user.id, currentDate);
        data.tasks = newTasks;
        data.lastUpdated = new Date().toISOString();
        storage.savePlannerData(user.id, currentDate, data);
    };

    const handleUpdateTask = (time, updatedTask) => {
        const newTasks = {
            ...tasks,
            [time]: { ...updatedTask, updatedAt: new Date().toISOString() },
        };
        setTasks(newTasks);
        saveTasksToStorage(newTasks);
    };

    const handleDeleteTask = (time) => {
        const newTasks = { ...tasks };
        delete newTasks[time];
        setTasks(newTasks);
        saveTasksToStorage(newTasks);
    };

    const handleEditTime = (oldTime, newTime) => {
        if (oldTime === newTime) return;

        const newTasks = { ...tasks };
        if (newTasks[oldTime]) {
            newTasks[newTime] = {
                ...newTasks[oldTime],
                updatedAt: new Date().toISOString(),
            };
            delete newTasks[oldTime];
        }
        setTasks(newTasks);
        saveTasksToStorage(newTasks);
    };

    const handleAddTimeSlot = (timeSlot) => {
        if (!tasks[timeSlot]) {
            const newTasks = {
                ...tasks,
                [timeSlot]: { subtasks: [] },
            };
            setTasks(newTasks);
            saveTasksToStorage(newTasks);
        }
    };

    const handleUsePreviousPlan = (fromDate) => {
        const prevData = storage.getPlannerData(user.id, fromDate);
        if (!prevData?.tasks) return;

        const mergedTasks = { ...tasks }; // Start with today's tasks

        for (const [time, oldTask] of Object.entries(prevData.tasks)) {
            if (!mergedTasks[time]) {
                // Time slot doesn't exist yet, add it directly
                mergedTasks[time] = { ...oldTask };
            } else {
                // Merge subtasks (avoid duplicate text)
                const existingSubtasks = mergedTasks[time].subtasks || [];
                const existingTexts = new Set(
                    existingSubtasks.map((s) => s.text)
                );
                const newSubtasks =
                    oldTask.subtasks?.filter(
                        (s) => !existingTexts.has(s.text)
                    ) || [];
                mergedTasks[time].subtasks = [
                    ...existingSubtasks,
                    ...newSubtasks,
                ];
            }
        }

        setTasks(mergedTasks);
        saveTasksToStorage(mergedTasks);
        setShowUsePreviousModal(false);
    };

    const allTimeSlots = Object.keys(tasks).sort(
        (a, b) => parseTimeForSorting(a) - parseTimeForSorting(b)
    );

    const todayStats = () => {
        let total = 0;
        let completed = 0;
        Object.values(tasks).forEach((slot) => {
            if (slot?.subtasks) {
                total += slot.subtasks.length;
                completed += slot.subtasks.filter((s) => s.done).length;
            }
        });
        return { total, completed };
    };

    const stats = todayStats();

    // Get current day name
    const getCurrentDay = () => {
        const today = new Date();
        return today.toLocaleDateString("en-US", { weekday: "long" });
    };

    // Toggle timer visibility
    const toggleTimer = () => {
        setShowTimer(!showTimer);
    };

    // Toggle stats visibility
    const toggleStats = () => {
        setShowStats(!showStats);
    };

    return (
        <div
            className={`min-h-screen ${theme.colors.background} flex flex-col`}
        >
            <div
                className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} border-b ${theme.colors.border} backdrop-blur-sm relative z-50`}
            >
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Header Section */}
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div
                                    className={`${theme.colors.primaryLight} rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0`}
                                >
                                    <Calendar
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.colors.primaryText}`}
                                    />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                    <h1
                                        className={`text-lg sm:text-xl md:text-2xl font-bold ${theme.colors.text} truncate`}
                                    >
                                        Day Planner
                                    </h1>
                                    <p
                                        className={`text-xs sm:text-sm md:text-base ${theme.colors.textSecondary} truncate`}
                                    >
                                        Welcome back,{" "}
                                        {user.name ||
                                            (isGuest ? "Guest" : "User")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2">
                                <div className="hidden sm:block">
                                    <Clock />
                                </div>
                                <div className="sm:hidden">
                                    <Clock />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Section */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => setView("today")}
                                    className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base touch-manipulation ${
                                        view === "today"
                                            ? `${theme.colors.primary} text-white`
                                            : `${theme.colors.textSecondary} ${theme.colors.primaryTextHover} ${theme.colors.hoverBg}`
                                    }`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setView("history")}
                                    className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base flex items-center touch-manipulation ${
                                        view === "history"
                                            ? `${theme.colors.primary} text-white`
                                            : `${theme.colors.textSecondary} ${theme.colors.primaryTextHover} ${theme.colors.hoverBg}`
                                    }`}
                                >
                                    <History className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">
                                        History
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2">
                                <ThemeSelector />
                                <SyncControls isGuest={isGuest} user={user} />
                                {isGuest && (
                                    <button
                                        onClick={() => {
                                            toast.warning("Guest Mode", {
                                                description:
                                                    "Your data is stored locally and may be lost if you clear browser data or use a different device.",
                                                duration: 6000,
                                            });
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${theme.colors.hoverBg} ${theme.colors.textMuted} hover:${theme.colors.textSecondary} touch-manipulation`}
                                        title="Guest Mode - Click for info"
                                    >
                                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                                <ProfileDropdown
                                    user={user}
                                    onLogout={onLogout}
                                    isGuest={isGuest}
                                    showTimer={showTimer}
                                    onToggleTimer={toggleTimer}
                                    showStats={showStats}
                                    onToggleStats={toggleStats}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl sm:mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1">
                {/* Timer Section */}
                {showTimer && (
                    <div className="mb-6">
                        <Timer />
                    </div>
                )}

                {/* Weekly Stats Section */}
                {showStats && (
                    <div className="mb-6">
                        <WeeklyStats userId={user.id} />
                    </div>
                )}

                {view === "today" ? (
                    <>
                        {/* Weekly Goal and Day Strip Row */}
                        <div className="flex flex-col lg:flex-row sm:gap-4 mb-4 sm:mb-6">
                            <div className="flex-1">
                                <WeeklyGoal userId={user.id} />
                            </div>
                            <div className="lg:w-80">
                                <DayStrip />
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <div className="min-w-0 flex-1">
                                    <h2
                                        className={`text-lg sm:text-xl font-semibold ${theme.colors.text} truncate`}
                                    >
                                        {currentDate ===
                                        new Date().toISOString().split("T")[0]
                                            ? "Today"
                                            : currentDate}
                                    </h2>
                                    <p
                                        className={`${theme.colors.textSecondary} text-sm sm:text-base`}
                                    >
                                        {stats.completed} of {stats.total} tasks
                                        completed
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={currentDate}
                                        onChange={(e) =>
                                            setCurrentDate(e.target.value)
                                        }
                                        className={`px-3 py-2 border ${theme.colors.borderInput} ${theme.colors.inputBg} ${theme.colors.text} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent text-sm sm:text-base touch-manipulation`}
                                    />
                                </div>
                            </div>

                            {stats.total > 0 && (
                                <div
                                    className={`${theme.colors.progressBg} rounded-full h-2 mb-4 sm:mb-6`}
                                >
                                    <div
                                        className={`${theme.colors.progressFill} h-2 rounded-full transition-all duration-300`}
                                        style={{
                                            width: `${
                                                (stats.completed /
                                                    stats.total) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {allTimeSlots.map((time) => (
                                <TimeSlot
                                    key={time}
                                    time={time}
                                    task={tasks[time]}
                                    onUpdateTask={handleUpdateTask}
                                    onDeleteTask={handleDeleteTask}
                                    onEditTime={handleEditTime}
                                />
                            ))}
                            <AddTimeSlot onAddTimeSlot={handleAddTimeSlot} />
                            <div
                                className={`${theme.colors.cardBg} ${theme.colors.shadow} rounded-2xl border-2 border-dashed ${theme.colors.borderInput} p-6 text-center hover:${theme.colors.borderHover} transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm`}
                            >
                                <button
                                    onClick={() =>
                                        setShowUsePreviousModal(true)
                                    }
                                    className={`flex items-center justify-center space-x-2 w-full ${theme.colors.textSecondary} ${theme.colors.primaryTextHover} transition-colors`}
                                >
                                    Use Previous Plan
                                </button>
                            </div>
                        </div>

                        {showUsePreviousModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                                <div
                                    className={`p-6 max-w-sm w-full rounded-2xl ${theme.colors.shadow} border ${theme.colors.backgroundSecondary} ${theme.colors.border} backdrop-blur-sm`}
                                >
                                    <h3
                                        className={`text-lg font-semibold mb-4 ${theme.colors.text}`}
                                    >
                                        Select a previous date
                                    </h3>

                                    {availableDates.length === 0 ? (
                                        <p
                                            className={
                                                theme.colors.textSecondary
                                            }
                                        >
                                            No previous plans found.
                                        </p>
                                    ) : (
                                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                                            {availableDates.map((date) => (
                                                <li key={date}>
                                                    <button
                                                        onClick={() =>
                                                            handleUsePreviousPlan(
                                                                date
                                                            )
                                                        }
                                                        className={`w-full text-left px-4 py-2 rounded-lg transition font-normal ${theme.colors.hoverBg} ${theme.colors.textSecondary} ${theme.colors.primaryTextHover}`}
                                                    >
                                                        {date}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() =>
                                                setShowUsePreviousModal(false)
                                            }
                                            className={`text-sm font-medium transition ${theme.colors.textSecondary} ${theme.colors.primaryTextHover}`}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <HistoryView userId={user.id} />
                )}
            </div>

            {/* Footer */}
            <footer className="flex justify-center items-center py-4 px-4 max-w-6xl mx-auto mt-auto">
                <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full ${theme.colors.backgroundSecondary} backdrop-blur-sm border border-opacity-20 ${theme.colors.border}`}
                >
                    <p
                        className={`text-xs ${theme.colors.textMuted} font-normal`}
                    >
                        Made with <span className="text-red-500">♥</span> by{" "}
                        <a
                            href="https://harshalmali.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${theme.colors.primaryText} ${theme.colors.primaryTextHover} hover:underline transition-colors font-medium`}
                        >
                            HM
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Planner;
