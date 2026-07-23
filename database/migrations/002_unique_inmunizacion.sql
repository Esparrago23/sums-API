-- Migración 002 — UNIQUE constraint en "inmunizacion" para evitar dosis duplicadas
-- (misma persona + misma vacuna + mismo esquema de vacunación + misma dosis).
--
-- NOTA (actualización): esta constraint ya se agregó directamente a la definición
-- de la tabla en database/schema.sql, así que cualquier base de datos NUEVA
-- inicializada vía docker-entrypoint-initdb.d ya la incluye automáticamente.
-- Este archivo se conserva únicamente para aplicarse manualmente sobre bases de
-- datos operativas (centro_medico_<anio>) que ya existían ANTES de este cambio
-- y que por lo tanto no recrearán la tabla desde schema.sql.
--
-- NOTA: "inmunizacion" no tiene persona_id directo; la persona se determina vía
-- esquema_vacunacion_id -> esquema_vacunacion.persona_id (cada esquema_vacunacion
-- pertenece a una sola persona). Por eso el UNIQUE se define sobre
-- (esquema_vacunacion_id, vacuna_id, dosis_id), lo que en la práctica impide
-- registrar dos veces la misma dosis de la misma vacuna para la misma persona.
--
-- CAVEAT: dosis_id es nullable y en PostgreSQL un UNIQUE/UNIQUE INDEX normal trata
-- cada NULL como distinto entre sí, así que esta constraint NO evita duplicados
-- cuando dosis_id es NULL en más de una fila con el mismo esquema+vacuna. Si se
-- requiere cubrir también ese caso, se puede reemplazar por un índice único
-- parcial adicional:
--   CREATE UNIQUE INDEX IF NOT EXISTS uq_inmunizacion_esquema_vacuna_sin_dosis
--     ON inmunizacion (esquema_vacunacion_id, vacuna_id) WHERE dosis_id IS NULL;
--
-- IMPORTANTE: antes de aplicar, verificar que no existan duplicados actuales
-- (el ALTER TABLE fallará con "could not create unique constraint" si los hay):
--   SELECT esquema_vacunacion_id, vacuna_id, dosis_id, COUNT(*)
--   FROM inmunizacion
--   GROUP BY esquema_vacunacion_id, vacuna_id, dosis_id
--   HAVING COUNT(*) > 1;
-- Resolver (eliminar/consolidar) los duplicados encontrados antes de continuar.
--
-- Esta migración NO se ejecuta automáticamente. Aplicar manualmente a la base
-- operativa (centro_medico_<anio>) cuando corresponda, por ejemplo:
--   docker compose exec -T db psql -U postgres -d centro_medico_2026 -f - < database/migrations/002_unique_inmunizacion.sql

ALTER TABLE inmunizacion
  ADD CONSTRAINT uq_inmunizacion_esquema_vacuna_dosis
  UNIQUE (esquema_vacunacion_id, vacuna_id, dosis_id);
