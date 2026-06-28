import { Request, Response } from "express";
import {
  GetMisCedulasResumenUseCase,
  GetMisCedulasSerieUseCase,
  GetMisCedulasPorEstadoUseCase
} from "../../application/misCedulas_UseCase";
import {
  GetResumenGeneralUseCase,
  GetProductividadEntrevistadoresUseCase,
  GetCedulasSerieUseCase,
  GetCedulasPorEstadoUseCase,
  GetCedulasPorUnidadUseCase,
  GetCedulasPorLocalidadUseCase
} from "../../application/operacion_UseCase";
import { PeriodoAgrupacion } from "../../domain/repositories/IestadisticasOperacion";

// Mapeo seguro de 'agrupar' (lista blanca) hacia el campo de date_trunc.
const MAPA_AGRUPAR: Record<string, PeriodoAgrupacion> = {
  dia: "day",
  semana: "week",
  mes: "month"
};

// Un solo controller con un método por endpoint.
export class EstadisticasOperacion_Controller {
  constructor(
    private getMisCedulasResumen: GetMisCedulasResumenUseCase,
    private getMisCedulasSerie: GetMisCedulasSerieUseCase,
    private getMisCedulasPorEstado: GetMisCedulasPorEstadoUseCase,
    private getResumenGeneral: GetResumenGeneralUseCase,
    private getProductividadEntrevistadores: GetProductividadEntrevistadoresUseCase,
    private getCedulasSerie: GetCedulasSerieUseCase,
    private getCedulasPorEstado: GetCedulasPorEstadoUseCase,
    private getCedulasPorUnidad: GetCedulasPorUnidadUseCase,
    private getCedulasPorLocalidad: GetCedulasPorLocalidadUseCase
  ) {}

  // 1. GET /estadisticas/mis-cedulas/resumen
  async misCedulasResumen(req: Request, res: Response) {
    try {
      const idUsuario = (req as any).user.idUsuario;
      const resultado = await this.getMisCedulasResumen.execute(idUsuario);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 2. GET /estadisticas/mis-cedulas/serie?dias=30
  async misCedulasSerie(req: Request, res: Response) {
    try {
      const idUsuario = (req as any).user.idUsuario;

      // Validación de 'dias': entero positivo razonable (1..365), por defecto 30.
      let dias = 30;
      if (req.query.dias !== undefined) {
        const parsed = Number(req.query.dias);
        if (!Number.isInteger(parsed) || parsed < 1 || parsed > 365) {
          res
            .status(400)
            .json({ error: "El parámetro 'dias' debe ser un entero entre 1 y 365" });
          return;
        }
        dias = parsed;
      }

      const resultado = await this.getMisCedulasSerie.execute(idUsuario, dias);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 3. GET /estadisticas/mis-cedulas/por-estado
  async misCedulasPorEstado(req: Request, res: Response) {
    try {
      const idUsuario = (req as any).user.idUsuario;
      const resultado = await this.getMisCedulasPorEstado.execute(idUsuario);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 4. GET /estadisticas/resumen-general
  async resumenGeneral(req: Request, res: Response) {
    try {
      const resultado = await this.getResumenGeneral.execute();
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 5. GET /estadisticas/productividad/entrevistadores
  async productividadEntrevistadores(req: Request, res: Response) {
    try {
      const resultado = await this.getProductividadEntrevistadores.execute();
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 6. GET /estadisticas/cedulas/serie?agrupar=mes
  async cedulasSerie(req: Request, res: Response) {
    try {
      // 'agrupar' validado contra lista blanca; por defecto 'mes' -> 'month'.
      const agrupar = (req.query.agrupar as string) ?? "mes";
      const periodo = MAPA_AGRUPAR[agrupar];
      if (!periodo) {
        res
          .status(400)
          .json({ error: "El parámetro 'agrupar' debe ser uno de: dia, semana, mes" });
        return;
      }

      const resultado = await this.getCedulasSerie.execute(periodo);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 7. GET /estadisticas/cedulas/por-estado
  async cedulasPorEstado(req: Request, res: Response) {
    try {
      const resultado = await this.getCedulasPorEstado.execute();
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 8. GET /estadisticas/cedulas/por-unidad
  async cedulasPorUnidad(req: Request, res: Response) {
    try {
      const resultado = await this.getCedulasPorUnidad.execute();
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 9. GET /estadisticas/cedulas/por-localidad
  async cedulasPorLocalidad(req: Request, res: Response) {
    try {
      const resultado = await this.getCedulasPorLocalidad.execute();
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
