'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  QrCode,
  Building2,
  Stethoscope,
  Clock,
  Sparkles,
  Lock,
  FileBadge,
} from 'lucide-react';
import {
  CURRENT_CLINIC,
  CURRENT_USER,
  MOCK_AUTOCLAVES,
  MOCK_CME_BATCHES,
  MOCK_EQUIPMENTS,
  MOCK_POPS,
  MOCK_INCIDENTS,
} from '@/lib/mockData';

interface DossierModalProps {
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ onClose }) => {
  const [isSignedGovBr, setIsSignedGovBr] = useState<boolean>(true);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSignGovBr = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSignedGovBr(true);
    }, 1000);
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Barra Superior / Ações */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Dossiê Sanitário Consolidado - RDC 1002/2025 Anvisa</span>
          </div>
          <div className="flex items-center space-x-2">
            {!isSignedGovBr && (
              <button
                type="button"
                onClick={handleSignGovBr}
                disabled={isSigning}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                <FileBadge className="w-4 h-4" />
                <span>{isSigning ? 'Assinando...' : 'Assinar com Gov.br'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
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
                <span>
                  <strong>CNPJ:</strong> {CURRENT_CLINIC.cnpj}
                </span>
                <span>
                  <strong>Alvará Sanitário:</strong> {CURRENT_CLINIC.sanitaryLicense}
                </span>
                <span>
                  <strong>Inscrição CRO-PJ:</strong> {CURRENT_CLINIC.croRegistration}
                </span>
                <span>
                  <strong>Consultórios Ativos:</strong> {CURRENT_CLINIC.chairsCount}
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="font-mono text-[10px] block text-slate-400">HASH CRIPTOGRÁFICO SHA-256</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">8f92a1...44c1002</span>
              <span className="block mt-1 text-emerald-700 font-semibold text-[11px]">Auditado em: {currentDate}</span>
            </div>
          </div>

          {/* 1. Indicadores Chave de Prontidão Sanitária */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Índice de Conformidade</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">100%</div>
              <span className="text-[10px] text-slate-500">RDC 1002/2025 Plena</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Ciclos Esterilização</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{MOCK_CME_BATCHES.length} Lotes</div>
              <span className="text-[10px] text-emerald-700 font-medium">Biológicos Aprovados</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">POPs Homologados</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{MOCK_POPS.length}/8 POPs</div>
              <span className="text-[10px] text-emerald-700 font-medium">100% Equipe Ciente</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Parque de Equipamentos</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{MOCK_EQUIPMENTS.length} Ativos</div>
              <span className="text-[10px] text-emerald-700 font-medium">Manutenções em Dia</span>
            </div>
          </div>

          {/* 2. Histórico de Esterilização */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. Monitoramento de Cargas da CME & Indicadores Biológicos</span>
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Lote</th>
                  <th className="py-2 px-3">Autoclave</th>
                  <th className="py-2 px-3">Data / Hora</th>
                  <th className="py-2 px-3">Parâmetros</th>
                  <th className="py-2 px-3">Químico Cl. 5</th>
                  <th className="py-2 px-3">Biológico</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CME_BATCHES.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{batch.batchCode}</td>
                    <td className="py-2 px-3">{batch.autoclaveName}</td>
                    <td className="py-2 px-3 text-slate-600">{batch.startedAt}</td>
                    <td className="py-2 px-3">{batch.temperatureC}°C / {batch.pressureBar} bar</td>
                    <td className="py-2 px-3">
                      <span className="text-emerald-700 font-bold">Virado (Aprovado)</span>
                    </td>
                    <td className="py-2 px-3">
                      {batch.hasBiological ? (
                        <span className="text-emerald-700 font-bold">Negativo (24h)</span>
                      ) : (
                        <span className="text-slate-400">Não aplicável</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        LIBERADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Manutenções de Equipamentos e Laudos */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-cyan-700" />
              <span>3. Equipamentos Críticos, Laudos NR-13 e Levantamento Radiométrico</span>
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Equipamento</th>
                  <th className="py-2 px-3">Marca / Modelo</th>
                  <th className="py-2 px-3">Nº Série</th>
                  <th className="py-2 px-3">Última Revisão</th>
                  <th className="py-2 px-3">Próxima Revisão</th>
                  <th className="py-2 px-3">Laudo Técnico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_EQUIPMENTS.map((eq) => (
                  <tr key={eq.id}>
                    <td className="py-2 px-3 font-semibold text-slate-900">{eq.name}</td>
                    <td className="py-2 px-3">{eq.brand} - {eq.model}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{eq.serialNumber}</td>
                    <td className="py-2 px-3">{eq.lastMaintenance}</td>
                    <td className="py-2 px-3 font-semibold text-emerald-700">{eq.nextMaintenance}</td>
                    <td className="py-2 px-3">
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

          {/* Assinatura Digital Gov.br / ICP-Brasil com Carimbo do Tempo */}
          <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="text-[11px] text-slate-500 max-w-sm">
              <p>Documento emitido eletronicamente via <strong>OdontoShield SaaS</strong>.</p>
              <p>Conforme MP 2.200-2/2001 e Decreto 10.543/2020 (Validade Jurídica Integral).</p>
            </div>

            {/* Selo Gov.br */}
            <div className="border-2 border-blue-600/70 rounded-2xl p-3 bg-blue-50/50 text-xs min-w-[280px]">
              <div className="flex items-center space-x-2 mb-1.5 border-b border-blue-200 pb-1">
                <div className="w-5 h-5 rounded-md bg-blue-700 flex items-center justify-center text-white font-black text-[10px]">
                  gov
                </div>
                <div>
                  <span className="font-bold text-blue-950 text-[10px] block leading-none">
                    DOCUMENTO ASSINADO DIGITALMENTE
                  </span>
                  <span className="text-[8px] text-blue-800 font-mono">Assinatura Eletrônica Avançada Gov.br</span>
                </div>
              </div>

              <div className="text-[10px] space-y-0.5 text-slate-800">
                <p>
                  Assinado por: <strong>{CURRENT_USER.name}</strong>
                </p>
                <p>
                  Cargo: Responsável Técnico • CRO-SP {CURRENT_USER.croNumber}
                </p>
                <p className="text-slate-500 font-mono text-[9px]">
                  Data/Hora: {currentDate} às 10:45 (Horário de Brasília)
                </p>
                <p className="text-slate-500 font-mono text-[8px] truncate">
                  Hash SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};