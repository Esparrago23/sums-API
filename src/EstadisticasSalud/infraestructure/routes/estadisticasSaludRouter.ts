/**
 * @swagger
 * /estadisticas/salud/enfermedades-cronicas:
 *   get:
 *     summary: Personas (distintas) por enfermedad crónica
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnfermedadCronicaDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/toxicomanias:
 *   get:
 *     summary: Personas (distintas) por toxicomanía
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ToxicomaniaDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/discapacidad:
 *   get:
 *     summary: Discapacidad (resumen y desglose por tipo)
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscapacidadDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/preventiva:
 *   get:
 *     summary: Salud preventiva (resumen y por atención de embarazo)
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaludPreventivaDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/seguridad-social:
 *   get:
 *     summary: Personas con y sin seguridad social
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguridadSocialDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/alimentacion:
 *   get:
 *     summary: Promedios de días de consumo por grupo de alimentos
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlimentacionDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/servicios-salud:
 *   get:
 *     summary: Frecuencia de uso de servicios de salud
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServicioSaludDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/higiene-bucodental:
 *   get:
 *     summary: Higiene bucodental (diaria, no diaria, sin dato)
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HigieneBucodentalDTO'
 *       400:
 *         description: Parámetro de filtro inválido
 *       500:
 *         description: Error interno del servidor
 *
 * /estadisticas/salud/piramide-vacuna:
 *   get:
 *     summary: Pirámide poblacional filtrada por vacuna
 *     tags: [Estadísticas - Salud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula mayor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra por fecha de registro de la cédula menor o igual (formato YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por la unidad de salud de la cédula (entero)"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra por la localidad de la dirección (coincidencia exacta)"
 *       - in: query
 *         name: vacuna_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra por el ID de la vacuna recibida"
 *     responses:
 *       200:
 *         description: Estadística obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PiramideVacunaDTO'
 *       400:
 *         description: Parámetro de filtro inválido
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

// 7. Frecuencia de uso de servicios de salud
router.get(
  "/estadisticas/salud/servicios-salud",
  authMiddleware(),
  estadisticasSaludController.serviciosSalud.bind(estadisticasSaludController)
);

// 8. Higiene bucodental
router.get(
  "/estadisticas/salud/higiene-bucodental",
  authMiddleware(),
  estadisticasSaludController.higieneBucodental.bind(estadisticasSaludController)
);

// 9. Pirámide poblacional por vacuna
router.get(
  "/estadisticas/salud/piramide-vacuna",
  authMiddleware(),
  estadisticasSaludController.piramideVacuna.bind(estadisticasSaludController)
);

export default router;
