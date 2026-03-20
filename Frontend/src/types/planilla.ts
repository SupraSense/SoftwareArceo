export type EstadoDia = 'TRABAJO' | 'FRANCO' | 'VACACIONES';

export interface Pernocta {
  id: string;
  diaPlanillaId: string;
  ubicacion: string;
  patente: string;
}

export interface Conexion {
  id: string;
  diaPlanillaId: string;
  patente: string;
}

export interface Desconexion {
  id: string;
  diaPlanillaId: string;
  patente: string;
}

export interface DiaPlanilla {
  id: string;
  planillaId: string;
  fecha: string;
  estado: EstadoDia;
  observacion?: string | null;
  pernocta: Pernocta | null;
  conexiones: Conexion[];
  desconexiones: Desconexion[];
}

export interface PlanillaMensual {
  id: string;
  choferId: number;
  mes: number;
  anio: number;
  dias: DiaPlanilla[];
}

export interface UpdateDiaPayload {
  estado: EstadoDia;
  observacion?: string | null;
}

export interface RegistrarPernoctaPayload {
  ubicacion: string;
  patente: string;
}

export interface RegistrarConexionPayload {
  patente: string;
}

export interface RegistrarDesconexionPayload {
  patente: string;
}
