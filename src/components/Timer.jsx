"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";

const Timer = () => {
    const { theme } = useTheme();
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [inputMinutes, setInputMinutes] = useState(25);
    const [inputSeconds, setInputSeconds] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning && !isPaused) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsRunning(false);
                        setIsPaused(false);
                        // Play notification sound
                        playNotificationSound();
                        // Show toast notification
                        toast.success("Timer Complete! ⏰", {
                            description: "Your timer has finished!",
                            duration: 5000,
                        });
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, isPaused]);

    const playNotificationSound = () => {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Configure the beep sound
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz frequency
            oscillator.type = "sine";

            // Set volume
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.5
            );

            // Play the sound
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);

            // Play a second beep for better notification
            setTimeout(() => {
                const oscillator2 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();

                oscillator2.connect(gainNode2);
                gainNode2.connect(audioContext.destination);

                oscillator2.frequency.setValueAtTime(
                    800,
                    audioContext.currentTime
                );
                oscillator2.type = "sine";

                gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode2.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioContext.currentTime + 0.5
                );

                oscillator2.start(audioContext.currentTime);
                oscillator2.stop(audioContext.currentTime + 0.5);
            }, 200);
        } catch (error) {
            console.log("Audio notification not available:", error);
            // Fallback: try to play a simple system beep
            try {
                const audio = new Audio(
                    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
                );
                audio.play().catch(() => {
                    console.log("Fallback audio also not available");
                });
            } catch (fallbackError) {
                console.log("No audio notification available");
            }
        }
    };

    const startTimer = () => {
        if (time === 0) {
            setTime(inputMinutes * 60 + inputSeconds);
        }
        setIsRunning(true);
        setIsPaused(false);
    };

    const pauseTimer = () => {
        setIsPaused(true);
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleInputChange = (type, value) => {
        const numValue = parseInt(value) || 0;
        if (type === "minutes") {
            setInputMinutes(Math.min(59, Math.max(0, numValue)));
        } else {
            setInputSeconds(Math.min(59, Math.max(0, numValue)));
        }
    };

    return (
        <div
            className={`${theme.colors.cardBg} ${theme.colors.shadow} rounded-2xl border ${theme.colors.border} p-4 sm:p-6 backdrop-blur-sm`}
        >
            <div className="text-center">
                <h3
                    className={`text-lg font-semibold ${theme.colors.text} mb-4`}
                >
                    Timer
                </h3>

                {/* Time Display */}
                <div
                    className={`text-4xl sm:text-5xl font-mono font-bold ${theme.colors.text} mb-6`}
                >
                    {formatTime(time)}
                </div>

                {/* Input Controls */}
                {time === 0 && !isRunning && (
                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex flex-col items-center">
                                <label
                                    className={`text-sm ${theme.colors.textSecondary} mb-1`}
                                >
                                    Minutes
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={inputMinutes}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "minutes",
                                            e.target.value
                                        )
                                    }
                                    className={`w-16 px-2 py-1 text-center border ${theme.colors.borderInput} rounded ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 ${theme.colors.ring} focus:border-transparent`}
                                />
                            </div>
                            <span
                                className={`text-2xl ${theme.colors.textSecondary} mt-6`}
                            >
                                :
                            </span>
                            <div className="flex flex-col items-center">
                                <label
                                    className={`text-sm ${theme.colors.textSecondary} mb-1`}
                                >
                                    Seconds
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={inputSeconds}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "seconds",
                                            e.target.value
                                        )
                                    }
                                    className={`w-16 px-2 py-1 text-center border ${theme.colors.borderInput} rounded ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 ${theme.colors.ring} focus:border-transparent`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-3">
                    {!isRunning ? (
                        <button
                            onClick={startTimer}
                            className={`${theme.colors.primary} text-white px-6 py-2 rounded-lg font-medium transition-colors ${theme.colors.primaryHover} flex items-center gap-2`}
                        >
                            <Play className="w-4 h-4" />
                            Start
                        </button>
                    ) : (
                        <button
                            onClick={pauseTimer}
                            className={`${theme.colors.primary} text-white px-6 py-2 rounded-lg font-medium transition-colors ${theme.colors.primaryHover} flex items-center gap-2`}
                        >
                            <Pause className="w-4 h-4" />
                            Pause
                        </button>
                    )}

                    <button
                        onClick={resetTimer}
                        className={`${theme.colors.progressBg} ${theme.colors.textSecondary} px-6 py-2 rounded-lg font-medium transition-colors hover:${theme.colors.borderInput} flex items-center gap-2`}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>

                {/* Progress Bar */}
                {time > 0 && (
                    <div className="mt-6">
                        <div
                            className={`${theme.colors.progressBg} rounded-full h-2`}
                        >
                            <div
                                className={`${theme.colors.progressFill} h-2 rounded-full transition-all duration-1000`}
                                style={{
                                    width: `${
                                        ((inputMinutes * 60 +
                                            inputSeconds -
                                            time) /
                                            (inputMinutes * 60 +
                                                inputSeconds)) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timer;
