import { NextResponse } from 'next/server';
import { query, isDatabaseConfigured, initDatabase } from '@/lib/db';
import { isStripeConfigured } from '@/lib/stripe';
import { CURRENT_CLINIC, MOCK_TEAM_MEMBERS, MOCK_CME_BATCHES } from '@/lib/mockData';
import { ClinicTenant } from '@/lib/types';

// Lista em memória como fallback se DATABASE_URL ainda não estiver no Render
const inMemoryTenants: ClinicTenant[] = [
  CURRENT_CLINIC,
  {
    id: 'tenant-demo-02',
    name: 'Clínica Odonto Prime (São Paulo)',
    legalName: 'Odonto Prime Assistência Odontológica Ltda',
    cnpj: '45.192.833/0001-12',
    sanitaryLicense: 'VISA-SP 2026/44120',
    licenseExpiry: '2027-02-10',
    croRegistration: 'SP-CL-19940',
    chairsCount: 4,
    nspRequired: true,
    nspStatus: 'ACTIVE',
    address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
    phone: '11988887777',
    technicalResponsibleName: 'Dra. Camila Vasconcelos',
    technicalResponsibleCro: 'CRO-SP 88123',
    planId: 'PRO',
    planName: 'Clínica Pro',
    subscriptionStatus: 'TRIAL',
    trialDaysLeft: 12,
    monthlyFee: 149,
  },
];

interface ActivityLogItem {
  id: string;
  tenantId: string;
  tenantName: string;
  userName: string;
  actionType: string;
  description: string;
  createdAt: string;
}

const inMemoryActivityLogs: ActivityLogItem[] = [
  {
    id: 'log-1',
    tenantId: 'tenant-odontoshield-01',
    tenantName: 'Clínica OdontoInova',
    userName: 'Dr. Lucas Ribeiro',
    actionType: 'LOGIN',
    description: 'Acessou o sistema pelo computador (PIN bancada)',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    tenantId: 'tenant-odontoshield-01',
    tenantName: 'Clínica OdontoInova',
    userName: 'Maria Silva (ASB)',
    actionType: 'NEW_CYCLE',
    description: 'Finalizou o Ciclo CME #2610-P01 com teste biológico e fita Classe 5',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    tenantId: 'tenant-demo-02',
    tenantName: 'Clínica Odonto Prime',
    userName: 'Dra. Camila Vasconcelos',
    actionType: 'SIGNUP',
    description: 'Nova clínica cadastrada no plano Pro (Trial de 14 dias)',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];

let dbInitialized = false;

async function ensureDb() {
  if (isDatabaseConfigured() && !dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET: Retorna dados para o Painel de SuperAdmin
export async function GET() {
  try {
    await ensureDb();
    const dbConfigured = isDatabaseConfigured();

    let tenants: ClinicTenant[] = [...inMemoryTenants];
    let activityLogs: ActivityLogItem[] = [...inMemoryActivityLogs];
    let totalCycles = MOCK_CME_BATCHES.length;
    let totalUsers = MOCK_TEAM_MEMBERS.length;

    if (dbConfigured) {
      try {
        const [tenantsRes, logsRes, cyclesCountRes, usersCountRes] = await Promise.all([
          query('SELECT * FROM clinic_tenants ORDER BY created_at DESC LIMIT 100'),
          query('SELECT * FROM superadmin_activity_log ORDER BY created_at DESC LIMIT 50'),
          query('SELECT COUNT(*) as count FROM cme_batches'),
          query('SELECT COUNT(*) as count FROM clinic_users'),
        ]);

        if (tenantsRes.rows.length > 0) {
          tenants = tenantsRes.rows.map((row) => ({
            id: row.id,
            name: row.name,
            legalName: row.legal_name || row.name,
            cnpj: row.cnpj || 'Não informado',
            sanitaryLicense: row.sanitary_license || '',
            licenseExpiry: row.license_validity || '',
            croRegistration: row.cro_registration || '',
            chairsCount: row.chairs_count || 2,
            nspRequired: Boolean(row.chairs_count > 3),
            nspStatus: row.chairs_count > 3 ? 'ACTIVE' : 'EXEMPT',
            address: row.address || '',
            phone: row.phone || '',
            technicalResponsibleName: row.technical_responsible_name || '',
            technicalResponsibleCro: row.technical_responsible_cro || '',
            technicalResponsiblePhone: row.technical_responsible_phone || row.phone || '',
            technicalResponsibleEmail: row.technical_responsible_email || row.email || '',
            planId: (row.plan_id as 'SOLO' | 'PRO' | 'ENTERPRISE') || 'PRO',
            planName: row.plan_name || 'Clínica Pro',
            subscriptionStatus: (row.subscription_status as 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED') || 'TRIAL',
            trialDaysLeft: row.trial_days_left ?? 14,
            monthlyFee: Number(row.monthly_fee || 149),
          }));
        }

        if (logsRes.rows.length > 0) {
          activityLogs = logsRes.rows.map((l) => ({
            id: l.id,
            tenantId: l.tenant_id,
            tenantName: l.tenant_name || 'Clínica',
            userName: l.user_name || 'Usuário',
            actionType: l.action_type,
            description: l.description,
            createdAt: l.created_at,
          }));
        }

        if (cyclesCountRes.rows[0]?.count) {
          totalCycles = Number(cyclesCountRes.rows[0].count);
        }
        if (usersCountRes.rows[0]?.count) {
          totalUsers = Number(usersCountRes.rows[0].count);
        }
      } catch (dbErr) {
        console.warn('[ADMIN API] Erro ao consultar banco, usando fallback:', dbErr);
      }
    }

    // Calcular Métricas SaaS
    const totalTenants = tenants.length;
    const trialCount = tenants.filter((t) => t.subscriptionStatus === 'TRIAL').length;
    const activeCount = tenants.filter((t) => t.subscriptionStatus === 'ACTIVE').length;
    const projectedMrr = tenants.reduce((acc, t) => acc + (t.monthlyFee || 149), 0);

    return NextResponse.json({
      success: true,
      database: {
        isConfigured: dbConfigured,
        type: dbConfigured ? 'POSTGRESQL_CLOUD' : 'SERVER_MEMORY_DEMO',
        provider: dbConfigured ? 'Render / Cloud Postgres' : 'Memória Local',
      },
      stripe: {
        isConfigured: isStripeConfigured(),
        webhookUrl: 'https://agente-clinicas.onrender.com/api/stripe/webhook',
      },
      metrics: {
        totalTenants,
        trialCount,
        activeCount,
        projectedMrr,
        totalCycles,
        totalUsers,
      },
      tenants,
      activityLogs,
    });
  } catch (error) {
    console.error('[ADMIN GET ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao carregar dados do SuperAdmin' },
      { status: 500 }
    );
  }
}

// POST: Cadastra ou sincroniza uma nova clínica no SuperAdmin
export async function POST(request: Request) {
  try {
    await ensureDb();
    const body = await request.json();
    const tenant: ClinicTenant = body.tenant || body;

    if (!tenant.name && !tenant.legalName) {
      return NextResponse.json({ error: 'Nome da clínica é obrigatório' }, { status: 400 });
    }

    const tenantId = tenant.id || `clinic_${Date.now()}`;
    const cleanTenant: ClinicTenant = {
      ...tenant,
      id: tenantId,
      subscriptionStatus: tenant.subscriptionStatus || 'TRIAL',
      trialDaysLeft: tenant.trialDaysLeft ?? 14,
      monthlyFee: tenant.monthlyFee || 149,
      planId: tenant.planId || 'PRO',
      planName: tenant.planName || 'Clínica Pro',
    };

    // 1. Guardar em memória
    const existingIndex = inMemoryTenants.findIndex((t) => t.id === tenantId);
    if (existingIndex >= 0) {
      inMemoryTenants[existingIndex] = cleanTenant;
    } else {
      inMemoryTenants.unshift(cleanTenant);
    }

    // Criar log de atividade
    const newLog: ActivityLogItem = {
      id: `log_${Date.now()}`,
      tenantId: cleanTenant.id,
      tenantName: cleanTenant.name,
      userName: cleanTenant.technicalResponsibleName || 'Responsável Técnico',
      actionType: 'NEW_CLINIC_REGISTERED',
      description: `Clínica ${cleanTenant.name} (${cleanTenant.cnpj}) se cadastrou no plano ${cleanTenant.planName}.`,
      createdAt: new Date().toISOString(),
    };
    inMemoryActivityLogs.unshift(newLog);

    // 2. Se banco estiver configurado, salvar no PostgreSQL
    if (isDatabaseConfigured()) {
      try {
        await query(
          `INSERT INTO clinic_tenants (
            id, name, legal_name, cnpj, sanitary_license, license_validity,
            cro_registration, chairs_count, address, phone,
            technical_responsible_name, technical_responsible_cro,
            plan_id, plan_name, subscription_status, trial_days_left, monthly_fee
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            legal_name = EXCLUDED.legal_name,
            phone = EXCLUDED.phone,
            trial_days_left = EXCLUDED.trial_days_left,
            updated_at = CURRENT_TIMESTAMP`,
          [
            cleanTenant.id,
            cleanTenant.name,
            cleanTenant.legalName || cleanTenant.name,
            cleanTenant.cnpj || '',
            cleanTenant.sanitaryLicense || '',
            cleanTenant.licenseExpiry || '',
            cleanTenant.croRegistration || '',
            cleanTenant.chairsCount || 2,
            cleanTenant.address || '',
            cleanTenant.phone || '',
            cleanTenant.technicalResponsibleName || '',
            cleanTenant.technicalResponsibleCro || '',
            cleanTenant.planId || 'PRO',
            cleanTenant.planName || 'Clínica Pro',
            cleanTenant.subscriptionStatus || 'TRIAL',
            cleanTenant.trialDaysLeft || 14,
            cleanTenant.monthlyFee || 149,
          ]
        );

        await query(
          `INSERT INTO superadmin_activity_log (
            id, tenant_id, tenant_name, user_name, action_type, description
          ) VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            newLog.id,
            newLog.tenantId,
            newLog.tenantName,
            newLog.userName,
            newLog.actionType,
            newLog.description,
          ]
        );
      } catch (dbErr) {
        console.error('[ADMIN POST DB ERROR]', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Clínica cadastrada e monitorada com sucesso no SuperAdmin',
      tenant: cleanTenant,
    });
  } catch (error) {
    console.error('[ADMIN POST ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao cadastrar clínica' },
      { status: 500 }
    );
  }
}

// PATCH: Atualiza dados de trial ou ativação da clínica pelo SuperAdmin
export async function PATCH(request: Request) {
  try {
    await ensureDb();
    const { tenantId, action, extraDays, newStatus } = await request.json();

    const tenant = inMemoryTenants.find((t) => t.id === tenantId);
    if (tenant) {
      if (action === 'EXTEND_TRIAL') {
        tenant.trialDaysLeft = (tenant.trialDaysLeft || 0) + (extraDays || 14);
        tenant.subscriptionStatus = 'TRIAL';
      } else if (action === 'ACTIVATE') {
        tenant.subscriptionStatus = 'ACTIVE';
      } else if (newStatus) {
        tenant.subscriptionStatus = newStatus;
      }
    }

    if (isDatabaseConfigured()) {
      try {
        if (action === 'EXTEND_TRIAL') {
          await query(
            'UPDATE clinic_tenants SET trial_days_left = trial_days_left + $1, subscription_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            [extraDays || 14, 'TRIAL', tenantId]
          );
        } else if (action === 'ACTIVATE') {
          await query(
            'UPDATE clinic_tenants SET subscription_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['ACTIVE', tenantId]
          );
        }
      } catch (dbErr) {
        console.error('[ADMIN PATCH DB ERROR]', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status da clínica atualizado pelo SuperAdmin',
      tenant,
    });
  } catch (error) {
    console.error('[ADMIN PATCH ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar clínica' },
      { status: 500 }
    );
  }
}
