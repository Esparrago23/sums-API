/**
 * @swagger
 * /estadisticas/vivienda/servicios:
 *   get:
 *     summary: Servicios básicos de la vivienda (agua, luz, alcantarillado, fosa séptica)
 *     tags: [Estadísticas - Vivienda]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula con fecha_registro mayor o igual a esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula con fecha_registro menor o igual a esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula de esta unidad de salud"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra viviendas por localidad (match exacto contra direccion.localidad)"
 *     responses:
 *       200:
 *         description: Estadísticas de servicios básicos obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_viviendas:
 *                   type: integer
 *                   description: Total de viviendas registradas
 *                 con_agua:
 *                   type: integer
 *                   description: Viviendas con agua entubada
 *                 sin_agua:
 *                   type: integer
 *                   description: Viviendas sin agua entubada
 *                 con_luz:
 *                   type: integer
 *                   description: Viviendas con energía eléctrica
 *                 sin_luz:
 *                   type: integer
 *                   description: Viviendas sin energía eléctrica
 *                 con_alcantarillado:
 *                   type: integer
 *                   description: Viviendas con red de alcantarillado
 *                 sin_alcantarillado:
 *                   type: integer
 *                   description: Viviendas sin red de alcantarillado
 *                 con_fosa_septica:
 *                   type: integer
 *                   description: Viviendas con fosa séptica
 *       400:
 *         description: Parámetros de filtro inválidos (fecha mal formada o unidad_salud_id no entero)
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *
 * /estadisticas/vivienda/hacinamiento:
 *   get:
 *     summary: Hacinamiento (habitantes / cuartos > 2.5)
 *     tags: [Estadísticas - Vivienda]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula con fecha_registro mayor o igual a esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula con fecha_registro menor o igual a esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula de esta unidad de salud"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra viviendas por localidad (match exacto contra direccion.localidad)"
 *     responses:
 *       200:
 *         description: Estadísticas de hacinamiento obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 viviendas_hacinadas:
 *                   type: integer
 *                   description: Viviendas con más de 2.5 personas por cuarto
 *                 viviendas_no_hacinadas:
 *                   type: integer
 *                   description: Viviendas con 2.5 o menos personas por cuarto
 *                 sin_dato:
 *                   type: integer
 *                   description: Viviendas sin número de cuartos registrado
 *                 promedio_personas_por_cuarto:
 *                   type: number
 *                   format: float
 *                   description: Promedio de personas por cuarto
 *       400:
 *         description: Parámetros de filtro inválidos (fecha mal formada o unidad_salud_id no entero)
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *
 * /estadisticas/vivienda/materiales-riesgo:
 *   get:
 *     summary: Materiales y condiciones de riesgo (piso de tierra, cocina con leña/en dormitorio)
 *     tags: [Estadísticas - Vivienda]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula con fecha_registro mayor o igual a esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: fecha_fin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula con fecha_registro menor o igual a esta fecha (formato: YYYY-MM-DD)"
 *       - in: query
 *         name: unidad_salud_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Filtra viviendas cuyo núcleo tenga al menos una cédula de esta unidad de salud"
 *       - in: query
 *         name: localidad
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filtra viviendas por localidad (match exacto contra direccion.localidad)"
 *     responses:
 *       200:
 *         description: Estadísticas de materiales y condiciones de riesgo obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 piso_tierra:
 *                   type: integer
 *                   description: Viviendas con piso de tierra
 *                 cocina_con_lena:
 *                   type: integer
 *                   description: Viviendas que cocinan con leña
 *                 cocina_en_dormitorio:
 *                   type: integer
 *                   description: Viviendas con cocina ubicada dentro del dormitorio
 *                 total_viviendas:
 *                   type: integer
 *                   description: Total de viviendas registradas
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *
 * /estadisticas/vivienda/animales:
 *   get:
 *     summary: Animales por tipo y resumen de mascotas en la vivienda
 *     tags: [Estadísticas - Vivienda]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de animales y mascotas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 por_animal:
 *                   type: array
 *                   description: Conteo de viviendas por tipo de animal
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del tipo de animal
 *                       total:
 *                         type: integer
 *                         description: Total de viviendas con ese animal
 *                 mascotas:
 *                   type: object
 *                   description: Resumen de mascotas en la vivienda
 *                   properties:
 *                     con_perros_gatos_dentro:
 *                       type: integer
 *                       description: Viviendas con perros o gatos dentro del hogar
 *                     mascotas_sin_vacunar:
 *                       type: integer
 *                       description: Viviendas con mascotas sin vacunas corrientes
 *                     mascotas_esterilizadas:
 *                       type: integer
 *                       description: Viviendas con mascotas esterilizadas
 *       401:
 *         description: No autorizado (token inválido o ausente)
 */

import express from "express";
import { authMiddleware } from "../../../User/infraestructure/middleware/authMiddleware";
import {
  getServiciosController,
  getHacinamientoController,
  getMaterialesRiesgoController,
  getAnimalesController
} from "../../estadisticasVivienda_dependencies";

export const router = express.Router();

// 1. Servicios básicos de la vivienda
router.get(
  "/estadisticas/vivienda/servicios",
  authMiddleware(),
  getServiciosController.run.bind(getServiciosController)
);

// 2. Hacinamiento (habitantes / cuartos > 2.5)
router.get(
  "/estadisticas/vivienda/hacinamiento",
  authMiddleware(),
  getHacinamientoController.run.bind(getHacinamientoController)
);

// 3. Materiales y condiciones de riesgo
router.get(
  "/estadisticas/vivienda/materiales-riesgo",
  authMiddleware(),
  getMaterialesRiesgoController.run.bind(getMaterialesRiesgoController)
);

// 4. Animales / mascotas
router.get(
  "/estadisticas/vivienda/animales",
  authMiddleware(),
  getAnimalesController.run.bind(getAnimalesController)
);

export default router;
