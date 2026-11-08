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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">Passo 2: Concluir & Liberar Carga (Pós-Ciclo)</h3>
              <p className="text-[11px] text-slate-400">
                Lote: <span className="text-cyan-400 font-mono font-bold">{batch.batchCode}</span> ({batch.shortCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Rolável */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Informações da Carga Iniciada */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 grid grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 text-[10px] block">Autoclave:</span>
              <span className="font-semibold text-slate-200">{batch.autoclaveName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Operador (ASB):</span>
              <span className="font-semibold text-slate-200">{batch.operatorName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Hora de Início:</span>
              <span className="font-semibold text-slate-200">{batch.startedAt}</span>
            </div>
          </div>

          {/* Seção 1: Conferência dos Parâmetros Físicos Finais (RDC 1002 / RDC 15) */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Thermometer className="w-3.5 h-3.5" />
                <span>1. Parâmetros Físicos Registrados no Manômetro/Display</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Leitura Obrigatória</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Temperatura Real (°C) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Alvo: 134°C ou 121°C</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Pressão Real (bar) *</label>
                <input
                  type="number"
                  step="0.05"
                  value={pressureBar}
                  onChange={(e) => setPressureBar(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Alvo: 2.0 a 2.2 bar</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Tempo Total (min) *</label>
                <input
                  type="number"
                  value={cycleTimeMin}
                  onChange={(e) => setCycleTimeMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Com secagem</span>
              </div>
            </div>
          </div>

          {/* Seção 2: Evidência Fotográfica do Integrador Químico Classe 5 */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>2. Evidência Fotográfica: Integrador Classe 5 (RDC 1002)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Prova Pericial</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Leitura da fita */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chemicalClass5Ok}
                    onChange={(e) => setChemicalClass5Ok(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                  />
                  <div className="text-[11px]">
                    <span className="font-semibold text-slate-200 block">Fita Classe 5 Atingiu a Linha &quot;ACCEPT&quot;</span>
                    <span className="text-[10px] text-slate-400">A barra escura migrou para a zona segura</span>
                  </div>
                </label>

                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasBiological}
                      onChange={(e) => setHasBiological(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                    />
                    <span>Este ciclo incluiu Teste Biológico (Geobacillus)</span>
                  </label>
                </div>
              </div>

              {/* Upload / Foto */}
              <div>
                {chemicalPhoto ? (
                  <div className="relative group rounded-xl overflow-hidden border border-slate-700">
                    <img
                      src={chemicalPhoto}
                      alt="Fita Classe 5"
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setChemicalPhoto(null)}
                      className="absolute top-1 right-1 bg-black/80 text-red-400 p-1 rounded text-[10px]"
                    >
                      Remover Foto
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition text-slate-400 hover:text-cyan-300 bg-slate-900/50">
                    <Camera className="w-5 h-5 mb-1 text-cyan-400" />
                    <span className="text-[11px] font-semibold text-center">Fotografar Fita Classe 5</span>
                    <span className="text-[9px] text-slate-500 text-center">Câmera do celular ou arquivo</span>
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

          <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-3 flex items-start space-x-2 text-[11px] text-cyan-300">
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <p>
              Ao aprovar, o status de todos os <strong>{batch.packagesCount} pacotes</strong> contidos neste lote mudará automaticamente para <strong>&quot;ESTÉRIL & DISPONÍVEL NO ESTOQUE&quot;</strong>, ficando liberados para consumo nos consultórios.
            </p>
          </div>
        </div>

        {/* Rodapé com Decisão Sanitária */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleConfirm(false)}
            className="w-full sm:w-auto px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Reprovar Carga (Falha Sanitária)</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition"
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
