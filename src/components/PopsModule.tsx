'use client';

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  PenTool,
  Printer,
  CheckCircle2,
  Clock,
  Send,
  Users,
  Check,
  Building2,
  Calendar,
  X,
  FileBadge,
  Sparkles,
  Camera,
} from 'lucide-react';
import { PopItem, TeamMember, ClinicTenant, PhotoEvidenceRecord } from '@/lib/types';
import { PhotoProofUploader } from '@/components/PhotoProofUploader';

interface PopsModuleProps {
  pops: PopItem[];
  selectedPop: PopItem | null;
  onSelectPop: (pop: PopItem) => void;
  onOpenSignModal: (pop: PopItem) => void;
  teamMembers: TeamMember[];
  clinic: ClinicTenant;
  onRemindWhatsApp: (name: string, phone: string, pop: PopItem) => void;
  onSavePhotoEvidence?: (popId: string, record: PhotoEvidenceRecord) => void;
  onDeletePhotoEvidence?: (popId: string, evidenceId: string) => void;
}

// Renderizador rico de Markdown livre de vazamento de caracteres (###, **, etc.)
const renderRichMarkdown = (markdown: string) => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-1.5 my-2 pl-2">
            {currentList.items.map((it, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{it}</span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-2 my-2 pl-1">
            {currentList.items.map((it, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-slate-300">
                <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{it}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  // Helper para formatar negritos **texto** dentro de linhas
  const parseInlineBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-slate-100 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    // Título Nível 1 ou 2 ou 3 (### ou ##)
    if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
      flushList();
      const titleText = line.replace(/^#+\s*/, '');
      elements.push(
        <div key={`h-${index}`} className="pt-3 pb-1.5 border-b border-slate-800/80 mb-2">
          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-sm bg-cyan-500" />
            <span>{parseInlineBold(titleText)}</span>
          </h4>
        </div>
      );
      return;
    }

    // Lista Numerada (1., 2., etc.)
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(parseInlineBold(olMatch[1]));
      return;
    }

    // Lista Não-Numerada (- ou *)
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(parseInlineBold(ulMatch[1]));
      return;
    }

    // Parágrafo regular
    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-xs text-slate-300 leading-relaxed my-1.5">
        {parseInlineBold(line)}
      </p>
    );
  });

  flushList();
  return elements;
};

export const PopsModule: React.FC<PopsModuleProps> = ({
  pops,
  selectedPop,
  onSelectPop,
  onOpenSignModal,
  teamMembers,
  clinic,
  onRemindWhatsApp,
  onSavePhotoEvidence,
  onDeletePhotoEvidence,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Calcula a taxa de conformidade de toda a equipe
  const totalTeamCount = teamMembers.length || 5;

  const currentPop = selectedPop || pops[0];

  // Identificar status de assinatura de cada colaborador para o POP atual
  const teamSignatureStatus = teamMembers.map((member) => {
    const signature = currentPop.signatures.find(
      (s) => s.collaboratorName.toLowerCase() === member.name.toLowerCase()
    );
    return {
      member,
      isSigned: Boolean(signature),
      signature,
    };
  });

  const signedCount = teamSignatureStatus.filter((t) => t.isSigned).length;
  const isFullyCompliant = signedCount >= totalTeamCount && totalTeamCount > 0;

  // Imprimir ou Exportar em folha timbrada A4
  const handlePrintPop = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      window.print();
      setIsExportingPdf(false);
    }, 200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Banner Superior */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Biblioteca de POPs & Gestão de Treinamentos</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  RDC 1002/2025 Art. 16
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                8 Procedimentos Operacionais Padrão obrigatórios, cabeçalho controlado, vigência bienal, rubricas touch da equipe e exportação oficial.
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <span>Responsável Técnico:</span>
          <strong className="text-cyan-300 font-semibold">
            {clinic.technicalResponsibleName || 'Dr. Lucas Ribeiro'} (CRO-SP{' '}
            {clinic.technicalResponsibleCro || '102.450'})
          </strong>
        </div>
      </div>

      {/* Grid Principal: Lista Lateral de POPs (1 col) + Leitor Controlado (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LISTA LATERAL DOS 8 POPS */}
        <div className="space-y-2 lg:col-span-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2 flex items-center justify-between">
            <span>POPs Normativos Anvisa ({pops.length})</span>
            <span className="text-[10px] text-cyan-400">Clique para ler</span>
          </div>

          {pops.map((pop) => {
            const isSelected = currentPop?.id === pop.id;
            // Um POP só é conforme se 100% da equipe assinou
            const popSignatures = pop.signatures || [];
            const popSignedCount = popSignatures.length;
            const isCompliant = popSignedCount >= totalTeamCount && totalTeamCount > 0;

            return (
              <div
                key={pop.id}
                onClick={() => onSelectPop(pop)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    {pop.code}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      isCompliant
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {isCompliant
                      ? 'Vigente / 100% Ciente'
                      : `Pendente (${popSignedCount}/${totalTeamCount} Cientes)`}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-relaxed">
                  {pop.title}
                </h4>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Cat: {pop.category}</span>
                  {pop.requiresPhotoProof ? (
                    <span className="flex items-center space-x-1 text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/70 font-semibold">
                      <Camera className="w-2.5 h-2.5 text-cyan-400" />
                      <span>Fotos ({pop.photoEvidences?.length || 0})</span>
                    </span>
                  ) : (
                    <span className="font-mono">v{pop.version}.0</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ÁREA DE LEITURA DO POP SELECIONADO (DOCUMENTO CONTROLADO) */}
        {currentPop && (
          <div className="lg:col-span-2 space-y-5">
            <div
              id="pop-printable-document"
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
            >
              {/* CABEÇALHO DE DOCUMENTO CONTROLADO (PADRÃO RDC 1002/2025) */}
              <div className="border-2 border-slate-800 rounded-2xl p-5 bg-slate-950/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                      <FileBadge className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                        Procedimento Operacional Padrão (POP) • Anvisa
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">
                        {currentPop.code} • Versão {currentPop.version}.0
                      </h3>
                    </div>
                  </div>

                  {/* Botões de Ação do Topo */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrintPop}
                      title="Exportar POP em formato oficial A4 para impressão ou arquivo físico"
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Exportar POP Oficial em PDF</span>
                    </button>

                    <button
                      onClick={() => onOpenSignModal(currentPop)}
                      className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Assinar Termo com Dedo/Touch</span>
                    </button>
                  </div>
                </div>

                {/* Metadados do Cabeçalho Controlado */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Responsável Técnico Aprovador:
                    </span>
                    <strong className="text-slate-200 block text-xs">
                      {currentPop.approvedByRt || 'Dr. Lucas Ribeiro'}
                    </strong>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      CRO-{currentPop.rtCroState || 'SP'} {currentPop.rtCro || '102.450'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Data de Aprovação / Vigência:
                    </span>
                    <strong className="text-slate-200 block text-xs">
                      {currentPop.approvalDate || '01/11/2026'}
                    </strong>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Vigência Bienal Ativa
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Próxima Revisão Obrigatória:
                    </span>
                    <strong className="text-amber-300 block text-xs">
                      {currentPop.reviewDue || '01/11/2028'}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      Bienal (RDC 1002 Art. 16)
                    </span>
                  </div>
                </div>

                {/* Título Oficial do POP */}
                <div>
                  <h2 className="text-base font-bold text-white leading-snug">
                    {currentPop.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{currentPop.summary}</p>
                </div>
              </div>

              {/* BOX DE ALERTA SANITÁRIO (PROIBIÇÕES EXPRESSAS DA RDC 1002/2025) */}
              {currentPop.prohibitionCallout && (
                <div className="bg-red-950/30 border-2 border-red-500/70 p-4 rounded-xl flex items-start space-x-3 text-xs text-red-200 shadow-md">
                  <div className="p-1.5 bg-red-900/50 rounded-lg text-red-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="font-bold text-red-300 uppercase tracking-wider text-[11px] block">
                      ⚠️ PROIBIÇÃO EXPRESSA DA RDC Nº 1.002/2025 DA ANVISA:
                    </span>
                    <p className="leading-relaxed font-medium text-red-100">
                      {currentPop.prohibitionCallout}
                    </p>
                  </div>
                </div>
              )}

              {/* CORPO DO POP (TEXTO TÉCNICO COMPLETO EM MARKDOWN RICO) */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-xs space-y-2">
                {renderRichMarkdown(currentPop.contentMarkdown)}
              </div>

              {/* COMPROVAÇÃO DIGITAL POR FOTO COM METADADOS SANITÁRIOS (RDC 1.002/2025) */}
              {currentPop.requiresPhotoProof && currentPop.photoProofConfigs && currentPop.photoProofConfigs.length > 0 && (
                <PhotoProofUploader
                  pop={currentPop}
                  configs={currentPop.photoProofConfigs}
                  evidences={currentPop.photoEvidences || []}
                  onSaveEvidence={(rec) => onSavePhotoEvidence?.(currentPop.id, rec)}
                  onDeleteEvidence={(evidId) => onDeletePhotoEvidence?.(currentPop.id, evidId)}
                  teamMembers={teamMembers}
                  clinic={clinic}
                />
              )}

              {/* PAINEL DE ASSINATURAS DA EQUIPE (NO RODAPÉ DO POP) */}
              <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-sm text-slate-100">
                      Painel de Ciência e Treinamento da Equipe Clínica
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                      isFullyCompliant
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {isFullyCompliant
                      ? '✓ POP 100% HOMOLOGADO PELA EQUIPE'
                      : `PENDENTE (${signedCount}/${totalTeamCount} ASSINARAM)`}
                  </span>
                </div>

                <div className="space-y-2">
                  {teamSignatureStatus.map(({ member, isSigned, signature }) => (
                    <div
                      key={member.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
                        isSigned
                          ? 'bg-slate-900/80 border-slate-800'
                          : 'bg-amber-950/10 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSigned
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {isSigned ? <Check className="w-4 h-4" /> : '!'}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <strong className="text-slate-100 font-semibold">{member.name}</strong>
                            <span className="text-[10px] text-slate-400">({member.roleName})</span>
                          </div>

                          <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>CPF: {member.cpf || 'Cadastrado'}</span>
                            {member.councilNumber && (
                              <span className="text-cyan-400 font-mono">
                                • CRO-{member.councilState || 'SP'} {member.councilNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isSigned && signature ? (
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-400 font-bold block flex items-center space-x-1 justify-end">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Assinado Digitalmente</span>
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 block">
                              {signature.signedAt} • IP: {signature.ipAddress}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pendente</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => onRemindWhatsApp(member.name, member.phone, currentPop)}
                              className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-lg text-[10px] font-semibold transition flex items-center space-x-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Lembrar no WhatsApp</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nota de rodapé da RDC 1002 */}
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900 flex justify-between items-center">
                  <span>Hash Pericial SHA-256: {currentPop.fileSha256}</span>
                  <span>Exigência do Art. 16 da RDC nº 1.002/2025 Anvisa</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
