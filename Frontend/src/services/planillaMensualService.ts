import api from './api';
import type { 
  PlanillaMensual, 
  DiaPlanilla, 
  Pernocta, 
  Conexion, 
  Desconexion, 
  UpdateDiaPayload, 
  RegistrarPernoctaPayload, 
  RegistrarConexionPayload, 
  RegistrarDesconexionPayload 
} from '../types/planilla';

const API_URL = '/planillas';

export const planillaService = {
  getPlanilla: async (choferId: number, mes: number, anio: number): Promise<PlanillaMensual> => {
    const response = await api.get(API_URL, {
      params: { choferId, mes, anio }
    });
    return response.data;
  },

  updateDia: async (diaId: string, payload: UpdateDiaPayload): Promise<DiaPlanilla> => {
    const response = await api.patch(`${API_URL}/dias/${diaId}`, payload);
    return response.data;
  },

  registrarPernocta: async (diaId: string, payload: RegistrarPernoctaPayload): Promise<Pernocta> => {
    const response = await api.post(`${API_URL}/dias/${diaId}/pernocta`, payload);
    return response.data;
  },

  registrarConexion: async (diaId: string, payload: RegistrarConexionPayload): Promise<Conexion> => {
    const response = await api.post(`${API_URL}/dias/${diaId}/conexion`, payload);
    return response.data;
  },

  registrarDesconexion: async (diaId: string, payload: RegistrarDesconexionPayload): Promise<Desconexion> => {
    const response = await api.post(`${API_URL}/dias/${diaId}/desconexion`, payload);
    return response.data;
  }
};
