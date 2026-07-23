-- ============================================================
-- SUMS - Generador de cédulas sintéticas para PostgreSQL
-- Genera familias completas sin requerir Python ni extensiones.
--
-- CONFIGURACIÓN PRINCIPAL:
--   Cambia v_total_cedulas dentro del bloque DO.
--
-- ADVERTENCIA:
--   Ejecutar primero schema.sql y seeder.sql.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Catálogos mínimos faltantes y datos base de Suchiapa
-- ------------------------------------------------------------
INSERT INTO cat_entidad (nombre)
VALUES ('Chiapas')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_municipio (nombre, entidad_id)
SELECT 'Suchiapa', e.id_entidad
FROM cat_entidad e
WHERE e.nombre = 'Chiapas'
  AND NOT EXISTS (
    SELECT 1 FROM cat_municipio m
    WHERE m.nombre = 'Suchiapa' AND m.entidad_id = e.id_entidad
  );

INSERT INTO cat_tipo_asentamiento (tipo_asentamiento)
SELECT x.nombre
FROM (VALUES ('Colonia'), ('Barrio'), ('Ejido'), ('Ranchería')) AS x(nombre)
WHERE NOT EXISTS (
  SELECT 1 FROM cat_tipo_asentamiento t
  WHERE t.tipo_asentamiento = x.nombre
);

INSERT INTO cat_asentamiento (nombre, municipio_id, tipo_asentamiento_id)
SELECT a.nombre, m.id_municipio, t.id_tipo_asentamiento
FROM (
  VALUES
    ('Centro', 'Barrio'),
    ('San Jacinto', 'Barrio'),
    ('Santa Cecilia', 'Barrio'),
    ('El Rosario', 'Colonia'),
    ('La Ciénega', 'Ejido'),
    ('Plan de Mulumí', 'Ranchería')
) AS a(nombre, tipo)
JOIN cat_municipio m ON m.nombre = 'Suchiapa'
JOIN cat_entidad e ON e.id_entidad = m.entidad_id AND e.nombre = 'Chiapas'
JOIN cat_tipo_asentamiento t ON t.tipo_asentamiento = a.tipo
WHERE NOT EXISTS (
  SELECT 1
  FROM cat_asentamiento ca
  WHERE ca.nombre = a.nombre AND ca.municipio_id = m.id_municipio
);

INSERT INTO cat_zona (zona)
SELECT x.zona
FROM (VALUES ('Urbana'), ('Rural'), ('Periurbana')) AS x(zona)
WHERE NOT EXISTS (SELECT 1 FROM cat_zona z WHERE z.zona = x.zona);

INSERT INTO cat_turno (nombre)
VALUES ('Matutino'), ('Vespertino'), ('Mixto')
ON CONFLICT (nombre) DO NOTHING;

-- Catálogos base, por si el seeder original no se ejecutó completo.
INSERT INTO cat_estado_civil (nombre) VALUES
('Soltero(a)'), ('Casado(a)'), ('Viudo(a)'), ('Unión libre')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_parentesco (nombre) VALUES
('Madre'), ('Padre'), ('Hijo(a)'), ('Abuelo(a)')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_escolaridad (nombre) VALUES
('Ninguna'), ('Primaria'), ('Secundaria'), ('Preparatoria'),
('Licenciatura'), ('Posgrado')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_ocupacion (nombre) VALUES
('Estudiante'), ('Hogar'), ('Desempleo'), ('Empleado(a)'),
('Comerciante'), ('Campesino(a)'), ('Profesionista')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_ingreso_salarial (rango, descripcion) VALUES
('Hasta un salario mínimo', '0 a 1 salario'),
('1 a 2', '1 a 2 salarios mínimos'),
('2 a 3', '2 a 3 salarios mínimos'),
('3 a 5', '3 a 5 salarios mínimos'),
('Mayor a 5', 'Más de 5 salarios mínimos'),
('No recibe ingresos', 'Sin ingresos')
ON CONFLICT (rango) DO NOTHING;

INSERT INTO cat_lengua (nombre) VALUES
('Español'), ('Náhuatl'), ('Maya'), ('Zapoteco'), ('Mixteco'), ('Otra')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_material (nombre) VALUES
('Madera'), ('Lámina'), ('Concreto o cemento'), ('Tierra'), ('Otros (especifique)')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_manejo_excretas (nombre) VALUES
('WC'), ('Letrina'), ('Al ras de suelo')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_animal (nombre) VALUES
('Aves de corral'), ('Bovinos'), ('Cerdos'), ('Perros'), ('Gatos'), ('Caballos'), ('Otros')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_toxicomania (nombre) VALUES
('Alcoholismo'), ('Tabaquismo'), ('Ninguna'), ('Otra')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_enfermedad_cronica (nombre) VALUES
('Obesidad'), ('Hipertensión'), ('Diabetes Mellitus tipo 2'), ('Tosedor crónico'), ('Ninguna')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_atencion_embarazo (nombre) VALUES
('Ninguno'), ('IMSS'), ('ISSSTE'), ('Secretaría de Salud'), ('Privado'), ('Otro')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_frecuencia_servicio_salud (nombre) VALUES
('Mensual'), ('Cada 6 meses'), ('Anual'), ('Sólo cuando se enferma'), ('Nunca')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_dosis (nombre) VALUES
('Única'), ('1era'), ('2da'), ('3era'), ('Refuerzo')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO vacuna (nombre, descripcion) VALUES
('BCG', 'Tuberculosis'),
('Hepatitis B', 'Hepatitis B'),
('Hexavalente (DPaT+VPI+Hib+HepB)', 'Vacuna combinada infantil'),
('Rotavirus (RV1)', 'Diarrea por rotavirus'),
('Neumocócica conjugada (13 valente)', 'Enfermedad neumocócica'),
('Influenza estacional', 'Influenza'),
('SR (Sarampión,rubeola)', 'Sarampión y rubéola'),
('COVID-19', 'COVID-19')
ON CONFLICT (nombre) DO NOTHING;

-- Garantizar una unidad y un entrevistador utilizables.
INSERT INTO unidad_salud (clues, nombre, distrito, municipio_id, numero_nucleos)
SELECT 'CSSUCH00001', 'Centro de Salud Suchiapa', 'Distrito Suchiapa', m.id_municipio, 0
FROM cat_municipio m
JOIN cat_entidad e ON e.id_entidad = m.entidad_id
WHERE m.nombre = 'Suchiapa' AND e.nombre = 'Chiapas'
ON CONFLICT (clues) DO NOTHING;

INSERT INTO entrevistador (nombre, unidad_salud_id, fecha_registro)
SELECT 'Entrevistador Sintético', us.id_unidad_salud, CURRENT_DATE
FROM unidad_salud us
WHERE us.clues = 'CSSUCH00001'
  AND NOT EXISTS (
    SELECT 1 FROM entrevistador en
    WHERE en.nombre = 'Entrevistador Sintético'
      AND en.unidad_salud_id = us.id_unidad_salud
  );

-- ------------------------------------------------------------
-- 2. Generación de cédulas
-- ------------------------------------------------------------
DO $$
DECLARE
    -- CAMBIA ESTE VALOR PARA GENERAR MÁS O MENOS CÉDULAS.
    v_total_cedulas CONSTANT INT := 1000;

    v_i INT;
    v_j INT;
    v_num_hijos INT;
    v_num_integrantes INT;

    v_unidad_id INT;
    v_entrevistador_id INT;
    v_municipio_id INT;
    v_asentamiento_id INT;
    v_zona_id INT;

    v_direccion_id INT;
    v_nucleo_id INT;
    v_levantamiento_id INT;
    v_cedula_id INT;
    v_persona_id INT;
    v_jefe_id INT;
    v_esquema_id INT;

    v_personas INT[];
    v_sexo sexo_persona;
    v_fecha_nacimiento DATE;
    v_edad INT;
    v_nombre VARCHAR(100);
    v_segundo_nombre VARCHAR(100);
    v_apellido_paterno VARCHAR(100);
    v_apellido_materno VARCHAR(100);
    v_apellido_jefe_paterno VARCHAR(100);
    v_apellido_jefe_materno VARCHAR(100);
    v_estado_civil VARCHAR(50);
    v_parentesco VARCHAR(50);
    v_escolaridad VARCHAR(100);
    v_ocupacion VARCHAR(100);
    v_ingreso VARCHAR(100);
    v_toxicomania VARCHAR(100);
    v_enfermedad VARCHAR(150);
    v_frecuencia VARCHAR(50);
    v_atencion_embarazo VARCHAR(100);
    v_fecha_cedula DATE;
    v_tiene_discapacidad BOOLEAN;
    v_tiene_pareja BOOLEAN;

    nombres_hombres TEXT[] := ARRAY[
      'Alejandro','Carlos','José','Luis','Miguel','Juan','Daniel','Eduardo',
      'Fernando','Roberto','Jorge','Manuel','David','Francisco','Ricardo'
    ];
    nombres_mujeres TEXT[] := ARRAY[
      'María','Ana','Guadalupe','Carmen','Rosa','Daniela','Fernanda','Sofía',
      'Laura','Patricia','Isabel','Gabriela','Andrea','Lucía','Valeria'
    ];
    apellidos TEXT[] := ARRAY[
      'Gómez','López','Hernández','Martínez','Pérez','Rodríguez','Sánchez',
      'García','Vázquez','Díaz','Cruz','Ruiz','Morales','Flores','Aguilar'
    ];
    calles TEXT[] := ARRAY[
      'Primera Oriente','Segunda Oriente','Primera Poniente','Segunda Poniente',
      'Avenida Central','Calle del Río','Calle Las Flores','Calle Benito Juárez',
      'Calle Miguel Hidalgo','Calle 5 de Mayo'
    ];
BEGIN
    -- Semilla reproducible. Cambiar el decimal para obtener otro conjunto.
    PERFORM setseed(0.425);

    SELECT us.id_unidad_salud
    INTO v_unidad_id
    FROM unidad_salud us
    WHERE us.clues = 'CSSUCH00001'
    LIMIT 1;

    SELECT e.id_entrevistador
    INTO v_entrevistador_id
    FROM entrevistador e
    WHERE e.unidad_salud_id = v_unidad_id
    ORDER BY e.id_entrevistador
    LIMIT 1;

    SELECT m.id_municipio
    INTO v_municipio_id
    FROM cat_municipio m
    JOIN cat_entidad e ON e.id_entidad = m.entidad_id
    WHERE m.nombre = 'Suchiapa' AND e.nombre = 'Chiapas'
    LIMIT 1;

    IF v_unidad_id IS NULL OR v_entrevistador_id IS NULL OR v_municipio_id IS NULL THEN
      RAISE EXCEPTION 'No fue posible obtener unidad, entrevistador o municipio';
    END IF;

    FOR v_i IN 1..v_total_cedulas LOOP
        v_personas := ARRAY[]::INT[];
        v_fecha_cedula := CURRENT_DATE - floor(random() * 365)::INT;
        v_num_hijos := floor(random() * 5)::INT;       -- 0 a 4 hijos
        v_tiene_pareja := random() < 0.78;
        v_num_integrantes := 1 + CASE WHEN v_tiene_pareja THEN 1 ELSE 0 END + v_num_hijos;

        SELECT ca.id_asentamiento
        INTO v_asentamiento_id
        FROM cat_asentamiento ca
        WHERE ca.municipio_id = v_municipio_id
        ORDER BY random()
        LIMIT 1;

        SELECT z.id_zona
        INTO v_zona_id
        FROM cat_zona z
        ORDER BY random()
        LIMIT 1;

        -- Dirección
        INSERT INTO direccion (
          calle, numero_exterior, numero_interior, colonia, codigo_postal,
          localidad, manzana, vivienda_referencia, asentamiento_id
        )
        SELECT
          calles[1 + floor(random() * array_length(calles, 1))::INT],
          (1 + floor(random() * 300))::INT::TEXT,
          CASE WHEN random() < 0.15 THEN (1 + floor(random() * 10))::INT::TEXT ELSE NULL END,
          ca.nombre,
          '29150',
          'Suchiapa',
          (1 + floor(random() * 40))::INT::TEXT,
          'VIV-' || lpad(v_i::TEXT, 5, '0'),
          v_asentamiento_id
        FROM cat_asentamiento ca
        WHERE ca.id_asentamiento = v_asentamiento_id
        RETURNING id_direccion INTO v_direccion_id;

        -- Crear primero el núcleo sin jefe para resolver la FK circular.
        INSERT INTO nucleo_familiar (jefe_persona_id, fecha_registro, comentarios)
        VALUES (NULL, v_fecha_cedula::TIMESTAMP, 'Familia sintética ' || v_i)
        RETURNING id_nucleo_familiar INTO v_nucleo_id;

        -- Cada iteración crea jefe, pareja opcional e hijos.
        FOR v_j IN 1..v_num_integrantes LOOP
            IF v_j = 1 THEN
                v_sexo := CASE WHEN random() < 0.55 THEN 'masculino'::sexo_persona ELSE 'femenino'::sexo_persona END;
                v_edad := 25 + floor(random() * 46)::INT; -- 25 a 70
                v_parentesco := CASE WHEN v_sexo = 'masculino' THEN 'Padre' ELSE 'Madre' END;
                v_estado_civil := CASE WHEN v_tiene_pareja THEN 'Casado(a)' ELSE 'Soltero(a)' END;
            ELSIF v_j = 2 AND v_tiene_pareja THEN
                v_sexo := CASE WHEN v_sexo = 'masculino' THEN 'femenino'::sexo_persona ELSE 'masculino'::sexo_persona END;
                v_edad := GREATEST(20, v_edad - 5 + floor(random() * 11)::INT);
                v_parentesco := CASE WHEN v_sexo = 'masculino' THEN 'Padre' ELSE 'Madre' END;
                v_estado_civil := 'Casado(a)';
            ELSE
                v_sexo := CASE WHEN random() < 0.5 THEN 'masculino'::sexo_persona ELSE 'femenino'::sexo_persona END;
                v_edad := floor(random() * 24)::INT; -- 0 a 23
                v_parentesco := 'Hijo(a)';
                v_estado_civil := 'Soltero(a)';
            END IF;

            v_fecha_nacimiento := (CURRENT_DATE - make_interval(years => v_edad)
                                  - make_interval(days => floor(random() * 365)::INT))::DATE;

            v_nombre := CASE WHEN v_sexo = 'masculino'
              THEN nombres_hombres[1 + floor(random() * array_length(nombres_hombres, 1))::INT]
              ELSE nombres_mujeres[1 + floor(random() * array_length(nombres_mujeres, 1))::INT]
            END;
            v_segundo_nombre := CASE WHEN random() < 0.35 THEN
              CASE WHEN v_sexo = 'masculino'
                THEN nombres_hombres[1 + floor(random() * array_length(nombres_hombres, 1))::INT]
                ELSE nombres_mujeres[1 + floor(random() * array_length(nombres_mujeres, 1))::INT]
              END
              ELSE NULL
            END;

            -- Los hijos conservan el apellido paterno del jefe.
            IF v_j = 1 THEN
              v_apellido_paterno := apellidos[1 + floor(random() * array_length(apellidos, 1))::INT];
              v_apellido_materno := apellidos[1 + floor(random() * array_length(apellidos, 1))::INT];
              v_apellido_jefe_paterno := v_apellido_paterno;
              v_apellido_jefe_materno := v_apellido_materno;
            ELSIF v_parentesco = 'Hijo(a)' THEN
              v_apellido_paterno := v_apellido_jefe_paterno;
              v_apellido_materno := v_apellido_jefe_materno;
            ELSE
              v_apellido_paterno := apellidos[1 + floor(random() * array_length(apellidos, 1))::INT];
              v_apellido_materno := apellidos[1 + floor(random() * array_length(apellidos, 1))::INT];
            END IF;

            INSERT INTO persona (
              primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,
              fecha_nacimiento, sexo, estado_civil_id, alfabetizacion, fecha_registro
            )
            SELECT
              v_nombre, v_segundo_nombre, v_apellido_paterno, v_apellido_materno,
              v_fecha_nacimiento, v_sexo, ec.id_estado_civil,
              CASE WHEN v_edad < 5 THEN false ELSE random() < 0.94 END,
              v_fecha_cedula::TIMESTAMP
            FROM cat_estado_civil ec
            WHERE ec.nombre = v_estado_civil
            RETURNING id_persona INTO v_persona_id;

            v_personas := array_append(v_personas, v_persona_id);
            IF v_j = 1 THEN
              v_jefe_id := v_persona_id;
            END IF;

            INSERT INTO nucleo_persona (
              nucleo_familiar_id, persona_id, parentesco_id, fecha_registro
            )
            SELECT v_nucleo_id, v_persona_id, p.id_parentesco, v_fecha_cedula::TIMESTAMP
            FROM cat_parentesco p
            WHERE p.nombre = v_parentesco;

            -- Lengua
            INSERT INTO persona_lengua (persona_id, lengua_id, es_principal)
            SELECT v_persona_id, l.id_lengua, true
            FROM cat_lengua l
            WHERE l.nombre = CASE WHEN random() < 0.96 THEN 'Español' ELSE 'Otra' END;

            -- Escolaridad según edad
            v_escolaridad := CASE
              WHEN v_edad < 6 THEN 'Ninguna'
              WHEN v_edad < 12 THEN 'Primaria'
              WHEN v_edad < 15 THEN CASE WHEN random() < 0.85 THEN 'Secundaria' ELSE 'Primaria' END
              WHEN v_edad < 18 THEN CASE WHEN random() < 0.75 THEN 'Preparatoria' ELSE 'Secundaria' END
              WHEN random() < 0.10 THEN 'Licenciatura'
              WHEN random() < 0.35 THEN 'Preparatoria'
              WHEN random() < 0.75 THEN 'Secundaria'
              ELSE 'Primaria'
            END;

            INSERT INTO persona_escolaridad (persona_id, escolaridad_id, fecha_registro)
            SELECT v_persona_id, e.id_escolaridad, v_fecha_cedula
            FROM cat_escolaridad e WHERE e.nombre = v_escolaridad;

            -- Ocupación e ingreso según edad
            IF v_edad < 6 THEN
              v_ocupacion := NULL;
              v_ingreso := 'No recibe ingresos';
            ELSIF v_edad < 23 THEN
              v_ocupacion := CASE WHEN random() < 0.85 THEN 'Estudiante' ELSE 'Desempleo' END;
              v_ingreso := 'No recibe ingresos';
            ELSE
              v_ocupacion := (ARRAY['Hogar','Desempleo','Empleado(a)','Comerciante','Campesino(a)','Profesionista'])
                [1 + floor(random() * 6)::INT];
              v_ingreso := CASE v_ocupacion
                WHEN 'Hogar' THEN 'No recibe ingresos'
                WHEN 'Desempleo' THEN 'No recibe ingresos'
                WHEN 'Profesionista' THEN CASE WHEN random() < 0.7 THEN '2 a 3' ELSE '3 a 5' END
                ELSE CASE
                  WHEN random() < 0.55 THEN 'Hasta un salario mínimo'
                  WHEN random() < 0.85 THEN '1 a 2'
                  ELSE '2 a 3'
                END
              END;
            END IF;

            IF v_ocupacion IS NOT NULL THEN
              INSERT INTO persona_ocupacion (persona_id, ocupacion_id, fecha_registro)
              SELECT v_persona_id, o.id_ocupacion, v_fecha_cedula
              FROM cat_ocupacion o WHERE o.nombre = v_ocupacion;
            END IF;

            INSERT INTO persona_ingreso (persona_id, ingreso_salarial_id, fecha_registro)
            SELECT v_persona_id, i.id_ingreso_salarial, v_fecha_cedula
            FROM cat_ingreso_salarial i WHERE i.rango = v_ingreso;

            -- Seguridad social y discapacidad
            INSERT INTO persona_seguridad_social (persona_id, cuenta_seguridad_social, fecha_registro)
            VALUES (v_persona_id, random() < 0.38, v_fecha_cedula);

            v_tiene_discapacidad := random() < 0.07;

            INSERT INTO persona_discapacidad (
                persona_id,
                presenta_discapacidad,
                tipo_discapacidad
            )
            VALUES (
                v_persona_id,
                v_tiene_discapacidad,
                CASE
                    WHEN v_tiene_discapacidad THEN
                        (ARRAY[
                            'Motriz',
                            'Visual',
                            'Auditiva',
                            'Intelectual'
                        ])[1 + floor(random() * 4)::INT]
                    ELSE NULL
                END
            );

            -- Alimentación e higiene
            INSERT INTO persona_alimentacion (
              persona_id, dias_proteina, dias_frutas_verduras, dias_cereales, fecha_registro
            ) VALUES (
              v_persona_id,
              1 + floor(random() * 7)::INT,
              1 + floor(random() * 7)::INT,
              3 + floor(random() * 5)::INT,
              v_fecha_cedula
            );

            INSERT INTO persona_higiene (
              persona_id, higiene_bano_bucodental_diaria, fecha_registro
            ) VALUES (v_persona_id, random() < 0.82, v_fecha_cedula);

            -- Toxicomanía: menores siempre Ninguna.
            v_toxicomania := CASE
              WHEN v_edad < 14 THEN 'Ninguna'
              WHEN random() < 0.72 THEN 'Ninguna'
              WHEN random() < 0.60 THEN 'Alcoholismo'
              ELSE 'Tabaquismo'
            END;

            INSERT INTO persona_toxicomania (persona_id, toxicomania_id)
            SELECT v_persona_id, t.id_toxicomania
            FROM cat_toxicomania t WHERE t.nombre = v_toxicomania;

            -- Enfermedad crónica, con mayor probabilidad en adultos mayores.
            v_enfermedad := CASE
              WHEN v_edad < 18 AND random() < 0.92 THEN 'Ninguna'
              WHEN v_edad >= 50 AND random() < 0.22 THEN 'Hipertensión'
              WHEN v_edad >= 45 AND random() < 0.15 THEN 'Diabetes Mellitus tipo 2'
              WHEN random() < 0.13 THEN 'Obesidad'
              WHEN random() < 0.04 THEN 'Tosedor crónico'
              ELSE 'Ninguna'
            END;

            INSERT INTO persona_enfermedad_cronica (persona_id, enfermedad_cronica_id)
            SELECT v_persona_id, e.id_enfermedad_cronica
            FROM cat_enfermedad_cronica e WHERE e.nombre = v_enfermedad;

            -- Salud preventiva
            v_atencion_embarazo := CASE
              WHEN v_sexo = 'femenino' AND v_edad BETWEEN 15 AND 45 AND random() < 0.16
                THEN CASE WHEN random() < 0.80 THEN 'Secretaría de Salud' ELSE 'Privado' END
              ELSE 'Ninguno'
            END;

            INSERT INTO persona_salud_preventiva (
              persona_id, atencion_embarazo_id,
              tamizaje_cervico_uterino, fecha_tamizaje_cervico_uterino,
              tamizaje_cancer_mama, fecha_tamizaje_cancer_mama,
              fecha_registro
            )
            SELECT
              v_persona_id,
              a.id_atencion_embarazo,
              CASE WHEN v_sexo = 'femenino' AND v_edad BETWEEN 25 AND 64 THEN random() < 0.62 ELSE false END,
              CASE WHEN v_sexo = 'femenino' AND v_edad BETWEEN 25 AND 64 AND random() < 0.62
                THEN v_fecha_cedula - floor(random() * 1095)::INT ELSE NULL END,
              CASE WHEN v_sexo = 'femenino' AND v_edad BETWEEN 40 AND 69 THEN random() < 0.55 ELSE false END,
              CASE WHEN v_sexo = 'femenino' AND v_edad BETWEEN 40 AND 69 AND random() < 0.55
                THEN v_fecha_cedula - floor(random() * 730)::INT ELSE NULL END,
              v_fecha_cedula
            FROM cat_atencion_embarazo a
            WHERE a.nombre = v_atencion_embarazo;

            v_frecuencia := (ARRAY['Mensual','Cada 6 meses','Anual','Sólo cuando se enferma','Nunca'])
              [1 + floor(random() * 5)::INT];

            INSERT INTO persona_servicio_salud (
              persona_id, frecuencia_servicio_salud_id, motivo_uso, fecha_registro
            )
            SELECT
              v_persona_id,
              f.id_frecuencia_servicio_salud,
              CASE v_frecuencia
                WHEN 'Nunca' THEN 'No utiliza servicios de salud'
                WHEN 'Sólo cuando se enferma' THEN 'Consulta por enfermedad'
                ELSE 'Control preventivo y consulta general'
              END,
              v_fecha_cedula
            FROM cat_frecuencia_servicio_salud f
            WHERE f.nombre = v_frecuencia;

            -- Esquema de vacunación; inmunizaciones se insertan después de crear la cédula.
            INSERT INTO esquema_vacunacion (persona_id, unidad_salud_id, fecha_registro)
            VALUES (v_persona_id, v_unidad_id, v_fecha_cedula);
        END LOOP;

        UPDATE nucleo_familiar
        SET jefe_persona_id = v_jefe_id
        WHERE id_nucleo_familiar = v_nucleo_id;

        INSERT INTO nucleo_direccion (
          nucleo_familiar_id, direccion_id, fecha_asociacion
        ) VALUES (v_nucleo_id, v_direccion_id, v_fecha_cedula);

        -- Vivienda
        INSERT INTO vivienda (
          nucleo_familiar_id, direccion_id, numero_cuartos, numero_habitantes,
          agua_entubada, energia_electrica, cocina_ubicacion, cocina_con_lena,
          manejo_excretas_id, red_alcantarillado, fosa_septica,
          material_techo_id, material_paredes_id, material_piso_id,
          perros_gatos_dentro, mascotas_vacunas_corrientes,
          mascotas_esterilizadas, comentarios
        )
        SELECT
          v_nucleo_id,
          v_direccion_id,
          1 + floor(random() * 5)::INT,
          v_num_integrantes,
          random() < 0.78,
          random() < 0.94,
          CASE WHEN random() < 0.80
            THEN 'fuera_del_dormitorio'::ubicacion_cocina
            ELSE 'dentro_del_dormitorio'::ubicacion_cocina END,
          random() < 0.42,
          me.id_manejo_excretas,
          random() < 0.57,
          random() < 0.32,
          mt.id_material,
          mp.id_material,
          mpi.id_material,
          random() < 0.48,
          random() < 0.60,
          random() < 0.38,
          'Vivienda sintética generada automáticamente'
        FROM cat_manejo_excretas me
        CROSS JOIN LATERAL (
          SELECT id_material FROM cat_material ORDER BY random() LIMIT 1
        ) mt
        CROSS JOIN LATERAL (
          SELECT id_material FROM cat_material ORDER BY random() LIMIT 1
        ) mp
        CROSS JOIN LATERAL (
          SELECT id_material FROM cat_material ORDER BY random() LIMIT 1
        ) mpi
        WHERE me.nombre = CASE
          WHEN random() < 0.72 THEN 'WC'
          WHEN random() < 0.88 THEN 'Letrina'
          ELSE 'Al ras de suelo'
        END
        LIMIT 1;

        -- Entre 0 y 3 tipos de animales por familia.
        INSERT INTO familia_animal (nucleo_familiar_id, animal_id, comentarios)
        SELECT v_nucleo_id, a.id_animal, 'Registro sintético'
        FROM cat_animal a
        WHERE random() < 0.22
        ORDER BY random()
        LIMIT 3;

        -- Levantamiento y cédula
        INSERT INTO levantamiento (
          unidad_salud_id, fecha, zona_id, comentarios
        ) VALUES (
          v_unidad_id, v_fecha_cedula, v_zona_id,
          'Levantamiento sintético número ' || v_i
        )
        RETURNING id_levantamiento INTO v_levantamiento_id;

        INSERT INTO levantamiento_personal (levantamiento_id, entrevistador_id)
        VALUES (v_levantamiento_id, v_entrevistador_id);

        INSERT INTO cedula (
          unidad_salud_id, entrevistador_id, levantamiento_id,
          nucleo_familiar_id, fecha_registro, estado, observaciones
        ) VALUES (
          v_unidad_id,
          v_entrevistador_id,
          v_levantamiento_id,
          v_nucleo_id,
          v_fecha_cedula,
          (ARRAY['sincronizada','validada','cerrada']::estado_cedula[])
            [1 + floor(random() * 3)::INT],
          'Cédula sintética generada para pruebas y minería de datos'
        )
        RETURNING id_cedula INTO v_cedula_id;

        INSERT INTO levantamiento_nucleo (
          levantamiento_id, entrevistador_id, nucleo_familiar_id,
          cedula_id, fecha, comentarios
        ) VALUES (
          v_levantamiento_id, v_entrevistador_id, v_nucleo_id,
          v_cedula_id, v_fecha_cedula::TIMESTAMP,
          'Asociación sintética'
        );

        -- Inmunizaciones coherentes con la edad aproximada.
        FOREACH v_persona_id IN ARRAY v_personas LOOP
          SELECT ev.id_esquema_vacunacion
          INTO v_esquema_id
          FROM esquema_vacunacion ev
          WHERE ev.persona_id = v_persona_id
          ORDER BY ev.id_esquema_vacunacion DESC
          LIMIT 1;

          SELECT EXTRACT(YEAR FROM age(CURRENT_DATE, p.fecha_nacimiento))::INT
          INTO v_edad
          FROM persona p
          WHERE p.id_persona = v_persona_id;

          -- Influenza para una proporción amplia.
          IF random() < 0.64 THEN
            INSERT INTO inmunizacion (
              esquema_vacunacion_id, cedula_id, vacuna_id, dosis_id, fecha_aplicacion
            )
            SELECT v_esquema_id, v_cedula_id, v.id_vacuna, d.id_dosis,
                   v_fecha_cedula - floor(random() * 365)::INT
            FROM vacuna v
            JOIN cat_dosis d ON d.nombre = 'Única'
            WHERE v.nombre = 'Influenza estacional';
          END IF;

          -- COVID para mayores de 12 años.
          IF v_edad >= 12 AND random() < 0.76 THEN
            INSERT INTO inmunizacion (
              esquema_vacunacion_id, cedula_id, vacuna_id, dosis_id, fecha_aplicacion
            )
            SELECT v_esquema_id, v_cedula_id, v.id_vacuna, d.id_dosis,
                   v_fecha_cedula - floor(random() * 730)::INT
            FROM vacuna v
            JOIN cat_dosis d ON d.nombre = CASE WHEN random() < 0.45 THEN '2da' ELSE 'Refuerzo' END
            WHERE v.nombre = 'COVID-19';
          END IF;

          -- Esquema infantil básico.
          IF v_edad <= 10 THEN
            INSERT INTO inmunizacion (
              esquema_vacunacion_id, cedula_id, vacuna_id, dosis_id, fecha_aplicacion
            )
            SELECT v_esquema_id, v_cedula_id, v.id_vacuna, d.id_dosis,
                   GREATEST(
                     (SELECT fecha_nacimiento FROM persona WHERE id_persona = v_persona_id),
                     v_fecha_cedula - floor(random() * 3650)::INT
                   )
            FROM vacuna v
            JOIN cat_dosis d ON d.nombre = CASE
              WHEN v.nombre IN ('BCG','Hepatitis B') THEN 'Única'
              ELSE '1era'
            END
            WHERE v.nombre IN (
              'BCG', 'Hepatitis B', 'Hexavalente (DPaT+VPI+Hib+HepB)',
              'Rotavirus (RV1)', 'Neumocócica conjugada (13 valente)',
              'SR (Sarampión,rubeola)'
            )
            AND random() < 0.88;
          END IF;
        END LOOP;
    END LOOP;

    UPDATE unidad_salud us
    SET numero_nucleos = (
      SELECT COUNT(*)
      FROM cedula c
      WHERE c.unidad_salud_id = us.id_unidad_salud
    )
    WHERE us.id_unidad_salud = v_unidad_id;

    RAISE NOTICE 'Se generaron % cédulas sintéticas', v_total_cedulas;
END $$;

COMMIT;

-- ------------------------------------------------------------
-- 3. Resumen de resultados
-- ------------------------------------------------------------
SELECT 'cedulas' AS tabla, COUNT(*) AS total FROM cedula
UNION ALL
SELECT 'nucleos_familiares', COUNT(*) FROM nucleo_familiar
UNION ALL
SELECT 'personas', COUNT(*) FROM persona
UNION ALL
SELECT 'viviendas', COUNT(*) FROM vivienda
UNION ALL
SELECT 'inmunizaciones', COUNT(*) FROM inmunizacion
ORDER BY tabla;
