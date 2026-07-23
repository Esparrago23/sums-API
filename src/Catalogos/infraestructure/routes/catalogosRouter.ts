import express from 'express';
import { catalogosController } from '../catalogos_dependencies';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { catalogoSchema } from '../../domain/schemas/catalogoSchema';
import { authMiddleware } from '../../../User/infraestructure/middleware/authMiddleware';

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
 *             - material
 *             - manejo-excretas
 *             - animal
 *             - toxicomania
 *             - enfermedad-cronica
 *             - frecuencia-servicio-salud
 *             - atencion-embarazo
 *             - vacuna
 *             - dosis
 *     responses:
 *       200:
 *         description: Elementos del catalogo
 */
router.get('/catalogos', authMiddleware(), catalogosController.listCatalogos.bind(catalogosController));
router.get('/catalogos/:catalogo', authMiddleware(), catalogosController.readAll.bind(catalogosController));
router.post('/catalogos/:catalogo', authMiddleware(), validate(catalogoSchema), catalogosController.createCatalogItem.bind(catalogosController));

export default router;
