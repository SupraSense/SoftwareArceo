import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  registrarPernoctaSchemaZod, 
  registrarConexionSchemaZod, 
  registrarDesconexionSchemaZod
} from '../../schemasZod/planillaSchemas';

import { X } from 'lucide-react';

type EventoType = 'PERNOCTA' | 'CONEXION' | 'DESCONEXION';

interface RegistroEventoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: EventoType | null;
  fechaString: string; // ej "2026-03-26"
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const RegistroEventoDialog: React.FC<RegistroEventoDialogProps> = ({
  isOpen, onClose, tipo, fechaString, onSubmit, isSubmitting
}) => {
  // Select schema according to event type
  const resolver = tipo === 'PERNOCTA' 
    ? zodResolver(registrarPernoctaSchemaZod)
    : tipo === 'CONEXION' 
      ? zodResolver(registrarConexionSchemaZod)
      : zodResolver(registrarDesconexionSchemaZod);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
    resolver
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen || !tipo) return null;

  const getTitle = () => {
    switch (tipo) {
      case 'PERNOCTA': return `Registrar Pernocta - ${fechaString}`;
      case 'CONEXION': return `Registrar Conexión - ${fechaString}`;
      case 'DESCONEXION': return `Registrar Desconexión - ${fechaString}`;
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {getTitle()}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {tipo === 'PERNOCTA' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ¿Dónde pernoctó? *
              </label>
              <input 
                autoFocus
                type="text"
                placeholder="Ubicación o locación"
                {...register('ubicacion')}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ubicacion && <span className="text-red-500 text-sm">{errors.ubicacion.message as string}</span>}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Patente del Vehículo *
            </label>
            <input 
              autoFocus={tipo !== 'PERNOCTA'}
              type="text"
              placeholder="AB123CD"
              {...register('patente')}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.patente ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.patente && <span className="text-red-500 text-sm">{errors.patente.message as string}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : `Confirmar ${tipo.charAt(0) + tipo.slice(1).toLowerCase()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
