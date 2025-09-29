// src/utils/storage.js

const STORAGE_KEYS = {
    USERS: "planner-users",
    CURRENT_USER: "planner-current-user",
    PLANNER_DATA: "planner-data",
};

export const storage = {
    // User management
    getUsers() {
        try {
            const users = localStorage.getItem(STORAGE_KEYS.USERS);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error("Error getting users:", error);
            return [];
        }
    },

    saveUser(userData) {
        try {
            const users = this.getUsers();
            const newUser = {
                ...userData,
                id: userData.id || Date.now().toString(),
            };
            users.push(newUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return newUser;
        } catch (error) {
            console.error("Error saving user:", error);
            return null;
        }
    },

    findUser(email, password) {
        const users = this.getUsers();
        return users.find(
            (user) => user.email === email && user.password === password
        );
    },

    removeUser(userId) {
        try {
            const users = this.getUsers();
            const filteredUsers = users.filter((user) => user.id !== userId);
            localStorage.setItem(
                STORAGE_KEYS.USERS,
                JSON.stringify(filteredUsers)
            );
        } catch (error) {
            console.error("Error removing user:", error);
        }
    },

    // Current user management
    getCurrentUser() {
        try {
            const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error getting current user:", error);
            return null;
        }
    },

    setCurrentUser(user) {
        try {
            localStorage.setItem(
                STORAGE_KEYS.CURRENT_USER,
                JSON.stringify(user)
            );
        } catch (error) {
            console.error("Error setting current user:", error);
        }
    },

    clearCurrentUser() {
        try {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } catch (error) {
            console.error("Error clearing current user:", error);
        }
    },

    // Planner data management
    getPlannerData(userId, date) {
        try {
            const key = `${STORAGE_KEYS.PLANNER_DATA}-${userId}-${date}`;
            const data = localStorage.getItem(key);
            return data
                ? JSON.parse(data)
                : { tasks: {}, lastUpdated: new Date().toISOString() };
        } catch (error) {
            console.error("Error getting planner data:", error);
            return { tasks: {}, lastUpdated: new Date().toISOString() };
        }
    },

    savePlannerData(userId, date, data) {
        try {
            const key = `${STORAGE_KEYS.PLANNER_DATA}-${userId}-${date}`;
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving planner data:", error);
        }
    },

    getPlannerDates(userId) {
        try {
            const dates = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (
                    key &&
                    key.startsWith(`${STORAGE_KEYS.PLANNER_DATA}-${userId}-`)
                ) {
                    const date = key.split("-").slice(-3).join("-"); // Extract date from key
                    dates.push(date);
                }
            }
            return dates;
        } catch (error) {
            console.error("Error getting planner dates:", error);
            return [];
        }
    },

    getAllPlannerDates(userId) {
        return this.getPlannerDates(userId);
    },

    // Clear all data (for testing/debugging)
    clearAllData() {
        try {
            // Clear all planner-related keys
            Object.values(STORAGE_KEYS).forEach((key) => {
                localStorage.removeItem(key);
            });
            // Also clear all planner data keys
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(STORAGE_KEYS.PLANNER_DATA)) {
                    localStorage.removeItem(key);
                }
            }
            // Clear any other planner-related keys
            Object.keys(localStorage).forEach((key) => {
                if (
                    key.startsWith("planner-") ||
                    key.startsWith("lastSyncTime")
                ) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error("Error clearing all data:", error);
        }
    },

    // Clear user-specific data only
    clearUserData(userId) {
        try {
            // Clear current user
            this.clearCurrentUser();
            // Clear all planner data for this user
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (
                    key &&
                    key.startsWith(`${STORAGE_KEYS.PLANNER_DATA}-${userId}-`)
                ) {
                    localStorage.removeItem(key);
                }
            }
            // Clear sync time
            localStorage.removeItem("lastSyncTime");
        } catch (error) {
            console.error("Error clearing user data:", error);
        }
    },
};

export default storage;
