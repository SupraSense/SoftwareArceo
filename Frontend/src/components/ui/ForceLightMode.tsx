import React, { useLayoutEffect } from 'react';

export const ForceLightMode: React.FC = () => {
    useLayoutEffect(() => {
        // Prevent dark mode on this page, regardless of system preference or context
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');

        return () => {
            // Restore context preference if needed when unmounting
            // Note: Since ThemeContext also runs effects, this simple removal works for "while mounted"
            // If the user navigates away, the ThemeProvider should theoretically re-apply the correct class
            // if strict sync is needed. However, since the user is navigating to a protected route usually,
            // the Layout there should ensure the context theme is engaged. 
            // To be safe, we retrieve the stored theme from localStorage to restore strictly.
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches && !storedTheme) {
                // If system is dark and no preference, restore dark?
                // The ThemeContext usually handles this.
            }
        };
    }, []);

    return null;
};
