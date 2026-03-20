import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { 
  DiaPlanilla, 
  EstadoDia,
  UpdateDiaPayload
} from '../../types/planilla';
import { updateDiaSchemaZod } from '../../schemasZod/planillaSchemas';
import { Moon, Link as LinkIcon, Unlink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNotification } from '../../hooks/useNotification';

interface DiaRowProps {
  dia: DiaPlanilla;
  onUpdateDia: (diaId: string, payload: UpdateDiaPayload) => Promise<any>;
  onOpenEvento: (tipo: 'PERNOCTA' | 'CONEXION' | 'DESCONEXION', diaId: string, fecha: string) => void;
}

export const DiaRow: React.FC<DiaRowProps> = ({ dia, onUpdateDia, onOpenEvento }) => {
  const notify = useNotification();
  const fechaStr = format(new Date(dia.fecha), 'EEE. dd MMM', { locale: es });
  const fechaModalStr = format(new Date(dia.fecha), 'yyyy-MM-dd');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<UpdateDiaPayload>({
    resolver: zodResolver(updateDiaSchemaZod),
    defaultValues: {
      estado: dia.estado,
      observacion: dia.observacion || ''
    }
  });

  // Keep form in sync if external data changes
  useEffect(() => {
    reset({ estado: dia.estado, observacion: dia.observacion || '' });
  }, [dia, reset]);

  const handleUpdate = async (data: UpdateDiaPayload) => {
    // Solo enviar si hubo cambios reales respecto a los props base
    if (data.estado === dia.estado && data.observacion === (dia.observacion || '')) {
      return;
    }
    try {
      await onUpdateDia(dia.id, data);
    } catch {
      // Revertir a valores previos en caso de error
      reset({ estado: dia.estado, observacion: dia.observacion || '' });
    }
  };

  const getDayRowClass = () => {
    const isWeekend = new Date(dia.fecha).getDay() === 0 || new Date(dia.fecha).getDay() === 6;
    return isWeekend ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800';
  };

  // On blur triggering submit for seamless user experience
  const onBlurSubmit = () => {
    handleSubmit(handleUpdate)();
  };

  // On change state triggering submit immediately for Select
  const onStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value as EstadoDia;
    const currentObs = watch('observacion');
    if (newVal !== dia.estado) {
      handleUpdate({ estado: newVal, observacion: currentObs });
    }
  };

  return (
    <tr className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${getDayRowClass()}`}>
      {/* Fecha */}
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize font-medium whitespace-nowrap">
        {fechaStr}
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <select
          {...register('estado')}
          onChange={(e) => {
            // we override react-hook-form onChange locally to submit immediately
            register('estado').onChange(e);
            onStateChange(e);
          }}
          className={`w-full max-w-[140px] text-sm rounded-md border p-1.5 focus:ring-1 
            ${errors.estado ? 'border-red-500 ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}
            ${dia.estado === 'TRABAJO' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' : ''}
            ${dia.estado === 'FRANCO' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400' : ''}
            ${dia.estado === 'VACACIONES' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400' : ''}
            dark:bg-gray-700 dark:text-white transition-colors`}
        >
          <option value="TRABAJO">T (Trabajo)</option>
          <option value="FRANCO">F (Franco)</option>
          <option value="VACACIONES">V (Vacaciones)</option>
        </select>
      </td>

      {/* Novedades (OT) */}
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 italic whitespace-nowrap">
        Sin novedades
      </td>

      {/* Eventos: Pernocta, Conexión, Desconexión */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pernocta Button */}
          <button
            onClick={() => {
              if (dia.pernocta) {
                notify.showInfo('Ya existe una pernocta registrada para este día.');
                return;
              }
              onOpenEvento('PERNOCTA', dia.id, fechaModalStr);
            }}
            title={dia.pernocta ? `Pernoctó en ${dia.pernocta.ubicacion} (${dia.pernocta.patente})` : 'Marcar Pernocta'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors 
              ${dia.pernocta 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400 cursor-not-allowed cursor-help' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Pernocta {dia.pernocta ? '(1)' : ''}</span>
          </button>

          {/* Conexiones Button */}
          <button
            onClick={() => onOpenEvento('CONEXION', dia.id, fechaModalStr)}
            title="Registrar Conexión"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors 
              ${dia.conexiones.length > 0 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Conex {dia.conexiones.length > 0 ? `(${dia.conexiones.length})` : ''}</span>
          </button>

          {/* Desconexiones Button */}
          <button
            onClick={() => onOpenEvento('DESCONEXION', dia.id, fechaModalStr)}
            title="Registrar Desconexión"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors 
              ${dia.desconexiones.length > 0 
                ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>Desconex {dia.desconexiones.length > 0 ? `(${dia.desconexiones.length})` : ''}</span>
          </button>
        </div>
      </td>

      {/* Observación */}
      <td className="px-4 py-3">
        <div className="relative w-full min-w-[200px]">
          <input
            {...register('observacion')}
            onBlur={(e) => {
              register('observacion').onBlur(e);
              onBlurSubmit();
            }}
            type="text"
            placeholder="Observaciones del día..."
            className={`w-full text-sm rounded-md border p-1.5 bg-gray-50 focus:bg-white focus:ring-1 
              ${errors.observacion ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'}
              dark:bg-gray-700/50 dark:focus:bg-gray-700 dark:text-white transition-colors`}
          />
          {errors.observacion && (
            <span className="absolute -bottom-4 left-0 text-red-500 text-[10px]">
              {errors.observacion.message as string}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};
