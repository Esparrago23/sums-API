/**
 * @swagger
 * /educaciones:
 *   post:
 *     summary: Create a new education record
 *     tags: [Educacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Educacion'
 *     responses:
 *       201:
 *         description: Education record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Educacion'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all education records
 *     tags: [Educacion]
 *     responses:
 *       200:
 *         description: List of all education records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Educacion'
 * 
 * /educaciones/{id}:
 *   get:
 *     summary: Get an education record by ID
 *     tags: [Educacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the education record
 *     responses:
 *       200:
 *         description: Education record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Educacion'
 *       404:
 *         description: Education record not found
 * 
 *   put:
 *     summary: Update an education record
 *     tags: [Educacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the education record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Educacion'
 *     responses:
 *       200:
 *         description: Education record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Educacion'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Education record not found
 * 
 *   delete:
 *     summary: Delete an education record
 *     tags: [Educacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the education record to delete
 *     responses:
 *       200:
 *         description: Education record deleted successfully
 *       404:
 *         description: Education record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { educacionSchema } from '../../domain/schemas/educacionSchema';
import { createEducacionController } from '../educacion_dependencies';
import { readAllEducacionController } from '../educacion_dependencies'; 
import { deleteEducacionController } from '../educacion_dependencies';
import { readEducacionByIdController } from '../educacion_dependencies';
import { updateEducacionController } from '../educacion_dependencies';


export const router = express.Router();
router.post('/educaciones', validate(educacionSchema), createEducacionController.run.bind(createEducacionController));
router.get('/educaciones', readAllEducacionController.run.bind(readAllEducacionController));
router.delete('/educaciones/:id', deleteEducacionController.run.bind(deleteEducacionController));
router.get('/educaciones/:id', readEducacionByIdController.run.bind(readEducacionByIdController));
router.put('/educaciones/:id', validate(educacionSchema), updateEducacionController.run.bind(updateEducacionController));

export default router;