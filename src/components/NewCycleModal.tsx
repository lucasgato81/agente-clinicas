'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Box,
  Printer,
  PenTool,
  Grid,
  Info,
  Clock,
  Tag,
  ArrowRight,
} from 'lucide-react';
import {
  AutoclaveItem,
  CmeBatchItem,
  SterilePackageItem,
  InstrumentKitTemplate,
  ClinicTenant,
} from '@/lib/types';
import { MOCK_KIT_TEMPLATES } from '@/lib/mockData';
import { generateBatchIdentifier } from '@/lib/batchUtils';
import { PimacoSheetModal } from './PimacoSheetModal';

interface NewCycleModalProps {
  clinic?: ClinicTenant;
  existingBatchesCount: number;
  autoclaves: AutoclaveItem[];
  kitTemplates?: InstrumentKitTemplate[];
  initialKit?: InstrumentKitTemplate;
  onClose: () => void;
  onLoadStarted: (newBatch: CmeBatchItem, newPackages: SterilePackageItem[]) => void;
}

export const NewCycleModal: React.FC<NewCycleModalProps> = ({
  clinic,
  existingBatchesCount,
  autoclaves: initialAutoclaves,
  kitTemplates = MOCK_KIT_TEMPLATES,
  initialKit,
  onClose,
  onLoadStarted,
}) => {
  const [autoclavesList, setAutoclavesList] = useState<AutoclaveItem[]>(initialAutoclaves);
  const [selectedAutoId, setSelectedAutoId] = useState<string>(initialAutoclaves[0]?.id || '');
  const [operatorName, setOperatorName] = useState<string>('Maria Silva (ASB)');

  // Modal inline para adicionar nova autoclave rápida
  const [isAddingNewAuto, setIsAddingNewAuto] = useState<boolean>(false);
  const [newAutoBrand, setNewAutoBrand] = useState<string>('');
  const [newAutoVolume, setNewAutoVolume] = useState<number>(21);

  // Descobre índice da autoclave selecionada para gerar A1, A2, A3...
  const selectedIndex = autoclavesList.findIndex((a) => a.id === selectedAutoId);
  const autoNumber = selectedIndex >= 0 ? selectedIndex + 1 : 1;

  // Geração Automática do Identificador Único do Lote
  const clinicName = clinic?.name || 'Odonto Inova';
  const { batchCode, shortCode, cycleNumber } = generateBatchIdentifier(
    clinicName,
    existingBatchesCount,
    undefined,
    autoNumber
  );

  // Lista de pacotes neste ciclo (inicia com kit padrão ou initialKit se fornecido)
  const [packageItems, setPackageItems] = useState<{ desc: string; type: string; crit: 'CRITICAL' | 'SEMI_CRITICAL' }[]>(
    initialKit
      ? [{ desc: `${initialKit.code} - ${initialKit.name}`, type: initialKit.defaultPackaging, crit: initialKit.criticality }]
      : [
          { desc: 'KIT-CLIN-01 - Kit Clínico Básico (Espelho, Sonda, Pinça)', type: 'Grau Cirúrgico 9x23cm', crit: 'SEMI_CRITICAL' },
          { desc: 'KIT-CIR-01 - Kit Cirúrgico de Extração #05', type: 'Grau Cirúrgico 10x25cm', crit: 'CRITICAL' },
        ]
  );

  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('Grau Cirúrgico 9x23cm');
  const [newCrit, setNewCrit] = useState<'CRITICAL' | 'SEMI_CRITICAL'>('CRITICAL');
  const [isPimacoOpen, setIsPimacoOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddNewAutoclaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAutoBrand.trim()) return;
    const nextNum = autoclavesList.length + 1;
    const newAuto: AutoclaveItem = {
      id: `auto-${Date.now()}`,
      nickname: `Autoclave 0${nextNum} (${newAutoBrand.trim()} ${newAutoVolume}L)`,
      brand: newAutoBrand.trim(),
      model: `${newAutoVolume}L`,
      serialNumber: `AUT-2026-${nextNum}`,
      chamberVolumeL: newAutoVolume,
      lastValidation: new Date().toISOString().slice(0, 10),
      validationDue: '2027-10-26',
      status: 'OPERATIONAL',
    };
    setAutoclavesList((prev) => [...prev, newAuto]);
    setSelectedAutoId(newAuto.id);
    setIsAddingNewAuto(false);
    setNewAutoBrand('');
  };

  const handleSelectKitForAutofill = (kit: InstrumentKitTemplate) => {
    setNewDesc(`${kit.code} - ${kit.name}`);
    setNewType(kit.defaultPackaging);
    setNewCrit(kit.criticality);
    setTimeout(() => {
      const inputEl = document.getElementById('package-desc-input');
      if (inputEl) {
        inputEl.focus();
      }
    }, 50);
  };

  const handleAddPackage = () => {
    if (!newDesc.trim()) return;
    setPackageItems((prev) => [
      ...prev,
      { desc: newDesc.trim(), type: newType, crit: newCrit },
    ]);
    setNewDesc('');
  };

  const handleRemovePackage = (index: number) => {
    setPackageItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartCycle = () => {
    if (packageItems.length === 0) return;

    const selectedAuto = autoclavesList.find((a) => a.id === selectedAutoId) || autoclavesList[0];
    const now = new Date();
    const startedAt = now.toISOString().replace('T', ' ').slice(0, 16);

    const displayName = selectedAuto?.nickname || `Autoclave 0${autoNumber} (${selectedAuto?.brand} ${selectedAuto?.chamberVolumeL}L)`;

    const newBatch: CmeBatchItem = {
      id: `batch-${Date.now()}`,
      batchCode,
      shortCode,
      cycleNumber,
      autoclaveName: displayName,
      operatorName,
      startedAt,
      temperatureC: 134.0,
      pressureBar: 2.10,
      cycleTimeMin: 45,
      physicalOk: false,
      chemicalClass5Ok: false,
      hasBiological: false,
      status: 'PROCESSING', // Passo 1: Em processamento na autoclave
      packagesCount: packageItems.length,
    };

    const newPackages: SterilePackageItem[] = packageItems.map((item, idx) => {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      return {
        id: `pkg-${Date.now()}-${idx}`,
        batchCode,
        shortCode: `${shortCode}-P${String(idx + 1).padStart(2, '0')}`,
        qrCodeToken: `ODONTO-${batchCode}-${idx + 1}`,
        packageType: item.type,
        criticality: item.crit,
        description: item.desc,
        packagedAt: startedAt,
        expiresAt: expDate.toISOString().slice(0, 10),
        status: 'IN_PROCESS', // Bloqueado para uso até conclusão do ciclo
      };
    });

    onLoadStarted(newBatch, newPackages);
    onClose();
  };

  // Mock de pacote para visualização no modal de folha Pimaco
  const samplePkg: SterilePackageItem = {
    id: 'sample',
    batchCode,
    shortCode,
    qrCodeToken: `ODONTO-${batchCode}-01`,
    packageType: 'Grau Cirúrgico',
    criticality: 'CRITICAL',
    description: packageItems[0]?.desc || 'Kit Odontológico Esterilizado',
    packagedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    status: 'IN_PROCESS',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white border border-[#E2ECE6] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2ECE6] bg-[#F8FAF9] shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Passo 1: Preparar Carga & Iniciar Ciclo (Pré-Ciclo)</h3>
                <p className="text-[11px] text-slate-500 font-medium">Embalagem, identificação dos pacotes e início do processamento</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo Rolável */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            {/* Bloco de Identificação Gerada Automaticamente */}
            <div className="bg-[#F8FAF9] border border-teal-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                  Lote Sanitário Gerado Automaticamente (RDC 1002)
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-medium">Sequência Única por Cliente</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-[#E2ECE6] p-3 rounded-xl shadow-sm">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Identificador Oficial do Lote:</span>
                  <span className="text-sm font-bold font-mono text-teal-900 block">{batchCode}</span>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    [Iniciais: {clinicName.slice(0, 16)}] • [Data: {new Date().toLocaleDateString('pt-BR')}] • [Ciclo #{cycleNumber}]
                  </span>
                </div>

                <div className="bg-amber-50/50 border border-amber-200 p-3 rounded-xl shadow-sm">
                  <span className="text-[10px] text-amber-900 block mb-0.5 font-medium">Código Curto (Para Caneta Permanente):</span>
                  <span className="text-base font-extrabold font-mono text-amber-950 block">{shortCode}</span>
                  <span className="text-[9px] text-amber-800/80 mt-1 block">
                    Escreva no plástico da embalagem se não tiver impressora
                  </span>
                </div>
              </div>
            </div>

            {/* Opções de Etiquetagem (Com e Sem Impressora) */}
            <div className="bg-white border border-[#E2ECE6] rounded-2xl p-3.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-600" />
                  <span>Opções de Identificação dos Pacotes:</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Impressão 100% Opcional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl border border-[#E2ECE6] bg-[#F8FAF9] flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 text-[11px] flex items-center space-x-1">
                      <PenTool className="w-3 h-3 text-amber-600" />
                      <span>Sem Impressora (Custo Zero)</span>
                    </span>
                    <p className="text-[10px] text-slate-600">
                      Basta escrever à mão no plástico: <strong className="text-slate-900 font-mono">{shortCode}</strong> e a data de hoje.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E2ECE6] bg-[#F8FAF9] flex flex-col justify-between">
                  <div className="space-y-0.5 mb-2">
                    <span className="font-bold text-slate-800 text-[11px] flex items-center space-x-1">
                      <Grid className="w-3 h-3 text-teal-600" />
                      <span>Com Impressora da Recepção</span>
                    </span>
                    <p className="text-[10px] text-slate-600">
                      Gere a folha de 30 etiquetas na folha Pimaco em impressora comum.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPimacoOpen(true)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-teal-700 border border-[#E2ECE6] rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition shadow-sm"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Visualizar Folha A4 Pimaco</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Seleção da Autoclave (Autoclave 1, 2, 3...) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Em qual Autoclave este ciclo está rodando? *</span>
                </label>
                <span className="text-[10px] text-teal-800 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  Identificador: A{autoNumber}
                </span>
              </div>

              {/* Cards de Seleção das Autoclaves da Clínica */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {autoclavesList.map((auto, idx) => {
                  const isSelected = auto.id === selectedAutoId;
                  const autoNum = idx + 1;
                  return (
                    <button
                      key={auto.id}
                      type="button"
                      onClick={() => setSelectedAutoId(auto.id)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-500 text-teal-950 shadow-md ring-2 ring-teal-500/30'
                          : 'bg-white border-[#E2ECE6] text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold font-mono uppercase ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Autoclave {String(autoNum).padStart(2, '0')}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                      </div>
                      <div className="font-bold text-xs text-slate-900 line-clamp-1 mt-1">
                        {auto.nickname || `${auto.brand} ${auto.model}`}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-medium">
                        {auto.chamberVolumeL} Litros • S/N: {auto.serialNumber.slice(0, 14)}
                      </div>
                    </button>
                  );
                })}

                {/* Botão para Adicionar Outra Autoclave (Autoclave 3, 4...) */}
                {!isAddingNewAuto ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAuto(true)}
                    className="p-3 rounded-2xl border border-dashed border-[#E2ECE6] hover:border-teal-500 text-slate-500 hover:text-teal-700 transition flex flex-col items-center justify-center space-y-1 text-center bg-[#F8FAF9]"
                  >
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span className="text-[11px] font-bold">+ Outra Autoclave</span>
                    <span className="text-[9px] text-slate-400">Autoclave {autoclavesList.length + 1}...</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleAddNewAutoclaveInline}
                    className="p-3 rounded-2xl border border-teal-300 bg-white flex flex-col justify-between space-y-1.5 shadow-sm"
                  >
                    <span className="text-[10px] font-bold text-teal-900">
                      Cadastrar Autoclave 0{autoclavesList.length + 1}:
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Marca / Modelo (Ex: Sercon)"
                      value={newAutoBrand}
                      onChange={(e) => setNewAutoBrand(e.target.value)}
                      className="w-full bg-white border border-[#E2ECE6] rounded-lg px-2 py-1 text-[11px] text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        placeholder="Litros"
                        value={newAutoVolume}
                        onChange={(e) => setNewAutoVolume(parseInt(e.target.value) || 21)}
                        className="w-16 bg-white border border-[#E2ECE6] rounded-lg px-1.5 py-1 text-[11px] text-slate-900 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-[10px] font-bold py-1 shadow-sm"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAuto(false)}
                        className="text-slate-400 hover:text-slate-700 px-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Operador Responsável */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Operador Responsável pela Carga (ASB/TSB) *
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>

            {/* Pacotes e Kits na Carga */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Pacotes e Artigos nesta Carga ({packageItems.length})
                </span>
                <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  RDC 1002: Rastreabilidade por Lote
                </span>
              </div>

              {/* 1. Campo de Inserção / Autopreenchimento */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="package-desc-input"
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPackage();
                    }
                  }}
                  placeholder="Selecione um kit abaixo ou digite avulso..."
                  className="flex-1 bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition shadow-sm"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="bg-white border border-[#E2ECE6] rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                >
                  <option value="Grau Cirúrgico 9x23cm">Grau Cirúrgico 9x23cm</option>
                  <option value="Grau Cirúrgico 10x25cm">Grau Cirúrgico 10x25cm</option>
                  <option value="Grau Cirúrgico 15x30cm">Grau Cirúrgico 15x30cm</option>
                  <option value="Papel Crepado Hospitalar">Papel Crepado Hospitalar</option>
                  <option value="Caixa Inox Perfurada">Caixa Inox Perfurada</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddPackage}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-sm transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add</span>
                </button>
              </div>

              {/* 2. Sugestões de Kits Padronizados Diretamente Embaixo do Campo */}
              {kitTemplates && kitTemplates.length > 0 && (
                <div className="bg-[#F8FAF9] border border-[#E2ECE6] rounded-2xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-teal-800 flex items-center space-x-1">
                      <Box className="w-3 h-3 text-teal-600" />
                      <span>Kits da Clínica (clique para autopreencher o campo acima):</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">Preenche nome e embalagem</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {kitTemplates.map((kit) => (
                      <button
                        key={kit.id}
                        type="button"
                        onClick={() => handleSelectKitForAutofill(kit)}
                        className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:border-teal-300 border border-[#E2ECE6] rounded-lg text-[11px] text-slate-700 hover:text-teal-900 transition flex items-center space-x-1.5 group cursor-pointer shadow-sm"
                        title={`Clique para autopreencher o campo com ${kit.name}`}
                      >
                        <span className="font-mono text-[10px] font-bold text-teal-700 group-hover:text-teal-800">
                          {kit.code}
                        </span>
                        <span className="truncate max-w-[170px]">{kit.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista dos Pacotes */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {packageItems.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white border border-[#E2ECE6] px-3 py-2 rounded-xl text-xs text-slate-800 shadow-sm"
                  >
                    <span className="truncate max-w-[280px] sm:max-w-[340px] font-medium">{pkg.desc}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {pkg.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePackage(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-amber-950">
              <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <p className="leading-relaxed">
                Ao iniciar, o lote ficará com status <strong>&quot;EM PROCESSAMENTO&quot;</strong>. Quando a autoclave terminar, a ASB clicará em <strong>&quot;Concluir & Liberar&quot;</strong> para lançar os parâmetros físicos finais e a foto do Integrador Classe 5.
              </p>
            </div>
          </div>

          {/* Rodapé Fixo */}
          <div className="px-6 py-4 border-t border-[#E2ECE6] bg-[#F8FAF9] flex justify-end space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar (ESC)
            </button>
            <button
              type="button"
              onClick={handleStartCycle}
              disabled={packageItems.length === 0}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition cursor-pointer"
            >
              <span>🚀 Iniciar Ciclo na Autoclave</span>
            </button>
          </div>
        </div>
      </div>

      {isPimacoOpen && (
        <PimacoSheetModal pkg={samplePkg} onClose={() => setIsPimacoOpen(false)} />
      )}
    </>
  );
};
