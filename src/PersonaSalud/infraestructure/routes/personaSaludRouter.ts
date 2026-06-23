import express from 'express';
import { personaSaludController } from '../personaSalud_dependencies';
import { PersonaSaludTipo } from '../../domain/repositories/IPersonaSaludRepository';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { schemaByTipo } from '../../domain/schemas/personaSaludSchema';

export const router = express.Router();

const routeMap: Array<{ path: string; tipo: PersonaSaludTipo }> = [
  { path: '/personas-alimentacion', tipo: 'alimentacion' },
  { path: '/personas-higiene', tipo: 'higiene' },
  { path: '/personas-seguridad-social', tipo: 'seguridad-social' },
  { path: '/personas-discapacidades', tipo: 'discapacidades' },
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
 *       400:
 *         description: Invalid input data
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
 *       400:
 *         description: Invalid input data
 * /personas-salud-preventiva:
 *   post:
 *     summary: Registrar tamizajes y atencion de embarazo
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 *       400:
 *         description: Invalid input data
 * /personas-servicios-salud:
 *   post:
 *     summary: Registrar frecuencia de uso de servicios de salud
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 *       400:
 *         description: Invalid input data
 * 
 * /personas-discapacidades:
 *   post:
 *     summary: Registrar discapacidades
 *     tags: [PersonaSalud]
 *     responses:
 *       201:
 *         description: Registro creado
 *       400:
 *         description: Invalid input data (e.g., tipo_discapacidad requiere presenta_discapacidad=true)
 */
for (const route of routeMap) {
  router.post(route.path, validate(schemaByTipo[route.tipo]), personaSaludController.create(route.tipo));
  router.get(route.path, personaSaludController.readAll(route.tipo));
  router.get(`${route.path}/:id`, personaSaludController.readById(route.tipo));
  router.put(`${route.path}/:id`, validate(schemaByTipo[route.tipo]), personaSaludController.update(route.tipo));
  router.delete(`${route.path}/:id`, personaSaludController.delete(route.tipo));
}

export default router;
