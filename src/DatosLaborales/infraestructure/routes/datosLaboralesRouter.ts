/**
 * @swagger
 * /datos_laborales:
 *   post:
 *     summary: Create new employment data
 *     tags: [DatosLaborales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turno_id:
 *                 type: integer
 *               horario_inicio:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?$"
 *                 description: "Formato de hora HH:MM o HH:MM:SS"
 *               horario_fin:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?$"
 *               cargo:
 *                 type: string
 *               especialidad:
 *                 type: string
 *                 description: "Especialidad o 'NA' si no aplica"
 *     responses:
 *       201:
 *         description: Employment data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatosLaborales'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all employment data records
 *     tags: [DatosLaborales]
 *     responses:
 *       200:
 *         description: List of all employment data records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DatosLaborales'
 * 
 * /datos_laborales/{id}:
 *   get:
 *     summary: Get employment data by ID
 *     tags: [DatosLaborales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the employment data record
 *     responses:
 *       200:
 *         description: Employment data record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatosLaborales'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update employment data
 *     tags: [DatosLaborales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the employment data record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turno_id:
 *                 type: integer
 *               horario_inicio:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?$"
 *               horario_fin:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?$"
 *               cargo:
 *                 type: string
 *               especialidad:
 *                 type: string
 *                 description: "Especialidad o 'NA' si no aplica"
 *     responses:
 *       200:
 *         description: Employment data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatosLaborales'
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete employment data
 *     tags: [DatosLaborales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the employment data record to delete
 *     responses:
 *       200:
 *         description: Employment data deleted successfully
 *       404:
 *         description: Record not found
 */

import express from 'express';
import { createDatosLaboralesController } from '../datosLaborales_dependencies';
import { readAllDatosLaboralesController } from '../datosLaborales_dependencies';
import { deleteDatosLaboralesController } from '../datosLaborales_dependencies';
import { readDatosLaboralesByIdController } from '../datosLaborales_dependencies';
import { updateDatosLaboralesController } from '../datosLaborales_dependencies';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { datosLaboralesSchema } from '../../domain/schemas/datosLaboralesSchema';


export const router = express.Router();
router.post('/datos_laborales', validate(datosLaboralesSchema), createDatosLaboralesController.run.bind(createDatosLaboralesController));
router.get('/datos_laborales', readAllDatosLaboralesController.run.bind(readAllDatosLaboralesController));
router.delete('/datos_laborales/:id', deleteDatosLaboralesController.run.bind(deleteDatosLaboralesController));
router.get('/datos_laborales/:id', readDatosLaboralesByIdController.run.bind(readDatosLaboralesByIdController));
router.put('/datos_laborales/:id', validate(datosLaboralesSchema), updateDatosLaboralesController.run.bind(updateDatosLaboralesController));

export default router;