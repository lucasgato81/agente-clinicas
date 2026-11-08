import { Pool } from 'pg';

// Configuração do pool de conexões PostgreSQL
// No Render, a variável DATABASE_URL é fornecida automaticamente
const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

if (connectionString) {
  // Configuração compatível com Render, Neon, Supabase e Postgres local
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

export const getDbPool = () => pool;
export const isDatabaseConfigured = () => Boolean(pool);

// Executa uma query segura com tratamento de erros
export async function query(text: string, params?: unknown[]) {
  if (!pool) {
    return { rows: [] };
  }
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Inicializador de tabelas e schema caso não existam
export async function initDatabase() {
  if (!pool) {
    console.log('[DB] DATABASE_URL não configurada. Operando em modo de dados local/memória.');
    return;
  }

  try {
    console.log('[DB] Verificando e inicializando tabelas no PostgreSQL...');

    await query(`
      CREATE TABLE IF NOT EXISTS clinic_tenants (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        legal_name VARCHAR(255),
        cnpj VARCHAR(30),
        sanitary_license VARCHAR(100),
        license_validity VARCHAR(30),
        cro_registration VARCHAR(50),
        cro_state VARCHAR(10),
        technical_responsible_name VARCHAR(255),
        technical_responsible_cro VARCHAR(50),
        technical_responsible_cpf VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS clinic_users (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        role_name VARCHAR(100),
        cpf VARCHAR(30),
        council_number VARCHAR(50),
        council_state VARCHAR(10),
        phone VARCHAR(30),
        pin VARCHAR(10), -- PIN de 4 dígitos para bancada
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cme_batches (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        batch_code VARCHAR(100) NOT NULL,
        short_code VARCHAR(50),
        cycle_number INT,
        autoclave_name VARCHAR(100),
        operator_name VARCHAR(255),
        operator_id VARCHAR(100),
        started_at VARCHAR(50),
        finished_at VARCHAR(50),
        temperature_c NUMERIC,
        pressure_bar NUMERIC,
        cycle_time_min INT,
        physical_ok BOOLEAN DEFAULT TRUE,
        chemical_class5_ok BOOLEAN DEFAULT TRUE,
        chemical_photo_url TEXT,
        has_biological BOOLEAN DEFAULT FALSE,
        bio_result_ok BOOLEAN,
        bio_photo_url TEXT,
        status VARCHAR(50) DEFAULT 'APPROVED',
        packages_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sterile_packages (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        batch_code VARCHAR(100) NOT NULL,
        short_code VARCHAR(50),
        qr_code_token VARCHAR(100) UNIQUE NOT NULL,
        package_type VARCHAR(100),
        criticality VARCHAR(50) DEFAULT 'CRITICAL',
        description TEXT,
        packaged_at VARCHAR(50),
        expires_at VARCHAR(50),
        status VARCHAR(50) DEFAULT 'STERILIZED',
        patient_name VARCHAR(255),
        used_at VARCHAR(50),
        dentist_name VARCHAR(255),
        kit_template_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pop_documents (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        code VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        version INT DEFAULT 1,
        approved_by_rt VARCHAR(255),
        rt_cro VARCHAR(50),
        rt_cro_state VARCHAR(10),
        approval_date VARCHAR(50),
        review_due VARCHAR(50),
        validity_biennial VARCHAR(150),
        summary TEXT,
        prohibition_callout TEXT,
        content_markdown TEXT,
        file_sha256 VARCHAR(100),
        signatures_count INT DEFAULT 0,
        total_team_count INT DEFAULT 5,
        status VARCHAR(50) DEFAULT 'COMPLIANT',
        requires_photo_proof BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pop_signatures (
        id VARCHAR(100) PRIMARY KEY,
        pop_id VARCHAR(100) REFERENCES pop_documents(id) ON DELETE CASCADE,
        collaborator_name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        cpf VARCHAR(30),
        council_number VARCHAR(50),
        council_state VARCHAR(10),
        signed_at VARCHAR(50),
        ip_address VARCHAR(50),
        sha256_hash VARCHAR(100),
        signature_data_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pop_photo_evidences (
        id VARCHAR(100) PRIMARY KEY,
        pop_code VARCHAR(50) NOT NULL,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        cycle_id VARCHAR(100),
        evidence_type VARCHAR(100) NOT NULL,
        title VARCHAR(255),
        photo_url TEXT,
        photo_hash_sha256 VARCHAR(100),
        operator_name VARCHAR(255),
        operator_cpf VARCHAR(30),
        operator_role VARCHAR(100),
        operator_cro VARCHAR(50),
        validation_status VARCHAR(50) DEFAULT 'APROVADO',
        is_confidential BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS safety_incidents (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        reported_at VARCHAR(50),
        category VARCHAR(150),
        severity VARCHAR(50),
        affected_type VARCHAR(50),
        affected_person_name VARCHAR(255),
        affected_person_role VARCHAR(100),
        description TEXT,
        conduct_taken TEXT,
        preventive_action TEXT,
        reevaluation_date VARCHAR(50),
        reevaluation_status VARCHAR(50) DEFAULT 'PENDING',
        notivisa_notified BOOLEAN DEFAULT FALSE,
        notivisa_protocol VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS clinic_equipments (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) REFERENCES clinic_tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        brand VARCHAR(100),
        model VARCHAR(100),
        serial_number VARCHAR(100),
        location_room VARCHAR(100),
        last_maintenance VARCHAR(50),
        next_maintenance VARCHAR(50),
        days_remaining INT DEFAULT 365,
        status VARCHAR(50) DEFAULT 'OK',
        has_laudo BOOLEAN DEFAULT TRUE,
        technician_name VARCHAR(255),
        technician_phone VARCHAR(50),
        thermal_qualification_date VARCHAR(50),
        nr13_hydrostatic_test_date VARCHAR(50),
        nr13_safety_valve_calibration VARCHAR(50),
        radiation_survey_date VARCHAR(50),
        head_leakage_test_date VARCHAR(50),
        medical_physicist_name VARCHAR(255),
        medical_physicist_register VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('[DB] Tabelas PostgreSQL verificadas com sucesso!');
  } catch (error) {
    console.error('[DB] Erro ao inicializar tabelas PostgreSQL:', error);
  }
}
