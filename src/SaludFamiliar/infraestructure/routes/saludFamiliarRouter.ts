/**
 * @swagger
 * /salud-familiar:
 *   post:
 *     summary: Create a new family health record
 *     tags: [SaludFamiliar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaludFamiliar'
 *     responses:
 *       201:
 *         description: Family health record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaludFamiliar'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all family health records
 *     tags: [SaludFamiliar]
 *     responses:
 *       200:
 *         description: List of all family health records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaludFamiliar'
 * 
 * /salud-familiar/{id}:
 *   get:
 *     summary: Get a family health record by ID
 *     tags: [SaludFamiliar]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the family health record
 *     responses:
 *       200:
 *         description: Family health record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaludFamiliar'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update a family health record
 *     tags: [SaludFamiliar]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the family health record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaludFamiliar'
 *     responses:
 *       200:
 *         description: Family health record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaludFamiliar'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete a family health record
 *     tags: [SaludFamiliar]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the family health record to delete
 *     responses:
 *       200:
 *         description: Family health record deleted successfully
 *       404:
 *         description: Record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { saludFamiliarSchema } from '../../domain/schemas/saludFamiliarSchema';
import { createSaludFamiliarController } from '../saludFamiliar_dependencies';
import { readAllSaludFamiliarController } from '../saludFamiliar_dependencies';
import { deleteSaludFamiliarController } from '../saludFamiliar_dependencies';
import { readSaludFamiliarByIdController } from '../saludFamiliar_dependencies';
import { updateSaludFamiliarController } from '../saludFamiliar_dependencies';

export const router = express.Router();
router.post('/salud-familiar', validate(saludFamiliarSchema), createSaludFamiliarController.run.bind(createSaludFamiliarController));
router.get('/salud-familiar', readAllSaludFamiliarController.run.bind(readAllSaludFamiliarController));
router.delete('/salud-familiar/:id', deleteSaludFamiliarController.run.bind(deleteSaludFamiliarController));
router.get('/salud-familiar/:id', readSaludFamiliarByIdController.run.bind(readSaludFamiliarByIdController));
router.put('/salud-familiar/:id', validate(saludFamiliarSchema), updateSaludFamiliarController.run.bind(updateSaludFamiliarController));

export default router;
