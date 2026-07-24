-- 1. Create new tables
CREATE TABLE IF NOT EXISTS "cat_sexo" (
  "id_sexo" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cat_ubicacion_cocina" (
  "id_ubicacion_cocina" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cat_tamizaje" (
  "id_tamizaje" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cat_discapacidad" (
  "id_discapacidad" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cat_material_piso" (
  "id_material_piso" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cat_material_muro_techo" (
  "id_material_muro_techo" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Insert default values
INSERT INTO "cat_sexo" ("nombre") VALUES ('Masculino'), ('Femenino') ON CONFLICT DO NOTHING;
INSERT INTO "cat_ubicacion_cocina" ("nombre") VALUES ('Dentro del dormitorio'), ('Fuera del dormitorio') ON CONFLICT DO NOTHING;
INSERT INTO "cat_tamizaje" ("nombre") VALUES ('Sí'), ('No') ON CONFLICT DO NOTHING;
INSERT INTO "cat_discapacidad" ("nombre") VALUES 
  ('Física / Motriz'), ('Visual'), ('Auditiva'), ('Intelectual'),
  ('Psicosocial (Mental)'), ('Habla / Comunicación'), ('Cuidado Personal'),
  ('Múltiple'), ('Otra') ON CONFLICT DO NOTHING;

-- Si ya existen datos en cat_material, copiarlos a los nuevos
INSERT INTO "cat_material_piso" ("id_material_piso", "nombre")
SELECT "id_material", "nombre" FROM "cat_material" ON CONFLICT DO NOTHING;

-- Para asegurar la misma secuencia en inserciones futuras
SELECT setval('cat_material_piso_id_material_piso_seq', (SELECT MAX(id_material_piso) FROM cat_material_piso) + 1);

INSERT INTO "cat_material_muro_techo" ("id_material_muro_techo", "nombre")
SELECT "id_material", "nombre" FROM "cat_material" ON CONFLICT DO NOTHING;

SELECT setval('cat_material_muro_techo_id_material_muro_techo_seq', (SELECT MAX(id_material_muro_techo) FROM cat_material_muro_techo) + 1);

-- 3. Add new columns to tables
ALTER TABLE "persona" ADD COLUMN IF NOT EXISTS "sexo_id" INT;
ALTER TABLE "persona" ADD FOREIGN KEY ("sexo_id") REFERENCES "cat_sexo" ("id_sexo");

ALTER TABLE "vivienda" ADD COLUMN IF NOT EXISTS "cocina_ubicacion_id" INT;
ALTER TABLE "vivienda" ADD FOREIGN KEY ("cocina_ubicacion_id") REFERENCES "cat_ubicacion_cocina" ("id_ubicacion_cocina");

ALTER TABLE "persona_salud_preventiva" ADD COLUMN IF NOT EXISTS "tamizaje_cervico_uterino_id" INT;
ALTER TABLE "persona_salud_preventiva" ADD FOREIGN KEY ("tamizaje_cervico_uterino_id") REFERENCES "cat_tamizaje" ("id_tamizaje");

ALTER TABLE "persona_salud_preventiva" ADD COLUMN IF NOT EXISTS "tamizaje_cancer_mama_id" INT;
ALTER TABLE "persona_salud_preventiva" ADD FOREIGN KEY ("tamizaje_cancer_mama_id") REFERENCES "cat_tamizaje" ("id_tamizaje");

ALTER TABLE "persona_discapacidad" ADD COLUMN IF NOT EXISTS "tipo_discapacidad_id" INT;
ALTER TABLE "persona_discapacidad" ADD FOREIGN KEY ("tipo_discapacidad_id") REFERENCES "cat_discapacidad" ("id_discapacidad");

-- Modificar FKs de vivienda
ALTER TABLE "vivienda" DROP CONSTRAINT IF EXISTS vivienda_material_piso_id_fkey;
ALTER TABLE "vivienda" ADD FOREIGN KEY ("material_piso_id") REFERENCES "cat_material_piso" ("id_material_piso");

ALTER TABLE "vivienda" DROP CONSTRAINT IF EXISTS vivienda_material_techo_id_fkey;
ALTER TABLE "vivienda" ADD FOREIGN KEY ("material_techo_id") REFERENCES "cat_material_muro_techo" ("id_material_muro_techo");

ALTER TABLE "vivienda" DROP CONSTRAINT IF EXISTS vivienda_material_paredes_id_fkey;
ALTER TABLE "vivienda" ADD FOREIGN KEY ("material_paredes_id") REFERENCES "cat_material_muro_techo" ("id_material_muro_techo");

-- 4. Data Migration
UPDATE "persona" SET "sexo_id" = 1 WHERE "sexo" = 'masculino';
UPDATE "persona" SET "sexo_id" = 2 WHERE "sexo" = 'femenino';

UPDATE "vivienda" SET "cocina_ubicacion_id" = 1 WHERE "cocina_ubicacion" = 'dentro_del_dormitorio';
UPDATE "vivienda" SET "cocina_ubicacion_id" = 2 WHERE "cocina_ubicacion" = 'fuera_del_dormitorio';

UPDATE "persona_salud_preventiva" SET "tamizaje_cervico_uterino_id" = 1 WHERE "tamizaje_cervico_uterino" = true;
UPDATE "persona_salud_preventiva" SET "tamizaje_cervico_uterino_id" = 2 WHERE "tamizaje_cervico_uterino" = false;

UPDATE "persona_salud_preventiva" SET "tamizaje_cancer_mama_id" = 1 WHERE "tamizaje_cancer_mama" = true;
UPDATE "persona_salud_preventiva" SET "tamizaje_cancer_mama_id" = 2 WHERE "tamizaje_cancer_mama" = false;

UPDATE "persona_discapacidad" SET "tipo_discapacidad_id" = (SELECT id_discapacidad FROM cat_discapacidad WHERE nombre = persona_discapacidad.tipo_discapacidad LIMIT 1) WHERE "tipo_discapacidad" IS NOT NULL;

-- 5. Drop old columns
ALTER TABLE "persona" DROP COLUMN IF EXISTS "sexo";
ALTER TABLE "vivienda" DROP COLUMN IF EXISTS "cocina_ubicacion";
ALTER TABLE "persona_salud_preventiva" DROP COLUMN IF EXISTS "tamizaje_cervico_uterino";
ALTER TABLE "persona_salud_preventiva" DROP COLUMN IF EXISTS "tamizaje_cancer_mama";
ALTER TABLE "persona_discapacidad" DROP COLUMN IF EXISTS "tipo_discapacidad";

-- Rename new columns to the old names to maintain ORM consistency (where applicable, e.g. for boolean -> id)
-- However, for the backend it's safer to keep the new names or refactor the backend explicitly. 
-- Since the plan says refactor the backend to use _id for enums, let's keep the `_id` suffix.

-- Optionally drop types if they're no longer used
DROP TYPE IF EXISTS "sexo_persona";
DROP TYPE IF EXISTS "ubicacion_cocina";
