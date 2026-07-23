-- Migración 001 — Cifrado de datos sensibles en reposo (nombres de persona + dirección)
--
-- Las columnas cifradas (AES-256-GCM, formato enc::v2:: / enc::d2::) son más largas
-- que el texto original, así que se amplían a TEXT para evitar truncamiento.
--
-- Aplicar a la base operativa (centro_medico_<anio>) ANTES de re-cifrar los datos:
--   docker compose exec -T db psql -U postgres -d centro_medico_2026 -f - < database/migrations/001_cifrado_campos_sensibles.sql
-- Luego ejecutar el re-cifrado de datos existentes:
--   npx ts-node scripts/encrypt_existing_data.ts

ALTER TABLE persona
  ALTER COLUMN primer_nombre    TYPE TEXT,
  ALTER COLUMN segundo_nombre   TYPE TEXT,
  ALTER COLUMN apellido_paterno TYPE TEXT,
  ALTER COLUMN apellido_materno TYPE TEXT;

ALTER TABLE direccion
  ALTER COLUMN calle               TYPE TEXT,
  ALTER COLUMN numero_exterior     TYPE TEXT,
  ALTER COLUMN numero_interior     TYPE TEXT,
  ALTER COLUMN colonia             TYPE TEXT,
  ALTER COLUMN vivienda_referencia TYPE TEXT;
