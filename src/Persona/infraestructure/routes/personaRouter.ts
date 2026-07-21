/**
 * @swagger
 * /personas:
 *   post:
 *     summary: Create a new person record
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       201:
 *         description: Person record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Invalid input data (e.g., missing fields, or rules like 'lengua_indigena_especificar requires lengua_id', 'tipo_discapacidad requires presenta_discapacidad=true')
 * 
 *   get:
 *     summary: Get all person records
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: List of all person records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Persona'
 * 
 * /personas/{id}:
 *   get:
 *     summary: Get a person record by ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the person record
 *     responses:
 *       200:
 *         description: Person record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Person record not found
 * 
 *   put:
 *     summary: Update a person record
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the person record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       200:
 *         description: Person record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Invalid input data (e.g., missing fields, or rules like 'lengua_indigena_especificar requires lengua_id', 'tipo_discapacidad requires presenta_discapacidad=true')
 *       404:
 *         description: Person record not found
 * 
 *   delete:
 *     summary: Delete a person record
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the person record to delete
 *     responses:
 *       200:
 *         description: Person record deleted successfully
 *       404:
 *         description: Person record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { personaSchema } from '../../domain/schemas/personaSchema';
import { createPersonaController } from '../persona_dependencies';
import { readAllPersonaController } from '../persona_dependencies';
import { deletePersonaController } from '../persona_dependencies';
import { readPersonaByIdController } from '../persona_dependencies';
import { updatePersonaController } from '../persona_dependencies';
import { authMiddleware } from '../../../User/infraestructure/middleware/authMiddleware';

export const router = express.Router();
router.post('/personas', authMiddleware(), validate(personaSchema), createPersonaController.run.bind(createPersonaController));
router.get('/personas', authMiddleware(), readAllPersonaController.run.bind(readAllPersonaController));
router.delete('/personas/:id', authMiddleware(), deletePersonaController.run.bind(deletePersonaController));
router.get('/personas/:id', authMiddleware(), readPersonaByIdController.run.bind(readPersonaByIdController));
router.put('/personas/:id', authMiddleware(), validate(personaSchema), updatePersonaController.run.bind(updatePersonaController));

export default router;
