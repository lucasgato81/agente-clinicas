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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Box className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">Criar Kit Padronizado de Instrumentais</h3>
              <p className="text-[11px] text-slate-400">Padronização para embalagem rápida e sem esquecimentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Código do Kit *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: KIT-CIR-03"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Nome do Kit *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Kit Cirúrgico de Implante / Levantamento"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Especialidade Clínica
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Periodontia, Cirurgia, Dentística"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Embalagem Padrão (Invólucro)
              </label>
              <select
                value={defaultPackaging}
                onChange={(e) => setDefaultPackaging(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Grau Cirúrgico 9x23cm">Grau Cirúrgico 9x23cm</option>
                <option value="Grau Cirúrgico 10x25cm">Grau Cirúrgico 10x25cm</option>
                <option value="Caixa Inox Perfurada">Caixa Inox Perfurada</option>
                <option value="Papel Crepado Hospitalar">Papel Crepado Hospitalar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Classificação de Criticidade (RDC 1002)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer text-xs transition ${
                  criticality === 'CRITICAL'
                    ? 'border-red-500 bg-red-950/20 text-red-300 font-medium'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
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
                className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer text-xs transition ${
                  criticality === 'SEMI_CRITICAL'
                    ? 'border-amber-500 bg-amber-950/20 text-amber-300 font-medium'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
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
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Composição do Kit (Um instrumental por linha) *
            </label>
            <textarea
              rows={4}
              required
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Ex:&#10;1x Fórceps Adulto 18R&#10;1x Alavanca Reta 301&#10;1x Sindesmótomo Reto&#10;1x Pinça Clínica"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-500">
              A ASB verá exatamente este checklist na hora da embalagem e esterilização.
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-600/20 transition flex items-center space-x-1.5"
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
