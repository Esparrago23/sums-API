import { Request, Response } from "express";
import {
  GetEnfermedadesCronicasUseCase,
  GetToxicomaniasUseCase,
  GetDiscapacidadUseCase,
  GetSaludPreventivaUseCase,
  GetSeguridadSocialUseCase,
  GetAlimentacionUseCase,
  GetServiciosSaludUseCase,
  GetHigieneBucodentalUseCase,
  GetPiramideVacunaUseCase
} from "../../application/estadisticasSalud_UseCases";
import { SaludFiltros } from "../../domain/entities/estadisticasSalud";

// Resultado de parsear/validar los filtros §C de la query string.
type FiltrosParseResult =
  | { ok: true; filtros: SaludFiltros }
  | { ok: false; error: string };

// Valida formato estricto YYYY-MM-DD y que sea una fecha de calendario real.
function esFechaValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }
  const [anio, mes, dia] = valor.split("-").map((n) => parseInt(n, 10));
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

// Lee y valida los query params opcionales (§C). Devuelve 400 vía resultado si algo es inválido.
function parseFiltros(req: Request): FiltrosParseResult {
  const filtros: SaludFiltros = {};

  // fecha_inicio
  const fechaInicio = req.query.fecha_inicio;
  if (fechaInicio !== undefined) {
    if (typeof fechaInicio !== "string" || !esFechaValida(fechaInicio)) {
      return {
        ok: false,
        error: "El parámetro 'fecha_inicio' debe tener formato YYYY-MM-DD"
      };
    }
    filtros.fecha_inicio = fechaInicio;
  }

  // fecha_fin
  const fechaFin = req.query.fecha_fin;
  if (fechaFin !== undefined) {
    if (typeof fechaFin !== "string" || !esFechaValida(fechaFin)) {
      return {
        ok: false,
        error: "El parámetro 'fecha_fin' debe tener formato YYYY-MM-DD"
      };
    }
    filtros.fecha_fin = fechaFin;
  }

  // unidad_salud_id (entero positivo)
  const unidad = req.query.unidad_salud_id;
  if (unidad !== undefined) {
    const parsed = Number(unidad);
    if (typeof unidad !== "string" || unidad.trim() === "" || !Number.isInteger(parsed)) {
      return {
        ok: false,
        error: "El parámetro 'unidad_salud_id' debe ser un entero"
      };
    }
    filtros.unidad_salud_id = parsed;
  }

  // localidad (texto, match exacto)
  const localidad = req.query.localidad;
  if (localidad !== undefined) {
    if (typeof localidad !== "string") {
      return {
        ok: false,
        error: "El parámetro 'localidad' debe ser un texto"
      };
    }
    filtros.localidad = localidad;
  }

  // vacuna_id (entero positivo)
  const vacuna_id = req.query.vacuna_id;
  if (vacuna_id !== undefined) {
    const parsed = Number(vacuna_id);
    if (typeof vacuna_id !== "string" || vacuna_id.trim() === "" || !Number.isInteger(parsed)) {
      return {
        ok: false,
        error: "El parámetro 'vacuna_id' debe ser un entero"
      };
    }
    filtros.vacuna_id = parsed;
  }

  return { ok: true, filtros };
}

export class EstadisticasSaludController {
  constructor(
    private getEnfermedadesCronicas: GetEnfermedadesCronicasUseCase,
    private getToxicomanias: GetToxicomaniasUseCase,
    private getDiscapacidad: GetDiscapacidadUseCase,
    private getSaludPreventiva: GetSaludPreventivaUseCase,
    private getSeguridadSocial: GetSeguridadSocialUseCase,
    private getAlimentacion: GetAlimentacionUseCase,
    private getServiciosSalud: GetServiciosSaludUseCase,
    private getHigieneBucodental: GetHigieneBucodentalUseCase,
    private getPiramideVacuna: GetPiramideVacunaUseCase
  ) {}

  // 1. GET /estadisticas/salud/enfermedades-cronicas
  async enfermedadesCronicas(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getEnfermedadesCronicas.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 2. GET /estadisticas/salud/toxicomanias
  async toxicomanias(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getToxicomanias.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 3. GET /estadisticas/salud/discapacidad
  async discapacidad(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getDiscapacidad.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 4. GET /estadisticas/salud/preventiva
  async preventiva(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getSaludPreventiva.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 5. GET /estadisticas/salud/seguridad-social
  async seguridadSocial(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getSeguridadSocial.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 6. GET /estadisticas/salud/alimentacion
  async alimentacion(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getAlimentacion.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 7. GET /estadisticas/salud/servicios-salud
  async serviciosSalud(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getServiciosSalud.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 8. GET /estadisticas/salud/higiene-bucodental
  async higieneBucodental(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getHigieneBucodental.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 9. GET /estadisticas/salud/piramide-vacuna
  async piramideVacuna(req: Request, res: Response) {
    try {
      const parsed = parseFiltros(req);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const data = await this.getPiramideVacuna.execute(parsed.filtros);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

