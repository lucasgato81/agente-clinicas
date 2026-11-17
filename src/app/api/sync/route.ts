import { NextResponse } from 'next/server';
import { query, isDatabaseConfigured, initDatabase } from '@/lib/db';
import { getSessionFromRequest, logLgpdAudit } from '@/lib/auth';
import {
  CURRENT_CLINIC,
  MOCK_CME_BATCHES,
  MOCK_PACKAGES,
  MOCK_POPS,
  MOCK_INCIDENTS,
  MOCK_EQUIPMENTS,
  MOCK_TEAM_MEMBERS,
} from '@/lib/mockData';

// Armazenamento em memória do servidor como fallback compartilhado entre usuários
let memoryState = {
  clinic: CURRENT_CLINIC,
  batches: MOCK_CME_BATCHES,
  packages: MOCK_PACKAGES,
  pops: MOCK_POPS,
  incidents: MOCK_INCIDENTS,
  equipments: MOCK_EQUIPMENTS,
  teamMembers: MOCK_TEAM_MEMBERS,
};

let dbInitialized = false;

async function ensureDbInit() {
  if (isDatabaseConfigured() && !dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET: Sincroniza dados da clínica para computadores e celulares (Isolamento Multi-Tenant)
export async function GET(request: Request) {
  try {
    await ensureDbInit();
    const session = getSessionFromRequest(request);
    const tenantId = session?.tenantId;

    if (isDatabaseConfigured() && tenantId) {
      try {
        const [batchesRes, packagesRes, popsRes, incidentsRes, equipRes] = await Promise.all([
          query('SELECT * FROM cme_batches WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 50', [tenantId]),
          query('SELECT * FROM sterile_packages WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100', [tenantId]),
          query('SELECT * FROM pop_documents WHERE tenant_id = $1 ORDER BY code ASC', [tenantId]),
          query('SELECT * FROM safety_incidents WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 50', [tenantId]),
          query('SELECT * FROM clinic_equipments WHERE tenant_id = $1 ORDER BY name ASC', [tenantId]),
        ]);

        // Se houver dados no banco, compor com o estado
        if (batchesRes.rows.length > 0 || packagesRes.rows.length > 0) {
          return NextResponse.json({
            source: 'POSTGRESQL',
            clinic: memoryState.clinic,
            batches: batchesRes.rows.map((r) => ({
              id: r.id,
              batchCode: r.batch_code,
              shortCode: r.short_code,
              cycleNumber: r.cycle_number,
              autoclaveName: r.autoclave_name,
              operatorName: r.operator_name,
              startedAt: r.started_at,
              finishedAt: r.finished_at,
              temperatureC: Number(r.temperature_c),
              pressureBar: Number(r.pressure_bar),
              cycleTimeMin: r.cycle_time_min,
              physicalOk: r.physical_ok,
              chemicalClass5Ok: r.chemical_class5_ok,
              chemicalPhotoUrl: r.chemical_photo_url,
              hasBiological: r.has_biological,
              bioResultOk: r.bio_result_ok,
              bioPhotoUrl: r.bio_photo_url,
              status: r.status,
              packagesCount: r.packages_count,
            })),
            packages: packagesRes.rows.map((p) => ({
              id: p.id,
              batchCode: p.batch_code,
              shortCode: p.short_code,
              qrCodeToken: p.qr_code_token,
              packageType: p.package_type,
              criticality: p.criticality,
              description: p.description,
              packagedAt: p.packaged_at,
              expiresAt: p.expires_at,
              status: p.status,
              patientName: p.patient_name,
              usedAt: p.used_at,
              dentistName: p.dentist_name,
            })),
            pops: memoryState.pops,
            incidents: memoryState.incidents,
            equipments: memoryState.equipments,
            teamMembers: memoryState.teamMembers,
          });
        }
      } catch (err) {
        console.warn('[SYNC API] Erro ao buscar dados do banco, usando fallback:', err);
      }
    }

    // Retornar estado compartilhado
    return NextResponse.json({
      source: 'SERVER_MEMORY',
      clinic: memoryState.clinic,
      batches: memoryState.batches,
      packages: memoryState.packages,
      pops: memoryState.pops,
      incidents: memoryState.incidents,
      equipments: memoryState.equipments,
      teamMembers: memoryState.teamMembers,
    });
  } catch (error) {
    console.error('[SYNC GET]', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar dados da clínica' },
      { status: 500 }
    );
  }
}

// POST: Recebe atualizações de qualquer aparelho e salva para a clínica correta (Multi-Tenant)
export async function POST(request: Request) {
  try {
    await ensureDbInit();
    const session = getSessionFromRequest(request);
    const action = await request.json();
    const tenantId = session?.tenantId || action.payload?.tenantId || 'clinica_01';

    switch (action.type) {
      case 'NEW_BATCH': {
        const batch = action.payload;
        memoryState.batches = [batch, ...memoryState.batches];

        if (isDatabaseConfigured()) {
          try {
            await query(
              `INSERT INTO cme_batches (
                id, tenant_id, batch_code, short_code, cycle_number,
                autoclave_name, operator_name, started_at, temperature_c,
                pressure_bar, cycle_time_min, physical_ok, chemical_class5_ok,
                chemical_photo_url, has_biological, bio_result_ok, bio_photo_url,
                status, packages_count
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
              ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, finished_at = EXCLUDED.finished_at`,
              [
                batch.id,
                tenantId,
                batch.batchCode,
                batch.shortCode,
                batch.cycleNumber,
                batch.autoclaveName,
                batch.operatorName,
                batch.startedAt,
                batch.temperatureC || 134,
                batch.pressureBar || 2.1,
                batch.cycleTimeMin || 45,
                batch.physicalOk ?? true,
                batch.chemicalClass5Ok ?? true,
                batch.chemicalPhotoUrl || null,
                batch.hasBiological ?? false,
                batch.bioResultOk ?? null,
                batch.bioPhotoUrl || null,
                batch.status || 'APPROVED',
                batch.packagesCount || 0,
              ]
            );
          } catch (dbErr) {
            console.error('[SYNC POST NEW_BATCH]', dbErr);
          }
        }
        break;
      }

      case 'USE_PACKAGE': {
        const { qrCodeToken, patientName, dentistName, usedAt } = action.payload;
        memoryState.packages = memoryState.packages.map((pkg) =>
          pkg.qrCodeToken === qrCodeToken
            ? { ...pkg, status: 'USED', patientName, dentistName, usedAt }
            : pkg
        );

        if (isDatabaseConfigured()) {
          try {
            await query(
              `UPDATE sterile_packages 
               SET status = 'USED', patient_name = $1, dentist_name = $2, used_at = $3
               WHERE qr_code_token = $4`,
              [patientName, dentistName, usedAt, qrCodeToken]
            );
          } catch (dbErr) {
            console.error('[SYNC POST USE_PACKAGE]', dbErr);
          }
        }
        break;
      }

      case 'SIGN_POP': {
        const { popId, record } = action.payload;
        memoryState.pops = memoryState.pops.map((p) => {
          if (p.id === popId) {
            const updated = [record, ...p.signatures];
            return {
              ...p,
              signatures: updated,
              signaturesCount: Math.min(p.signaturesCount + 1, p.totalTeamCount),
              status: updated.length >= p.totalTeamCount ? 'COMPLIANT' : p.status,
            };
          }
          return p;
        });
        break;
      }

      case 'SAVE_PHOTO_PROOF': {
        const { popId, evidence } = action.payload;
        memoryState.pops = memoryState.pops.map((p) => {
          if (p.id === popId) {
            return {
              ...p,
              photoEvidences: [evidence, ...(p.photoEvidences || [])],
            };
          }
          return p;
        });

        if (isDatabaseConfigured()) {
          try {
            await query(
              `INSERT INTO pop_photo_evidences (
                id, pop_code, tenant_id, cycle_id, evidence_type, title,
                photo_url, photo_hash_sha256, operator_name, operator_cpf,
                operator_role, operator_cro, validation_status, is_confidential, notes
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
              [
                evidence.evidencia_id,
                evidence.pop_codigo,
                tenantId,
                evidence.ciclo_id || null,
                evidence.tipo_evidencia,
                evidence.titulo_evidencia || null,
                evidence.foto_url,
                evidence.foto_hash_sha256,
                evidence.operador.nome,
                evidence.operador.cpf,
                evidence.operador.funcao,
                evidence.operador.cro || null,
                evidence.status_validacao || 'APROVADO',
                evidence.confidencial ?? false,
                evidence.observacoes || null,
              ]
            );
          } catch (dbErr) {
            console.error('[SYNC POST SAVE_PHOTO_PROOF]', dbErr);
          }
        }
        break;
      }

      case 'NEW_INCIDENT': {
        const incident = action.payload;
        memoryState.incidents = [incident, ...memoryState.incidents];

        if (isDatabaseConfigured()) {
          try {
            await query(
              `INSERT INTO safety_incidents (
                id, tenant_id, reported_at, category, severity,
                affected_type, affected_person_name, affected_person_role,
                description, conduct_taken, preventive_action, reevaluation_date,
                notivisa_notified
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
              [
                incident.id,
                tenantId,
                incident.reportedAt,
                incident.category,
                incident.severity,
                incident.affectedType,
                incident.affectedPersonName,
                incident.affectedPersonRole || null,
                incident.description,
                incident.conductTaken || null,
                incident.preventiveAction,
                incident.reevaluationDate,
                incident.notivisaNotified || false,
              ]
            );
          } catch (dbErr) {
            console.error('[SYNC POST NEW_INCIDENT]', dbErr);
          }
        }
        break;
      }

      case 'CREATE_TENANT': {
        const newClinic = action.payload;
        memoryState.clinic = newClinic;

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
                updated_at = CURRENT_TIMESTAMP`,
              [
                newClinic.id,
                newClinic.name,
                newClinic.legalName || newClinic.name,
                newClinic.cnpj || '',
                newClinic.sanitaryLicense || '',
                newClinic.licenseExpiry || '',
                newClinic.croRegistration || '',
                newClinic.chairsCount || 2,
                newClinic.address || '',
                newClinic.phone || '',
                newClinic.technicalResponsibleName || '',
                newClinic.technicalResponsibleCro || '',
                newClinic.planId || 'PRO',
                newClinic.planName || 'Clínica Pro',
                newClinic.subscriptionStatus || 'TRIAL',
                newClinic.trialDaysLeft || 14,
                newClinic.monthlyFee || 149,
              ]
            );

            await query(
              `INSERT INTO superadmin_activity_log (
                id, tenant_id, tenant_name, user_name, action_type, description
              ) VALUES ($1,$2,$3,$4,$5,$6)`,
              [
                `log_${Date.now()}`,
                newClinic.id,
                newClinic.name,
                newClinic.technicalResponsibleName || 'Responsável Técnico',
                'NEW_TENANT_ONBOARDED',
                `Nova clínica ${newClinic.name} (${newClinic.cnpj}) cadastrada com sucesso.`,
              ]
            );
          } catch (dbErr) {
            console.error('[SYNC POST CREATE_TENANT]', dbErr);
          }
        }
        break;
      }

      case 'CREATE_MEMBER': {
        const member = action.payload;
        memoryState.teamMembers = [member, ...memoryState.teamMembers];

        if (isDatabaseConfigured()) {
          try {
            await query(
              `INSERT INTO clinic_users (
                id, tenant_id, name, email, role, role_name, cpf,
                council_number, council_state, phone, pin, active
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
              ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                role = EXCLUDED.role,
                pin = EXCLUDED.pin`,
              [
                member.id,
                tenantId,
                member.name,
                member.email,
                member.role,
                member.roleName,
                member.cpf || '',
                member.councilNumber || '',
                member.councilState || '',
                member.phone || '',
                member.pin || '1234',
                true,
              ]
            );
          } catch (dbErr) {
            console.error('[SYNC POST CREATE_MEMBER]', dbErr);
          }
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ success: true, updatedState: memoryState });
  } catch (error) {
    console.error('[SYNC POST]', error);
    return NextResponse.json({ success: false, error: 'Falha ao salvar ação' }, { status: 500 });
  }
}
