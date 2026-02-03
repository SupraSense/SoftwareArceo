import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, PanelLeft } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { authService } from '../../auth/authService';

export const DashboardLayout: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
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
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700"
                            onClick={() => setMenuOpen(true)}
                        >
                            <PanelLeft size={24} />
                        </button>
                        <button
                            onClick={() => authService.logout()}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                            LA
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
