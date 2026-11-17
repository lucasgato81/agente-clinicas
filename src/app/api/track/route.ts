import { NextResponse } from 'next/server';
import { query, isDatabaseConfigured } from '@/lib/db';
import { MOCK_PACKAGES, MOCK_CME_BATCHES } from '@/lib/mockData';
import { checkRateLimit, logLgpdAudit } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Rate limit para evitar scraping massivo de tokens de rastreio (max 30 requisições por minuto)
    const rateCheck = checkRateLimit(`track_${ip}`, 30, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Limite de consultas excedido. Aguarde alguns instantes.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const token = (searchParams.get('token') || '').trim();

    if (!token) {
      return NextResponse.json(
        { error: 'Token de rastreabilidade não informado.' },
        { status: 400 }
      );
    }

    let foundPkg: unknown = null;
    let foundBatch: unknown = null;

    // 1. Tentar buscar no banco de dados PostgreSQL
    if (isDatabaseConfigured()) {
      try {
        const pkgRes = await query(
          `SELECT 
            id, tenant_id, batch_code, short_code, qr_code_token, package_type,
            criticality, description, packaged_at, expires_at, status
           FROM sterile_packages 
           WHERE LOWER(qr_code_token) = LOWER($1) 
              OR LOWER(short_code) = LOWER($1) 
              OR LOWER(id) = LOWER($1) 
           LIMIT 1`,
          [token]
        );

        if (pkgRes.rows.length > 0) {
          const row = pkgRes.rows[0];
          foundPkg = {
            id: row.id,
            tenantId: row.tenant_id,
            batchCode: row.batch_code,
            shortCode: row.short_code,
            qrCodeToken: row.qr_code_token,
            packageType: row.package_type,
            criticality: row.criticality,
            description: row.description,
            packagedAt: row.packaged_at,
            expiresAt: row.expires_at,
            status: row.status,
          };

          const batchRes = await query(
            `SELECT 
              id, batch_code, short_code, cycle_number, autoclave_name,
              started_at, finished_at, temperature_c, pressure_bar,
              cycle_time_min, physical_ok, chemical_class5_ok,
              has_biological, bio_result_ok, status
             FROM cme_batches 
             WHERE batch_code = $1 
             LIMIT 1`,
            [row.batch_code]
          );

          if (batchRes.rows.length > 0) {
            const b = batchRes.rows[0];
            foundBatch = {
              id: b.id,
              batchCode: b.batch_code,
              shortCode: b.short_code,
              cycleNumber: b.cycle_number,
              autoclaveName: b.autoclave_name,
              startedAt: b.started_at,
              finishedAt: b.finished_at,
              temperatureC: Number(b.temperature_c),
              pressureBar: Number(b.pressure_bar),
              cycleTimeMin: b.cycle_time_min,
              physicalOk: b.physical_ok,
              chemicalClass5Ok: b.chemical_class5_ok,
              hasBiological: b.has_biological,
              bioResultOk: b.bio_result_ok,
              status: b.status,
            };
          }
        }
      } catch (dbErr) {
        console.warn('[TRACK API] Erro ao consultar banco:', dbErr);
      }
    }

    // 2. Fallback para catálogo mock se não encontrado no banco
    if (!foundPkg) {
      const mockPkg = MOCK_PACKAGES.find(
        (p) =>
          p.qrCodeToken.toLowerCase() === token.toLowerCase() ||
          p.shortCode.toLowerCase() === token.toLowerCase() ||
          p.id.toLowerCase() === token.toLowerCase()
      );

      if (mockPkg) {
        // Retorna APENAS os dados do pacote SEM vazar dados de outros pacientes
        foundPkg = {
          id: mockPkg.id,
          batchCode: mockPkg.batchCode,
          shortCode: mockPkg.shortCode,
          qrCodeToken: mockPkg.qrCodeToken,
          packageType: mockPkg.packageType,
          criticality: mockPkg.criticality,
          description: mockPkg.description,
          packagedAt: mockPkg.packagedAt,
          expiresAt: mockPkg.expiresAt,
          status: mockPkg.status,
        };

        const mockBatch = MOCK_CME_BATCHES.find((b) => b.batchCode === mockPkg.batchCode);
        if (mockBatch) {
          foundBatch = {
            id: mockBatch.id,
            batchCode: mockBatch.batchCode,
            shortCode: mockBatch.shortCode,
            cycleNumber: mockBatch.cycleNumber,
            autoclaveName: mockBatch.autoclaveName,
            startedAt: mockBatch.startedAt,
            finishedAt: mockBatch.finishedAt,
            temperatureC: mockBatch.temperatureC,
            pressureBar: mockBatch.pressureBar,
            cycleTimeMin: mockBatch.cycleTimeMin,
            physicalOk: mockBatch.physicalOk,
            chemicalClass5Ok: mockBatch.chemicalClass5Ok,
            hasBiological: mockBatch.hasBiological,
            bioResultOk: mockBatch.bioResultOk,
            status: mockBatch.status,
          };
        }
      }
    }

    if (!foundPkg) {
      return NextResponse.json(
        { error: 'Pacote estéril não encontrado com o código fornecido.' },
        { status: 404 }
      );
    }

    // Registrar auditoria LGPD de acesso à rastreabilidade
    await logLgpdAudit({
      action: 'VIEW_TRACE',
      resourceType: 'PACKAGE',
      resourceId: token,
      details: `Consulta pública de rastreabilidade pelo token: ${token}`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      package: foundPkg,
      batch: foundBatch,
    });
  } catch (error) {
    console.error('[TRACK API]', error);
    return NextResponse.json(
      { error: 'Erro ao processar consulta de rastreabilidade.' },
      { status: 500 }
    );
  }
}
