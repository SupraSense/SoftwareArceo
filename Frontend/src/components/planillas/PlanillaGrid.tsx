import React, { useState } from 'react';
import type { PlanillaMensual } from '../../types/planilla';
import { DiaRow } from './DiaRow';
import { RegistroEventoDialog } from './RegistroEventoDialog';
import { usePlanillaMensual } from '../../hooks/usePlanillaMensual';

interface PlanillaGridProps {
  planilla: PlanillaMensual;
  usePlanillaHook: ReturnType<typeof usePlanillaMensual>;
}

export const PlanillaGrid: React.FC<PlanillaGridProps> = ({ planilla, usePlanillaHook }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    tipo: 'PERNOCTA' | 'CONEXION' | 'DESCONEXION' | null;
    diaId: string;
    fechaStr: string;
  }>({
    isOpen: false,
    tipo: null,
    diaId: '',
    fechaStr: ''
  });

  const handleOpenEvento = (tipo: 'PERNOCTA' | 'CONEXION' | 'DESCONEXION', diaId: string, fechaStr: string) => {
    setModalState({ isOpen: true, tipo, diaId, fechaStr });
  };

  const handleCloseEvento = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handeSubmitEvento = async (data: any) => {
    if (!modalState.tipo || !modalState.diaId) return;

    if (modalState.tipo === 'PERNOCTA') {
      await usePlanillaHook.addPernocta(modalState.diaId, data);
    } else if (modalState.tipo === 'CONEXION') {
      await usePlanillaHook.addConexion(modalState.diaId, data);
    } else if (modalState.tipo === 'DESCONEXION') {
      await usePlanillaHook.addDesconexion(modalState.diaId, data);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Planilla Mensual - Mes {planilla.mes}/{planilla.anio}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Fecha</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Estado</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Novedades (OT)</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Eventos (Pern/Conx/Desc)</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Observación</th>
            </tr>
          </thead>
          <tbody>
            {planilla.dias.map(dia => (
              <DiaRow 
                key={dia.id} 
                dia={dia} 
                onUpdateDia={usePlanillaHook.updateDia}
                onOpenEvento={handleOpenEvento}
              />
            ))}
          </tbody>
        </table>
      </div>

      {planilla.dias.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No hay días registrados para esta planilla.
        </div>
      )}

      {/* Modal Reutilizado */}
      <RegistroEventoDialog 
        isOpen={modalState.isOpen}
        tipo={modalState.tipo}
        fechaString={modalState.fechaStr}
        onClose={handleCloseEvento}
        onSubmit={handeSubmitEvento}
        isSubmitting={usePlanillaHook.isUpdating}
      />
    </div>
  );
};
