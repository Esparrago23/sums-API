import { db } from '../../core/db_postgresql';

type Dict = Record<string, any>;

export interface CapturaCompletaResult {
  cedula_id: number | null;
  nucleo_familiar_id: number;
  direccion_id: number | null;
  vivienda_id: number | null;
  integrantes: Array<{ persona_id: number; nucleo_persona_id: number | null; nombre: string | null }>;
  inmunizaciones: Array<{ inmunizacion_id: number; persona_id: number; vacuna: string | null }>;
  warnings: string[];
}

export class CapturaCompletaCedulaUseCase {
  async execute(payload: Dict): Promise<CapturaCompletaResult> {
    const warnings: string[] = [];
    const familia = this.objectValue(payload.familia) ?? payload;
    const vivienda = this.objectValue(payload.vivienda) ?? payload;

    const nucleoId = await this.createNucleo(familia);
    const direccionId = await this.createDireccionIfPresent(familia);
    if (direccionId) {
      await this.createNucleoDireccion(nucleoId, direccionId);
    }

    const viviendaId = await this.createVivienda(nucleoId, direccionId, vivienda);
    await this.createFamiliaAnimales(nucleoId, vivienda, warnings);

    const integrantesPayload = this.arrayValue(payload.integrantes);
    const integrantes: CapturaCompletaResult['integrantes'] = [];
    const personaByName = new Map<string, number>();
    for (const integrante of integrantesPayload) {
      const created = await this.createIntegrante(nucleoId, integrante, warnings);
      if (created) {
        integrantes.push(created);
        const key = this.normalizeKey(created.nombre);
        if (key) personaByName.set(key, created.persona_id);
      }
    }

    const cedulaId = await this.createCedulaIfPossible(payload, nucleoId, warnings);
    const inmunizaciones = await this.createVacunas(payload, personaByName, cedulaId, warnings);

    return {
      cedula_id: cedulaId,
      nucleo_familiar_id: nucleoId,
      direccion_id: direccionId,
      vivienda_id: viviendaId,
      integrantes,
      inmunizaciones,
      warnings
    };
  }

  private async createNucleo(familia: Dict): Promise<number> {
    const comentarios = [
      this.textValue(familia.informante_nombre ?? familia.informanteNombre)
        ? `Informante: ${this.textValue(familia.informante_nombre ?? familia.informanteNombre)}`
        : null,
      this.textValue(familia.rol_informante ?? familia.rolInformante)
        ? `Rol: ${this.textValue(familia.rol_informante ?? familia.rolInformante)}`
        : null
    ].filter(Boolean).join(' | ') || null;

    const result = await db.executePreparedQuery(
      `INSERT INTO nucleo_familiar (fecha_registro, comentarios)
       VALUES (NOW(), $1)
       RETURNING id_nucleo_familiar;`,
      [comentarios]
    );
    return result.rows[0].id_nucleo_familiar;
  }

  private async createDireccionIfPresent(familia: Dict): Promise<number | null> {
    const calle = this.textValue(familia.calle ?? familia.domicilio);
    const localidad = this.textValue(familia.localidad);
    const manzana = this.textValue(familia.manzana);
    const viviendaReferencia = this.textValue(
      familia.vivienda_referencia ?? familia.viviendaReferencia ?? familia.vivienda
    );
    const hasAny = [
      calle,
      familia.numero_exterior,
      familia.numero_interior,
      familia.colonia,
      familia.codigo_postal,
      localidad,
      manzana,
      viviendaReferencia,
      familia.asentamiento_id
    ].some((value) => value !== undefined && value !== null && value !== '');
    if (!hasAny) return null;

    const result = await db.executePreparedQuery(
      `INSERT INTO direccion (
         calle, numero_exterior, numero_interior, colonia, codigo_postal,
         localidad, manzana, vivienda_referencia, asentamiento_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id_direccion;`,
      [
        calle,
        this.textValue(familia.numero_exterior),
        this.textValue(familia.numero_interior),
        this.textValue(familia.colonia),
        this.textValue(familia.codigo_postal),
        localidad,
        manzana,
        viviendaReferencia,
        this.intValue(familia.asentamiento_id)
      ]
    );
    return result.rows[0].id_direccion;
  }

  private async createNucleoDireccion(nucleoId: number, direccionId: number): Promise<void> {
    await db.executePreparedQuery(
      `INSERT INTO nucleo_direccion (nucleo_familiar_id, direccion_id, fecha_asociacion)
       VALUES ($1, $2, CURRENT_DATE);`,
      [nucleoId, direccionId]
    );
  }

  private async createVivienda(nucleoId: number, direccionId: number | null, vivienda: Dict): Promise<number | null> {
    const materialTechoId = this.intValue(vivienda.material_techo_id)
      ?? await this.findOrCreateCatalog('cat_material', 'id_material', 'nombre', vivienda.techo);
    const materialParedesId = this.intValue(vivienda.material_paredes_id)
      ?? await this.findOrCreateCatalog('cat_material', 'id_material', 'nombre', vivienda.paredes);
    const materialPisoId = this.intValue(vivienda.material_piso_id)
      ?? await this.findOrCreateCatalog('cat_material', 'id_material', 'nombre', vivienda.piso);
    const manejoExcretasId = this.intValue(vivienda.manejo_excretas_id)
      ?? await this.findOrCreateCatalog('cat_manejo_excretas', 'id_manejo_excretas', 'nombre', vivienda.excretas);

    const result = await db.executePreparedQuery(
      `INSERT INTO vivienda (
         nucleo_familiar_id, direccion_id, numero_cuartos, numero_habitantes,
         agua_entubada, energia_electrica, cocina_ubicacion, cocina_con_lena,
         manejo_excretas_id, red_alcantarillado, fosa_septica, material_techo_id,
         material_paredes_id, material_piso_id, material_otro_especificar,
         perros_gatos_dentro, mascotas_vacunas_corrientes, mascotas_esterilizadas,
         comentarios
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       RETURNING id_vivienda;`,
      [
        nucleoId,
        direccionId,
        this.intValue(vivienda.numero_cuartos ?? vivienda.cuartos),
        this.intValue(vivienda.numero_habitantes ?? vivienda.habitantes),
        this.boolValue(vivienda.agua_entubada),
        this.boolValue(vivienda.energia_electrica),
        this.cocinaValue(vivienda.cocina_ubicacion ?? vivienda.cocina),
        this.boolValue(vivienda.cocina_con_lena ?? vivienda.coccion_lena ?? vivienda.coccionLena),
        manejoExcretasId,
        this.boolValue(vivienda.red_alcantarillado ?? vivienda.alcantarillado),
        this.boolValue(vivienda.fosa_septica),
        materialTechoId,
        materialParedesId,
        materialPisoId,
        this.textValue(vivienda.material_otro_especificar ?? vivienda.material_otros ?? vivienda.materialOtros),
        this.boolValue(vivienda.perros_gatos_dentro ?? vivienda.perros_gatos ?? vivienda.perrosGatos),
        this.boolValue(vivienda.mascotas_vacunas_corrientes ?? vivienda.animales_vacunas ?? vivienda.animalesVacunas),
        this.boolValue(vivienda.mascotas_esterilizadas ?? vivienda.esterilizados),
        this.textValue(vivienda.comentarios)
      ]
    );
    return result.rows[0].id_vivienda;
  }

  private async createFamiliaAnimales(nucleoId: number, vivienda: Dict, warnings: string[]): Promise<void> {
    const animales = [
      ...this.arrayValue(vivienda.otros_animales ?? vivienda.otrosAnimales),
      this.textValue(vivienda.animal_otro ?? vivienda.animalOtro)
    ].filter(Boolean);

    for (const animal of animales) {
      const animalNombre = this.textValue(animal);
      if (!animalNombre || this.normalizeKey(animalNombre) === 'na') continue;
      const animalId = await this.findOrCreateCatalog('cat_animal', 'id_animal', 'nombre', animalNombre === 'Otros' ? 'Otro' : animalNombre);
      if (!animalId) {
        warnings.push(`No se pudo resolver animal: ${animalNombre}`);
        continue;
      }
      await db.executePreparedQuery(
        `INSERT INTO familia_animal (nucleo_familiar_id, animal_id, otro_especificar, comentarios)
         VALUES ($1, $2, $3, $4);`,
        [
          nucleoId,
          animalId,
          animalNombre === 'Otros' ? this.textValue(vivienda.animal_otro ?? vivienda.animalOtro) : null,
          this.textValue(vivienda.animal_observaciones ?? vivienda.animalObservaciones)
        ]
      );
    }
  }

  private async createIntegrante(
    nucleoId: number,
    integrante: Dict,
    warnings: string[]
  ): Promise<{ persona_id: number; nucleo_persona_id: number | null; nombre: string | null } | null> {
    const nombre = this.textValue(integrante.nombre ?? integrante.nombre_completo);
    if (!nombre) {
      warnings.push('Integrante omitido: falta nombre');
      return null;
    }

    const fechaNacimiento = this.dateValue(integrante.fecha_nacimiento ?? integrante.fechaNacimiento)
      ?? this.dateFromAge(integrante.edad);
    if (!fechaNacimiento) {
      warnings.push(`Integrante omitido (${nombre}): falta fecha de nacimiento o edad`);
      return null;
    }

    const sexo = this.sexoValue(integrante.sexo);
    if (!sexo) {
      warnings.push(`Integrante omitido (${nombre}): falta sexo masculino/femenino`);
      return null;
    }

    const estadoCivilId = await this.findOrCreateCatalog('cat_estado_civil', 'id_estado_civil', 'nombre', integrante.estado_civil ?? integrante.estadoCivil);
    const lenguaId = await this.findOrCreateCatalog('cat_lengua', 'id_lengua', 'nombre', integrante.lengua);
    const escolaridadId = await this.findOrCreateCatalog('cat_escolaridad', 'id_escolaridad', 'nombre', integrante.escolaridad);
    const ingresoId = await this.findOrCreateCatalog('cat_ingreso_salarial', 'id_ingreso_salarial', 'rango', integrante.ingreso);
    const parentescoId = await this.findOrCreateCatalog('cat_parentesco', 'id_parentesco', 'nombre', integrante.parentesco ?? integrante.rol);

    const nameParts = this.splitName(nombre);
    const personaResult = await db.executePreparedQuery(
      `INSERT INTO persona (
         primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,
         fecha_nacimiento, sexo, estado_civil_id, alfabetizacion, fecha_registro
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id_persona;`,
      [
        nameParts.primer_nombre,
        nameParts.segundo_nombre,
        nameParts.apellido_paterno,
        nameParts.apellido_materno,
        fechaNacimiento,
        sexo,
        estadoCivilId,
        this.boolValue(integrante.alfabetizacion)
      ]
    );
    const personaId = personaResult.rows[0].id_persona;

    if (lenguaId) {
      await db.executePreparedQuery(
        `INSERT INTO persona_lengua (persona_id, lengua_id, lengua_indigena_especificar, es_principal)
         VALUES ($1, $2, $3, true);`,
        [personaId, lenguaId, this.textValue(integrante.lengua_indigena_especificar ?? integrante.lenguaEspecificar)]
      );
    }
    if (escolaridadId) {
      await db.executePreparedQuery(
        `INSERT INTO persona_escolaridad (persona_id, escolaridad_id, fecha_registro)
         VALUES ($1, $2, CURRENT_DATE);`,
        [personaId, escolaridadId]
      );
    }
    const ocupacionTexto = this.textValue(integrante.ocupacion_texto ?? integrante.ocupacion);
    if (ocupacionTexto) {
      await db.executePreparedQuery(
        `INSERT INTO persona_ocupacion (persona_id, ocupacion_id, ocupacion_texto, fecha_registro)
         VALUES ($1, NULL, $2, CURRENT_DATE);`,
        [personaId, ocupacionTexto]
      );
    }
    if (ingresoId) {
      await db.executePreparedQuery(
        `INSERT INTO persona_ingreso (persona_id, ingreso_salarial_id, fecha_registro)
         VALUES ($1, $2, CURRENT_DATE);`,
        [personaId, ingresoId]
      );
    }

    await this.createIntegranteSalud(personaId, integrante);

    const nucleoPersonaResult = await db.executePreparedQuery(
      `INSERT INTO nucleo_persona (nucleo_familiar_id, persona_id, parentesco_id, fecha_registro)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (nucleo_familiar_id, persona_id) DO NOTHING
       RETURNING id_nucleo_persona;`,
      [nucleoId, personaId, parentescoId]
    );

    return {
      persona_id: personaId,
      nucleo_persona_id: nucleoPersonaResult.rows[0]?.id_nucleo_persona ?? null,
      nombre
    };
  }

  private async createIntegranteSalud(personaId: number, integrante: Dict): Promise<void> {
    const diasProteina = this.intValue(integrante.dias_proteina ?? integrante.proteina);
    const diasFrutasVerduras = this.intValue(integrante.dias_frutas_verduras ?? integrante.frutas_verduras ?? integrante.frutasVerduras);
    const diasCereales = this.intValue(integrante.dias_cereales ?? integrante.cereales);
    if ([diasProteina, diasFrutasVerduras, diasCereales].some((value) => value !== null)) {
      await db.executePreparedQuery(
        `INSERT INTO persona_alimentacion (persona_id, dias_proteina, dias_frutas_verduras, dias_cereales, fecha_registro)
         VALUES ($1, $2, $3, $4, CURRENT_DATE);`,
        [
          personaId,
          this.daysValue(diasProteina),
          this.daysValue(diasFrutasVerduras),
          this.daysValue(diasCereales)
        ]
      );
    }

    if (integrante.higiene !== undefined || integrante.higiene_bano_bucodental_diaria !== undefined) {
      await db.executePreparedQuery(
        `INSERT INTO persona_higiene (persona_id, higiene_bano_bucodental_diaria, fecha_registro)
         VALUES ($1, $2, CURRENT_DATE);`,
        [personaId, this.boolValue(integrante.higiene_bano_bucodental_diaria ?? integrante.higiene) ?? false]
      );
    }
    if (integrante.seguridad_social !== undefined || integrante.cuenta_seguridad_social !== undefined) {
      await db.executePreparedQuery(
        `INSERT INTO persona_seguridad_social (persona_id, cuenta_seguridad_social, fecha_registro)
         VALUES ($1, $2, CURRENT_DATE);`,
        [personaId, this.boolValue(integrante.cuenta_seguridad_social ?? integrante.seguridad_social) ?? false]
      );
    }
    if (integrante.discapacidad !== undefined || integrante.presenta_discapacidad !== undefined || integrante.tipo_discapacidad) {
      await db.executePreparedQuery(
        `INSERT INTO persona_discapacidad (persona_id, presenta_discapacidad, tipo_discapacidad)
         VALUES ($1, $2, $3);`,
        [
          personaId,
          this.boolValue(integrante.presenta_discapacidad ?? integrante.discapacidad) ?? Boolean(integrante.tipo_discapacidad),
          this.textValue(integrante.tipo_discapacidad ?? integrante.tipoDiscapacidad)
        ]
      );
    }

    await this.createToxicomanias(personaId, integrante);
    await this.createCronicas(personaId, integrante);
    await this.createSaludPreventiva(personaId, integrante);
    await this.createServicioSalud(personaId, integrante);
  }

  private async createToxicomanias(personaId: number, integrante: Dict): Promise<void> {
    for (const toxicomania of this.arrayValue(integrante.toxicomanias)) {
      const nombre = this.textValue(toxicomania);
      if (!nombre || this.normalizeKey(nombre) === 'na') continue;
      const toxicomaniaId = await this.findOrCreateCatalog('cat_toxicomania', 'id_toxicomania', 'nombre', nombre);
      if (!toxicomaniaId) continue;
      await db.executePreparedQuery(
        `INSERT INTO persona_toxicomania (persona_id, toxicomania_id, otra_sustancia)
         VALUES ($1, $2, $3);`,
        [personaId, toxicomaniaId, this.textValue(integrante.otra_sustancia ?? integrante.otraSustancia)]
      );
    }
  }

  private async createCronicas(personaId: number, integrante: Dict): Promise<void> {
    for (const cronica of this.arrayValue(integrante.enfermedades_cronicas ?? integrante.cronicas)) {
      const nombre = this.textValue(cronica);
      if (!nombre || this.normalizeKey(nombre) === 'na') continue;
      const cronicaId = await this.findOrCreateCatalog('cat_enfermedad_cronica', 'id_enfermedad_cronica', 'nombre', nombre);
      if (!cronicaId) continue;
      await db.executePreparedQuery(
        `INSERT INTO persona_enfermedad_cronica (persona_id, enfermedad_cronica_id)
         VALUES ($1, $2);`,
        [personaId, cronicaId]
      );
    }
  }

  private async createSaludPreventiva(personaId: number, integrante: Dict): Promise<void> {
    const atencionEmbarazoId = await this.findOrCreateCatalog(
      'cat_atencion_embarazo',
      'id_atencion_embarazo',
      'nombre',
      integrante.atencion_embarazo ?? integrante.embarazo
    );
    const cervico = this.boolOrNullFromTamizaje(integrante.tamizaje_cervico_uterino ?? integrante.tamizajeCervico);
    const mama = this.boolOrNullFromTamizaje(integrante.tamizaje_cancer_mama ?? integrante.tamizajeMama);
    const fechaCervico = this.dateValue(integrante.fecha_tamizaje_cervico_uterino ?? integrante.fechaCervico);
    const fechaMama = this.dateValue(integrante.fecha_tamizaje_cancer_mama ?? integrante.fechaMama);

    if (atencionEmbarazoId || cervico !== null || mama !== null || fechaCervico || fechaMama) {
      await db.executePreparedQuery(
        `INSERT INTO persona_salud_preventiva (
           persona_id, atencion_embarazo_id, tamizaje_cervico_uterino,
           fecha_tamizaje_cervico_uterino, tamizaje_cancer_mama,
           fecha_tamizaje_cancer_mama, fecha_registro
         )
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE);`,
        [personaId, atencionEmbarazoId, cervico, fechaCervico, mama, fechaMama]
      );
    }
  }

  private async createServicioSalud(personaId: number, integrante: Dict): Promise<void> {
    const frecuenciaId = await this.findOrCreateCatalog(
      'cat_frecuencia_servicio_salud',
      'id_frecuencia_servicio_salud',
      'nombre',
      integrante.frecuencia_servicio_salud ?? integrante.frecuenciaSalud
    );
    const motivo = this.textValue(integrante.motivo_uso ?? integrante.motivoSalud);
    if (frecuenciaId || motivo) {
      await db.executePreparedQuery(
        `INSERT INTO persona_servicio_salud (persona_id, frecuencia_servicio_salud_id, motivo_uso, fecha_registro)
         VALUES ($1, $2, $3, CURRENT_DATE);`,
        [personaId, frecuenciaId, motivo]
      );
    }
  }

  private async createCedulaIfPossible(payload: Dict, nucleoId: number, warnings: string[]): Promise<number | null> {
    const unidadSaludId = this.intValue(payload.unidad_salud_id);
    const entrevistadorId = this.intValue(payload.entrevistador_id);
    if (!unidadSaludId || !entrevistadorId) {
      warnings.push('Cedula formal no creada: faltan unidad_salud_id y/o entrevistador_id.');
      return null;
    }

    const estado = this.estadoCedulaValue(payload.estado) ?? 'borrador';
    const result = await db.executePreparedQuery(
      `INSERT INTO cedula (
         unidad_salud_id, entrevistador_id, levantamiento_id, nucleo_familiar_id,
         fecha_registro, estado, observaciones
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id_cedula;`,
      [
        unidadSaludId,
        entrevistadorId,
        this.intValue(payload.levantamiento_id),
        nucleoId,
        this.dateValue(payload.fecha_registro) ?? this.today(),
        estado,
        this.textValue(payload.observaciones)
      ]
    );
    return result.rows[0].id_cedula;
  }

  private async createVacunas(
    payload: Dict,
    personaByName: Map<string, number>,
    cedulaId: number | null,
    warnings: string[]
  ): Promise<CapturaCompletaResult['inmunizaciones']> {
    const vacunacion = this.objectValue(payload.vacunacion) ?? payload;
    const seAplico = this.boolValue(vacunacion.se_aplico_vacuna ?? vacunacion.seAplicoVacuna);
    const vacunas = this.arrayValue(vacunacion.vacunas ?? payload.vacunas);
    if (seAplico === false || vacunas.length === 0) return [];

    const result: CapturaCompletaResult['inmunizaciones'] = [];
    for (const vacunaPayload of vacunas) {
      const personaId = this.intValue(vacunaPayload.persona_id)
        ?? personaByName.get(this.normalizeKey(vacunaPayload.paciente ?? vacunaPayload.nombre) ?? '');
      if (!personaId) {
        warnings.push(`Vacuna omitida: no se encontro persona para ${this.textValue(vacunaPayload.paciente) ?? 'paciente sin nombre'}`);
        continue;
      }

      const vacunaNombre = this.textValue(vacunaPayload.vacuna ?? vacunaPayload.tipo ?? vacunaPayload.vacuna_aplicada);
      const vacunaId = this.intValue(vacunaPayload.vacuna_id)
        ?? await this.findOrCreateCatalog('vacuna', 'id_vacuna', 'nombre', vacunaNombre);
      if (!vacunaId) {
        warnings.push(`Vacuna omitida: no se pudo resolver vacuna para persona ${personaId}`);
        continue;
      }

      const dosisId = this.intValue(vacunaPayload.dosis_id)
        ?? await this.findOrCreateCatalog('cat_dosis', 'id_dosis', 'nombre', vacunaPayload.dosis);
      const esquemaId = await this.createEsquemaVacunacion(personaId, this.intValue(payload.unidad_salud_id));
      const inmunizacion = await db.executePreparedQuery(
        `INSERT INTO inmunizacion (
           esquema_vacunacion_id, cedula_id, vacuna_id, dosis_id,
           otra_vacuna_especificar, fecha_aplicacion
         )
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id_inmunizacion;`,
        [
          esquemaId,
          cedulaId,
          vacunaId,
          dosisId,
          this.textValue(vacunaPayload.otra_vacuna_especificar ?? vacunaPayload.otraVacuna),
          this.dateValue(vacunaPayload.fecha_aplicacion) ?? this.today()
        ]
      );
      result.push({
        inmunizacion_id: inmunizacion.rows[0].id_inmunizacion,
        persona_id: personaId,
        vacuna: vacunaNombre
      });
    }
    return result;
  }

  private async createEsquemaVacunacion(personaId: number, unidadSaludId: number | null): Promise<number> {
    const result = await db.executePreparedQuery(
      `INSERT INTO esquema_vacunacion (persona_id, unidad_salud_id, fecha_registro)
       VALUES ($1, $2, CURRENT_DATE)
       RETURNING id_esquema_vacunacion;`,
      [personaId, unidadSaludId]
    );
    return result.rows[0].id_esquema_vacunacion;
  }

  private async findOrCreateCatalog(
    tableName: string,
    idColumn: string,
    labelColumn: string,
    rawValue: unknown
  ): Promise<number | null> {
    const value = this.textValue(rawValue);
    if (!value || this.normalizeKey(value) === 'na') return null;

    const found = await db.executePreparedQuery(
      `SELECT ${idColumn} AS id FROM ${tableName} WHERE LOWER(${labelColumn}) = LOWER($1) LIMIT 1;`,
      [value]
    );
    if (found.rowCount > 0) return found.rows[0].id;

    const created = await db.executePreparedQuery(
      `INSERT INTO ${tableName} (${labelColumn})
       VALUES ($1)
       ON CONFLICT (${labelColumn}) DO UPDATE SET ${labelColumn} = EXCLUDED.${labelColumn}
       RETURNING ${idColumn} AS id;`,
      [value]
    );
    return created.rows[0].id;
  }

  private splitName(nombre: string): {
    primer_nombre: string;
    segundo_nombre: string | null;
    apellido_paterno: string;
    apellido_materno: string | null;
  } {
    const parts = nombre.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return {
        primer_nombre: parts[0],
        segundo_nombre: null,
        apellido_paterno: 'SIN APELLIDO',
        apellido_materno: null
      };
    }
    if (parts.length === 2) {
      return {
        primer_nombre: parts[0],
        segundo_nombre: null,
        apellido_paterno: parts[1],
        apellido_materno: null
      };
    }
    return {
      primer_nombre: parts[0],
      segundo_nombre: parts.slice(1, -2).join(' ') || null,
      apellido_paterno: parts[parts.length - 2],
      apellido_materno: parts[parts.length - 1]
    };
  }

  private objectValue(value: unknown): Dict | null {
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Dict : null;
  }

  private arrayValue(value: unknown): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null);
    if (value instanceof Set) return Array.from(value).map((item) => ({ value: item }));
    return [];
  }

  private textValue(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text.length > 0 ? text : null;
  }

  private intValue(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  }

  private daysValue(value: number | null): number {
    if (value === null || Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(7, value));
  }

  private boolValue(value: unknown): boolean | null {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'boolean') return value;
    const normalized = this.normalizeKey(value);
    if (['si', 'sí', 'true', '1', 'yes'].includes(normalized ?? '')) return true;
    if (['no', 'false', '0'].includes(normalized ?? '')) return false;
    return null;
  }

  private boolOrNullFromTamizaje(value: unknown): boolean | null {
    const normalized = this.normalizeKey(value);
    if (!normalized || normalized === 'na') return null;
    return this.boolValue(value);
  }

  private sexoValue(value: unknown): 'masculino' | 'femenino' | null {
    const normalized = this.normalizeKey(value);
    if (!normalized) return null;
    if (normalized.startsWith('masculino')) return 'masculino';
    if (normalized.startsWith('femenino')) return 'femenino';
    return null;
  }

  private cocinaValue(value: unknown): 'fuera_del_dormitorio' | 'dentro_del_dormitorio' | null {
    const normalized = this.normalizeKey(value);
    if (!normalized) return null;
    if (normalized.includes('dentro')) return 'dentro_del_dormitorio';
    if (normalized.includes('fuera')) return 'fuera_del_dormitorio';
    return null;
  }

  private estadoCedulaValue(value: unknown): 'borrador' | 'sincronizada' | 'validada' | 'cerrada' | null {
    const normalized = this.normalizeKey(value);
    if (!normalized) return null;
    if (['borrador', 'sincronizada', 'validada', 'cerrada'].includes(normalized)) {
      return normalized as 'borrador' | 'sincronizada' | 'validada' | 'cerrada';
    }
    return null;
  }

  private dateValue(value: unknown): string | null {
    const text = this.textValue(value);
    if (!text) return null;
    const mexicanDate = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (mexicanDate) {
      const day = mexicanDate[1].padStart(2, '0');
      const month = mexicanDate[2].padStart(2, '0');
      const year = mexicanDate[3];
      const normalized = `${year}-${month}-${day}`;
      const parsedMexicanDate = new Date(normalized);
      return Number.isNaN(parsedMexicanDate.getTime()) ? null : normalized;
    }
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
  }

  private dateFromAge(value: unknown): string | null {
    const age = this.intValue(value);
    if (age === null || age < 0) return null;
    const year = new Date().getFullYear() - age;
    return `${year}-01-01`;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private normalizeKey(value: unknown): string | null {
    const text = this.textValue(value);
    if (!text) return null;
    return text.toLowerCase();
  }
}
