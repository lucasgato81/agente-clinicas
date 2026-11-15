const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://odontoshield_user:r9sgeIST2xigATJ23tqUy5n6Vhb3DaPo@dpg-dbo7mdbrjlhs73al2qt0-a.oregon-postgres.render.com/odontoshield',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Conectado ao PostgreSQL do Render com sucesso!');

    await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_tenants (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        legal_name VARCHAR(255),
        cnpj VARCHAR(30),
        sanitary_license VARCHAR(100),
        license_validity VARCHAR(30),
        cro_registration VARCHAR(50),
        cro_state VARCHAR(10),
        chairs_count INT DEFAULT 2,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        technical_responsible_name VARCHAR(255),
        technical_responsible_cro VARCHAR(50),
        technical_responsible_cpf VARCHAR(30),
        technical_responsible_phone VARCHAR(50),
        technical_responsible_email VARCHAR(255),
        plan_id VARCHAR(50) DEFAULT 'PRO',
        plan_name VARCHAR(100) DEFAULT 'Clínica Pro',
        subscription_status VARCHAR(50) DEFAULT 'TRIAL',
        trial_days_left INT DEFAULT 14,
        monthly_fee NUMERIC DEFAULT 149,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS superadmin_activity_log (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100),
        tenant_name VARCHAR(255),
        user_name VARCHAR(255),
        action_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        pin VARCHAR(10),
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ TODAS AS TABELAS FORAM CRIADAS NO BANCO DE DADOS ODONTOSHIELD NO RENDER!');

    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
    `);
    console.log('Tabelas existentes no banco:', tables.rows.map((t) => t.table_name));
  } catch (err) {
    console.error('Erro na criação das tabelas:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
