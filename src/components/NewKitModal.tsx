'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Box, Plus, Trash2 } from 'lucide-react';
import { InstrumentKitTemplate, InstrumentCriticality } from '@/lib/types';

interface NewKitModalProps {
  onClose: () => void;
  onSave: (kit: InstrumentKitTemplate) => void;
}

export const NewKitModal: React.FC<NewKitModalProps> = ({ onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Cirurgia Bucomaxilofacial');
  const [criticality, setCriticality] = useState<InstrumentCriticality>('CRITICAL');
  const [defaultPackaging, setDefaultPackaging] = useState('Grau Cirúrgico 10x25cm');
  const [itemsText, setItemsText] = useState('1x Fórceps Adulto\n1x Alavanca Reta\n1x Sindesmótomo\n1x Pinça Clínica');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const items = itemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newKit: InstrumentKitTemplate = {
      id: `kit-tmpl-${Date.now()}`,
      code: code.trim() || `KIT-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      specialty: specialty.trim(),
      criticality,
      defaultPackaging,
      itemsList: items.length > 0 ? items : ['Instrumentais diversos do kit'],
      active: true,
    };

    onSave(newKit);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E2ECE6] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2ECE6] bg-[#F8FAF9] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-sm">
              <Box className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Criar Kit Padronizado de Instrumentais</h3>
              <p className="text-[11px] text-slate-500 font-medium">Padronização para embalagem rápida e sem esquecimentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Código do Kit *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: KIT-CIR-03"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 uppercase font-mono shadow-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nome do Kit *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Kit Cirúrgico de Implante / Levantamento"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Especialidade Clínica
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Periodontia, Cirurgia, Dentística"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Embalagem Padrão (Invólucro)
              </label>
              <select
                value={defaultPackaging}
                onChange={(e) => setDefaultPackaging(e.target.value)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              >
                <option value="Grau Cirúrgico 9x23cm">Grau Cirúrgico 9x23cm</option>
                <option value="Grau Cirúrgico 10x25cm">Grau Cirúrgico 10x25cm</option>
                <option value="Caixa Inox Perfurada">Caixa Inox Perfurada</option>
                <option value="Papel Crepado Hospitalar">Papel Crepado Hospitalar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Classificação de Criticidade (RDC 1002)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer text-xs transition shadow-sm ${
                  criticality === 'CRITICAL'
                    ? 'border-red-300 bg-red-50 text-red-900 font-bold'
                    : 'border-[#E2ECE6] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="criticality"
                  checked={criticality === 'CRITICAL'}
                  onChange={() => setCriticality('CRITICAL')}
                  className="hidden"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span>Crítico (Invasivo / Cirúrgico)</span>
              </label>

              <label
                className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer text-xs transition shadow-sm ${
                  criticality === 'SEMI_CRITICAL'
                    ? 'border-amber-300 bg-amber-50 text-amber-900 font-bold'
                    : 'border-[#E2ECE6] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="criticality"
                  checked={criticality === 'SEMI_CRITICAL'}
                  onChange={() => setCriticality('SEMI_CRITICAL')}
                  className="hidden"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Semicrítico (Exame / Mucosa)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Composição do Kit (Um instrumental por linha) *
            </label>
            <textarea
              rows={4}
              required
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Ex:&#10;1x Fórceps Adulto 18R&#10;1x Alavanca Reta 301&#10;1x Sindesmótomo Reto&#10;1x Pinça Clínica"
              className="w-full bg-white border border-[#E2ECE6] rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 font-mono shadow-sm"
            />
            <span className="text-[10px] text-slate-500 font-medium">
              A ASB verá exatamente este checklist na hora da embalagem e esterilização.
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E2ECE6] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#E2ECE6] rounded-xl text-xs font-bold transition shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 transition flex items-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Template de Kit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
