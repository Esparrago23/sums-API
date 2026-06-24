import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  template: string;
  sslmode: string;
}

function loadDBConfig(): DBConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.DB_EXTERNAL_PORT || '5432', 10),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    template: process.env.DB_TEMPLATE || '',
    sslmode: process.env.DB_SSLMODE || 'disable',
  };
}

// Controla el modo de prueba - false en producción
const IS_TEST_MODE = false;

class Conn_PostgreSQL {
  private pool!: Pool;
  private config: DBConfig;
  private currentYear: number;
  private initialized: boolean = false;
  private initializationError: Error | null = null;

  constructor() {
    this.config = loadDBConfig();
    this.currentYear = new Date().getFullYear();

    // Creamos un pool temporal para tener algo inicializado inmediatamente
    this.pool = this.createTempPool();

    // Inicia con reintentos hasta conectar
    this.initializeWithRetry();
  }

  // Inicializa con reintentos cada 5 segundos hasta conectar (máx 60s)
  private async initializeWithRetry(): Promise<void> {
    const maxAttempts = 12;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.ensureDatabaseForCurrentYear();

        // Cerramos el pool temporal
        if (this.pool) {
          this.pool.end().catch(() => {});
        }

        // Creamos el pool real
        this.pool = this.connectToYearDB(this.currentYear);
        this.listenToPool();
        this.initialized = true;
        console.log(`✅ Conexión inicial establecida a centro_medico_${this.currentYear}`);

        // Configura intervalo para verificar cambios de año
        const interval = IS_TEST_MODE ? 1 * 60 * 1000 : 60 * 60 * 1000;
        setInterval(() => this.checkAndUpdateConnection(), interval);
        return;
      } catch (err: any) {
        console.error(`❌ Intento ${attempt}/${maxAttempts} fallido:`, err.message || err);
        if (attempt < maxAttempts) {
          console.log(`⏳ Reintentando en 5 segundos...`);
          await new Promise(res => setTimeout(res, 5000));
        } else {
          console.error('❌ No se pudo conectar a la base de datos después de todos los intentos.');
          this.initializationError = err instanceof Error ? err : new Error(String(err));
          this.initialized = true;
        }
      }
    }
  }

  // Crea un pool temporal a postgres hasta conectar a la BD del año
  private createTempPool(): Pool {
    return new Pool({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: 'postgres',
      ssl: this.config.sslmode !== 'disable' ? { rejectUnauthorized: false } : undefined,
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
  }

  private listenToPool() {
    this.pool.on('connect', () => {
      console.log(`✅ Conexión establecida a centro_medico_${this.currentYear}`);
    });

    this.pool.on('error', (err) => {
      console.error('❌ Error en la conexión a la base de datos:', err);
      setTimeout(() => {
        console.log('🔄 Intentando reconexión...');
        this.pool = this.connectToYearDB(this.currentYear);
        this.listenToPool();
      }, 5000);
    });
  }

  private connectToYearDB(year: number): Pool {
    const dbName = `centro_medico_${year}`;
    return new Pool({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: dbName,
      ssl: this.config.sslmode !== 'disable' ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  private async checkAndUpdateConnection(): Promise<void> {
    try {
      const now = new Date();
      const simulatedYear = IS_TEST_MODE
        ? this.currentYear + (now.getSeconds() >= 30 ? 1 : 0)
        : now.getFullYear();

      if (simulatedYear !== this.currentYear) {
        console.log(`🔄 Cambio de año detectado: ${this.currentYear} -> ${simulatedYear}`);
        try {
          await this.ensureYearDatabase(simulatedYear);
          await this.pool.end();
          this.currentYear = simulatedYear;
          this.pool = this.connectToYearDB(simulatedYear);
          this.listenToPool();
          console.log(`🔁 Pool actualizado para el año ${simulatedYear}`);

          try {
            await this.ensureYearDatabase(this.currentYear + 1);
          } catch (nextYearError) {
            console.warn(`⚠️ No se pudo preparar BD para ${this.currentYear + 1}`);
            setTimeout(() => {
              this.ensureYearDatabase(this.currentYear + 1).catch(err =>
                console.error(`❌ Error en reintento para BD ${this.currentYear + 1}:`, err)
              );
            }, 30 * 60 * 1000);
          }
        } catch (yearError) {
          console.error(`❌ Error al cambiar al año ${simulatedYear}:`, yearError);
        }
      } else {
        const isLastMonthOfYear = now.getMonth() === 11;
        if (IS_TEST_MODE || isLastMonthOfYear) {
          try {
            await this.ensureYearDatabase(this.currentYear + 1);
          } catch (error) {
            console.warn(`⚠️ No se pudo verificar BD para ${this.currentYear + 1}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error durante la verificación de conexión:', error);
    }
  }

  async ensureDatabaseForCurrentYear(): Promise<void> {
    const now = new Date();
    const currentYear = now.getFullYear();

    await this.ensureYearDatabase(currentYear);

    const isLastMonthOfYear = now.getMonth() === 11;
    if (IS_TEST_MODE || isLastMonthOfYear) {
      await this.ensureYearDatabase(currentYear + 1);
      console.log(`🛠️ Base de datos del próximo año (${currentYear + 1}) verificada`);
    }
  }

  private async ensureYearDatabase(year: number): Promise<void> {
    const dbName = `centro_medico_${year}`;
    const host = this.config.host.replace('-pooler', '');

    const client = new Client({
      host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: 'postgres',
      ssl: this.config.sslmode !== 'disable' ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 30000,
    });

    try {
      await client.connect();

      const result = await client.query(
        'SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)',
        [dbName]
      );

      if (!result.rows[0].exists) {
        console.log(`⚙️ Creando base de datos: ${dbName} desde plantilla ${this.config.template}`);

        let created = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await this.forceDisconnectTemplate(client, this.config.template);
            await new Promise(res => setTimeout(res, 1000 * attempt));

            await client.query(`ALTER DATABASE "${this.config.template}" ALLOW_CONNECTIONS true`);
            await client.query(`CREATE DATABASE "${dbName}" TEMPLATE "${this.config.template}"`);

            console.log(`✅ Base ${dbName} creada exitosamente en intento ${attempt}`);
            created = true;
            break;
          } catch (err: any) {
            if (err.code === '42P04' || err.code === '23505') {
              console.log(`ℹ️ La base ${dbName} ya existe.`);
              created = true;
              break;
            }
            console.error(`❌ Intento ${attempt} fallido:`, err);
            if (err.code === '55006') {
              const waitTime = 2000 * attempt;
              console.log(`⏳ Esperando ${waitTime / 1000}s antes del siguiente intento...`);
              await new Promise(res => setTimeout(res, waitTime));
            }
          }
        }

        if (!created) {
          throw new Error(`No se pudo crear la base ${dbName} después de 3 intentos`);
        }
      } else {
        console.log(`ℹ️ La base de datos ${dbName} ya existe`);
      }
    } catch (error) {
      console.error(`❌ Error al verificar/crear la base de datos ${dbName}:`, error);
      throw error;
    } finally {
      try {
        await client.end();
      } catch (e) {
        console.error('Error al cerrar cliente:', e);
      }
    }
  }

  private async forceDisconnectTemplate(client: Client, templateName: string): Promise<void> {
    try {
      console.log(`🔌 Intentando desconectar usuarios de la plantilla ${templateName}...`);

      const activeConnections = await client.query(`
        SELECT count(*) as count
        FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()
      `, [templateName]);

      const connectionCount = parseInt(activeConnections.rows[0].count, 10);
      if (connectionCount > 0) {
        console.log(`⚠️ Hay ${connectionCount} conexiones activas a ${templateName}`);
      }

      await client.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()
      `, [templateName]);

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        await client.query(`ALTER DATABASE "${templateName}" ALLOW_CONNECTIONS false`);
        console.log(`🔒 Conexiones desactivadas para ${templateName}`);
      } catch (alterError: any) {
        console.warn(`⚠️ No se pudo desactivar conexiones a ${templateName}: ${alterError.message}`);
      }
    } catch (error) {
      console.error(`❌ Error al desconectar usuarios de ${templateName}:`, error);
    }
  }

  async executePreparedQuery(query: string, values: any[] = []): Promise<any> {
    if (!this.initialized) {
      await this.waitForInitialization();
    }
    if (this.initializationError) {
      throw new Error(`Base de datos no disponible: ${this.initializationError.message}`);
    }

    const client = await this.pool.connect();
    try {
      const result = await client.query(query, values);
      return result;
    } catch (error) {
      console.error('Error ejecutando consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async fetchRows(query: string, values: any[] = []): Promise<any> {
    if (!this.initialized) {
      await this.waitForInitialization();
    }
    if (this.initializationError) {
      throw new Error(`Base de datos no disponible: ${this.initializationError.message}`);
    }

    const client = await this.pool.connect();
    try {
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener filas:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async waitForInitialization(): Promise<void> {
    console.log('⏳ Esperando inicialización de la conexión...');
    return new Promise<void>((resolve) => {
      const checkInitialized = () => {
        if (this.initialized) {
          resolve();
        } else {
          setTimeout(checkInitialized, 100);
        }
      };
      checkInitialized();
    });
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('🔒 Conexión a la base de datos cerrada');
    }
  }
}

// Exporta una instancia única de la conexión
export const db = new Conn_PostgreSQL();

// Manejo de cierre adecuado
process.on('SIGINT', async () => {
  console.log('Cerrando aplicación...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Terminando aplicación...');
  await db.close();
  process.exit(0);
});
