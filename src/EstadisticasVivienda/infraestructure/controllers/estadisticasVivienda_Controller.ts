import { Request, Response } from "express";
import {
  GetServiciosUseCase,
  GetHacinamientoUseCase,
  GetMaterialesRiesgoUseCase,
  GetAnimalesUseCase
} from "../../application/estadisticasVivienda_UseCases";

// 1. Servicios básicos de la vivienda
export class GetServicios_Controller {
  constructor(private getServicios: GetServiciosUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const data = await this.getServicios.execute();
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
    try {
      const data = await this.getHacinamiento.execute();
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
    try {
      const data = await this.getMaterialesRiesgo.execute();
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
    try {
      const data = await this.getAnimales.execute();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error });
    }
  }
}
