import express from 'express';
import { personaSaludController } from '../personaSalud_dependencies';
import { PersonaSaludTipo } from '../../domain/repositories/IPersonaSaludRepository';

export const router = express.Router();

const routeMap: Array<{ path: string; tipo: PersonaSaludTipo }> = [
  { path: '/personas-alimentacion', tipo: 'alimentacion' },
  { path: '/personas-higiene', tipo: 'higiene' },
  { path: '/personas-toxicomanias', tipo: 'toxicomanias' },
  { path: '/personas-enfermedades-cronicas', tipo: 'enfermedades-cronicas' },
  { path: '/personas-salud-preventiva', tipo: 'salud-preventiva' },
  { path: '/personas-servicios-salud', tipo: 'servicios-salud' }
];

/**
 * @swagger
 * /personas-alimentacion:
 *   post:
 *     summary: Registrar frecuencia de alimentacion por persona
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 *   get:
 *     summary: Listar registros de alimentacion
 *     tags: [PersonaSalud]
 *     responses:
 *       200:
 *         description: Lista de registros
 * /personas-higiene:
 *   post:
 *     summary: Registrar higiene diaria por persona
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 * /personas-salud-preventiva:
 *   post:
 *     summary: Registrar tamizajes y atencion de embarazo
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 * /personas-servicios-salud:
 *   post:
 *     summary: Registrar frecuencia de uso de servicios de salud
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 */
for (const route of routeMap) {
  router.post(route.path, personaSaludController.create(route.tipo));
  router.get(route.path, personaSaludController.readAll(route.tipo));
  router.get(`${route.path}/:id`, personaSaludController.readById(route.tipo));
  router.put(`${route.path}/:id`, personaSaludController.update(route.tipo));
  router.delete(`${route.path}/:id`, personaSaludController.delete(route.tipo));
}

export default router;
