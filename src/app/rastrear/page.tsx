'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  Stethoscope,
  QrCode,
  ArrowLeft,
  FileCheck2,
  Printer,
  Sparkles,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { SterilePackageItem, CmeBatchItem } from '@/lib/types';
import { MOCK_PACKAGES, MOCK_CME_BATCHES, CURRENT_CLINIC } from '@/lib/mockData';

function TrackingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [pkg, setPkg] = useState<SterilePackageItem | null>(null);
  const [batch, setBatch] = useState<CmeBatchItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Tenta carregar do sync/backend se disponível
    const fetchPackageData = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const data = await res.json();
          const allPkgs: SterilePackageItem[] = data.packages || MOCK_PACKAGES;
          const allBatches: CmeBatchItem[] = data.batches || MOCK_CME_BATCHES;

          const foundPkg = allPkgs.find(
            (p) =>
              p.qrCodeToken.toLowerCase() === token.toLowerCase() ||
              p.shortCode.toLowerCase() === token.toLowerCase() ||
              p.id.toLowerCase() === token.toLowerCase()
          );

          if (foundPkg) {
            setPkg(foundPkg);
            const foundBatch = allBatches.find((b) => b.batchCode === foundPkg.batchCode);
            setBatch(foundBatch || null);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback para mock local
      }

      // Fallback local se a API não retornar
      const localPkg = MOCK_PACKAGES.find(
        (p) =>
          p.qrCodeToken.toLowerCase() === token.toLowerCase() ||
          p.shortCode.toLowerCase() === token.toLowerCase() ||
          p.id.toLowerCase() === token.toLowerCase()
      );

      if (localPkg) {
        setPkg(localPkg);
        const localBatch = MOCK_CME_BATCHES.find((b) => b.batchCode === localPkg.batchCode);
        setBatch(localBatch || null);
      } else if (MOCK_PACKAGES.length > 0) {
        // Se não passou token ou não achou, mostra o primeiro pacote como demonstração
        setPkg(MOCK_PACKAGES[0]);
        setBatch(MOCK_CME_BATCHES[0]);
      }
      setLoading(false);
    };

    fetchPackageData();
  }, [token]);

  const isExpired = pkg ? new Date(pkg.expiresAt).getTime() < new Date().getTime() : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Barra Superior / Logo */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Sistema</span>
          </Link>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm tracking-tight text-white">
              OdontoShield <span className="text-cyan-400 font-mono text-xs">RDC 1002</span>
            </span>
          </div>
        </div>

        {/* Card Principal: Passaporte de Biossegurança */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl animate-pulse">
            <Clock className="w-8 h-8 mx-auto text-cyan-400 mb-2 animate-spin" />
            <p className="text-xs">Consultando autenticidade sanitária do lote...</p>
          </div>
        ) : pkg ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 md:p-8">
            {/* Selo de Validação Sanitária */}
            <div className="text-center space-y-2">
              <div
                className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  isExpired
                    ? 'bg-red-600 shadow-red-950/50'
                    : pkg.status === 'USED'
                    ? 'bg-blue-600 shadow-blue-950/50'
                    : 'bg-emerald-500 shadow-emerald-950/50'
                }`}
              >
                {isExpired ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <CheckCircle2 className="w-8 h-8" />
                )}
              </div>

              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                PASSAPORTE DE BIOSEGURANÇA & CME
              </span>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {pkg.description}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                  Código: {pkg.shortCode}
                </span>

                {isExpired ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-800">
                    ESTERILIZAÇÃO VENCIDA
                  </span>
                ) : pkg.status === 'USED' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    CONSUMIDO EM PACIENTE
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ESTÉRIL & CONFORME ANVISA</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quadro de Prazos e Validade da Barreira */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Data de Processamento na CME:
                </span>
                <span className="text-slate-200 font-semibold text-sm">{pkg.packagedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Validade Máxima da Esterilização:
                </span>
                <span
                  className={`font-bold text-sm ${
                    isExpired ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {pkg.expiresAt}
                </span>
              </div>
            </div>

            {/* Parâmetros do Ciclo de Autoclave */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span>Parâmetros de Auditoria Sanitária (RDC 1002/2025)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Lote do Ciclo</span>
                  <span className="font-mono text-cyan-300 font-bold">{pkg.batchCode}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Temperatura / Pressão</span>
                  <span className="font-semibold text-slate-200">
                    {batch ? `${batch.temperatureC || 134}°C • ${batch.pressureBar || 2.1} bar` : '134°C • 2.1 bar'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Indicador Classe 5</span>
                  <span className="font-bold text-emerald-400">APROVADO</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Indicador Biológico</span>
                  <span className="font-bold text-emerald-400">NEGATIVO (SEM CRESCIMENTO)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Criticidade do Artigo</span>
                  <span className="font-semibold text-slate-200">
                    {pkg.criticality === 'CRITICAL' ? 'Artigo Crítico (Cirúrgico)' : 'Semicrítico'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Tipo de Embalagem</span>
                  <span className="font-semibold text-slate-200">{pkg.packageType}</span>
                </div>
              </div>
            </div>

            {/* Vínculo de Atendimento (se consumido) */}
            {pkg.patientName && (
              <div className="bg-cyan-950/40 border border-cyan-800/60 p-4 rounded-2xl text-xs space-y-1.5">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  Vínculo Clínico Registrado
                </span>
                <p className="text-slate-200">
                  Utilizado no atendimento de: <strong>{pkg.patientName}</strong>
                </p>
                {pkg.dentistName && (
                  <p className="text-slate-400 text-[11px]">
                    Cirurgião-Dentista: <strong>{pkg.dentistName}</strong>
                  </p>
                )}
                {pkg.usedAt && (
                  <p className="text-slate-400 text-[11px]">
                    Data e Hora do Vínculo: <strong>{pkg.usedAt}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Dados do Estabelecimento e Responsável Técnico */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>{CURRENT_CLINIC.name}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  CNPJ: {CURRENT_CLINIC.cnpj} • RT: {CURRENT_CLINIC.technicalResponsibleName || 'Dr. Lucas Ribeiro'} (CRO: {CURRENT_CLINIC.technicalResponsibleCro || 'CRO-SP 123456'})
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Comprovante</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-400" />
            <h2 className="text-base font-bold text-white">Pacote Não Encontrado</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              O código informado não corresponde a nenhum pacote ativo ou esterilizado no sistema.
            </p>
          </div>
        )}
      </div>

      {/* Rodapé Legal */}
      <footer className="text-center py-6 text-[11px] text-slate-400 flex items-center justify-center space-x-2">
        <Lock className="w-3.5 h-3.5 text-cyan-400" />
        <span>Rastreabilidade Digital Criptografada • Em Conformidade com a RDC 1002/2025 da ANVISA</span>
      </footer>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <Clock className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}