/**
 * @swagger
 * /unidadSalud:
 *   post:
 *     summary: Create a new health unit
 *     tags: [UnidadSalud]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clues
 *               - nombre
 *             properties:
 *               clues:
 *                 type: string
 *                 pattern: "^[A-Za-z]{5}\\d{6}$"
 *                 description: "Código CLUES de 11 caracteres (5 letras y 6 números)"
 *               nombre:
 *                 type: string
 *               distrito:
 *                 type: string
 *               municipio_id:
 *                 type: integer
 *               numero_nucleos:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Health unit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnidadSalud'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all health units
 *     tags: [UnidadSalud]
 *     responses:
 *       200:
 *         description: List of all health units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UnidadSalud'
 * 
 * /unidadSalud/{id}:
 *   get:
 *     summary: Get a health unit by ID
 *     tags: [UnidadSalud]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the health unit
 *     responses:
 *       200:
 *         description: Health unit found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnidadSalud'
 *       404:
 *         description: Health unit not found
 * 
 *   put:
 *     summary: Update a health unit
 *     tags: [UnidadSalud]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the health unit to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clues:
 *                 type: string
 *                 pattern: "^[A-Za-z]{5}\\d{6}$"
 *                 description: "Código CLUES de 11 caracteres (5 letras y 6 números)"
 *               nombre:
 *                 type: string
 *               distrito:
 *                 type: string
 *               municipio_id:
 *                 type: integer
 *               numero_nucleos:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Health unit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnidadSalud'
 *       404:
 *         description: Health unit not found
 * 
 *   delete:
 *     summary: Delete a health unit
 *     tags: [UnidadSalud]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the health unit to delete
 *     responses:
 *       200:
 *         description: Health unit deleted successfully
 *       404:
 *         description: Health unit not found
 */

import express from 'express'
import { createUnidadSalud_Controller } from '../unidadsalud_dependencies'
import { readAllUnidadSalud_Controller } from '../unidadsalud_dependencies'
import { deleteUnidadSalud_Controller } from '../unidadsalud_dependencies'
import { readUnidadSaludById_Controller } from '../unidadsalud_dependencies'
import { updateUnidadSalud_Controller } from '../unidadsalud_dependencies'
import { validate } from '../../../shared/middleware/validateMiddleware'
import { unidadSaludSchema } from '../../domain/schemas/unidadSaludSchema'

export const UnidadSaludRouter = express.Router()
UnidadSaludRouter.post('/unidadSalud', validate(unidadSaludSchema), createUnidadSalud_Controller.run.bind(createUnidadSalud_Controller))
UnidadSaludRouter.get('/unidadSalud', readAllUnidadSalud_Controller.run.bind(readAllUnidadSalud_Controller))
UnidadSaludRouter.delete('/unidadSalud/:id', deleteUnidadSalud_Controller.run.bind(deleteUnidadSalud_Controller))
UnidadSaludRouter.get('/unidadSalud/:id', readUnidadSaludById_Controller.run.bind(readUnidadSaludById_Controller))
UnidadSaludRouter.put('/unidadSalud/:id', validate(unidadSaludSchema), updateUnidadSalud_Controller.run.bind(updateUnidadSalud_Controller))

export default UnidadSaludRouter
