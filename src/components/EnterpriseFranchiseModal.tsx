'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ExternalLink,
  Users,
  Search,
  Sparkles,
  ArrowUpRight,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { ClinicTenant } from '@/lib/types';

interface EnterpriseFranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClinic: ClinicTenant;
  onSwitchClinic: (clinic: ClinicTenant) => void;
}

interface FranchiseUnit {
  id: string;
  name: string;
  city: string;
  state: string;
  rtName: string;
  chairs: number;
  complianceScore: number;
  status: 'COMPLIANT' | 'WARNING' | 'CRITICAL';
  biologicalOk: boolean;
  licenseValidUntil: string;
  pendingPopsCount: number;
}

export const EnterpriseFranchiseModal: React.FC<EnterpriseFranchiseModalProps> = ({
  isOpen,
  onClose,
  currentClinic,
  onSwitchClinic,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const units: FranchiseUnit[] = [
    {
      id: 'unit_01',
      name: 'Unidade Matriz - Jardins',
      city: 'São Paulo',
      state: 'SP',
      rtName: 'Dr. Lucas Ribeiro (CRO 10248)',
      chairs: 4,
      complianceScore: 100,
      status: 'COMPLIANT',
      biologicalOk: true,
      licenseValidUntil: '2027-02-15',
      pendingPopsCount: 0,
    },
    {
      id: 'unit_02',
      name: 'Unidade Franquia 02 - Morumbi',
      city: 'São Paulo',
      state: 'SP',
      rtName: 'Dra. Camila Vasconcelos (CRO 19382)',
      chairs: 3,
      complianceScore: 92,
      status: 'COMPLIANT',
      biologicalOk: true,
      licenseValidUntil: '2026-11-20',
      pendingPopsCount: 1,
    },
    {
      id: 'unit_03',
      name: 'Unidade Franquia 03 - Campinas Centro',
      city: 'Campinas',
      state: 'SP',
      rtName: 'Dr. Henrique Souza (CRO 34912)',
      chairs: 3,
      complianceScore: 68,
      status: 'WARNING',
      biologicalOk: false, // Indicador biológico pendente!
      licenseValidUntil: '2026-12-05',
      pendingPopsCount: 3,
    },
    {
      id: 'unit_04',
      name: 'Unidade Franquia 04 - Alphaville',
      city: 'Barueri',
      state: 'SP',
      rtName: 'Dr. Rodrigo Mendes (CRO 44921)',
      chairs: 6,
      complianceScore: 96,
      status: 'COMPLIANT',
      biologicalOk: true,
      licenseValidUntil: '2027-05-10',
      pendingPopsCount: 0,
    },
  ];

  if (!isOpen) return null;

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgCompliance = Math.round(
    units.reduce((acc, u) => acc + u.complianceScore, 0) / units.length
  );

  const unitsAtRisk = units.filter((u) => u.status !== 'COMPLIANT').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 md:px-6 md:py-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-950/50">
              <Building2 className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Painel Corporativo de Redes & Franquias</span>
                <span className="text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                  Enterprise
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Auditoria sanitária centralizada para gestores e franqueadores odontológicos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Métricas Globais da Rede */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Score Médio da Rede
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-0.5">{avgCompliance}%</div>
              <span className="text-[11px] text-slate-400">Conformidade Sanitária Global</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Unidades Monitoradas
              </span>
              <div className="text-3xl font-black text-white mt-0.5">{units.length} Clínicas</div>
              <span className="text-[11px] text-slate-400">16 Consultórios Totais</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Unidades em Alerta Sanitário
              </span>
              <div className="text-3xl font-black text-amber-400 mt-0.5">{unitsAtRisk} Filial</div>
              <span className="text-[11px] text-amber-300">Risco de Multa / Interdição</span>
            </div>
          </div>

          {/* Busca de Unidade */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar unidade da rede por nome ou cidade..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Lista de Filiais da Franquia */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Filiais da Rede ({filteredUnits.length}):
            </span>

            <div className="space-y-2.5">
              {filteredUnits.map((u) => (
                <div
                  key={u.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white">{u.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          u.status === 'COMPLIANT'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        {u.status === 'COMPLIANT' ? '100% Regular' : 'Atenção Necessária'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>
                          {u.city} - {u.state}
                        </span>
                      </span>
                      <span>RT: {u.rtName}</span>
                      <span>{u.chairs} Consultórios</span>
                    </div>

                    {!u.biologicalOk && (
                      <p className="text-[11px] text-amber-400 flex items-center space-x-1 pt-0.5 font-medium">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Teste biológico da autoclave pendente de realização nesta semana.</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Score Sanitário</span>
                      <span
                        className={`text-lg font-black ${
                          u.complianceScore >= 90
                            ? 'text-emerald-400'
                            : u.complianceScore >= 70
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {u.complianceScore}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSwitchClinic({
                          ...currentClinic,
                          id: u.id,
                          name: u.name,
                        });
                        onClose();
                      }}
                      className="flex items-center space-x-1 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition shadow"
                    >
                      <span>Acessar Unidade</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Rede protegida contra riscos reputacionais e multas da ANVISA</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};