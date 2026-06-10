-- SQL dump generated using DBML (dbml.dbdiagram.io)
-- Database: PostgreSQL
-- Generated at: 2026-06-10T00:55:44.752Z

CREATE TYPE "sexo_persona" AS ENUM (
  'masculino',
  'femenino'
);

CREATE TYPE "ubicacion_cocina" AS ENUM (
  'fuera_del_dormitorio',
  'dentro_del_dormitorio'
);

CREATE TYPE "estado_cedula" AS ENUM (
  'borrador',
  'sincronizada',
  'validada',
  'cerrada'
);

CREATE TABLE "cat_entidad" (
  "id_entidad" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "cat_municipio" (
  "id_municipio" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "entidad_id" INT NOT NULL
);

CREATE TABLE "cat_zona" (
  "id_zona" SERIAL PRIMARY KEY,
  "zona" VARCHAR(100) NOT NULL
);

CREATE TABLE "cat_tipo_asentamiento" (
  "id_tipo_asentamiento" SERIAL PRIMARY KEY,
  "tipo_asentamiento" VARCHAR(100) NOT NULL
);

CREATE TABLE "cat_asentamiento" (
  "id_asentamiento" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(150) NOT NULL,
  "municipio_id" INT NOT NULL,
  "tipo_asentamiento_id" INT
);

CREATE TABLE "direccion" (
  "id_direccion" SERIAL PRIMARY KEY,
  "calle" VARCHAR(150),
  "numero_exterior" VARCHAR(50),
  "numero_interior" VARCHAR(50),
  "colonia" VARCHAR(150),
  "codigo_postal" VARCHAR(10),
  "localidad" VARCHAR(150),
  "manzana" VARCHAR(50),
  "vivienda_referencia" VARCHAR(50),
  "asentamiento_id" INT
);

CREATE TABLE "unidad_salud" (
  "id_unidad_salud" SERIAL PRIMARY KEY,
  "clues" VARCHAR(11) UNIQUE NOT NULL,
  "nombre" VARCHAR(255) NOT NULL,
  "distrito" VARCHAR(100),
  "municipio_id" INT,
  "numero_nucleos" INT
);

CREATE TABLE "cat_turno" (
  "id_turno" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "datos_laborales" (
  "id_datos_laborales" SERIAL PRIMARY KEY,
  "turno_id" INT,
  "horario_inicio" TIME,
  "horario_fin" TIME,
  "cargo" VARCHAR(100),
  "especialidad" VARCHAR(100)
);

CREATE TABLE "entrevistador" (
  "id_entrevistador" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(255) NOT NULL,
  "unidad_salud_id" INT NOT NULL,
  "datos_laborales_id" INT,
  "fecha_registro" DATE
);

CREATE TABLE "levantamiento" (
  "id_levantamiento" SERIAL PRIMARY KEY,
  "unidad_salud_id" INT NOT NULL,
  "fecha" DATE NOT NULL,
  "zona_id" INT,
  "comentarios" VARCHAR(250)
);

CREATE TABLE "levantamiento_personal" (
  "id_levantamiento_personal" SERIAL PRIMARY KEY,
  "levantamiento_id" INT NOT NULL,
  "entrevistador_id" INT NOT NULL
);

CREATE TABLE "cat_estado_civil" (
  "id_estado_civil" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "cat_parentesco" (
  "id_parentesco" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "cat_lengua" (
  "id_lengua" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "cat_escolaridad" (
  "id_escolaridad" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "cat_ocupacion" (
  "id_ocupacion" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "cat_ingreso_salarial" (
  "id_ingreso_salarial" SERIAL PRIMARY KEY,
  "rango" VARCHAR(100) UNIQUE NOT NULL,
  "descripcion" VARCHAR(150)
);

CREATE TABLE "cat_discapacidad" (
  "id_discapacidad" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "persona" (
  "id_persona" SERIAL PRIMARY KEY,
  "primer_nombre" VARCHAR(100) NOT NULL,
  "segundo_nombre" VARCHAR(100),
  "apellido_paterno" VARCHAR(100) NOT NULL,
  "apellido_materno" VARCHAR(100),
  "fecha_nacimiento" DATE NOT NULL,
  "sexo" sexo_persona NOT NULL,
  "estado_civil_id" INT,
  "alfabetizacion" BOOLEAN,
  "fecha_registro" TIMESTAMP
);

CREATE TABLE "persona_lengua" (
  "id_persona_lengua" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "lengua_id" INT NOT NULL,
  "lengua_indigena_especificar" VARCHAR(100),
  "es_principal" BOOLEAN
);

CREATE TABLE "persona_escolaridad" (
  "id_persona_escolaridad" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "escolaridad_id" INT NOT NULL,
  "fecha_registro" DATE
);

CREATE TABLE "persona_ocupacion" (
  "id_persona_ocupacion" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "ocupacion_id" INT NOT NULL,
  "fecha_registro" DATE
);

CREATE TABLE "persona_ingreso" (
  "id_persona_ingreso" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "ingreso_salarial_id" INT NOT NULL,
  "fecha_registro" DATE
);

CREATE TABLE "persona_seguridad_social" (
  "id_persona_seguridad_social" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "cuenta_seguridad_social" BOOLEAN NOT NULL,
  "numero_seguridad_social" VARCHAR(30),
  "fecha_registro" DATE
);

CREATE TABLE "persona_discapacidad" (
  "id_persona_discapacidad" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "presenta_discapacidad" BOOLEAN NOT NULL,
  "discapacidad_id" INT,
  "especificacion" VARCHAR(150)
);

CREATE TABLE "nucleo_familiar" (
  "id_nucleo_familiar" SERIAL PRIMARY KEY,
  "jefe_persona_id" INT,
  "fecha_registro" TIMESTAMP,
  "fecha_cierre" TIMESTAMP,
  "comentarios" VARCHAR(250)
);

CREATE TABLE "nucleo_persona" (
  "id_nucleo_persona" SERIAL PRIMARY KEY,
  "nucleo_familiar_id" INT NOT NULL,
  "persona_id" INT NOT NULL,
  "parentesco_id" INT,
  "fecha_registro" TIMESTAMP,
  "fecha_salida" TIMESTAMP,
  "comentarios" VARCHAR(250)
);

CREATE TABLE "nucleo_direccion" (
  "id_nucleo_direccion" SERIAL PRIMARY KEY,
  "nucleo_familiar_id" INT NOT NULL,
  "direccion_id" INT NOT NULL,
  "fecha_asociacion" DATE,
  "fecha_fin" DATE
);

CREATE TABLE "cedula" (
  "id_cedula" SERIAL PRIMARY KEY,
  "unidad_salud_id" INT NOT NULL,
  "entrevistador_id" INT NOT NULL,
  "levantamiento_id" INT,
  "nucleo_familiar_id" INT NOT NULL,
  "fecha_registro" DATE NOT NULL,
  "estado" estado_cedula NOT NULL,
  "observaciones" VARCHAR(300)
);

CREATE TABLE "levantamiento_nucleo" (
  "id_levantamiento_nucleo" SERIAL PRIMARY KEY,
  "levantamiento_id" INT NOT NULL,
  "entrevistador_id" INT NOT NULL,
  "nucleo_familiar_id" INT NOT NULL,
  "cedula_id" INT,
  "fecha" TIMESTAMP,
  "comentarios" VARCHAR(250)
);

CREATE TABLE "cat_material" (
  "id_material" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "cat_tipo_material_vivienda" (
  "id_tipo_material_vivienda" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "cat_servicio_vivienda" (
  "id_servicio_vivienda" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "cat_manejo_excretas" (
  "id_manejo_excretas" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "vivienda" (
  "id_vivienda" SERIAL PRIMARY KEY,
  "nucleo_familiar_id" INT NOT NULL,
  "direccion_id" INT,
  "numero_cuartos" INT,
  "numero_habitantes" INT,
  "cocina_ubicacion" ubicacion_cocina,
  "cocina_con_lena" BOOLEAN,
  "manejo_excretas_id" INT,
  "red_alcantarillado" BOOLEAN,
  "fosa_septica" BOOLEAN,
  "comentarios" VARCHAR(300)
);

CREATE TABLE "vivienda_material" (
  "id_vivienda_material" SERIAL PRIMARY KEY,
  "vivienda_id" INT NOT NULL,
  "tipo_material_vivienda_id" INT NOT NULL,
  "material_id" INT,
  "otro_especificar" VARCHAR(150)
);

CREATE TABLE "vivienda_servicio" (
  "id_vivienda_servicio" SERIAL PRIMARY KEY,
  "vivienda_id" INT NOT NULL,
  "servicio_vivienda_id" INT NOT NULL,
  "disponible" BOOLEAN NOT NULL
);

CREATE TABLE "cat_animal" (
  "id_animal" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "familia_animal" (
  "id_familia_animal" SERIAL PRIMARY KEY,
  "nucleo_familiar_id" INT NOT NULL,
  "animal_id" INT NOT NULL,
  "cantidad" INT,
  "vive_dentro_vivienda" BOOLEAN,
  "esquema_vacunas_corriente" BOOLEAN,
  "esterilizado" BOOLEAN,
  "comentarios" VARCHAR(255)
);

CREATE TABLE "cat_alimentacion" (
  "id_alimentacion" SERIAL PRIMARY KEY,
  "tipo" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "persona_alimentacion" (
  "id_persona_alimentacion" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "alimentacion_id" INT NOT NULL,
  "frecuencia_dias" INT NOT NULL,
  "fecha_registro" DATE
);

CREATE TABLE "persona_higiene" (
  "id_persona_higiene" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "higiene_bano_bucodental_diaria" BOOLEAN NOT NULL,
  "fecha_registro" DATE
);

CREATE TABLE "cat_toxicomania" (
  "id_toxicomania" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "persona_toxicomania" (
  "id_persona_toxicomania" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "toxicomania_id" INT NOT NULL,
  "otra_sustancia" VARCHAR(150),
  "fecha_inicio" DATE,
  "fecha_fin" DATE
);

CREATE TABLE "cat_enfermedad_cronica" (
  "id_enfermedad_cronica" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE "persona_enfermedad_cronica" (
  "id_persona_enfermedad_cronica" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "enfermedad_cronica_id" INT NOT NULL,
  "fecha_diagnostico" DATE,
  "observaciones" VARCHAR(250)
);

CREATE TABLE "cat_atencion_embarazo" (
  "id_atencion_embarazo" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "persona_salud_preventiva" (
  "id_persona_salud_preventiva" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "atencion_embarazo_id" INT,
  "tamizaje_cervico_uterino" BOOLEAN,
  "fecha_tamizaje_cervico_uterino" DATE,
  "tamizaje_cancer_mama" BOOLEAN,
  "fecha_tamizaje_cancer_mama" DATE,
  "fecha_registro" DATE
);

CREATE TABLE "cat_frecuencia_servicio_salud" (
  "id_frecuencia_servicio_salud" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "persona_servicio_salud" (
  "id_persona_servicio_salud" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "frecuencia_servicio_salud_id" INT,
  "motivo_uso" VARCHAR(250),
  "fecha_registro" DATE
);

CREATE TABLE "vacuna" (
  "id_vacuna" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(255) UNIQUE NOT NULL,
  "descripcion" TEXT
);

CREATE TABLE "cat_dosis" (
  "id_dosis" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "esquema_vacunacion" (
  "id_esquema_vacunacion" SERIAL PRIMARY KEY,
  "persona_id" INT NOT NULL,
  "unidad_salud_id" INT,
  "fecha_registro" DATE
);

CREATE TABLE "inmunizacion" (
  "id_inmunizacion" SERIAL PRIMARY KEY,
  "esquema_vacunacion_id" INT NOT NULL,
  "cedula_id" INT,
  "vacuna_id" INT NOT NULL,
  "dosis_id" INT,
  "fecha_aplicacion" DATE
);

CREATE UNIQUE INDEX ON "nucleo_persona" ("nucleo_familiar_id", "persona_id");

CREATE UNIQUE INDEX ON "vivienda_material" ("vivienda_id", "tipo_material_vivienda_id");

CREATE UNIQUE INDEX ON "vivienda_servicio" ("vivienda_id", "servicio_vivienda_id");

CREATE UNIQUE INDEX ON "persona_alimentacion" ("persona_id", "alimentacion_id", "fecha_registro");

ALTER TABLE "cat_municipio" ADD FOREIGN KEY ("entidad_id") REFERENCES "cat_entidad" ("id_entidad") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cat_asentamiento" ADD FOREIGN KEY ("municipio_id") REFERENCES "cat_municipio" ("id_municipio") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cat_asentamiento" ADD FOREIGN KEY ("tipo_asentamiento_id") REFERENCES "cat_tipo_asentamiento" ("id_tipo_asentamiento") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "direccion" ADD FOREIGN KEY ("asentamiento_id") REFERENCES "cat_asentamiento" ("id_asentamiento") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "unidad_salud" ADD FOREIGN KEY ("municipio_id") REFERENCES "cat_municipio" ("id_municipio") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "datos_laborales" ADD FOREIGN KEY ("turno_id") REFERENCES "cat_turno" ("id_turno") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "entrevistador" ADD FOREIGN KEY ("unidad_salud_id") REFERENCES "unidad_salud" ("id_unidad_salud") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "entrevistador" ADD FOREIGN KEY ("datos_laborales_id") REFERENCES "datos_laborales" ("id_datos_laborales") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento" ADD FOREIGN KEY ("unidad_salud_id") REFERENCES "unidad_salud" ("id_unidad_salud") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento" ADD FOREIGN KEY ("zona_id") REFERENCES "cat_zona" ("id_zona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento_personal" ADD FOREIGN KEY ("levantamiento_id") REFERENCES "levantamiento" ("id_levantamiento") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento_personal" ADD FOREIGN KEY ("entrevistador_id") REFERENCES "entrevistador" ("id_entrevistador") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona" ADD FOREIGN KEY ("estado_civil_id") REFERENCES "cat_estado_civil" ("id_estado_civil") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_lengua" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_lengua" ADD FOREIGN KEY ("lengua_id") REFERENCES "cat_lengua" ("id_lengua") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_escolaridad" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_escolaridad" ADD FOREIGN KEY ("escolaridad_id") REFERENCES "cat_escolaridad" ("id_escolaridad") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_ocupacion" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_ocupacion" ADD FOREIGN KEY ("ocupacion_id") REFERENCES "cat_ocupacion" ("id_ocupacion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_ingreso" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_ingreso" ADD FOREIGN KEY ("ingreso_salarial_id") REFERENCES "cat_ingreso_salarial" ("id_ingreso_salarial") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_seguridad_social" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_discapacidad" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_discapacidad" ADD FOREIGN KEY ("discapacidad_id") REFERENCES "cat_discapacidad" ("id_discapacidad") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "nucleo_familiar" ADD FOREIGN KEY ("jefe_persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "nucleo_persona" ADD FOREIGN KEY ("nucleo_familiar_id") REFERENCES "nucleo_familiar" ("id_nucleo_familiar") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "nucleo_persona" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "nucleo_persona" ADD FOREIGN KEY ("parentesco_id") REFERENCES "cat_parentesco" ("id_parentesco") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "nucleo_direccion" ADD FOREIGN KEY ("nucleo_familiar_id") REFERENCES "nucleo_familiar" ("id_nucleo_familiar") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "nucleo_direccion" ADD FOREIGN KEY ("direccion_id") REFERENCES "direccion" ("id_direccion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cedula" ADD FOREIGN KEY ("unidad_salud_id") REFERENCES "unidad_salud" ("id_unidad_salud") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cedula" ADD FOREIGN KEY ("entrevistador_id") REFERENCES "entrevistador" ("id_entrevistador") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cedula" ADD FOREIGN KEY ("levantamiento_id") REFERENCES "levantamiento" ("id_levantamiento") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cedula" ADD FOREIGN KEY ("nucleo_familiar_id") REFERENCES "nucleo_familiar" ("id_nucleo_familiar") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento_nucleo" ADD FOREIGN KEY ("levantamiento_id") REFERENCES "levantamiento" ("id_levantamiento") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento_nucleo" ADD FOREIGN KEY ("entrevistador_id") REFERENCES "entrevistador" ("id_entrevistador") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento_nucleo" ADD FOREIGN KEY ("nucleo_familiar_id") REFERENCES "nucleo_familiar" ("id_nucleo_familiar") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "levantamiento_nucleo" ADD FOREIGN KEY ("cedula_id") REFERENCES "cedula" ("id_cedula") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda" ADD FOREIGN KEY ("nucleo_familiar_id") REFERENCES "nucleo_familiar" ("id_nucleo_familiar") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda" ADD FOREIGN KEY ("direccion_id") REFERENCES "direccion" ("id_direccion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda" ADD FOREIGN KEY ("manejo_excretas_id") REFERENCES "cat_manejo_excretas" ("id_manejo_excretas") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda_material" ADD FOREIGN KEY ("vivienda_id") REFERENCES "vivienda" ("id_vivienda") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda_material" ADD FOREIGN KEY ("tipo_material_vivienda_id") REFERENCES "cat_tipo_material_vivienda" ("id_tipo_material_vivienda") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda_material" ADD FOREIGN KEY ("material_id") REFERENCES "cat_material" ("id_material") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda_servicio" ADD FOREIGN KEY ("vivienda_id") REFERENCES "vivienda" ("id_vivienda") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "vivienda_servicio" ADD FOREIGN KEY ("servicio_vivienda_id") REFERENCES "cat_servicio_vivienda" ("id_servicio_vivienda") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "familia_animal" ADD FOREIGN KEY ("nucleo_familiar_id") REFERENCES "nucleo_familiar" ("id_nucleo_familiar") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "familia_animal" ADD FOREIGN KEY ("animal_id") REFERENCES "cat_animal" ("id_animal") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_alimentacion" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_alimentacion" ADD FOREIGN KEY ("alimentacion_id") REFERENCES "cat_alimentacion" ("id_alimentacion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_higiene" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_toxicomania" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_toxicomania" ADD FOREIGN KEY ("toxicomania_id") REFERENCES "cat_toxicomania" ("id_toxicomania") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_enfermedad_cronica" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_enfermedad_cronica" ADD FOREIGN KEY ("enfermedad_cronica_id") REFERENCES "cat_enfermedad_cronica" ("id_enfermedad_cronica") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_salud_preventiva" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_salud_preventiva" ADD FOREIGN KEY ("atencion_embarazo_id") REFERENCES "cat_atencion_embarazo" ("id_atencion_embarazo") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_servicio_salud" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "persona_servicio_salud" ADD FOREIGN KEY ("frecuencia_servicio_salud_id") REFERENCES "cat_frecuencia_servicio_salud" ("id_frecuencia_servicio_salud") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "esquema_vacunacion" ADD FOREIGN KEY ("persona_id") REFERENCES "persona" ("id_persona") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "esquema_vacunacion" ADD FOREIGN KEY ("unidad_salud_id") REFERENCES "unidad_salud" ("id_unidad_salud") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "inmunizacion" ADD FOREIGN KEY ("esquema_vacunacion_id") REFERENCES "esquema_vacunacion" ("id_esquema_vacunacion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "inmunizacion" ADD FOREIGN KEY ("cedula_id") REFERENCES "cedula" ("id_cedula") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "inmunizacion" ADD FOREIGN KEY ("vacuna_id") REFERENCES "vacuna" ("id_vacuna") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "inmunizacion" ADD FOREIGN KEY ("dosis_id") REFERENCES "cat_dosis" ("id_dosis") DEFERRABLE INITIALLY IMMEDIATE;
