import { Request, Response } from "express";
import {
  GetPiramidePoblacionalUseCase,
  GetDistribucionGeneroUseCase,
  GetDistribucionEscolaridadUseCase,
  GetAlfabetizacionUseCase,
  GetDistribucionLenguaUseCase,
  GetDistribucionIngresoUseCase,
  GetDistribucionOcupacionUseCase,
  GetDistribucionEstadoCivilUseCase
} from "../../application/estadisticasDemografia_UseCases";
import { DemografiaFiltros } from "../../domain/entities/demografia";

// Controlador de estadísticas demográficas (un método por endpoint)
export class EstadisticasDemografia_Controller {
  constructor(
    private getPiramidePoblacional: GetPiramidePoblacionalUseCase,
    private getDistribucionGenero: GetDistribucionGeneroUseCase,
    private getDistribucionEscolaridad: GetDistribucionEscolaridadUseCase,
    private getAlfabetizacion: GetAlfabetizacionUseCase,
    private getDistribucionLengua: GetDistribucionLenguaUseCase,
    private getDistribucionIngreso: GetDistribucionIngresoUseCase,
    private getDistribucionOcupacion: GetDistribucionOcupacionUseCase,
    private getDistribucionEstadoCivil: GetDistribucionEstadoCivilUseCase
  ) {}

  // Parsea y valida los filtros opcionales de query (§C).
  // Devuelve { filtros } si todo es válido, o { error } con el mensaje 400 si algo es inválido.
  private parseFiltros(req: Request): { filtros?: DemografiaFiltros; error?: string } {
    const { fecha_inicio, fecha_fin, unidad_salud_id, localidad } = req.query;
    const filtros: DemografiaFiltros = {};
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Valida que el valor sea una fecha real con formato YYYY-MM-DD
    const esFechaValida = (valor: string): boolean => {
      if (!fechaRegex.test(valor)) return false;
      const fecha = new Date(valor + "T00:00:00Z");
      if (isNaN(fecha.getTime())) return false;
      // Verifica que no haya overflow (p.ej. 2026-02-30)
      return valor === fecha.toISOString().slice(0, 10);
    };

    if (fecha_inicio !== undefined) {
      if (typeof fecha_inicio !== "string" || !esFechaValida(fecha_inicio)) {
        return { error: "fecha_inicio invalida: use el formato YYYY-MM-DD" };
      }
      filtros.fecha_inicio = fecha_inicio;
    }

    if (fecha_fin !== undefined) {
      if (typeof fecha_fin !== "string" || !esFechaValida(fecha_fin)) {
        return { error: "fecha_fin invalida: use el formato YYYY-MM-DD" };
      }
      filtros.fecha_fin = fecha_fin;
    }

    if (unidad_salud_id !== undefined) {
      const valor = String(unidad_salud_id);
      if (!/^\d+$/.test(valor)) {
        return { error: "unidad_salud_id invalido: debe ser un entero" };
      }
      filtros.unidad_salud_id = parseInt(valor, 10);
    }

    if (localidad !== undefined) {
      if (typeof localidad !== "string") {
        return { error: "localidad invalida: debe ser texto" };
      }
      const loc = localidad.trim();
      if (loc.length > 0) {
        filtros.localidad = loc;
      }
    }

    return { filtros };
  }

  // 1. Pirámide poblacional (rango de edad x sexo)
  async piramide(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getPiramidePoblacional.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 2. Distribución por género
  async genero(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getDistribucionGenero.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 3. Distribución por escolaridad
  async escolaridad(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getDistribucionEscolaridad.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
  async alfabetizacion(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getAlfabetizacion.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 5. Distribución por lengua indígena
  async lenguaIndigena(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getDistribucionLengua.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 6. Distribución por ingreso salarial
  async ingreso(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getDistribucionIngreso.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 7. Distribución por ocupación
  async ocupacion(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getDistribucionOcupacion.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 8. Distribución por estado civil
  async estadoCivil(req: Request, res: Response) {
    try {
      const { filtros, error } = this.parseFiltros(req);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const resultado = await this.getDistribucionEstadoCivil.execute(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
