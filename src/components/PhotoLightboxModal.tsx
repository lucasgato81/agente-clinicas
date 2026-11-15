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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-[#E2ECE6] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2ECE6] bg-[#F8FAF9]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
              <p className="text-[11px] text-slate-500 font-mono font-medium">{batchCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Imagem Central */}
        <div className="p-6 bg-slate-50 flex flex-col items-center justify-center min-h-[260px]">
          <div className="relative group max-w-sm w-full flex justify-center">
            <img
              src={photoUrl}
              alt={title}
              className="max-h-72 w-auto object-contain rounded-2xl border border-[#E2ECE6] shadow-md transition-transform group-hover:scale-105 duration-200"
            />
          </div>
        </div>

        {/* Metadados Periciais */}
        <div className="p-5 bg-white border-t border-[#E2ECE6] text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold">Status Pericial:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold shadow-xs">
              CONFORME / APROVADO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700 text-[11px] bg-[#F8FAF9] p-3 rounded-2xl border border-[#E2ECE6]">
            <div className="flex items-center space-x-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{timestamp}</span>
            </div>
            <div className="flex items-center space-x-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>{operatorName}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            {type === 'chemical'
              ? 'Evidência fotográfica registrada da fita do Integrador Químico Classe 5 após ciclo de 134°C com viragem completa da barra reagente conforme a RDC 1002/2025.'
              : 'Evidência fotográfica da ampola de leitura do teste biológico após 24 horas de incubação em estufa com resultado negativo (ausência de esporos viáveis).'}
          </p>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3.5 border-t border-[#E2ECE6] bg-[#F8FAF9] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-md transition cursor-pointer"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
