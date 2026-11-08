'use client';

import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, AlertTriangle, FileText, QrCode, Building2, Stethoscope, Clock } from 'lucide-react';
import { CURRENT_CLINIC, CURRENT_USER, MOCK_AUTOCLAVES, MOCK_CME_BATCHES, MOCK_EQUIPMENTS, MOCK_POPS, MOCK_INCIDENTS } from '@/lib/mockData';

interface DossierModalProps {
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Barra Superior / Ações */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Dossiê Sanitário Consolidado - RDC 1002/2025 Anvisa</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Dossiê */}
        <div id="dossier-print-area" className="p-8 space-y-6 overflow-y-auto bg-slate-50 text-slate-800">
          {/* Cabeçalho Oficial */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-800 mb-0.5">
                RELATÓRIO TÉCNICO DE CONFORMIDADE REGULATÓRIA
              </div>
              <h1 className="text-xl font-black text-slate-900">{CURRENT_CLINIC.legalName}</h1>
              <p className="text-xs text-slate-600">Nome Fantasia: {CURRENT_CLINIC.name}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                <span><strong>CNPJ:</strong> {CURRENT_CLINIC.cnpj}</span>
                <span><strong>Alvará Sanitário:</strong> {CURRENT_CLINIC.sanitaryLicense}</span>
                <span><strong>Inscrição CRO-PJ:</strong> {CURRENT_CLINIC.croRegistration}</span>
                <span><strong>Consultórios Ativos:</strong> {CURRENT_CLINIC.chairsCount}</span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="font-mono text-[10px] block text-slate-400">AUTENTICAÇÃO SHA-256</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">8f92a1...44c1002</span>
              <span className="block mt-1 text-emerald-700 font-semibold text-[11px]">Auditado em: {currentDate}</span>
            </div>
          </div>

          {/* Enquadramento RDC 1002 */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Status Sanitário: Conforme com a RDC 1002/2025</h4>
                <p className="text-xs text-emerald-800">
                  Responsável Técnico habilitado, Núcleo de Segurança do Paciente instituído, CME classe I com rastreabilidade digital e 100% dos POPs assinados.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700">100%</span>
              <span className="text-[10px] block text-emerald-900 font-bold uppercase">Índice Geral de Conformidade</span>
            </div>
          </div>

          {/* 1. Responsabilidade Técnica & NSP */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Stethoscope className="w-4 h-4 text-cyan-700" />
              <span>1. Responsabilidade Técnica & Núcleo de Segurança do Paciente (NSP)</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500">Responsável Técnico (RT):</p>
                <p className="font-bold text-slate-800">{CURRENT_USER.name} - CRO-{CURRENT_USER.croState} {CURRENT_USER.croNumber}</p>
                <p className="text-slate-500 mt-1">E-mail de Contato RT:</p>
                <p className="font-medium text-slate-800">{CURRENT_USER.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Exigência do NSP (Artigo RDC 1002):</p>
                <p className="font-bold text-emerald-700">Obrigatório e Constituído (Clínica com {CURRENT_CLINIC.chairsCount} consultórios)</p>
                <p className="text-slate-500 mt-1">Plano de Segurança do Paciente:</p>
                <p className="font-medium text-slate-800">Vigente (Aprovado em Jan/2026 com revisão anual)</p>
              </div>
            </div>
          </div>

          {/* 2. Livro de Registro da CME */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-700" />
              <span>2. Extrato Digital da Central de Material e Esterilização (CME)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Registros auditáveis dos últimos ciclos de autoclave com monitoramento físico, químico classe 5 e biológico:
            </p>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2">Lote</th>
                  <th className="p-2">Equipamento</th>
                  <th className="p-2">Data/Hora</th>
                  <th className="p-2">Temp / Pressão</th>
                  <th className="p-2">Classe 5</th>
                  <th className="p-2">Biológico</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CME_BATCHES.map((batch) => (
                  <tr key={batch.id}>
                    <td className="p-2 font-mono font-bold text-cyan-900">{batch.batchCode}</td>
                    <td className="p-2">{batch.autoclaveName}</td>
                    <td className="p-2">{batch.startedAt}</td>
                    <td className="p-2">{batch.temperatureC}°C / {batch.pressureBar} bar</td>
                    <td className="p-2 text-emerald-700 font-bold">Aprovado</td>
                    <td className="p-2 font-medium">
                      {batch.hasBiological ? (
                        <span className="text-emerald-700 font-bold">Negativo (Aprovado)</span>
                      ) : (
                        <span className="text-slate-400">N/A neste ciclo</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                        APROVADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Equipamentos Críticos e Laudos */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-cyan-700" />
              <span>3. Gestão de Equipamentos, Tecnologias e Manutenções</span>
            </h3>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2">Equipamento</th>
                  <th className="p-2">Localização</th>
                  <th className="p-2">Nº Série</th>
                  <th className="p-2">Última Manutenção</th>
                  <th className="p-2">Próxima</th>
                  <th className="p-2">Laudo Técnico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_EQUIPMENTS.map((eq) => (
                  <tr key={eq.id}>
                    <td className="p-2 font-semibold text-slate-800">{eq.name}</td>
                    <td className="p-2 text-slate-600">{eq.locationRoom}</td>
                    <td className="p-2 font-mono text-[11px]">{eq.serialNumber}</td>
                    <td className="p-2">{eq.lastMaintenance}</td>
                    <td className="p-2 font-medium">{eq.nextMaintenance}</td>
                    <td className="p-2">
                      {eq.hasLaudo ? (
                        <span className="text-emerald-700 font-bold">Anexado & Válido</span>
                      ) : (
                        <span className="text-amber-700 font-medium">Pendente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Lista dos 8 POPs Obrigatórios */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-cyan-700" />
              <span>4. Procedimentos Operacionais Padrão (POPs) & Treinamento da Equipe</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {MOCK_POPS.map((pop) => (
                <div key={pop.id} className="border border-slate-100 p-2.5 rounded-lg bg-slate-50 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-cyan-800">{pop.code}</span>
                    <p className="font-semibold text-slate-800 text-[11px] line-clamp-1">{pop.title}</p>
                    <p className="text-[10px] text-slate-500">Rev: {pop.reviewDue} | RT: {pop.approvedByRt.slice(0, 18)}</p>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    {pop.signaturesCount}/{pop.totalTeamCount} Cientes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assinatura do RT */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-end">
            <div className="text-[11px] text-slate-500">
              <p>Documento emitido eletronicamente via <strong>OdontoShield</strong>.</p>
              <p>Validação da autenticidade em conformidade com as diretrizes da Anvisa e CFO.</p>
            </div>
            <div className="text-center">
              <div className="w-56 border-b border-slate-900 pb-1 mb-1">
                <span className="font-script text-lg text-slate-900">Dr. Rodrigo Mendes</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{CURRENT_USER.name}</p>
              <p className="text-[10px] text-slate-600">Responsável Técnico - CRO-SP {CURRENT_USER.croNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
