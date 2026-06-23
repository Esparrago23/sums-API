/**
 * @swagger
 * /miembros_familia:
 *   post:
 *     summary: Create a new family member record
 *     tags: [MiembrosFamilia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MiembroFamilia'
 *     responses:
 *       201:
 *         description: Family member record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MiembroFamilia'
 *       400:
 *         description: Invalid input data (e.g., id validations)
 * 
 *   get:
 *     summary: Get all family member records
 *     tags: [MiembrosFamilia]
 *     responses:
 *       200:
 *         description: List of all family member records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MiembroFamilia'
 * 
 * /miembros_familia/{id}:
 *   get:
 *     summary: Get a family member record by ID
 *     tags: [MiembrosFamilia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the family member record
 *     responses:
 *       200:
 *         description: Family member record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MiembroFamilia'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update a family member record
 *     tags: [MiembrosFamilia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the family member record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MiembroFamilia'
 *     responses:
 *       200:
 *         description: Family member record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MiembroFamilia'
 *       400:
 *         description: Invalid input data (e.g., id validations)
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete a family member record
 *     tags: [MiembrosFamilia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the family member record to delete
 *     responses:
 *       200:
 *         description: Family member record deleted successfully
 *       404:
 *         description: Record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { miembroFamiliaSchema } from '../../domain/schemas/miembroFamiliaSchema';
import { createMiembroFamiliaController } from '../miembroFamilia_dependencies';
import { readAllMiembroFamiliaController } from '../miembroFamilia_dependencies';
import { deleteMiembroFamiliaController } from '../miembroFamilia_dependencies';
import { readMiembroFamiliaByIdController } from '../miembroFamilia_dependencies';
import { updateMiembroFamiliaController } from '../miembroFamilia_dependencies';

export const router = express.Router();
router.post('/miembros_familia', validate(miembroFamiliaSchema), createMiembroFamiliaController.run.bind(createMiembroFamiliaController));
router.get('/miembros_familia', readAllMiembroFamiliaController.run.bind(readAllMiembroFamiliaController));
router.delete('/miembros_familia/:id', deleteMiembroFamiliaController.run.bind(deleteMiembroFamiliaController));
router.get('/miembros_familia/:id', readMiembroFamiliaByIdController.run.bind(readMiembroFamiliaByIdController));
router.put('/miembros_familia/:id', validate(miembroFamiliaSchema), updateMiembroFamiliaController.run.bind(updateMiembroFamiliaController));

export default router;
