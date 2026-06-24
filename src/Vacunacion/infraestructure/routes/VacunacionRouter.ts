/**
 * @swagger
 * /vacunaciones:
 *   post:
 *     summary: Create a new vaccination record
 *     tags: [Vacunaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vacunacion'
 *     responses:
 *       201:
 *         description: Vaccination record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vacunacion'
 *       400:
 *         description: Datos de entrada inválidos
 * 
 *   get:
 *     summary: Get all vaccination records
 *     tags: [Vacunaciones]
 *     responses:
 *       200:
 *         description: List of all vaccination records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vacunacion'
 * 
 * /vacunaciones/{id}:
 *   get:
 *     summary: Get a vaccination record by ID
 *     tags: [Vacunaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the vaccination record
 *     responses:
 *       200:
 *         description: Vaccination record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vacunacion'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update a vaccination record
 *     tags: [Vacunaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the vaccination record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vacunacion'
 *     responses:
 *       200:
 *         description: Vaccination record updated successfully
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete a vaccination record
 *     tags: [Vacunaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the vaccination record to delete
 *     responses:
 *       200:
 *         description: Vaccination record deleted successfully
 *       404:
 *         description: Record not found
 * 
 * /vacunaciones/por-vacuna-dosis:
 *   get:
 *     summary: Get total applications by vaccine type and dose
 *     tags: [Estadísticas de Vacunación]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VacunaDosisAplicacionDTO'
 * 
 * /vacunaciones/por-persona/{persona_id}:
 *   get:
 *     summary: Get vaccinations by vaccine type for a specific person
 *     tags: [Estadísticas de Vacunación]
 *     parameters:
 *       - in: path
 *         name: persona_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the person
 *     responses:
 *       200:
 *         description: Person's vaccination records found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VacunaDosisAplicacionDTO'
 * 
 * /vacunaciones/personas-por-vacuna:
 *   get:
 *     summary: Get number of people vaccinated per vaccine type
 *     tags: [Estadísticas de Vacunación]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PersonasVacunadasPorVacunaDTO'
 * 
 * /vacunaciones/por-anio:
 *   get:
 *     summary: Get applications by year and vaccine type
 *     tags: [Estadísticas de Vacunación]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AplicacionesPorAnioVacunaDTO'
 * 
 * /vacunaciones/por-sexo/{sexo}:
 *   get:
 *     summary: Get vaccinations segmented by gender
 *     tags: [Estadísticas de Vacunación]
 *     parameters:
 *       - in: path
 *         name: sexo
 *         schema:
 *           type: string
 *         required: true
 *         description: Gender filter (M/F)
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VacunacionPorSexoDTO'
 * 
 * /vacunaciones/por-rango-edad:
 *   get:
 *     summary: Get vaccinations by age range
 *     tags: [Estadísticas de Vacunación]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VacunacionPorRangoEdadDTO'
 * 
 * /vacunaciones/dosis-por-persona:
 *   get:
 *     summary: Get total doses applied per person
 *     tags: [Estadísticas de Vacunación]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DosisPorPersonaDTO'
 */

import express from "express";
import { validate } from "../../../shared/middleware/validateMiddleware";
import { vacunacionSchema } from '../../domain/schemas/vacunacionSchema';
import { createVacunasController } from "../../vacunas_dependencies";
import { readVacunasByIdController } from "../../vacunas_dependencies";
import { readAllVacunasController } from "../../vacunas_dependencies";
import { deleteVacunasController } from "../../vacunas_dependencies";
import { updateVacunasController } from "../../vacunas_dependencies";
import {getAplicacionesPorAnioVacunaController, getDosisAplicadasPorPersonaController,getVacunacionPorVacunaController ,getAplicacionesPorVacunaYDosisController, getPersonasVacunadasPorVacunaController, getVacunacionPorRangoEdadController, getVacunacionPorSexoController} from "../../vacunas_dependencies";

getVacunacionPorSexoController
export const router = express.Router();
// Total de aplicaciones por tipo de vacuna y dosis
router.get("/vacunaciones/por-vacuna-dosis", getAplicacionesPorVacunaYDosisController.run.bind(getAplicacionesPorVacunaYDosisController));

// Aplicaciones por tipo de vacuna y dosis para una persona específica
router.get("/vacunaciones/por-persona/:persona_id", getVacunacionPorVacunaController.run.bind(getVacunacionPorVacunaController));

// Número de personas vacunadas por cada vacuna (sin repetir persona)
router.get("/vacunaciones/personas-por-vacuna", getPersonasVacunadasPorVacunaController.run.bind(getPersonasVacunadasPorVacunaController));

// Aplicaciones por año y tipo de vacuna
router.get("/vacunaciones/por-anio", getAplicacionesPorAnioVacunaController.run.bind(getAplicacionesPorAnioVacunaController));

// Vacunación segmentada por sexo
router.get("/vacunaciones/por-sexo/:sexo", getVacunacionPorSexoController.run.bind(getVacunacionPorSexoController));

// Vacunación por rangos de edad (0-17, 18-49, 50+)
router.get("/vacunaciones/por-rango-edad", getVacunacionPorRangoEdadController.run.bind(getVacunacionPorRangoEdadController));

// Total de dosis aplicadas por persona (historial/resumen individual)
router.get("/vacunaciones/dosis-por-persona", getDosisAplicadasPorPersonaController.run.bind(getDosisAplicadasPorPersonaController));

router.post("/vacunaciones", validate(vacunacionSchema), createVacunasController.run.bind(createVacunasController));
router.get("/vacunaciones",readAllVacunasController.run.bind(readAllVacunasController));
router.delete("/vacunaciones/:id",deleteVacunasController.run.bind(deleteVacunasController));
router.get("/vacunaciones/:id",readVacunasByIdController.run.bind(readVacunasByIdController));
router.put("/vacunaciones/:id", validate(vacunacionSchema), updateVacunasController.run.bind(updateVacunasController));

export default router;
