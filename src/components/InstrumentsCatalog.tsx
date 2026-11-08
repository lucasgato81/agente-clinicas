'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Sparkles,
  Box,
  Wrench,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Trash2,
  Edit2,
} from 'lucide-react';
import { DentalInstrument, InstrumentKitTemplate, InstrumentCriticality } from '@/lib/types';

interface InstrumentsCatalogProps {
  instruments: DentalInstrument[];
  kitTemplates: InstrumentKitTemplate[];
  onOpenNewInstrument: () => void;
  onEditInstrument?: (instrument: DentalInstrument) => void;
  onDeleteInstrument?: (instrumentId: string) => void;
  onOpenNewKit: () => void;
  onUpdateInstrument?: (instrument: DentalInstrument) => void;
  onGoToCmeWithKit?: (kit: InstrumentKitTemplate) => void;
}

export const InstrumentsCatalog: React.FC<InstrumentsCatalogProps> = ({
  instruments,
  kitTemplates,
  onOpenNewInstrument,
  onEditInstrument,
  onDeleteInstrument,
  onOpenNewKit,
  onUpdateInstrument,
  onGoToCmeWithKit,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ITEMS' | 'KITS'>('ITEMS');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('ALL');

  // Métricas
  const totalInstruments = instruments.length;
  const totalPieces = instruments.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const criticalCount = instruments.filter((i) => i.criticality === 'CRITICAL').length;
  const sharpeningDueCount = instruments.filter((i) => i.status === 'SHARPENING_DUE').length;
  const totalKits = kitTemplates.length;

  // Filtragem de Instrumentais
  const filteredInstruments = instruments.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.serialOrTag && item.serialOrTag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesCriticality = criticalityFilter === 'ALL' || item.criticality === criticalityFilter;

    return matchesSearch && matchesCategory && matchesCriticality;
  });

  // Filtragem de Kits
  const filteredKits = kitTemplates.filter((kit) => {
    return (
      kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner / Header do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Catálogo de Instrumentais & Kits</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de ativos críticos, controle de vida útil (reafiação / ciclos de esterilização) e padronização de kits (RDC 1002/2025 & RDC 15/2012).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewKit}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>+ Novo Kit</span>
          </button>
          <button
            onClick={onOpenNewInstrument}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/20 flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Instrumental</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas e Conformidade */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Acervo de Instrumentais</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-cyan-300">{totalPieces}</span>
            <span className="text-[11px] text-slate-400">peças no total</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            ({totalInstruments} modelos/tipos cadastrados)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Artigos Críticos (RDC 1002)</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-red-400">{criticalCount}</span>
            <span className="text-[11px] text-slate-400">esterilização obrigatória</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Fadiga / Reafiação Próxima</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-bold ${sharpeningDueCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {sharpeningDueCount}
            </span>
            <span className="text-[11px] text-slate-400">requer manutenção</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Kits Padronizados</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-cyan-400">{totalKits}</span>
            <span className="text-[11px] text-slate-400">templates para CME</span>
          </div>
        </div>
      </div>

      {/* Nota Técnica Regulatória */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-100">
            Exigência Regulatória: RDC 1002/2025 (Art. 21-25) e RDC 15/2012 (Art. 11 & 72)
          </div>
          <p className="text-slate-400 leading-relaxed">
            Instrumentais cirúrgicos e invasivos (artigos críticos) requerem rastreabilidade de processamento por lote. O monitoramento do número de esterilizações evita o uso de instrumentais com desgaste de corte (ex: curetas periodontais cegas) ou risco de fratura por fadiga de metal em procedimentos cirúrgicos.
          </p>
        </div>
      </div>

      {/* Seletor de Sub-Abas: Instrumentais vs Kits */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveSubTab('ITEMS')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeSubTab === 'ITEMS'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Instrumentais Unitários ({instruments.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('KITS')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeSubTab === 'KITS'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Templates de Kits Padronizados ({kitTemplates.length})</span>
          </button>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, marca ou tag..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          {activeSubTab === 'ITEMS' && (
            <>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todas Especialidades</option>
                <option value="CIRURGIA">Cirurgia</option>
                <option value="PERIODONTIA">Periodontia</option>
                <option value="ENDODONTIA">Endodontia</option>
                <option value="DENTISTICA">Dentística</option>
                <option value="ORTODONTIA">Ortodontia</option>
                <option value="IMPLANTODONTIA">Implantodontia</option>
              </select>

              <select
                value={criticalityFilter}
                onChange={(e) => setCriticalityFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos os Riscos</option>
                <option value="CRITICAL">Críticos</option>
                <option value="SEMI_CRITICAL">Semicríticos</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Conteúdo: ABA 1 - INSTRUMENTAIS UNITÁRIOS */}
      {activeSubTab === 'ITEMS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {filteredInstruments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Stethoscope className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium">Nenhum instrumental encontrado.</p>
              <p className="text-xs text-slate-600">Ajuste os filtros de busca ou cadastre um novo item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Instrumental & Marca</th>
                    <th className="py-3 px-4">Especialidade</th>
                    <th className="py-3 px-4">Criticidade (RDC 1002)</th>
                    <th className="py-3 px-4 text-center">Qtd. em Acervo</th>
                    <th className="py-3 px-4">Tag / Tombamento</th>
                    <th className="py-3 px-4">Ciclos (Vida Útil)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredInstruments.map((item) => {
                    const cyclePct = Math.min(
                      100,
                      Math.round((item.currentCyclesCount / item.maxReprocessCycles) * 100)
                    );
                    const isNearLimit = cyclePct >= 80;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-100">{item.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {item.brand} • <span className="text-slate-400">{item.material}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.criticality === 'CRITICAL' ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/40 text-red-400 border border-red-800/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                              <span>CRÍTICO (Invasivo)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/40 text-amber-400 border border-amber-800/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>SEMICRÍTICO</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{item.quantity || 1} un.</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-cyan-300">
                          {item.serialOrTag || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1 max-w-[160px]">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-semibold text-slate-200">
                                {item.currentCyclesCount} / {item.maxReprocessCycles}
                              </span>
                              <span className={`text-[10px] ${isNearLimit ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                                {cyclePct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  cyclePct >= 90
                                    ? 'bg-red-500'
                                    : cyclePct >= 75
                                    ? 'bg-amber-400'
                                    : 'bg-cyan-500'
                                }`}
                                style={{ width: `${cyclePct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {item.status === 'SHARPENING_DUE' ? (
                            <span className="inline-flex items-center space-x-1 text-amber-400 text-[11px] font-medium bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-800/40">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Reafiação Próxima</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px] font-medium bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-800/40">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Conforme / Ativo</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {onEditInstrument && (
                              <button
                                onClick={() => onEditInstrument(item)}
                                title="Editar dados e quantidade"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteInstrument && (
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja excluir "${item.name}" do catálogo?`)) {
                                    onDeleteInstrument(item.id);
                                  }
                                }}
                                title="Excluir do acervo"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo: ABA 2 - TEMPLATES DE KITS PADRONIZADOS */}
      {activeSubTab === 'KITS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKits.map((kit) => (
            <div
              key={kit.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/40">
                      {kit.code}
                    </span>
                    <h3 className="font-semibold text-slate-100 text-sm mt-1">{kit.name}</h3>
                    <p className="text-[11px] text-slate-400">{kit.specialty}</p>
                  </div>
                  {kit.criticality === 'CRITICAL' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/40 text-red-400 border border-red-800/40">
                      CRÍTICO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/40 text-amber-400 border border-amber-800/40">
                      SEMICRÍTICO
                    </span>
                  )}
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="font-medium">Invólucro Padrão:</span>
                    <span className="text-slate-200 font-mono text-[10px]">{kit.defaultPackaging}</span>
                  </div>
                  <div className="border-t border-slate-800/60 pt-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Composição ({kit.itemsList.length} itens):
                    </span>
                    <ul className="space-y-1">
                      {kit.itemsList.map((item, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-center space-x-1.5">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Padronizado</span>
                </span>
                {onGoToCmeWithKit && (
                  <button
                    onClick={() => onGoToCmeWithKit(kit)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition"
                  >
                    <span>Esterilizar no CME</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
