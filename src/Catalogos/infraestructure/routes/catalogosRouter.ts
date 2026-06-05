import express from 'express';
import { catalogosController } from '../catalogos_dependencies';

export const router = express.Router();

/**
 * @swagger
 * /catalogos:
 *   get:
 *     summary: Listar catalogos disponibles
 *     tags: [Catalogos]
 *     responses:
 *       200:
 *         description: Llaves de catalogos disponibles
 * /catalogos/{catalogo}:
 *   get:
 *     summary: Leer elementos de un catalogo
 *     tags: [Catalogos]
 *     parameters:
 *       - in: path
 *         name: catalogo
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - estado-civil
 *             - parentesco
 *             - lengua
 *             - escolaridad
 *             - ocupacion
 *             - ingreso-salarial
 *             - discapacidad
 *             - material
 *             - tipo-material-vivienda
 *             - servicio-vivienda
 *             - manejo-excretas
 *             - animal
 *             - toxicomania
 *             - enfermedad-cronica
 *             - alimentacion
 *             - frecuencia-servicio-salud
 *             - atencion-embarazo
 *             - vacuna
 *             - dosis
 *     responses:
 *       200:
 *         description: Elementos del catalogo
 */
router.get('/catalogos', catalogosController.listCatalogos.bind(catalogosController));
router.get('/catalogos/:catalogo', catalogosController.readAll.bind(catalogosController));

export default router;
