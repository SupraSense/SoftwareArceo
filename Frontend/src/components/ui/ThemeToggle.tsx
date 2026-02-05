import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all duration-200"
            aria-label="Toggle Dark Mode"
            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
            {theme === 'light' ? (
                <Sun className="h-5 w-5 text-orange-500 transition-transform duration-500 rotate-0 hover:rotate-90" />
            ) : (
                <Moon className="h-5 w-5 text-blue-400 transition-transform duration-500 rotate-0 hover:-rotate-12" />
            )}
        </button>
    );
}
