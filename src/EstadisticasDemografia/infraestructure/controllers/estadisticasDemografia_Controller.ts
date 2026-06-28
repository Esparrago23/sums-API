import { Request, Response } from "express";
import {
  GetPiramidePoblacionalUseCase,
  GetDistribucionGeneroUseCase,
  GetDistribucionEscolaridadUseCase,
  GetAlfabetizacionUseCase,
  GetDistribucionLenguaUseCase
} from "../../application/estadisticasDemografia_UseCases";

// Controlador de estadísticas demográficas (un método por endpoint)
export class EstadisticasDemografia_Controller {
  constructor(
    private getPiramidePoblacional: GetPiramidePoblacionalUseCase,
    private getDistribucionGenero: GetDistribucionGeneroUseCase,
    private getDistribucionEscolaridad: GetDistribucionEscolaridadUseCase,
    private getAlfabetizacion: GetAlfabetizacionUseCase,
    private getDistribucionLengua: GetDistribucionLenguaUseCase
  ) {}

  // 1. Pirámide poblacional (rango de edad x sexo)
  async piramide(req: Request, res: Response) {
    try {
      const resultado = await this.getPiramidePoblacional.execute();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 2. Distribución por género
  async genero(req: Request, res: Response) {
    try {
      const resultado = await this.getDistribucionGenero.execute();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 3. Distribución por escolaridad
  async escolaridad(req: Request, res: Response) {
    try {
      const resultado = await this.getDistribucionEscolaridad.execute();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
  async alfabetizacion(req: Request, res: Response) {
    try {
      const resultado = await this.getAlfabetizacion.execute();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // 5. Distribución por lengua indígena
  async lenguaIndigena(req: Request, res: Response) {
    try {
      const resultado = await this.getDistribucionLengua.execute();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
