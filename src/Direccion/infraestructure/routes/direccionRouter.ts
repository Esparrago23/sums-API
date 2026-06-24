/**
 * @swagger
 * /direcciones:
 *   post:
 *     summary: Create a new address
 *     tags: [Direcciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all addresses
 *     tags: [Direcciones]
 *     responses:
 *       200:
 *         description: List of all addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Direccion'
 * 
 * /direcciones/{id}:
 *   get:
 *     summary: Get an address by ID
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the address
 *     responses:
 *       200:
 *         description: Address found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       404:
 *         description: Address not found
 * 
 *   put:
 *     summary: Update an address
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       400:
 *         description: Invalid input data / Validation error
 *       404:
 *         description: Address not found
 * 
 *   delete:
 *     summary: Delete an address
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { direccionSchema } from '../../domain/schemas/direccionSchema';
import { createDireccionController } from '../direccion_dependencies';
import { readAllDireccionController } from '../direccion_dependencies';
import { deleteDireccionController } from '../direccion_dependencies';
import { readDireccionByIdController } from '../direccion_dependencies';
import { updateDireccionController } from '../direccion_dependencies';


export const router = express.Router();
router.post('/direcciones', validate(direccionSchema), createDireccionController.run.bind(createDireccionController));
router.get('/direcciones', readAllDireccionController.run.bind(readAllDireccionController));
router.delete('/direcciones/:id', deleteDireccionController.run.bind(deleteDireccionController));
router.get('/direcciones/:id', readDireccionByIdController.run.bind(readDireccionByIdController));
router.put('/direcciones/:id', validate(direccionSchema), updateDireccionController.run.bind(updateDireccionController));

export default router;