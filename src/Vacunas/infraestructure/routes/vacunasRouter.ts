/**
 * @swagger
 * /vacunas:
 *   post:
 *     summary: Create a new vaccine
 *     tags: [Vacunas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vacunas'
 *     responses:
 *       201:
 *         description: Vaccine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vacunas'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all vaccines
 *     tags: [Vacunas]
 *     responses:
 *       200:
 *         description: List of all vaccines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vacunas'
 * 
 * /vacunas/{id}:
 *   get:
 *     summary: Get a vaccine by ID
 *     tags: [Vacunas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the vaccine
 *     responses:
 *       200:
 *         description: Vaccine found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vacunas'
 *       404:
 *         description: Vaccine not found
 * 
 *   put:
 *     summary: Update a vaccine
 *     tags: [Vacunas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the vaccine to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vacunas'
 *     responses:
 *       200:
 *         description: Vaccine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vacunas'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Vaccine not found
 * 
 *   delete:
 *     summary: Delete a vaccine
 *     tags: [Vacunas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the vaccine to delete
 *     responses:
 *       200:
 *         description: Vaccine deleted successfully
 *       404:
 *         description: Vaccine not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { vacunasSchema } from '../../domain/schemas/vacunasSchema';
import { createVacunasController } from '../vacunas_dependencies';
import { readAllVacunasController } from '../vacunas_dependencies';
import { deleteVacunasController } from '../vacunas_dependencies';
import { readVacunasByIdController } from '../vacunas_dependencies';
import { updateVacunasController } from '../vacunas_dependencies';

export const router = express.Router();

router.post('/vacunas', validate(vacunasSchema), createVacunasController.run.bind(createVacunasController));
router.get('/vacunas', readAllVacunasController.run.bind(readAllVacunasController));
router.delete('/vacunas/:id', deleteVacunasController.run.bind(deleteVacunasController));
router.get('/vacunas/:id', readVacunasByIdController.run.bind(readVacunasByIdController));
router.put('/vacunas/:id', validate(vacunasSchema), updateVacunasController.run.bind(updateVacunasController));

export default router;
