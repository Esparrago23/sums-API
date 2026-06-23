import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { servicioSaludSchema, visitaSchema } from '../../domain/schemas/serviciosSaludSchema';
import { 
    createServicioSaludController,
    readAllServicioSaludController,
    deleteServicioSaludController,
    readServicioSaludByIdController,
    updateServicioSaludController,
    agregarVisitaController,
    eliminarVisitaController,
    obtenerVisitasPorTipoController,
    obtenerUltimaVisitaController,
    
} from "../serviciosSalud_dependencies";

export const router = express.Router();

// Rutas básicas de servicios de salud
router.post('/servicios-salud', validate(servicioSaludSchema), createServicioSaludController.run.bind(createServicioSaludController));
router.get('/servicios-salud', readAllServicioSaludController.run.bind(readAllServicioSaludController));
router.delete('/servicios-salud/:id', deleteServicioSaludController.run.bind(deleteServicioSaludController));
router.get('/servicios-salud/:id', readServicioSaludByIdController.run.bind(readServicioSaludByIdController));
router.put('/servicios-salud/:id', validate(servicioSaludSchema), updateServicioSaludController.run.bind(updateServicioSaludController));

// Rutas para gestión de visitas
router.post('/servicios-salud/:servicioId/visitas', validate(visitaSchema), agregarVisitaController.run.bind(agregarVisitaController));
router.delete('/servicios-salud/:servicioId/visitas/:fecha', eliminarVisitaController.run.bind(eliminarVisitaController));
router.get('/servicios-salud/:servicioId/visitas/tipo/:tipo', obtenerVisitasPorTipoController.run.bind(obtenerVisitasPorTipoController));
router.get('/servicios-salud/:servicioId/visitas/ultima', obtenerUltimaVisitaController.run.bind(obtenerUltimaVisitaController));

export default router;

/**
 * @swagger
 * /servicios-basicos:
 *   post:
 *     summary: Create a new basic services record
 *     tags: [ServiciosBasicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiciosBasicos'
 *     responses:
 *       201:
 *         description: Basic services record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiciosBasicos'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all basic services records
 *     tags: [ServiciosBasicos]
 *     responses:
 *       200:
 *         description: List of all basic services records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiciosBasicos'
 * 
 * /servicios-basicos/{id}:
 *   get:
 *     summary: Get a basic services record by ID
 *     tags: [ServiciosBasicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the basic services record
 *     responses:
 *       200:
 *         description: Basic services record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiciosBasicos'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update a basic services record
 *     tags: [ServiciosBasicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the basic services record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiciosBasicos'
 *     responses:
 *       200:
 *         description: Basic services record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiciosBasicos'
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete a basic services record
 *     tags: [ServiciosBasicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the basic services record to delete
 *     responses:
 *       200:
 *         description: Basic services record deleted successfully
 *       404:
 *         description: Record not found
 * /servicios-salud/{servicioId}/visitas:
 *   post:
 *     summary: Agregar una visita a un servicio de salud
 *     tags: [ServicioSalud]
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visita'
 *     responses:
 *       201:
 *         description: Visita agregada
 *       400:
 *         description: Invalid input data / Validation error

 * /servicios-salud/{servicioId}/visitas/{fecha}:
 *   delete:
 *     summary: Eliminar una visita por fecha
 *     tags: [ServicioSalud]
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visita eliminada

 * /servicios-salud/{servicioId}/visitas/tipo/{tipo}:
 *   get:
 *     summary: Obtener visitas por tipo
 *     tags: [ServicioSalud]
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de visitas del tipo especificado

 * /servicios-salud/{servicioId}/visitas/ultima:
 *   get:
 *     summary: Obtener la última visita registrada
 *     tags: [ServicioSalud]
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Última visita encontrada
 */
