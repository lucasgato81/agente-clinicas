'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Image,
  Upload,
  Sparkles,
  ShieldCheck,
  Clock,
  Thermometer,
  Gauge,
  XCircle,
} from 'lucide-react';
import { CmeBatchItem } from '@/lib/types';

interface FinalizeCycleModalProps {
  batch: CmeBatchItem;
  onClose: () => void;
  onFinalize: (
    batchId: string,
    isApproved: boolean,
    temperatureC: number,
    pressureBar: number,
    cycleTimeMin: number,
    chemicalClass5Ok: boolean,
    chemicalPhotoUrl?: string,
    hasBiological?: boolean,
    bioPhotoUrl?: string
  ) => void;
}

export const FinalizeCycleModal: React.FC<FinalizeCycleModalProps> = ({
  batch,
  onClose,
  onFinalize,
}) => {
  const [temperatureC, setTemperatureC] = useState<number>(batch.temperatureC || 134.0);
  const [pressureBar, setPressureBar] = useState<number>(batch.pressureBar || 2.1);
  const [cycleTimeMin, setCycleTimeMin] = useState<number>(batch.cycleTimeMin || 45);
  const [chemicalClass5Ok, setChemicalClass5Ok] = useState<boolean>(true);
  const [hasBiological, setHasBiological] = useState<boolean>(batch.hasBiological || false);
  const [chemicalPhoto, setChemicalPhoto] = useState<string | null>(batch.chemicalPhotoUrl || null);
  const [bioPhoto, setBioPhoto] = useState<string | null>(batch.bioPhotoUrl || null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = (approved: boolean) => {
    const fallbackChemicalPhoto =
      chemicalPhoto ||
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><rect width="300" height="100" fill="%231e293b" rx="8"/><rect x="20" y="20" width="260" height="60" fill="%23f8fafc" rx="4"/><rect x="30" y="30" width="80" height="40" fill="%23059669" rx="2"/><text x="45" y="55" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">OK (${temperatureC}°C)</text><rect x="120" y="30" width="150" height="40" fill="%23047857" rx="2"/><text x="130" y="55" fill="white" font-size="11" font-family="sans-serif">CLASSE 5 INTEGRADA</text></svg>`;

    onFinalize(
      batch.id,
      approved,
      temperatureC,
      pressureBar,
      cycleTimeMin,
      approved ? chemicalClass5Ok : false,
      fallbackChemicalPhoto,
      hasBiological,
      bioPhoto || undefined
    );
    onClose();
  };

  return (
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
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Passo 2: Concluir & Liberar Carga (Pós-Ciclo)</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Lote: <span className="text-teal-700 font-mono font-bold">{batch.batchCode}</span> ({batch.shortCode})
              </p>
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
          {/* Informações da Carga Iniciada */}
          <div className="bg-[#F8FAF9] border border-[#E2ECE6] rounded-2xl p-3.5 grid grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 text-[10px] block font-medium">Autoclave:</span>
              <span className="font-bold text-slate-800">{batch.autoclaveName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-medium">Operador (ASB):</span>
              <span className="font-bold text-slate-800">{batch.operatorName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-medium">Hora de Início:</span>
              <span className="font-bold text-slate-800">{batch.startedAt}</span>
            </div>
          </div>

          {/* Seção 1: Conferência dos Parâmetros Físicos Finais (RDC 1002 / RDC 15) */}
          <div className="bg-white border border-[#E2ECE6] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center space-x-1.5">
                <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                <span>1. Parâmetros Físicos Registrados no Manômetro/Display</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-medium">Leitura Obrigatória</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">Temperatura Real (°C) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-600 shadow-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">Alvo: 134°C ou 121°C</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">Pressão Real (bar) *</label>
                <input
                  type="number"
                  step="0.05"
                  value={pressureBar}
                  onChange={(e) => setPressureBar(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-600 shadow-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">Alvo: 2.0 a 2.2 bar</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">Tempo Total (min) *</label>
                <input
                  type="number"
                  value={cycleTimeMin}
                  onChange={(e) => setCycleTimeMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-600 shadow-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">Com secagem</span>
              </div>
            </div>
          </div>

          {/* Seção 2: Evidência Fotográfica do Integrador Químico Classe 5 */}
          <div className="bg-white border border-[#E2ECE6] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-teal-600" />
                <span>2. Evidência Fotográfica: Integrador Classe 5 (RDC 1002)</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Prova Pericial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Leitura da fita */}
              <div className="space-y-2.5">
                <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-[#E2ECE6] bg-[#F8FAF9] cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={chemicalClass5Ok}
                    onChange={(e) => setChemicalClass5Ok(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-0 border-slate-300"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800 block">Fita Classe 5 Atingiu a Linha &quot;ACCEPT&quot;</span>
                    <span className="text-[10px] text-slate-500 font-medium">A barra escura migrou para a zona segura</span>
                  </div>
                </label>

                <div className="flex items-center space-x-2 pt-1">
                  <label className="flex items-center space-x-2 text-[11px] text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBiological}
                      onChange={(e) => setHasBiological(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-0 border-slate-300"
                    />
                    <span>Este ciclo incluiu Teste Biológico (Geobacillus)</span>
                  </label>
                </div>
              </div>

              {/* Upload / Foto */}
              <div>
                {chemicalPhoto ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-[#E2ECE6] shadow-sm">
                    <img
                      src={chemicalPhoto}
                      alt="Fita Classe 5"
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setChemicalPhoto(null)}
                      className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black/90 text-white p-1 rounded-lg text-[10px] font-bold"
                    >
                      Remover Foto
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#E2ECE6] hover:border-teal-500 rounded-2xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition text-slate-500 hover:text-teal-700 bg-[#F8FAF9]">
                    <Camera className="w-5 h-5 mb-1 text-teal-600" />
                    <span className="text-[11px] font-bold text-center">Fotografar Fita Classe 5</span>
                    <span className="text-[9px] text-slate-400 text-center">Câmera do celular ou arquivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFileUpload(e, setChemicalPhoto)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-teal-950">
            <Sparkles className="w-4 h-4 shrink-0 text-teal-600 mt-0.5" />
            <p className="leading-relaxed">
              Ao aprovar, o status de todos os <strong>{batch.packagesCount} pacotes</strong> contidos neste lote mudará automaticamente para <strong>&quot;ESTÉRIL & DISPONÍVEL NO ESTOQUE&quot;</strong>, ficando liberados para consumo nos consultórios.
            </p>
          </div>
        </div>

        {/* Rodapé com Decisão Sanitária */}
        <div className="px-6 py-4 border-t border-[#E2ECE6] bg-[#F8FAF9] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleConfirm(false)}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Reprovar Carga (Falha Sanitária)</span>
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-700/20 flex items-center space-x-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprovar Ciclo & Liberar Estoque</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
