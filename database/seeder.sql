-- =============================================================================
-- Catálogos alineados a la CÉDULA OFICIAL de Microdiagnóstico Familiar IMSS-BIENESTAR
-- (jun-2026). Se corrigieron: escolaridad, lengua, atención embarazo, frecuencia de
-- servicio de salud, animales (Porcinos) y se completó el esquema de vacunación.
--
-- NOTA: los INSERT usan ON CONFLICT DO NOTHING (no reemplazan valores previos). Si la BD
-- ya tenía catálogos con los valores viejos (p.ej. 'Preparatoria', 'Cerdos'), para dejar
-- el catálogo limpio hay que vaciar primero las tablas cat_* afectadas. En una BD de
-- desarrollo sin datos importantes:
--   TRUNCATE cat_escolaridad, cat_lengua, cat_animal, cat_atencion_embarazo,
--            cat_frecuencia_servicio_salud, cat_toxicomania, cat_enfermedad_cronica
--            RESTART IDENTITY CASCADE;
-- (CASCADE borra también las filas persona_* que referencien esos catálogos.)
-- =============================================================================

-- Garantiza que siempre se ejecuta contra la BD template, tanto en Docker init
-- como si se corre manualmente con psql.
\c sums_template

-- Insertar Roles
INSERT INTO cat_rol (nombre, descripcion) VALUES
('superadmin', 'Acceso total al sistema'),
('admin', 'Administrador de usuarios y catálogos'),
('analista', 'Analista de datos del microdiagnóstico'),
('entrevistador', 'Personal de campo que levanta la cédula')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Unidad de Salud Dummy
INSERT INTO unidad_salud (id_unidad_salud, clues, nombre, distrito)
VALUES (1, 'DUMMYCLUES1', 'Centro de Salud Prueba', 'Distrito 1')
ON CONFLICT (id_unidad_salud) DO NOTHING;

-- Insertar Entrevistador Dummy
INSERT INTO entrevistador (id_entrevistador, nombre, unidad_salud_id, fecha_registro)
VALUES (1, 'Entrevistador Prueba', 1, NOW())
ON CONFLICT (id_entrevistador) DO NOTHING;

-- Crear un superadmin y un admin por defecto (contraseña: 'password' hasheada con bcryptjs 10 rounds)
-- Hash regenerado y verificado localmente. Para generar uno nuevo:
--   node -e "require('bcryptjs').hash('password',10).then(h=>console.log(h))"
INSERT INTO usuario (nombre_usuario, contrasena, rol_id, fecha_registro, activo, unidad_salud_id, entrevistador_id)
VALUES
('superadmin_master', '$2b$10$LGMEBhV7TDSP4/0pQb9LeefrwTmslagVIAAHGsBALf4Xq2WzX/dW.', 1, NOW(), true, NULL, NULL),
('admin_regional', '$2b$10$LGMEBhV7TDSP4/0pQb9LeefrwTmslagVIAAHGsBALf4Xq2WzX/dW.', 2, NOW(), true, NULL, NULL),
('entrevistador1', '$2b$10$LGMEBhV7TDSP4/0pQb9LeefrwTmslagVIAAHGsBALf4Xq2WzX/dW.', 4, NOW(), true, 1, 1)
ON CONFLICT (nombre_usuario) DO NOTHING;

-- Insertar Vacunas (esquema oficial completo de la Cédula de Microdiagnóstico)
INSERT INTO vacuna (nombre, descripcion) VALUES
('BCG', 'Tuberculosis'),
('COVID-19', 'COVID-19'),
('DPT (Difteria, bordetella pertusis y tétanos)', 'Difteria, tos ferina, tétanos'),
('Hepatitis A', 'Hepatitis A'),
('Hepatitis B', 'Hepatitis B'),
('Hexavalente (DPaT+VPI+Hib+HepB)', 'Difteria, tos ferina, tétanos, polio, Haemophilus influenzae B y Hepatitis B'),
('Influenza estacional', 'Influenza'),
('Neumocócica conjugada (13 valente)', 'Neumonía, meningitis, otitis'),
('Neumocócica Polisacárida (23 serotipos)', 'Neumonía, meningitis'),
('Rotavirus (RV1)', 'Diarrea por rotavirus'),
('SR (Sarampión,rubeola)', 'Sarampión, rubéola'),
('SRP Triple viral (Sarampión, rubeola y parotiditis)', 'Sarampión, rubéola, parotiditis'),
('Td (Tétanos, difteria)', 'Tétanos, difteria'),
('Tdpa (Tétanos, difteria, tos ferina)', 'Tétanos, difteria, tos ferina'),
('VPH (Virus del Papiloma Humano)', 'Virus del papiloma humano'),
('Varicela', 'Varicela'),
('Otra', 'Otra vacuna (especifique)')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Dosis
INSERT INTO cat_dosis (nombre) VALUES
('Única'), ('1era'), ('2da'), ('3era'), ('Refuerzo')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Materiales de Vivienda
INSERT INTO cat_material (nombre) VALUES
('Madera'), ('Lámina'), ('Concreto o cemento'), ('Tierra'), ('Otros (especifique)')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Manejo Excretas
INSERT INTO cat_manejo_excretas (nombre) VALUES
('WC'), ('Letrina'), ('Al ras de suelo')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Estado Civil
INSERT INTO cat_estado_civil (nombre) VALUES
('Soltero(a)'), ('Casado(a)'), ('Viudo(a)'), ('Unión libre')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Parentesco / Rol Familiar
INSERT INTO cat_parentesco (nombre) VALUES
('Madre'), ('Padre'), ('Hijo(a)'), ('Abuelo(a)')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Ocupaciones
INSERT INTO cat_ocupacion (nombre) VALUES
('Estudiante'), ('Hogar'), ('Desempleo')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Toxicomanías (cédula: si no consume, se anota "NA" → sin fila)
INSERT INTO cat_toxicomania (nombre) VALUES
('Alcoholismo'), ('Tabaquismo'), ('Otras sustancias')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Enfermedades Crónicas (cédula: si no padece, se anota "NA" → sin fila)
INSERT INTO cat_enfermedad_cronica (nombre) VALUES
('Obesidad'), ('Hipertensión'), ('Diabetes Mellitus tipo 2'), ('Tosedor crónico')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Ingreso Salarial
INSERT INTO cat_ingreso_salarial (rango, descripcion) VALUES
('Hasta un salario mínimo', '0 a 1 salario'),
('1 a 2', '1 a 2 salarios mínimos'),
('2 a 3', '2 a 3 salarios mínimos'),
('3 a 5', '3 a 5 salarios mínimos'),
('Mayor a 5', 'Más de 5 salarios mínimos'),
('No recibe ingresos', 'Sin ingresos')
ON CONFLICT (rango) DO NOTHING;

-- Insertar Escolaridad (cédula: si no cuenta con escolaridad, se anota "NA" → sin fila)
INSERT INTO cat_escolaridad (nombre) VALUES
('Preescolar'), ('Primaria'), ('Secundaria'), ('Bachillerato'), ('Licenciatura'), ('Maestría'), ('Doctorado')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Lengua (cédula: Español o Lengua indígena; el nombre va en lengua_indigena_especificar)
INSERT INTO cat_lengua (nombre) VALUES
('Español'), ('Lengua indígena')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Animales (cédula "otros animales"; perros/gatos van en la tabla vivienda)
INSERT INTO cat_animal (nombre) VALUES
('Aves de corral'), ('Bovinos'), ('Porcinos'), ('Otros')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Atencion Embarazo (cédula: Sector Público / Sector Privado / Hogar)
INSERT INTO cat_atencion_embarazo (nombre) VALUES
('Sector Público'), ('Sector Privado'), ('Hogar')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Frecuencia Servicio de Salud (cédula: Mensual / Trimestral / Semestral / Anual)
INSERT INTO cat_frecuencia_servicio_salud (nombre) VALUES
('Mensual'), ('Trimestral'), ('Semestral'), ('Anual')
ON CONFLICT (nombre) DO NOTHING;


-- Actualizar secuencias (postgres)
SELECT setval('unidad_salud_id_unidad_salud_seq', (SELECT MAX(id_unidad_salud) FROM unidad_salud));
SELECT setval('entrevistador_id_entrevistador_seq', (SELECT MAX(id_entrevistador) FROM entrevistador));
