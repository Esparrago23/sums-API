# SUMS API

API REST en TypeScript/Node.js para modelar la Cedula de Microdiagnostico Familiar IMSS-BIENESTAR como datos relacionales, no como expediente clinico.

## Modelo de datos

El modelo corregido esta en `database/schema.dbml`.

Cambios principales:

- `Persona` ya no guarda `familia_id`, `parentesco`, `edad` ni `ingreso` libre.
- La pertenencia familiar se modela con `nucleo_familiar` y `nucleo_persona`.
- `parentesco_id` vive en `nucleo_persona`.
- `Cedula` funciona como registro maestro: unidad de salud, entrevistador, levantamiento, nucleo familiar, fecha, estado y observaciones.
- `Vivienda` apunta a `nucleo_familiar_id` y separa materiales, servicios y animales en tablas normalizadas.
- Estilo de vida se divide en registros por persona: alimentacion, higiene, toxicomanias, enfermedades cronicas, salud preventiva y servicio de salud.
- Vacunacion usa `vacuna`, `cat_dosis`, `esquema_vacunacion` e `inmunizacion`.

## Endpoints principales

Base local:

```txt
http://localhost:3000/sums
```

Documentacion Swagger:

```txt
GET /sums/api-docs
```

Personas:

```txt
POST /personas
GET /personas
GET /personas/:id
PUT /personas/:id
DELETE /personas/:id
```

Nucleo familiar:

```txt
POST /nucleos-familiares
GET /nucleos-familiares
GET /nucleos-familiares/:id
PUT /nucleos-familiares/:id
DELETE /nucleos-familiares/:id
POST /nucleos-familiares/:id/integrantes
GET /nucleos-familiares/:id/integrantes
PATCH /nucleos-familiares/:id/integrantes/:personaId
```

Cedula:

```txt
POST /cedulas
GET /cedulas
GET /cedulas/:id
PUT /cedulas/:id
DELETE /cedulas/:id
```

Vivienda:

```txt
POST /viviendas
GET /viviendas
POST /viviendas-materiales
POST /viviendas-servicios
POST /familias-animales
```

Salud y estilo de vida por persona:

```txt
POST /personas-alimentacion
POST /personas-higiene
POST /personas-toxicomanias
POST /personas-enfermedades-cronicas
POST /personas-salud-preventiva
POST /personas-servicios-salud
```

Vacunacion:

```txt
POST /vacunaciones
GET /vacunaciones
GET /vacunaciones/por-vacuna-dosis
GET /vacunaciones/por-persona/:persona_id
GET /vacunaciones/personas-por-vacuna
GET /vacunaciones/por-anio
GET /vacunaciones/por-rango-edad
GET /vacunaciones/dosis-por-persona
```

Catalogos:

```txt
GET /catalogos
GET /catalogos/:catalogo
```

Catalogos soportados: `estado-civil`, `parentesco`, `lengua`, `escolaridad`, `ocupacion`, `ingreso-salarial`, `discapacidad`, `material`, `tipo-material-vivienda`, `servicio-vivienda`, `manejo-excretas`, `animal`, `toxicomania`, `enfermedad-cronica`, `alimentacion`, `frecuencia-servicio-salud`, `atencion-embarazo`, `vacuna`, `dosis`.

## Validaciones implementadas

- `fecha_nacimiento` es requerida en persona.
- `sexo` solo acepta `masculino` o `femenino`.
- `ingreso` libre se rechaza; debe usarse `ingreso_salarial_id`.
- `CLUES` debe tener 11 caracteres.
- `numero_cuartos` y `numero_habitantes` no pueden ser negativos.
- `frecuencia_dias` de alimentacion debe estar entre 0 y 7.
- Si un tamizaje esta en `true`, su fecha correspondiente es obligatoria.

## Comandos

```bash
npm install
npm run build
npm run dev
```

En PowerShell de Windows puede ser necesario usar `npm.cmd` si la politica de ejecucion bloquea `npm.ps1`:

```powershell
npm.cmd run build
```
