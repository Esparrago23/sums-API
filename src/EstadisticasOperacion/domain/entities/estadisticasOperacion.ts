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

// 10. Cédulas por colonia
export interface CedulasPorColoniaDTO {
  colonia: string;
  total: number;
}

// 11. Histograma de tamaño de núcleos familiares
export interface NucleosTamanoDTO {
  integrantes: number;
  total_nucleos: number;
}

// Filtros §C: parámetros opcionales y combinables para acotar las
// estadísticas globales basadas en cédula. Todos los campos son opcionales;
// si ninguno llega, el comportamiento es el actual (sin filtros).
export interface FiltrosEstadisticas {
  fecha_inicio?: string;     // YYYY-MM-DD (cedula.fecha_registro >= )
  fecha_fin?: string;        // YYYY-MM-DD (cedula.fecha_registro <= )
  unidad_salud_id?: number;  // cedula.unidad_salud_id =
  localidad?: string;        // direccion.localidad = (exacto, vía nucleo_direccion)
}
