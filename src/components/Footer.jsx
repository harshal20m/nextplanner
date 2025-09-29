"use client";

import React from "react";
import { useTheme } from "../contexts/ThemeContext"; // Import useTheme

const Footer = () => {
    const { theme } = useTheme(); // Use the theme hook

    return (
        <footer className="flex justify-center items-center py-4 px-4 max-w-6xl mx-auto">
            <div
                className={`inline-flex items-center px-3 py-1.5 rounded-full ${theme.colors.backgroundSecondary} backdrop-blur-sm border border-opacity-20 ${theme.colors.border}`}
            >
                <p className={`text-xs ${theme.colors.textMuted} font-normal`}>
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
    );
};

export default Footer;
