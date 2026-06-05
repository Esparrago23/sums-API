export type UbicacionCocina = 'fuera_del_dormitorio' | 'dentro_del_dormitorio';

export class Vivienda {
  constructor(
    public id: number,
    public nucleo_familiar_id: number,
    public direccion_id: number | null,
    public numero_cuartos: number | null,
    public numero_habitantes: number | null,
    public cocina_ubicacion: UbicacionCocina | null,
    public cocina_con_lena: boolean | null,
    public manejo_excretas_id: number | null,
    public red_alcantarillado: boolean | null,
    public fosa_septica: boolean | null,
    public comentarios: string | null
  ) {}
}

export class ViviendaMaterial {
  constructor(
    public id: number,
    public vivienda_id: number,
    public tipo_material_vivienda_id: number,
    public material_id: number | null,
    public otro_especificar: string | null
  ) {}
}

export class ViviendaServicio {
  constructor(
    public id: number,
    public vivienda_id: number,
    public servicio_vivienda_id: number,
    public disponible: boolean
  ) {}
}

export class FamiliaAnimal {
  constructor(
    public id: number,
    public nucleo_familiar_id: number,
    public animal_id: number,
    public cantidad: number | null,
    public vive_dentro_vivienda: boolean | null,
    public esquema_vacunas_corriente: boolean | null,
    public esterilizado: boolean | null,
    public comentarios: string | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Vivienda:
 *       type: object
 *       required:
 *         - nucleo_familiar_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         nucleo_familiar_id:
 *           type: integer
 *         direccion_id:
 *           type: integer
 *           nullable: true
 *         numero_cuartos:
 *           type: integer
 *           nullable: true
 *           minimum: 0
 *         numero_habitantes:
 *           type: integer
 *           nullable: true
 *           minimum: 0
 *         cocina_ubicacion:
 *           type: string
 *           enum: [fuera_del_dormitorio, dentro_del_dormitorio]
 *           nullable: true
 *         cocina_con_lena:
 *           type: boolean
 *           nullable: true
 *         manejo_excretas_id:
 *           type: integer
 *           nullable: true
 *         red_alcantarillado:
 *           type: boolean
 *           nullable: true
 *         fosa_septica:
 *           type: boolean
 *           nullable: true
 *         comentarios:
 *           type: string
 *           nullable: true
 *     ViviendaMaterial:
 *       type: object
 *       required:
 *         - vivienda_id
 *         - tipo_material_vivienda_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         vivienda_id:
 *           type: integer
 *         tipo_material_vivienda_id:
 *           type: integer
 *           description: Catalogo techo, paredes o piso.
 *         material_id:
 *           type: integer
 *           nullable: true
 *         otro_especificar:
 *           type: string
 *           nullable: true
 *     ViviendaServicio:
 *       type: object
 *       required:
 *         - vivienda_id
 *         - servicio_vivienda_id
 *         - disponible
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         vivienda_id:
 *           type: integer
 *         servicio_vivienda_id:
 *           type: integer
 *         disponible:
 *           type: boolean
 *     FamiliaAnimal:
 *       type: object
 *       required:
 *         - nucleo_familiar_id
 *         - animal_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         nucleo_familiar_id:
 *           type: integer
 *         animal_id:
 *           type: integer
 *         cantidad:
 *           type: integer
 *           nullable: true
 *           minimum: 0
 *         vive_dentro_vivienda:
 *           type: boolean
 *           nullable: true
 *         esquema_vacunas_corriente:
 *           type: boolean
 *           nullable: true
 *         esterilizado:
 *           type: boolean
 *           nullable: true
 *         comentarios:
 *           type: string
 *           nullable: true
 */
