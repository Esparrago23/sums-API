import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { nucleoFamiliarSchema, nucleoPersonaSchema, nucleoPersonaPatchSchema } from '../../domain/schemas/nucleoFamiliarSchema';
import { nucleoFamiliarController } from '../nucleoFamiliar_dependencies';

export const router = express.Router();

/**
 * @swagger
 * /nucleos-familiares:
 *   post:
 *     summary: Crear nucleo familiar
 *     tags: [NucleoFamiliar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NucleoFamiliar'
 *     responses:
 *       201:
 *         description: Nucleo familiar creado
 *       400:
 *         description: Invalid input data (e.g., validación de fechas)
 *   get:
 *     summary: Listar nucleos familiares
 *     tags: [NucleoFamiliar]
 *     responses:
 *       200:
 *         description: Lista de nucleos familiares
 * /nucleos-familiares/{id}/integrantes:
 *   post:
 *     summary: Agregar persona a nucleo familiar
 *     tags: [NucleoFamiliar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NucleoPersona'
 *     responses:
 *       201:
 *         description: Integrante agregado
 *       400:
 *         description: Invalid input data (e.g., missing nucleo_familiar_id o persona_id)
 *   get:
 *     summary: Listar integrantes de un nucleo familiar
 *     tags: [NucleoFamiliar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Integrantes del nucleo
 * /nucleos-familiares/{id}/integrantes/{personaId}:
 *   patch:
 *     summary: Actualizar parentesco, fecha de salida o comentarios de un integrante
 *     tags: [NucleoFamiliar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: personaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Integrante actualizado
 *       400:
 *         description: Invalid input data
 */
router.post('/nucleos-familiares', validate(nucleoFamiliarSchema), nucleoFamiliarController.create.bind(nucleoFamiliarController));
router.get('/nucleos-familiares', nucleoFamiliarController.readAll.bind(nucleoFamiliarController));
router.get('/nucleos-familiares/:id', nucleoFamiliarController.readById.bind(nucleoFamiliarController));
router.put('/nucleos-familiares/:id', validate(nucleoFamiliarSchema), nucleoFamiliarController.update.bind(nucleoFamiliarController));
router.delete('/nucleos-familiares/:id', nucleoFamiliarController.delete.bind(nucleoFamiliarController));
router.post('/nucleos-familiares/:id/integrantes', validate(nucleoPersonaSchema), nucleoFamiliarController.addPersona.bind(nucleoFamiliarController));
router.get('/nucleos-familiares/:id/integrantes', nucleoFamiliarController.listIntegrantes.bind(nucleoFamiliarController));
router.patch('/nucleos-familiares/:id/integrantes/:personaId', validate(nucleoPersonaPatchSchema), nucleoFamiliarController.updateIntegrante.bind(nucleoFamiliarController));

export default router;
