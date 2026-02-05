import { createContext, useState, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        // 1. Check localStorage
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme | null;
            if (savedTheme) {
                return savedTheme;
            }

            // 2. Check System Preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }

        return 'light';
    });

    useLayoutEffect(() => {
        const root = window.document.documentElement;

        // Remove both to ensure no conflicts, though usually removing the opposite is enough
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
