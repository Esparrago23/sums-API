-- Insertar Roles
INSERT INTO cat_rol (nombre, descripcion) VALUES
('superadmin', 'Acceso total al sistema'),
('admin', 'Administrador de usuarios y catálogos'),
('analista', 'Analista de datos del microdiagnóstico'),
('entrevistador', 'Personal de campo que levanta la cédula')
ON CONFLICT (nombre) DO NOTHING;

-- Crear un superadmin y un admin por defecto (contraseña generada: 'password' hasheada con bcryptjs)
-- El hash de 'password' con 10 salt rounds es: $2b$10$xbSgWXvdqYvPbLHv9aV9u.1p9ONjKDav9FS6yXXEAFLibZ3d.KFU6
INSERT INTO usuario (nombre_usuario, contrasena, rol_id, fecha_registro, activo)
VALUES
('superadmin_master', '$2b$10$xbSgWXvdqYvPbLHv9aV9u.1p9ONjKDav9FS6yXXEAFLibZ3d.KFU6', 1, NOW(), true),
('admin_regional', '$2b$10$xbSgWXvdqYvPbLHv9aV9u.1p9ONjKDav9FS6yXXEAFLibZ3d.KFU6', 2, NOW(), true)
ON CONFLICT (nombre_usuario) DO NOTHING;

-- Insertar Vacunas
INSERT INTO vacuna (nombre, descripcion) VALUES
('BCG', 'Tuberculosis'),
('Hepatitis B', 'Hepatitis B'),
('Hexavalente (DPaT+VPI+Hib+HepB)', 'Difteria, tos ferina, tétanos, polio, Haemophilus influenzae B y Hepatitis B'),
('Rotavirus (RV1)', 'Diarrea por rotavirus'),
('Neumocócica conjugada (13 valente)', 'Neumonía, meningitis, otitis'),
('Neumocócica Polisacárida (23 serotipos)', 'Neumonía, meningitis'),
('Influenza estacional', 'Influenza'),
('DPT (Difteria, bordetella pertusis y tétanos)', 'Difteria, tos ferina, tétanos'),
('SR (Sarampión,rubeola)', 'Sarampión, rubéola'),
('COVID-19', 'COVID-19')
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

-- Insertar Toxicomanías
INSERT INTO cat_toxicomania (nombre) VALUES
('Alcoholismo'), ('Tabaquismo'), ('Ninguna'), ('Otra')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Enfermedades Crónicas
INSERT INTO cat_enfermedad_cronica (nombre) VALUES
('Obesidad'), ('Hipertensión'), ('Diabetes Mellitus tipo 2'), ('Tosedor crónico'), ('Ninguna')
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
