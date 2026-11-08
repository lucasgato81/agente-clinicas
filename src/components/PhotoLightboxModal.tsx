'use client';

import React from 'react';
import { X, ZoomIn, ShieldCheck, CheckCircle2, Calendar, User } from 'lucide-react';

interface PhotoLightboxModalProps {
  title: string;
  photoUrl: string;
  type: 'chemical' | 'biological';
  batchCode: string;
  timestamp: string;
  operatorName: string;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  title,
  photoUrl,
  type,
  batchCode,
  timestamp,
  operatorName,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">{title}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{batchCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Imagem Central */}
        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[260px]">
          <div className="relative group max-w-sm w-full flex justify-center">
            <img
              src={photoUrl}
              alt={title}
              className="max-h-72 w-auto object-contain rounded-xl border border-slate-800 shadow-2xl transition-transform group-hover:scale-105 duration-200"
            />
          </div>
        </div>

        {/* Metadados Periciais */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status Pericial:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
              CONFORME / APROVADO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{timestamp}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>{operatorName}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {type === 'chemical'
              ? 'Evidência fotográfica registrada da fita do Integrador Químico Classe 5 após ciclo de 134°C com viragem completa da barra reagente conforme a RDC 1002/2025.'
              : 'Evidência fotográfica da ampola de leitura do teste biológico após 24 horas de incubação em estufa com resultado negativo (ausência de esporos viáveis).'}
          </p>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg shadow transition"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
