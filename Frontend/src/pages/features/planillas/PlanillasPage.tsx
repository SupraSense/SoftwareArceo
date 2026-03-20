import { useState, useEffect, useMemo } from 'react';
import { Settings, FileText, Download } from 'lucide-react';
import { usePersonal } from '../../../hooks/usePersonal';
import { usePlanillaMensual } from '../../../hooks/usePlanillaMensual';
import { PlanillaGrid } from '../../../components/planillas/PlanillaGrid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Personal } from '../../../types/personal';

export const PlanillasPage = () => {
  const { personal, isLoading: loadingPersonal } = usePersonal();
  
  const [selectedChoferId, setSelectedChoferId] = useState<number | undefined>();
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Derived mes & anio based on selectedPeriodo ('2026-03')
  const anio = parseInt(selectedPeriodo.split('-')[0], 10);
  const mes = parseInt(selectedPeriodo.split('-')[1], 10);

  const hookPlanilla = usePlanillaMensual(selectedChoferId, mes, anio);

  // Filtrar solo el personal que pertenece al Área "Chofer"
  const choferes = useMemo(() => {
    return personal.filter((p: Personal) => p.area?.toLowerCase().includes('chofer'));
  }, [personal]);

  useEffect(() => {
    if (selectedChoferId && mes && anio) {
      hookPlanilla.fetchPlanilla();
    }
  }, [selectedChoferId, selectedPeriodo]);

  const generatePeriodOptions = () => {
    const options = [];
    const current = new Date();
    // 2 años al pasado, 1 al futuro
    for (let i = -24; i <= 12; i++) {
       const date = new Date(current.getFullYear(), current.getMonth() + i, 1);
       options.push({
         value: format(date, 'yyyy-MM'),
         label: format(date, 'MMMM yyyy', { locale: es })
       });
    }
    return options;
  };

  const periodOptions = generatePeriodOptions();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planilla de Choferes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión mensual de choferes y eventos pre-remunerativos</p>
      </div>

      {/* Tarjeta de Filtros Principales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chofer
            </label>
            <select
              value={selectedChoferId || ''}
              onChange={(e) => setSelectedChoferId(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>Selecciona el chofer</option>
              {loadingPersonal && <option disabled>Cargando operarios...</option>}
              {!loadingPersonal && choferes.length === 0 && <option disabled>No hay choferes disponibles</option>}
              {choferes.map((c: Personal) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Período
            </label>
            <select
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white capitalize"
            >
              {periodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-700 flex-1 md:flex-none justify-center dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
            <Settings className="w-4 h-4" />
            Configurar Diagrama Base
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 flex-1 md:flex-none justify-center transition-colors">
            <FileText className="w-4 h-4" />
            Exportar Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 flex-1 md:flex-none justify-center transition-colors">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Resultados de la Grilla Diaria */}
      {selectedChoferId && selectedPeriodo ? (
        hookPlanilla.isLoading && !hookPlanilla.planilla ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
          </div>
        ) : hookPlanilla.planilla ? (
          <PlanillaGrid planilla={hookPlanilla.planilla} usePlanillaHook={hookPlanilla} />
        ) : (
           <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/50 border border-dashed rounded-xl dark:bg-gray-800/50">
             Hubo un problema recuperando la información para este período.
           </div>
        )
      ) : (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white/50 border border-dashed rounded-xl dark:bg-gray-800/50">
          Seleccione un Chofer y Período para comenzar a gestionar la planilla.
        </div>
      )}

    </div>
  );
};
