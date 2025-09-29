"use client";

// src/components/Auth.jsx

import React, { useEffect, useState } from "react";
import { Calendar, User, Loader2, Trash2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import storage from "../utils/storage";

const Auth = ({ onLogin }) => {
    const { theme } = useTheme();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [existingUsers, setExistingUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const users = storage.getUsers();
        setExistingUsers(users);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (isLogin) {
            try {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (res.ok) {
                    const user = await res.json();

                    // Ensure 'id' exists before storing locally
                    if (!user.id) {
                        user.id = Date.now().toString();
                    }

                    // Save to localStorage if not already present
                    const existing = storage
                        .getUsers()
                        .find((u) => u.email === user.email);
                    if (!existing) {
                        storage.saveUser(user);
                    }

                    storage.setCurrentUser(user);
                    onLogin(user);
                    return;
                }
            } catch (err) {
                console.warn(
                    "Backend login failed, falling back to localStorage...",
                    err
                );
            }

            const user = storage.findUser(email, password);
            if (user) {
                storage.setCurrentUser(user);
                onLogin(user);
            } else {
                setError(
                    "Invalid email or password (not found in backend or local)"
                );
            }
        } else {
            if (existingUsers.find((u) => u.email === email)) {
                setError("Email already exists");
                setLoading(false);
                return;
            }
            const newUser = storage.saveUser({
                email,
                password,
                createdAt: new Date().toISOString(),
            });
            storage.setCurrentUser(newUser);
            onLogin(newUser);
        }

        setLoading(false);
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setEmail(user.email);
    };

    const clearSelectedUser = () => {
        setSelectedUser(null);
        setEmail("");
        setPassword("");
    };
    const handleRemoveUser = (userId) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this user?"
        );
        if (!confirmed) return;

        storage.removeUser(userId);
        setExistingUsers(storage.getUsers());

        // Also reset selection if the selected user is removed
        if (selectedUser?.id === userId) {
            clearSelectedUser();
        }
    };

    return (
        <div
            className={`min-h-screen ${theme.colors.backgroundGradient} flex items-center justify-center p-4`}
        >
            <div
                className={`${theme.colors.backgroundSecondary} rounded-2xl shadow-xl p-8 w-full max-w-md relative`}
            >
                <div className="absolute top-4 right-4">
                    <ThemeSelector />
                </div>

                <div className="text-center mb-8">
                    <div
                        className={`${theme.colors.primaryLight} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                    >
                        <Calendar
                            className={`w-8 h-8 ${theme.colors.primaryText}`}
                        />
                    </div>
                    <h1
                        className={`text-3xl font-bold ${theme.colors.text} mb-2`}
                    >
                        Day Planner
                    </h1>
                    <p className={theme.colors.textSecondary}>
                        Organize your day, achieve your goals
                    </p>
                </div>

                {isLogin && !selectedUser && existingUsers.length > 0 && (
                    <div className="mb-6">
                        <p
                            className={`mb-2 text-sm font-semibold ${theme.colors.text}`}
                        >
                            Select Existing User:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {existingUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center justify-between gap-2 px-3 py-2 border ${theme.colors.borderInput} rounded-lg ${theme.colors.inputBg} ${theme.colors.text}`}
                                >
                                    <button
                                        onClick={() => handleSelectUser(user)}
                                        className="flex items-center gap-2 flex-grow text-left hover:underline"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="truncate text-sm">
                                            {user.email}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRemoveUser(user.id)
                                        }
                                        className="text-xs text-red-500 hover:pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label
                            className={`block text-sm font-medium ${theme.colors.text} mb-2`}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!!selectedUser}
                            className={`w-full px-4 py-3 border ${theme.colors.borderInput} ${theme.colors.inputBg} ${theme.colors.text} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent transition-colors disabled:opacity-60`}
                            placeholder="Enter your email"
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSubmit(e)
                            }
                        />
                        {selectedUser && (
                            <button
                                type="button"
                                onClick={clearSelectedUser}
                                className={`mt-1 text-xs underline ${theme.colors.primaryTextHover}`}
                            >
                                Choose a different user
                            </button>
                        )}
                    </div>

                    <div>
                        <label
                            className={`block text-sm font-medium ${theme.colors.text} mb-2`}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 border ${theme.colors.borderInput} ${theme.colors.inputBg} ${theme.colors.text} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent transition-colors`}
                            placeholder="Enter your password"
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSubmit(e)
                            }
                        />
                    </div>

                    {error && (
                        <div
                            className={`${theme.colors.error} rounded-lg p-3 text-sm`}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 ${
                            theme.colors.primary
                        } text-white py-3 px-4 rounded-lg font-medium ${
                            theme.colors.primaryHover
                        } transition-colors focus:ring-2 ${
                            theme.colors.ring
                        } focus:ring-offset-2 ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading && (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        )}
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                clearSelectedUser();
                            }}
                            className={`${theme.colors.primaryText} ${theme.colors.primaryTextHover} font-medium`}
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
