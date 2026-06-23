/**
 * @swagger
 * /materiales_vivienda:
 *   post:
 *     summary: Create a new housing material record
 *     tags: [MaterialesVivienda]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaterialesVivienda'
 *     responses:
 *       201:
 *         description: Housing material record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialesVivienda'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all housing material records
 *     tags: [MaterialesVivienda]
 *     responses:
 *       200:
 *         description: List of all housing material records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaterialesVivienda'
 * 
 * /materiales_vivienda/{id}:
 *   get:
 *     summary: Get a housing material record by ID
 *     tags: [MaterialesVivienda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the housing material record
 *     responses:
 *       200:
 *         description: Housing material record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialesVivienda'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update a housing material record
 *     tags: [MaterialesVivienda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the housing material record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaterialesVivienda'
 *     responses:
 *       200:
 *         description: Housing material record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialesVivienda'
 *       400:
 *         description: Invalid input data / Validation error
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete a housing material record
 *     tags: [MaterialesVivienda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the housing material record to delete
 *     responses:
 *       200:
 *         description: Housing material record deleted successfully
 *       404:
 *         description: Record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { materialesViviendaSchema } from '../../domain/schemas/materialesViviendaSchema';
import { createMaterialesViviendaController } from '../materialesVivienda_dependencies';
import { readAllMaterialesViviendaController } from '../materialesVivienda_dependencies';
import { deleteMaterialesViviendaController } from '../materialesVivienda_dependencies';
import { readMaterialesViviendaByIdController } from '../materialesVivienda_dependencies';
import { updateMaterialesViviendaController } from '../materialesVivienda_dependencies';

export const router = express.Router();
router.post('/materiales_vivienda', validate(materialesViviendaSchema), createMaterialesViviendaController.run.bind(createMaterialesViviendaController));
router.get('/materiales_vivienda', readAllMaterialesViviendaController.run.bind(readAllMaterialesViviendaController));
router.delete('/materiales_vivienda/:id', deleteMaterialesViviendaController.run.bind(deleteMaterialesViviendaController));
router.get('/materiales_vivienda/:id', readMaterialesViviendaByIdController.run.bind(readMaterialesViviendaByIdController));
router.put('/materiales_vivienda/:id', validate(materialesViviendaSchema), updateMaterialesViviendaController.run.bind(updateMaterialesViviendaController));

export default router;
