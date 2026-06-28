import { Request, Response } from "express";
import {
  GetEnfermedadesCronicasUseCase,
  GetToxicomaniasUseCase,
  GetDiscapacidadUseCase,
  GetSaludPreventivaUseCase,
  GetSeguridadSocialUseCase,
  GetAlimentacionUseCase
} from "../../application/estadisticasSalud_UseCases";

export class EstadisticasSaludController {
  constructor(
    private getEnfermedadesCronicas: GetEnfermedadesCronicasUseCase,
    private getToxicomanias: GetToxicomaniasUseCase,
    private getDiscapacidad: GetDiscapacidadUseCase,
    private getSaludPreventiva: GetSaludPreventivaUseCase,
    private getSeguridadSocial: GetSeguridadSocialUseCase,
    private getAlimentacion: GetAlimentacionUseCase
  ) {}

  // 1. GET /estadisticas/salud/enfermedades-cronicas
  async enfermedadesCronicas(req: Request, res: Response) {
    try {
      const data = await this.getEnfermedadesCronicas.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 2. GET /estadisticas/salud/toxicomanias
  async toxicomanias(req: Request, res: Response) {
    try {
      const data = await this.getToxicomanias.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 3. GET /estadisticas/salud/discapacidad
  async discapacidad(req: Request, res: Response) {
    try {
      const data = await this.getDiscapacidad.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 4. GET /estadisticas/salud/preventiva
  async preventiva(req: Request, res: Response) {
    try {
      const data = await this.getSaludPreventiva.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 5. GET /estadisticas/salud/seguridad-social
  async seguridadSocial(req: Request, res: Response) {
    try {
      const data = await this.getSeguridadSocial.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 6. GET /estadisticas/salud/alimentacion
  async alimentacion(req: Request, res: Response) {
    try {
      const data = await this.getAlimentacion.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
