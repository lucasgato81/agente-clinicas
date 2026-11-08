import { NextResponse } from 'next/server';
import { query, isDatabaseConfigured, initDatabase } from '@/lib/db';
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

// GET: Sincroniza dados da clínica para computadores e celulares
export async function GET() {
  try {
    await ensureDbInit();

    if (isDatabaseConfigured()) {
      try {
        const [batchesRes, packagesRes, popsRes, incidentsRes, equipRes] = await Promise.all([
          query('SELECT * FROM cme_batches ORDER BY created_at DESC LIMIT 50'),
          query('SELECT * FROM sterile_packages ORDER BY created_at DESC LIMIT 100'),
          query('SELECT * FROM pop_documents ORDER BY code ASC'),
          query('SELECT * FROM safety_incidents ORDER BY created_at DESC LIMIT 50'),
          query('SELECT * FROM clinic_equipments ORDER BY name ASC'),
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

// POST: Recebe atualizações de qualquer aparelho e salva para todos
export async function POST(request: Request) {
  try {
    await ensureDbInit();
    const action = await request.json();

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
                'clinica_01',
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
                'clinica_01',
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
                'clinica_01',
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

      default:
        break;
    }

    return NextResponse.json({ success: true, updatedState: memoryState });
  } catch (error) {
    console.error('[SYNC POST]', error);
    return NextResponse.json({ success: false, error: 'Falha ao salvar ação' }, { status: 500 });
  }
}
