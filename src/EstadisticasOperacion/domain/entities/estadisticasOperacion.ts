// DTOs de respuesta para las estadísticas de productividad y operación.
// Todos son de solo lectura (agregaciones SQL).

// 1. Resumen de cédulas del entrevistador autenticado
export interface MisCedulasResumenDTO {
  entrevistador_id: number | null;
  alta: string | null;
  hoy: number;
  semana: number;
  mes: number;
  total: number;
  primera_cedula: string | null;
  ultima_cedula: string | null;
}

// 2. Serie temporal de cédulas del entrevistador autenticado
export interface MisCedulasSerieDTO {
  fecha: string;
  total: number;
}

// 3 / 7. Conteo de cédulas agrupado por estado
export interface CedulasPorEstadoDTO {
  estado: string;
  total: number;
}

// 4. Resumen general (totales globales)
export interface ResumenGeneralDTO {
  total_cedulas: number;
  total_personas: number;
  total_viviendas: number;
  total_nucleos: number;
  total_dosis: number;
  total_entrevistadores: number;
  cedulas_hoy: number;
  cedulas_mes: number;
}

// 5. Productividad por entrevistador (ranking)
export interface ProductividadEntrevistadorDTO {
  id_entrevistador: number;
  nombre: string;
  alta: string | null;
  total: number;
  hoy: number;
  semana: number;
  mes: number;
  ultima_actividad: string | null;
}

// 6. Serie temporal global de cédulas (agrupada por día/semana/mes)
export interface CedulasSerieDTO {
  periodo: string;
  total: number;
}

// 8. Cédulas por unidad de salud
export interface CedulasPorUnidadDTO {
  id_unidad_salud: number;
  nombre: string;
  total: number;
}

// 9. Cédulas por localidad
export interface CedulasPorLocalidadDTO {
  localidad: string;
  total: number;
}
