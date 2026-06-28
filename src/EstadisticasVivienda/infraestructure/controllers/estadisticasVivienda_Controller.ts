import { Request, Response } from "express";
import {
  GetServiciosUseCase,
  GetHacinamientoUseCase,
  GetMaterialesRiesgoUseCase,
  GetAnimalesUseCase
} from "../../application/estadisticasVivienda_UseCases";
import { ViviendaFiltros } from "../../domain/entities/consultas";

// Resultado de parsear y validar los filtros (§C) desde la query string.
type ParseResult =
  | { ok: true; filtros: ViviendaFiltros }
  | { ok: false; error: string };

// Valida formato estricto YYYY-MM-DD y que sea una fecha real.
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (isNaN(date.getTime())) return false;
  // Verifica que la fecha no se haya normalizado (p.ej. 2024-02-31).
  const [y, m, d] = value.split("-").map(Number);
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() + 1 === m &&
    date.getUTCDate() === d
  );
}

// Toma un query param que puede venir como string | string[] | undefined.
function firstValue(raw: unknown): string | undefined {
  if (raw === undefined) return undefined;
  if (Array.isArray(raw)) return raw.length > 0 ? String(raw[0]) : undefined;
  return String(raw);
}

// Parsea y valida los filtros opcionales y combinables (§C). 400 si algo es inválido.
function parseFiltros(req: Request): ParseResult {
  const filtros: ViviendaFiltros = {};

  const fechaInicio = firstValue(req.query.fecha_inicio);
  if (fechaInicio !== undefined && fechaInicio !== "") {
    if (!isValidDate(fechaInicio)) {
      return { ok: false, error: "fecha_inicio inválida. Formato esperado: YYYY-MM-DD" };
    }
    filtros.fecha_inicio = fechaInicio;
  }

  const fechaFin = firstValue(req.query.fecha_fin);
  if (fechaFin !== undefined && fechaFin !== "") {
    if (!isValidDate(fechaFin)) {
      return { ok: false, error: "fecha_fin inválida. Formato esperado: YYYY-MM-DD" };
    }
    filtros.fecha_fin = fechaFin;
  }

  const unidadSaludId = firstValue(req.query.unidad_salud_id);
  if (unidadSaludId !== undefined && unidadSaludId !== "") {
    if (!/^\d+$/.test(unidadSaludId)) {
      return { ok: false, error: "unidad_salud_id inválido. Debe ser un entero" };
    }
    filtros.unidad_salud_id = parseInt(unidadSaludId, 10);
  }

  const localidad = firstValue(req.query.localidad);
  if (localidad !== undefined && localidad !== "") {
    filtros.localidad = localidad;
  }

  return { ok: true, filtros };
}

// 1. Servicios básicos de la vivienda
export class GetServicios_Controller {
  constructor(private getServicios: GetServiciosUseCase) {}

  async run(req: Request, res: Response) {
    const parsed = parseFiltros(req);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    try {
      const data = await this.getServicios.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  }
}

// 2. Hacinamiento (habitantes / cuartos > 2.5)
export class GetHacinamiento_Controller {
  constructor(private getHacinamiento: GetHacinamientoUseCase) {}

  async run(req: Request, res: Response) {
    const parsed = parseFiltros(req);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    try {
      const data = await this.getHacinamiento.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  }
}

// 3. Materiales y condiciones de riesgo
export class GetMaterialesRiesgo_Controller {
  constructor(private getMaterialesRiesgo: GetMaterialesRiesgoUseCase) {}

  async run(req: Request, res: Response) {
    const parsed = parseFiltros(req);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    try {
      const data = await this.getMaterialesRiesgo.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  }
}

// 4. Animales / mascotas
export class GetAnimales_Controller {
  constructor(private getAnimales: GetAnimalesUseCase) {}

  async run(req: Request, res: Response) {
    const parsed = parseFiltros(req);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    try {
      const data = await this.getAnimales.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  }
}
