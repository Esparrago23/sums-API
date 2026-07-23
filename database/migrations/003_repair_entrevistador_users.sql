-- Migración 003 — Repara usuarios con rol "entrevistador" sin unidad_salud_id
-- ni entrevistador_id.
--
-- CAUSA: PUT /users/:id/role y POST /users/admin/register permitían asignar
-- rol_id=entrevistador sin crear/ligar un registro en la tabla "entrevistador",
-- dejando la cuenta a medio configurar. La app móvil manda entrevistador_id al
-- crear cédulas; con NULL, el insert viola cedula_entrevistador_id_fkey y la
-- app rechaza el guardado con "ID de entrevistador inválido". Ya corregido en
-- código (ver src/shared/services/rolCatalog.ts, ensureEntrevistadorLink) para
-- que altas/cambios de rol nuevos autoprovisionen esto; este script repara las
-- cuentas que ya habían quedado rotas antes del fix.
--
-- Detectadas en producción el 2026-07-23 vía GET /users (id_usuario, rol_id=4
-- con unidad_salud_id y/o entrevistador_id en NULL):
--   8 (Pedro), 11 (jmaciasE), 13 (jrenanE), 18 (tester1), 19 (tester2),
--   20 (tester3), 21 (tester4), 22 (tester5), 23 (tester6), 24 (patata).
--
-- Todas se ligan a unidad_salud_id=1 (única unidad de salud registrada al
-- momento de este script — confirmado con el equipo). El "nombre" del
-- registro de entrevistador se deja igual al nombre_usuario como placeholder;
-- edítalo después desde el panel admin con el nombre real de cada persona,
-- sobre todo para las cuentas que no son de prueba (Pedro, jmaciasE, jrenanE).
--
-- Cada usuario recibe su PROPIO registro nuevo en "entrevistador" — no
-- reutiliza el de otra cuenta (p.ej. entrevistador_id=1, de "entrevistador1"),
-- porque compartirlo mezclaría los datos de dos personas distintas como si
-- fueran una sola.
--
-- Idempotente: cada UPDATE solo toca filas que SIGUEN con entrevistador_id o
-- unidad_salud_id en NULL, así que se puede correr más de una vez sin duplicar
-- registros en "entrevistador" ni pisar ligas que ya se hayan reparado a mano.

BEGIN;

DO $$
DECLARE
  target_user RECORD;
  new_entrevistador_id INT;
BEGIN
  FOR target_user IN
    SELECT id_usuario, nombre_usuario
    FROM usuario
    WHERE id_usuario IN (8, 11, 13, 18, 19, 20, 21, 22, 23, 24)
      AND rol_id = (SELECT id_rol FROM cat_rol WHERE nombre = 'entrevistador')
      AND (unidad_salud_id IS NULL OR entrevistador_id IS NULL)
  LOOP
    INSERT INTO entrevistador (nombre, unidad_salud_id, fecha_registro)
    VALUES (target_user.nombre_usuario, 1, CURRENT_DATE)
    RETURNING id_entrevistador INTO new_entrevistador_id;

    UPDATE usuario
    SET unidad_salud_id = 1,
        entrevistador_id = new_entrevistador_id
    WHERE id_usuario = target_user.id_usuario;

    RAISE NOTICE 'usuario % (%) -> entrevistador %', target_user.id_usuario, target_user.nombre_usuario, new_entrevistador_id;
  END LOOP;
END $$;

-- Verificación: no debe quedar ningún usuario con rol entrevistador sin liga.
SELECT id_usuario, nombre_usuario, unidad_salud_id, entrevistador_id
FROM usuario
WHERE rol_id = (SELECT id_rol FROM cat_rol WHERE nombre = 'entrevistador')
  AND (unidad_salud_id IS NULL OR entrevistador_id IS NULL);

COMMIT;
