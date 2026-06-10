# Docker

La composicion levanta PostgreSQL y la API. En la primera ejecucion,
PostgreSQL crea `sums_template` desde `database/schema.sql`; despues la API
clona esa plantilla como `centro_medico_<anio_actual>`.

## Inicio

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
curl http://localhost:3000/sums/ping
```

Swagger queda disponible en:

```text
http://localhost:3000/sums/api-docs
```

## Reinicializar la base

Los scripts de `/docker-entrypoint-initdb.d` solo se ejecutan cuando el
volumen de PostgreSQL esta vacio. Para recrear la plantilla y la base anual:

```bash
docker compose down -v
docker compose up --build -d
```

Este comando elimina todos los datos guardados en el volumen.

## Nota sobre el modelo

`database/schema.sql` fue generado desde `database/schema.dbml`. El modelo
DBML normalizado no contiene algunas tablas y columnas que todavia usan
repositorios heredados, por ejemplo `usuario`, `salud_familiar`,
`servicios_basicos`, `servicios_salud`, `educacion`, `estilo_vida`,
`miembro_familia`, `materiales_vivienda` y `convivencia_animales`.

El contenedor y la conexion pueden iniciar correctamente, pero los endpoints
que dependan de esas estructuras heredadas fallaran hasta alinear su SQL con
el DBML o incorporar esas estructuras al esquema.
