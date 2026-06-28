/**
 * @swagger
 * /estadisticas/demografia/piramide:
 *   get:
 *     summary: Pirámide poblacional (rango de edad x sexo)
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/genero:
 *   get:
 *     summary: Distribución de la población por género
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/escolaridad:
 *   get:
 *     summary: Distribución de la población por nivel de escolaridad
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/alfabetizacion:
 *   get:
 *     summary: Conteo de alfabetización (alfabetizados / no alfabetizados / sin dato)
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *
 * /estadisticas/demografia/lengua-indigena:
 *   get:
 *     summary: Distribución de la población por lengua (Español / Lengua indígena)
 *     tags: [Estadísticas - Demografía]
 *     security:
 *       - bearerAuth: []
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

export default router;
