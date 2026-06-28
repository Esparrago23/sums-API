/**
 * @swagger
 * /estadisticas/mis-cedulas/resumen:
 *   get:
 *     summary: Resumen de cédulas del entrevistador autenticado
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de cédulas del entrevistador autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entrevistador_id:
 *                   type: integer
 *                   nullable: true
 *                   example: 12
 *                 alta:
 *                   type: string
 *                   nullable: true
 *                   example: "2025-01-15"
 *                 hoy:
 *                   type: integer
 *                   example: 3
 *                 semana:
 *                   type: integer
 *                   example: 18
 *                 mes:
 *                   type: integer
 *                   example: 74
 *                 total:
 *                   type: integer
 *                   example: 320
 *                 primera_cedula:
 *                   type: string
 *                   nullable: true
 *                   example: "2025-01-20"
 *                 ultima_cedula:
 *                   type: string
 *                   nullable: true
 *                   example: "2026-06-27"
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/mis-cedulas/serie:
 *   get:
 *     summary: Serie diaria de cédulas del entrevistador autenticado
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *           default: 30
 *           minimum: 1
 *           maximum: 365
 *         required: false
 *         description: Número de días hacia atrás a incluir en la serie (1 a 365)
 *     responses:
 *       200:
 *         description: Serie diaria de cédulas del entrevistador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:
 *                     type: string
 *                     example: "2026-06-27"
 *                   total:
 *                     type: integer
 *                     example: 5
 *       400:
 *         description: El parámetro 'dias' debe ser un entero entre 1 y 365
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/mis-cedulas/por-estado:
 *   get:
 *     summary: Conteo de cédulas del entrevistador autenticado agrupadas por estado
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de cédulas del entrevistador por estado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   estado:
 *                     type: string
 *                     example: "completada"
 *                   total:
 *                     type: integer
 *                     example: 42
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/resumen-general:
 *   get:
 *     summary: Totales globales del sistema
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totales globales del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_cedulas:
 *                   type: integer
 *                   example: 1250
 *                 total_personas:
 *                   type: integer
 *                   example: 4300
 *                 total_viviendas:
 *                   type: integer
 *                   example: 980
 *                 total_nucleos:
 *                   type: integer
 *                   example: 1100
 *                 total_dosis:
 *                   type: integer
 *                   example: 7600
 *                 total_entrevistadores:
 *                   type: integer
 *                   example: 25
 *                 cedulas_hoy:
 *                   type: integer
 *                   example: 12
 *                 cedulas_mes:
 *                   type: integer
 *                   example: 310
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/productividad/entrevistadores:
 *   get:
 *     summary: Productividad por entrevistador (ranking)
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productividad por entrevistador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_entrevistador:
 *                     type: integer
 *                     example: 12
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   alta:
 *                     type: string
 *                     nullable: true
 *                     example: "2025-01-15"
 *                   total:
 *                     type: integer
 *                     example: 320
 *                   hoy:
 *                     type: integer
 *                     example: 3
 *                   semana:
 *                     type: integer
 *                     example: 18
 *                   mes:
 *                     type: integer
 *                     example: 74
 *                   ultima_actividad:
 *                     type: string
 *                     nullable: true
 *                     example: "2026-06-27"
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/cedulas/serie:
 *   get:
 *     summary: Serie temporal global de cédulas (agrupada por día, semana o mes)
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: agrupar
 *         schema:
 *           type: string
 *           enum: [dia, semana, mes]
 *           default: mes
 *         required: false
 *         description: Granularidad de agrupación de la serie
 *     responses:
 *       200:
 *         description: Serie temporal global de cédulas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   periodo:
 *                     type: string
 *                     example: "2026-06-01"
 *                   total:
 *                     type: integer
 *                     example: 310
 *       400:
 *         description: "El parámetro 'agrupar' debe ser uno de: dia, semana, mes"
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/cedulas/por-estado:
 *   get:
 *     summary: Conteo global de cédulas agrupadas por estado
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo global de cédulas por estado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   estado:
 *                     type: string
 *                     example: "completada"
 *                   total:
 *                     type: integer
 *                     example: 980
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/cedulas/por-unidad:
 *   get:
 *     summary: Conteo de cédulas por unidad de salud
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de cédulas por unidad de salud
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_unidad_salud:
 *                     type: integer
 *                     example: 4
 *                   nombre:
 *                     type: string
 *                     example: "Unidad de Salud Centro"
 *                   total:
 *                     type: integer
 *                     example: 215
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/cedulas/por-localidad:
 *   get:
 *     summary: Conteo de cédulas por localidad
 *     tags: [Estadísticas - Operación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de cédulas por localidad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   localidad:
 *                     type: string
 *                     example: "San Miguel"
 *                   total:
 *                     type: integer
 *                     example: 130
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       500:
 *         description: Error interno del servidor
 */

import express from "express";
import { authMiddleware } from "../../../User/infraestructure/middleware/authMiddleware";

import { EstadisticasOperacionRepo } from "../repositories/estadisticasOperacionRepo";
import {
  GetMisCedulasResumenUseCase,
  GetMisCedulasSerieUseCase,
  GetMisCedulasPorEstadoUseCase
} from "../../application/misCedulas_UseCase";
import {
  GetResumenGeneralUseCase,
  GetProductividadEntrevistadoresUseCase,
  GetCedulasSerieUseCase,
  GetCedulasPorEstadoUseCase,
  GetCedulasPorUnidadUseCase,
  GetCedulasPorLocalidadUseCase
} from "../../application/operacion_UseCase";
import { EstadisticasOperacion_Controller } from "../controllers/estadisticasOperacion_Controller";

// Inyección de dependencias: repo -> casos de uso -> controller
const repo = new EstadisticasOperacionRepo();

const controller = new EstadisticasOperacion_Controller(
  new GetMisCedulasResumenUseCase(repo),
  new GetMisCedulasSerieUseCase(repo),
  new GetMisCedulasPorEstadoUseCase(repo),
  new GetResumenGeneralUseCase(repo),
  new GetProductividadEntrevistadoresUseCase(repo),
  new GetCedulasSerieUseCase(repo),
  new GetCedulasPorEstadoUseCase(repo),
  new GetCedulasPorUnidadUseCase(repo),
  new GetCedulasPorLocalidadUseCase(repo)
);

const router = express.Router();

// 1. Resumen de cédulas del entrevistador autenticado
router.get(
  "/estadisticas/mis-cedulas/resumen",
  authMiddleware(),
  controller.misCedulasResumen.bind(controller)
);

// 2. Serie temporal de cédulas del entrevistador autenticado
router.get(
  "/estadisticas/mis-cedulas/serie",
  authMiddleware(),
  controller.misCedulasSerie.bind(controller)
);

// 3. Cédulas del entrevistador autenticado agrupadas por estado
router.get(
  "/estadisticas/mis-cedulas/por-estado",
  authMiddleware(),
  controller.misCedulasPorEstado.bind(controller)
);

// 4. Resumen general (totales globales)
router.get(
  "/estadisticas/resumen-general",
  authMiddleware(),
  controller.resumenGeneral.bind(controller)
);

// 5. Productividad por entrevistador (ranking)
router.get(
  "/estadisticas/productividad/entrevistadores",
  authMiddleware(),
  controller.productividadEntrevistadores.bind(controller)
);

// 6. Serie temporal global de cédulas (agrupada por dia/semana/mes)
router.get(
  "/estadisticas/cedulas/serie",
  authMiddleware(),
  controller.cedulasSerie.bind(controller)
);

// 7. Cédulas globales agrupadas por estado
router.get(
  "/estadisticas/cedulas/por-estado",
  authMiddleware(),
  controller.cedulasPorEstado.bind(controller)
);

// 8. Cédulas por unidad de salud
router.get(
  "/estadisticas/cedulas/por-unidad",
  authMiddleware(),
  controller.cedulasPorUnidad.bind(controller)
);

// 9. Cédulas por localidad
router.get(
  "/estadisticas/cedulas/por-localidad",
  authMiddleware(),
  controller.cedulasPorLocalidad.bind(controller)
);

export default router;
