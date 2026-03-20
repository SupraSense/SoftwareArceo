import { useCallback, useState } from 'react';
import { planillaService } from '../services/planillaMensualService';
import { useNotification } from './useNotification';
import type { 
  PlanillaMensual, 
  UpdateDiaPayload, 
  RegistrarPernoctaPayload, 
  RegistrarConexionPayload, 
  RegistrarDesconexionPayload 
} from '../types/planilla';

export const usePlanillaMensual = (choferId?: number, mes?: number, anio?: number) => {
  const [planilla, setPlanilla] = useState<PlanillaMensual | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const notify = useNotification();

  const fetchPlanilla = useCallback(async () => {
    if (!choferId || !mes || !anio) return;
    
    setIsLoading(true);
    try {
      const data = await planillaService.getPlanilla(choferId, mes, anio);
      setPlanilla(data);
    } catch (error: any) {
      notify.showServerError(error, 'Error al cargar la planilla');
      setPlanilla(null);
    } finally {
      setIsLoading(false);
    }
  }, [choferId, mes, anio]);

  const updateDia = async (diaId: string, payload: UpdateDiaPayload) => {
    setIsUpdating(true);
    try {
      const updatedDia = await planillaService.updateDia(diaId, payload);
      // Actualizar el estado local usando optimista actualizacion en el listado
      setPlanilla(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dias: prev.dias.map(d => d.id === diaId ? updatedDia : d) // asume returns fully joined dia
        };
      });
      notify.showSuccess('Día actualizado correctamente');
      return updatedDia;
    } catch (error: any) {
      notify.showServerError(error, 'Error al actualizar el día');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const addPernocta = async (diaId: string, payload: RegistrarPernoctaPayload) => {
    setIsUpdating(true);
    try {
      const pernocta = await planillaService.registrarPernocta(diaId, payload);
      setPlanilla(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dias: prev.dias.map(d => d.id === diaId ? { ...d, pernocta } : d)
        };
      });
      notify.showSuccess('Pernocta registrada');
      return pernocta;
    } catch (error: any) {
      notify.showServerError(error, 'Error al registrar pernocta');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const addConexion = async (diaId: string, payload: RegistrarConexionPayload) => {
    setIsUpdating(true);
    try {
      const conexion = await planillaService.registrarConexion(diaId, payload);
      setPlanilla(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dias: prev.dias.map(d => d.id === diaId ? { ...d, conexiones: [...d.conexiones, conexion] } : d)
        };
      });
      notify.showSuccess('Conexión registrada');
      return conexion;
    } catch (error: any) {
      notify.showServerError(error, 'Error al registrar conexión');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const addDesconexion = async (diaId: string, payload: RegistrarDesconexionPayload) => {
    setIsUpdating(true);
    try {
      const desconexion = await planillaService.registrarDesconexion(diaId, payload);
      setPlanilla(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dias: prev.dias.map(d => d.id === diaId ? { ...d, desconexiones: [...d.desconexiones, desconexion] } : d)
        };
      });
      notify.showSuccess('Desconexión registrada');
      return desconexion;
    } catch (error: any) {
      notify.showServerError(error, 'Error al registrar desconexión');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    planilla,
    isLoading,
    isUpdating,
    fetchPlanilla,
    updateDia,
    addPernocta,
    addConexion,
    addDesconexion
  };
};
