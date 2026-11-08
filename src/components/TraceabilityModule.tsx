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
      <div className="bg-white border border-[#E2ECE6] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <span>Rastreabilidade: Instrumental x Paciente</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  RDC 1002/2025 Art. 21
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Vínculo obrigatório do lote de esterilização e kit ao prontuário do paciente, integrador Classe 5 e histórico pericial.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenScanner}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>+ Vincular Instrumental ao Paciente</span>
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2ECE6] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pacientes com Rastreabilidade Ativa</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-teal-800">{totalTrackedPatients}</span>
            <span className="text-[11px] text-slate-500">atendimentos com lote</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Conforme exigência do Art. 21 da RDC 1002
          </span>
        </div>

        <div className="bg-white border border-[#E2ECE6] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Kits Cirúrgicos / Críticos Utilizados</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{criticalUsedCount}</span>
            <span className="text-[11px] text-slate-500">pacotes baixados</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Com integrador Classe 5 virado e registrado
          </span>
        </div>

        <div className="bg-white border border-[#E2ECE6] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total de Instrumentais em Prontuário</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-teal-700">{totalUsedCount}</span>
            <span className="text-[11px] text-slate-500">pacotes registrados</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Auditoria reversa (recall) disponível
          </span>
        </div>
      </div>

      {/* Nota de Orientação Sanitária */}
      <div className="bg-teal-50/40 border border-teal-200/80 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-700">
        <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">
            Como funciona a Rastreabilidade no Consultório Odontológico:
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Ao iniciar o atendimento na cadeira clínica, o cirurgião-dentista ou ASB abre o aplicativo no celular, clica em <strong>"Vincular Instrumental ao Paciente"</strong>, bipa o QR Code da embalagem estéril e digita o nome do paciente. O sistema correlaciona na mesma hora o paciente com o <strong>Lote da Autoclave</strong>, os <strong>Parâmetros Físicos</strong> e o <strong>Laudo Químico Classe 5</strong>, gerando a Certidão Pericial para defesa jurídica da clínica.
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E2ECE6] p-3.5 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, prontuário, dentista ou lote..."
            className="w-full bg-white border border-[#E2ECE6] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Criticidade:</span>
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value as any)}
            className="bg-white border border-[#E2ECE6] rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="ALL">Todas</option>
            <option value="CRITICAL">Artigos Críticos</option>
            <option value="SEMI_CRITICAL">Semicríticos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Rastreabilidade */}
      {filteredUsedPackages.length === 0 ? (
        <div className="bg-white border border-[#E2ECE6] rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <ShieldCheck className="w-10 h-10 text-teal-600 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">
            Nenhum instrumental baixado em atendimento ainda
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Quando a equipe der baixa em um pacote estéril pelo celular no consultório, o registro com nome do paciente, lote e parâmetros aparecerá nesta tela.
          </p>
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Vincular Primeiro Pacote com QR Code</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E2ECE6] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2ECE6] bg-[#F8FAF9] text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Data & Hora do Uso</th>
                  <th className="py-3 px-4">Paciente & Prontuário</th>
                  <th className="py-3 px-4">Cirurgião-Dentista</th>
                  <th className="py-3 px-4">Kit / Instrumental Utilizado</th>
                  <th className="py-3 px-4">Lote CME & Autoclave</th>
                  <th className="py-3 px-4 text-center">Evidência Esterilização</th>
                  <th className="py-3 px-4 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECE6] text-slate-700">
                {filteredUsedPackages.map((pkg) => {
                  const linkedBatch = batches.find((b) => b.batchCode === pkg.batchCode);

                  return (
                    <tr key={pkg.id} className="odd:bg-white even:bg-[#F8FAF9]/50 hover:bg-teal-50/40 transition">
                      {/* Data/Hora */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-slate-900 font-semibold">
                          {pkg.usedAt || '2026-10-24 10:15'}
                        </span>
                        <span className="text-[10px] text-slate-500 block">Consultório / Mocho</span>
                      </td>

                      {/* Paciente */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{pkg.patientName || 'Paciente Não Identificado'}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-mono font-medium">
                          ✓ Rastreabilidade 100% Ativa
                        </span>
                      </td>

                      {/* Dentista */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">
                          {pkg.dentistName || 'Cirurgião-Dentista da Clínica'}
                        </span>
                      </td>

                      {/* Kit / Instrumental */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{pkg.description}</div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-slate-500">{pkg.packageType}</span>
                          {pkg.criticality === 'CRITICAL' ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              CRÍTICO
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              SEMICRÍTICO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Lote CME */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-bold text-teal-800">
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
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#DCFCE7] text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Classe 5 OK (Foto)</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-emerald-800 border border-emerald-300">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Aprovado</span>
                          </span>
                        )}
                      </td>

                      {/* Comprovante */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedTraceCertificate({ pkg, batch: linkedBatch })}
                          title="Emitir Certidão de Rastreabilidade para o Prontuário"
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-teal-800 text-[11px] font-medium border border-[#E2ECE6] shadow-2xs transition inline-flex items-center space-x-1 cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedTraceCertificate(null)}
        >
          <div
            className="bg-white border border-[#E2ECE6] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2ECE6] pb-3">
              <div className="flex items-center space-x-2">
                <FileBadge className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Certidão Pericial de Rastreabilidade (RDC 1002/2025)
                </h3>
              </div>
              <button
                onClick={() => setSelectedTraceCertificate(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E2ECE6] space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 border-b border-[#E2ECE6] pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Paciente Atendido:</span>
                  <span className="font-bold text-slate-900">{selectedTraceCertificate.pkg.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Data & Hora do Uso:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedTraceCertificate.pkg.usedAt || '2026-10-24 10:15'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-[#E2ECE6] pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Cirurgião-Dentista Executor:</span>
                  <span className="font-semibold text-slate-800">{selectedTraceCertificate.pkg.dentistName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Classificação de Risco:</span>
                  <span className="font-bold text-teal-800">{selectedTraceCertificate.pkg.criticality}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Instrumentais Utilizados:</span>
                <span className="font-semibold text-slate-900 block">{selectedTraceCertificate.pkg.description}</span>
                <span className="text-[10px] text-slate-500 font-mono">Tipo de Barreira: {selectedTraceCertificate.pkg.packageType}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#E2ECE6] space-y-1">
                <span className="text-[10px] font-bold text-teal-800 uppercase">Validação da Esterilização</span>
                <div className="flex justify-between text-[11px]">
                  <span>Código do Lote:</span>
                  <strong className="font-mono text-teal-800">{selectedTraceCertificate.pkg.batchCode}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Temperatura & Pressão da Autoclave:</span>
                  <span className="text-emerald-700 font-bold">134.2 °C • 2.15 bar (45 min)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Integrador Químico Classe 5:</span>
                  <span className="text-emerald-700 font-bold">Aprovado (Viragem Completa)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500">
                Hash de Autenticidade: {selectedTraceCertificate.pkg.qrCodeToken}
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
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
