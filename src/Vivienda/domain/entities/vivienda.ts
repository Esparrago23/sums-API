export type UbicacionCocina = 'fuera_del_dormitorio' | 'dentro_del_dormitorio';

export class Vivienda {
  constructor(
    public id: number,
    public nucleo_familiar_id: number,
    public direccion_id: number | null,
    public numero_cuartos: number | null,
    public numero_habitantes: number | null,
    public agua_entubada: boolean | null,
    public energia_electrica: boolean | null,
    public cocina_ubicacion: UbicacionCocina | null,
    public cocina_con_lena: boolean | null,
    public manejo_excretas_id: number | null,
    public red_alcantarillado: boolean | null,
    public fosa_septica: boolean | null,
    public material_techo_id: number | null,
    public material_paredes_id: number | null,
    public material_piso_id: number | null,
    public material_otro_especificar: string | null,
    public perros_gatos_dentro: boolean | null,
    public mascotas_vacunas_corrientes: boolean | null,
    public mascotas_esterilizadas: boolean | null,
    public comentarios: string | null
  ) {}
}

export class FamiliaAnimal {
  constructor(
    public id: number,
    public nucleo_familiar_id: number,
    public animal_id: number,
    public otro_especificar: string | null,
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
 *         agua_entubada:
 *           type: boolean
 *           nullable: true
 *         energia_electrica:
 *           type: boolean
 *           nullable: true
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
 *         material_techo_id:
 *           type: integer
 *           nullable: true
 *         material_paredes_id:
 *           type: integer
 *           nullable: true
 *         material_piso_id:
 *           type: integer
 *           nullable: true
 *         material_otro_especificar:
 *           type: string
 *           nullable: true
 *         perros_gatos_dentro:
 *           type: boolean
 *           nullable: true
 *         mascotas_vacunas_corrientes:
 *           type: boolean
 *           nullable: true
 *         mascotas_esterilizadas:
 *           type: boolean
 *           nullable: true
 *         comentarios:
 *           type: string
 *           nullable: true
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
 *         otro_especificar:
 *           type: string
 *           nullable: true
 *         comentarios:
 *           type: string
 *           nullable: true
 */
