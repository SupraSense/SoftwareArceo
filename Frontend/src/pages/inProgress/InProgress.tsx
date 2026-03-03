import React from 'react';
import { Construction } from 'lucide-react';

export const InProgress: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-full mb-6">
                <Construction className="w-16 h-16 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Funcionalidad en implementación
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Estamos trabajando duro para traerte esta funcionalidad pronto.
                ¡Mantente atento a las próximas actualizaciones!
            </p>
        </div>
    );
};
