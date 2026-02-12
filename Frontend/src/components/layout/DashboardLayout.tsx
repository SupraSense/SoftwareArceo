import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, PanelLeft, User, LogOut } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
import { authService } from '../../auth/authService';
import { ThemeToggle } from '../ui/ThemeToggle';

export const DashboardLayout: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [initials, setInitials] = useState('LA');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authService.checkAuth();
                if (data.authenticated && data.user) {
                    const u = data.user;
                    const first = (u.firstName || u.given_name || '').charAt(0).toUpperCase();
                    const last = (u.lastName || u.family_name || '').charAt(0).toUpperCase();
                    setInitials(first + last || 'U');
                }
            } catch (error) {
                console.error('Error fetching user for initials:', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
            {/* Sidebar Desktop - Static Flex Item */}
            <div className="hidden md:flex md:w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar className="h-full" />
            </div>

            {/* Sidebar Mobile - Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setMenuOpen(false)}
                    ></div>
                    <div className="fixed inset-y-0 left-0 flex flex-col z-50 w-64">
                        <Sidebar className="h-full shadow-xl" onClose={() => setMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-64 h-screen w-full">
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shrink-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setMenuOpen(true)}
                        >
                            <PanelLeft size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold border border-primary-200 dark:border-primary-700/50 hover:bg-primary-200 transition-colors"
                            >
                                {initials}
                            </button>

                            {profileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-40">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Mi Cuenta</p>
                                        </div>
                                        <Link
                                            to="/app/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <User size={16} />
                                            Mi Perfil
                                        </Link>
                                        <button
                                            onClick={() => authService.logout()}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
