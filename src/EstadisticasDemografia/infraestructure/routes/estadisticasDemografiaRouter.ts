/**
 * @swagger
 * components:
 *   parameters:
 *     DemografiaFechaInicio:
 *       in: query
 *       name: fecha_inicio
 *       required: false
 *       schema:
 *         type: string
 *         format: date
 *       description: "Filtro opcional. Fecha inicial (formato YYYY-MM-DD) acotada por cedula.fecha_registro."
 *       example: "2026-01-01"
 *     DemografiaFechaFin:
 *       in: query
 *       name: fecha_fin
 *       required: false
 *       schema:
 *         type: string
 *         format: date
 *       description: "Filtro opcional. Fecha final (formato YYYY-MM-DD) acotada por cedula.fecha_registro."
 *       example: "2026-12-31"
 *     DemografiaUnidadSalud:
 *       in: query
 *       name: unidad_salud_id
 *       required: false
 *       schema:
 *         type: integer
 *       description: "Filtro opcional. Identificador entero de la unidad de salud (cedula.unidad_salud_id)."
 *       example: 3
 *     DemografiaLocalidad:
 *       in: query
 *       name: localidad
 *       required: false
 *       schema:
 *         type: string
 *       description: "Filtro opcional. Localidad (match exacto contra direccion.localidad)."
 *       example: "Centro"
 *
 * /estadisticas/demografia/piramide:
 *   get:
 *     summary: Pirámide poblacional (rango de edad x sexo)
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rango_edad:
 *                     type: string
 *                     description: Rango de edad (0-4, 5-14, 15-29, 30-44, 45-59, 60+)
 *                     example: "15-29"
 *                   sexo:
 *                     type: string
 *                     description: Sexo de la persona
 *                     enum: [masculino, femenino]
 *                     example: "femenino"
 *                   total:
 *                     type: integer
 *                     description: Total de personas en ese rango de edad y sexo
 *                     example: 124
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/genero:
 *   get:
 *     summary: Distribución de la población por género
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sexo:
 *                     type: string
 *                     description: Sexo de la persona
 *                     enum: [masculino, femenino]
 *                     example: "masculino"
 *                   total:
 *                     type: integer
 *                     description: Total de personas con ese sexo
 *                     example: 532
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/escolaridad:
 *   get:
 *     summary: Distribución de la población por nivel de escolaridad
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del nivel de escolaridad
 *                     example: "Primaria"
 *                   total:
 *                     type: integer
 *                     description: Total de personas con ese nivel de escolaridad
 *                     example: 210
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/alfabetizacion:
 *   get:
 *     summary: Conteo de alfabetización (alfabetizados / no alfabetizados / sin dato)
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alfabetizados:
 *                   type: integer
 *                   description: Total de personas alfabetizadas
 *                   example: 480
 *                 no_alfabetizados:
 *                   type: integer
 *                   description: Total de personas no alfabetizadas
 *                   example: 95
 *                 sin_dato:
 *                   type: integer
 *                   description: Total de personas sin dato de alfabetización
 *                   example: 12
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/lengua-indigena:
 *   get:
 *     summary: Distribución de la población por lengua (Español / Lengua indígena)
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   lengua:
 *                     type: string
 *                     description: Nombre de la lengua
 *                     example: "Español"
 *                   total:
 *                     type: integer
 *                     description: Total de personas que hablan esa lengua
 *                     example: 615
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/ingreso:
 *   get:
 *     summary: Distribución de la población por rango de ingreso salarial
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rango:
 *                     type: string
 *                     description: Rango de ingreso salarial
 *                     example: "1 a 2 salarios mínimos"
 *                   total:
 *                     type: integer
 *                     description: Total de personas en ese rango de ingreso
 *                     example: 340
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/ocupacion:
 *   get:
 *     summary: Distribución de la población por ocupación
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la ocupación
 *                     example: "Agricultor"
 *                   total:
 *                     type: integer
 *                     description: Total de personas con esa ocupación
 *                     example: 152
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/estado-civil:
 *   get:
 *     summary: Distribución de la población por estado civil
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DemografiaFechaInicio'
 *       - $ref: '#/components/parameters/DemografiaFechaFin'
 *       - $ref: '#/components/parameters/DemografiaUnidadSalud'
 *       - $ref: '#/components/parameters/DemografiaLocalidad'
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del estado civil
 *                     example: "Casado"
 *                   total:
 *                     type: integer
 *                     description: Total de personas con ese estado civil
 *                     example: 287
 *       400:
 *         description: Parámetros de filtro inválidos
 *       401:
 *         description: No autorizado (token ausente o inválido)
 */

import express from "express";
import { authMiddleware } from "../../../User/infraestructure/middleware/authMiddleware";
import { estadisticasDemografiaController } from "../../estadisticasDemografia_dependencies";

export const router = express.Router();

// 1. Pirámide poblacional (rango de edad x sexo)
router.get(
  "/estadisticas/demografia/piramide",
  authMiddleware(),
  estadisticasDemografiaController.piramide.bind(estadisticasDemografiaController)
);

// 2. Distribución por género
router.get(
  "/estadisticas/demografia/genero",
  authMiddleware(),
  estadisticasDemografiaController.genero.bind(estadisticasDemografiaController)
);

// 3. Distribución por escolaridad
router.get(
  "/estadisticas/demografia/escolaridad",
  authMiddleware(),
  estadisticasDemografiaController.escolaridad.bind(estadisticasDemografiaController)
);

// 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
router.get(
  "/estadisticas/demografia/alfabetizacion",
  authMiddleware(),
  estadisticasDemografiaController.alfabetizacion.bind(estadisticasDemografiaController)
);

// 5. Distribución por lengua indígena
router.get(
  "/estadisticas/demografia/lengua-indigena",
  authMiddleware(),
  estadisticasDemografiaController.lenguaIndigena.bind(estadisticasDemografiaController)
);

// 6. Distribución por ingreso salarial
router.get(
  "/estadisticas/demografia/ingreso",
  authMiddleware(),
  estadisticasDemografiaController.ingreso.bind(estadisticasDemografiaController)
);

// 7. Distribución por ocupación
router.get(
  "/estadisticas/demografia/ocupacion",
  authMiddleware(),
  estadisticasDemografiaController.ocupacion.bind(estadisticasDemografiaController)
);

// 8. Distribución por estado civil
router.get(
  "/estadisticas/demografia/estado-civil",
  authMiddleware(),
  estadisticasDemografiaController.estadoCivil.bind(estadisticasDemografiaController)
);

export default router;
