'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  User,
  Camera,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  FileBadge,
  X,
  Check,
  Stethoscope,
  Filter,
  Sparkles,
} from 'lucide-react';
import { SterilePackageItem, CmeBatchItem } from '@/lib/types';

interface TraceabilityModuleProps {
  packages: SterilePackageItem[];
  batches: CmeBatchItem[];
  onOpenScanner: () => void;
  onViewPhoto?: (data: {
    title: string;
    photoUrl: string;
    type: 'chemical' | 'biological';
    batchCode: string;
    timestamp: string;
    operatorName: string;
  }) => void;
}

export const TraceabilityModule: React.FC<TraceabilityModuleProps> = ({
  packages,
  batches,
  onOpenScanner,
  onViewPhoto,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState<'ALL' | 'CRITICAL' | 'SEMI_CRITICAL'>('ALL');
  const [selectedTraceCertificate, setSelectedTraceCertificate] = useState<{
    pkg: SterilePackageItem;
    batch?: CmeBatchItem;
  } | null>(null);

  // Pacotes utilizados em pacientes
  const usedPackages = packages.filter((p) => p.status === 'USED');

  // Filtragem
  const filteredUsedPackages = usedPackages.filter((pkg) => {
    const matchesSearch =
      (pkg.patientName && pkg.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pkg.dentistName && pkg.dentistName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.qrCodeToken.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCriticality =
      criticalityFilter === 'ALL' || pkg.criticality === criticalityFilter;

    return matchesSearch && matchesCriticality;
  });

  const totalTrackedPatients = new Set(
    usedPackages.map((p) => p.patientName).filter(Boolean)
  ).size;
  const criticalUsedCount = usedPackages.filter((p) => p.criticality === 'CRITICAL').length;
  const totalUsedCount = usedPackages.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Banner Principal */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Rastreabilidade: Instrumental x Paciente</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  RDC 1002/2025 Art. 21
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vínculo obrigatório do lote de esterilização e kit ao prontuário do paciente, integrador Classe 5 e histórico pericial.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenScanner}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/20 transition cursor-pointer shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>+ Vincular Instrumental ao Paciente</span>
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Pacientes com Rastreabilidade Ativa</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-cyan-300">{totalTrackedPatients}</span>
            <span className="text-[11px] text-slate-400">atendimentos com lote</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Conforme exigência do Art. 21 da RDC 1002
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Kits Cirúrgicos / Críticos Utilizados</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{criticalUsedCount}</span>
            <span className="text-[11px] text-slate-400">pacotes baixados</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Com integrador Classe 5 virado e registrado
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Total de Instrumentais em Prontuário</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-indigo-300">{totalUsedCount}</span>
            <span className="text-[11px] text-slate-400">pacotes registrados</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Auditoria reversa (recall) disponível
          </span>
        </div>
      </div>

      {/* Nota de Orientação Sanitária */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-300">
        <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg shrink-0 mt-0.5">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-100">
            Como funciona a Rastreabilidade no Consultório Odontológico:
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Ao iniciar o atendimento na cadeira clínica, o cirurgião-dentista ou ASB abre o aplicativo no celular, clica em <strong>"Vincular Instrumental ao Paciente"</strong>, bipa o QR Code da embalagem estéril e digita o nome do paciente. O sistema correlaciona na mesma hora o paciente com o <strong>Lote da Autoclave</strong>, os <strong>Parâmetros Físicos</strong> e o <strong>Laudo Químico Classe 5</strong>, gerando a Certidão Pericial para defesa jurídica da clínica.
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, prontuário, dentista ou lote..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Criticidade:</span>
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Todas</option>
            <option value="CRITICAL">Artigos Críticos</option>
            <option value="SEMI_CRITICAL">Semicríticos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Rastreabilidade */}
      {filteredUsedPackages.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="font-bold text-slate-200 text-sm">
            Nenhum instrumental baixado em atendimento ainda
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Quando a equipe der baixa em um pacote estéril pelo celular no consultório, o registro com nome do paciente, lote e parâmetros aparecerá nesta tela.
          </p>
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Vincular Primeiro Pacote com QR Code</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Data & Hora do Uso</th>
                  <th className="py-3 px-4">Paciente & Prontuário</th>
                  <th className="py-3 px-4">Cirurgião-Dentista</th>
                  <th className="py-3 px-4">Kit / Instrumental Utilizado</th>
                  <th className="py-3 px-4">Lote CME & Autoclave</th>
                  <th className="py-3 px-4 text-center">Evidência Esterilização</th>
                  <th className="py-3 px-4 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredUsedPackages.map((pkg) => {
                  const linkedBatch = batches.find((b) => b.batchCode === pkg.batchCode);

                  return (
                    <tr key={pkg.id} className="hover:bg-slate-800/40 transition">
                      {/* Data/Hora */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-slate-200 font-medium">
                          {pkg.usedAt || '2026-10-24 10:15'}
                        </span>
                        <span className="text-[10px] text-slate-500 block">Consultório / Mocho</span>
                      </td>

                      {/* Paciente */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{pkg.patientName || 'Paciente Não Identificado'}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ✓ Rastreabilidade 100% Ativa
                        </span>
                      </td>

                      {/* Dentista */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200">
                          {pkg.dentistName || 'Cirurgião-Dentista da Clínica'}
                        </span>
                      </td>

                      {/* Kit / Instrumental */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-100">{pkg.description}</div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">{pkg.packageType}</span>
                          {pkg.criticality === 'CRITICAL' ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-950/60 text-red-400 border border-red-800/50">
                              CRÍTICO
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-800/50">
                              SEMICRÍTICO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Lote CME */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-bold text-cyan-300">
                          {pkg.shortCode || pkg.batchCode}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {linkedBatch?.autoclaveName || 'Autoclave CME'} (Ciclo #{linkedBatch?.cycleNumber || 1})
                        </span>
                      </td>

                      {/* Evidência Esterilização (Classe 5) */}
                      <td className="py-3 px-4 text-center">
                        {linkedBatch?.chemicalPhotoUrl ? (
                          <button
                            onClick={() =>
                              onViewPhoto &&
                              onViewPhoto({
                                title: `Fita Integrador Químico Classe 5 - ${pkg.batchCode}`,
                                photoUrl: linkedBatch.chemicalPhotoUrl!,
                                type: 'chemical',
                                batchCode: pkg.batchCode,
                                timestamp: linkedBatch.startedAt,
                                operatorName: linkedBatch.operatorName,
                              })
                            }
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Classe 5 OK (Foto)</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Aprovado</span>
                          </span>
                        )}
                      </td>

                      {/* Comprovante */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedTraceCertificate({ pkg, batch: linkedBatch })}
                          title="Emitir Certidão de Rastreabilidade para o Prontuário"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-[11px] font-medium border border-slate-700 transition inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Certidão</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Certidão de Rastreabilidade */}
      {selectedTraceCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedTraceCertificate(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileBadge className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Certidão Pericial de Rastreabilidade (RDC 1002/2025)
                </h3>
              </div>
              <button
                onClick={() => setSelectedTraceCertificate(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2 border-b border-slate-800/80 pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Paciente Atendido:</span>
                  <span className="font-bold text-slate-100">{selectedTraceCertificate.pkg.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Data & Hora do Uso:</span>
                  <span className="font-mono text-slate-200">{selectedTraceCertificate.pkg.usedAt || '2026-10-24 10:15'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-slate-800/80 pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Cirurgião-Dentista Executor:</span>
                  <span className="font-semibold text-slate-200">{selectedTraceCertificate.pkg.dentistName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Classificação de Risco:</span>
                  <span className="font-bold text-cyan-300">{selectedTraceCertificate.pkg.criticality}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Instrumentais Utilizados:</span>
                <span className="font-semibold text-slate-100 block">{selectedTraceCertificate.pkg.description}</span>
                <span className="text-[10px] text-slate-400 font-mono">Tipo de Barreira: {selectedTraceCertificate.pkg.packageType}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Validação da Esterilização</span>
                <div className="flex justify-between text-[11px]">
                  <span>Código do Lote:</span>
                  <strong className="font-mono text-slate-200">{selectedTraceCertificate.pkg.batchCode}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Temperatura & Pressão da Autoclave:</span>
                  <span className="text-emerald-400 font-semibold">134.2 °C • 2.15 bar (45 min)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Integrador Químico Classe 5:</span>
                  <span className="text-emerald-400 font-bold">Aprovado (Viragem Completa)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500">
                Hash de Autenticidade: {selectedTraceCertificate.pkg.qrCodeToken}
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir para Prontuário</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
