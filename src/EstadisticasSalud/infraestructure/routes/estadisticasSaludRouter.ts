/**
 * @swagger
 * /estadisticas/salud/enfermedades-cronicas:
 *   get:
 *     summary: Personas (distintas) por enfermedad crónica
 *     tags: [Estadísticas - Salud]
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
 *                 $ref: '#/components/schemas/EnfermedadCronicaDTO'
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/toxicomanias:
 *   get:
 *     summary: Personas (distintas) por toxicomanía
 *     tags: [Estadísticas - Salud]
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
 *                 $ref: '#/components/schemas/ToxicomaniaDTO'
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/discapacidad:
 *   get:
 *     summary: Discapacidad (resumen y desglose por tipo)
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscapacidadDTO'
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/preventiva:
 *   get:
 *     summary: Salud preventiva (resumen y por atención de embarazo)
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaludPreventivaDTO'
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/seguridad-social:
 *   get:
 *     summary: Personas con y sin seguridad social
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguridadSocialDTO'
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/alimentacion:
 *   get:
 *     summary: Promedios de días de consumo por grupo de alimentos
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlimentacionDTO'
 *       500:
 *         description: Error interno del servidor
 */

import express from "express";
import { authMiddleware } from "../../../User/infraestructure/middleware/authMiddleware";
import { estadisticasSaludController } from "../../estadisticasSalud_dependencies";

export const router = express.Router();

// 1. Personas por enfermedad crónica
router.get(
  "/estadisticas/salud/enfermedades-cronicas",
  authMiddleware(),
  estadisticasSaludController.enfermedadesCronicas.bind(estadisticasSaludController)
);

// 2. Personas por toxicomanía
router.get(
  "/estadisticas/salud/toxicomanias",
  authMiddleware(),
  estadisticasSaludController.toxicomanias.bind(estadisticasSaludController)
);

// 3. Discapacidad (resumen + por tipo)
router.get(
  "/estadisticas/salud/discapacidad",
  authMiddleware(),
  estadisticasSaludController.discapacidad.bind(estadisticasSaludController)
);

// 4. Salud preventiva (resumen + por atención de embarazo)
router.get(
  "/estadisticas/salud/preventiva",
  authMiddleware(),
  estadisticasSaludController.preventiva.bind(estadisticasSaludController)
);

// 5. Seguridad social
router.get(
  "/estadisticas/salud/seguridad-social",
  authMiddleware(),
  estadisticasSaludController.seguridadSocial.bind(estadisticasSaludController)
);

// 6. Alimentación
router.get(
  "/estadisticas/salud/alimentacion",
  authMiddleware(),
  estadisticasSaludController.alimentacion.bind(estadisticasSaludController)
);

export default router;
