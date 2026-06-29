# Cifrado de datos sensibles en reposo (4º entregable)

La API cifra de forma **transparente** los datos personales sensibles antes de guardarlos en
PostgreSQL y los descifra al leerlos. Portado del patrón "universal" del profesor
(<https://github.com/RodrigoMijangos/encription_pipeline>) a TypeScript y **endurecido con
AES-256-GCM** (la demo original usaba un XOR demostrativo). La demo Python de referencia vive en
[`../sums-cifrado/`](../sums-cifrado).

## Qué se cifra

| Tabla | Columnas cifradas | Modo |
|-------|-------------------|------|
| `persona` | `primer_nombre`, `segundo_nombre`, `apellido_paterno`, `apellido_materno` | aleatorio |
| `direccion` | `calle`, `numero_exterior`, `numero_interior`, `vivienda_referencia` | aleatorio |
| `direccion` | `colonia` | **determinista** |

No se cifran campos operativos/coarse: `codigo_postal`, `localidad`, `manzana`, `asentamiento_id`,
`fecha_nacimiento`, ni catálogos.

## Cómo funciona

- **Núcleo:** [`src/shared/security/encryption.ts`](src/shared/security/encryption.ts) — AES-256-GCM
  (`node:crypto`). Token: `enc::v2::base64(iv|tag|ciphertext)` (aleatorio) o `enc::d2::...`
  (determinista). Clave por tabla derivada con scrypt de `ENCRYPTION_MASTER_KEY`.
- **Registro de campos:** [`src/shared/security/sensitiveFields.ts`](src/shared/security/sensitiveFields.ts)
  — único lugar donde se declara qué columnas se cifran. Los repositorios solo llaman a
  `encryptValue` / `decryptRow`; la cripto queda desacoplada.
- **Idempotente y compatible:** no recifra lo ya cifrado y descifra texto plano tal cual (datos
  previos a la migración siguen leyéndose).

### Por qué `colonia` es determinista

El dashboard agrupa cédulas por colonia (`getCedulasPorColonia`, `GROUP BY d.colonia`). Con cifrado
aleatorio cada fila sería única y el agrupamiento se rompería. El cifrado **determinista** (mismo
texto → mismo token) preserva el `GROUP BY`; la etiqueta se descifra en JS para mostrarse legible.
Compromiso aceptado: revela qué familias comparten colonia (no la identifica individualmente).

### Puntos de lectura adaptados

- `Persona.mapPersona`, `Direccion` (todas las lecturas/`RETURNING`) → `decryptRow`.
- `Vacunacion.getDosisAplicadasPorPersona`: antes hacía `CONCAT_WS` de los 4 nombres en SQL (no se
  puede descifrar una concatenación de ciphertexts); ahora trae los campos por separado y los
  descifra/concatena en JS.
- `EstadisticasOperacion.getCedulasPorColonia`: agrupa por colonia (determinista) y descifra la etiqueta.

## Puesta en marcha (orden importa)

1. **Definir la clave** en `.env` (obligatorio en producción; si no, usa una clave de dev con aviso):
   ```
   ENCRYPTION_MASTER_KEY=<cadena-larga-y-aleatoria>
   ```
   ⚠️ Si cambias esta clave, los datos ya cifrados dejan de poder descifrarse.
2. **Migrar el esquema** (las columnas cifradas necesitan `TEXT`):
   ```bash
   docker compose exec -T db psql -U postgres -d centro_medico_2026 \
     -f - < database/migrations/001_cifrado_campos_sensibles.sql
   ```
   (En BD nuevas no hace falta: `database/schema.sql` ya define esas columnas como `TEXT`.)
3. **Re-cifrar los datos existentes** (los ~4,000 sintéticos ya cargados, idempotente):
   ```bash
   npx ts-node scripts/encrypt_existing_data.ts
   ```
4. Reiniciar la API. Desde aquí, toda escritura cifra y toda lectura descifra automáticamente.

## Verificación

- **Unit (sin BD):** el motor pasó 15/15 pruebas (round-trip, determinista, idempotencia, null-safe,
  agrupación por colonia, reconstrucción de nombre).
- **Typecheck:** `npx tsc --noEmit` sin errores.
- **E2E (con BD):** tras los pasos 1–4, `POST /sums/cedulas/captura-completa` y luego
  `SELECT primer_nombre FROM persona LIMIT 1;` debe mostrar `enc::v2::...`; el `GET` correspondiente
  devuelve el nombre en claro.

## Nota de seguridad / pendientes

- `ENCRYPTION_MASTER_KEY` en `.env` es suficiente para el MVP; en producción usar un gestor de
  secretos / KMS y rotación de claves (re-cifrado con clave nueva).
- La búsqueda/orden por nombre o por los campos de dirección cifrados (aleatorios) no es posible a
  nivel SQL (es el costo esperado del cifrado en reposo). Si se necesita, usar índices ciegos o
  cifrado determinista en ese campo concreto.
