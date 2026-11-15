'use client';

import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Sparkles, CheckCircle2, AlertCircle, Layers, Trash2, Plus, Minus } from 'lucide-react';
import { DentalInstrument, InstrumentCriticality } from '@/lib/types';

interface NewInstrumentModalProps {
  instrumentToEdit?: DentalInstrument | null;
  onClose: () => void;
  onSave: (instrument: DentalInstrument) => void;
  onDelete?: (id: string) => void;
}

export const NewInstrumentModal: React.FC<NewInstrumentModalProps> = ({
  instrumentToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(instrumentToEdit);

  const [name, setName] = useState(instrumentToEdit?.name || '');
  const [category, setCategory] = useState<DentalInstrument['category']>(
    instrumentToEdit?.category || 'CIRURGIA'
  );
  const [criticality, setCriticality] = useState<InstrumentCriticality>(
    instrumentToEdit?.criticality || 'CRITICAL'
  );
  const [material, setMaterial] = useState(instrumentToEdit?.material || 'Aço Inox Cirúrgico AISI 420');
  const [brand, setBrand] = useState(instrumentToEdit?.brand || 'Golgran');
  const [serialOrTag, setSerialOrTag] = useState(instrumentToEdit?.serialOrTag || '');
  const [quantity, setQuantity] = useState<number>(instrumentToEdit?.quantity || 5);
  const [maxReprocessCycles, setMaxReprocessCycles] = useState<number>(
    instrumentToEdit?.maxReprocessCycles || 100
  );

  useEffect(() => {
    if (instrumentToEdit) {
      setName(instrumentToEdit.name);
      setCategory(instrumentToEdit.category);
      setCriticality(instrumentToEdit.criticality);
      setMaterial(instrumentToEdit.material);
      setBrand(instrumentToEdit.brand);
      setSerialOrTag(instrumentToEdit.serialOrTag || '');
      setQuantity(instrumentToEdit.quantity || 5);
      setMaxReprocessCycles(instrumentToEdit.maxReprocessCycles || 100);
    }
  }, [instrumentToEdit]);

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

    const validatedQty = Math.max(1, Number(quantity) || 1);

    const savedInst: DentalInstrument = {
      id: instrumentToEdit?.id || `inst-${Date.now()}`,
      name: name.trim(),
      category,
      criticality,
      material: material.trim(),
      brand: brand.trim(),
      serialOrTag: serialOrTag.trim() || undefined,
      quantity: validatedQty,
      maxReprocessCycles: Number(maxReprocessCycles) || 100,
      currentCyclesCount: instrumentToEdit?.currentCyclesCount || 0,
      status: instrumentToEdit?.status || 'ACTIVE',
    };

    onSave(savedInst);
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
              <Stethoscope className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isEditing ? 'Editar Instrumental Odontológico' : 'Cadastrar Novo Instrumental Odontológico'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">RDC 1.002/2025 & RDC 15/2012 (Rastreabilidade e Vida Útil)</p>
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
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Nome do Instrumental *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cureta Gracey nº 7-8, Fórceps 150, Espelho Bucal, etc."
              className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-sm"
            />
          </div>

          {/* CAMPO DE QUANTIDADE EM ESTOQUE / ACERVO (DESTAQUE) */}
          <div className="bg-[#F8FAF9] border border-teal-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>Quantidade em Acervo / Peças na Clínica *</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                (Nas clínicas nunca se tem apenas 1 peça)
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center transition border border-[#E2ECE6] shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="1"
                max="999"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-white border border-teal-300 rounded-xl py-2 px-3 text-center text-base font-bold text-teal-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-sm"
              />

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center transition border border-[#E2ECE6] shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Atalhos rápidos de quantidade comuns em odontologia */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-medium">Adicionar rápido:</span>
              {[2, 5, 10, 15, 20].map((qtyVal) => (
                <button
                  key={qtyVal}
                  type="button"
                  onClick={() => setQuantity(qtyVal)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                    quantity === qtyVal
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-[#E2ECE6]'
                  }`}
                >
                  {qtyVal} un.
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Especialidade / Categoria
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as DentalInstrument['category'];
                  setCategory(val);
                  if (val === 'CIRURGIA' || val === 'PERIODONTIA' || val === 'IMPLANTODONTIA') {
                    setCriticality('CRITICAL');
                  } else {
                    setCriticality('SEMI_CRITICAL');
                  }
                }}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              >
                <option value="CIRURGIA">Cirurgia Bucomaxilofacial</option>
                <option value="PERIODONTIA">Periodontia</option>
                <option value="ENDODONTIA">Endodontia</option>
                <option value="DENTISTICA">Dentística / Clínica Geral</option>
                <option value="ORTODONTIA">Ortodontia</option>
                <option value="IMPLANTODONTIA">Implantodontia</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Classificação de Risco (RDC 1002)
              </label>
              <select
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as InstrumentCriticality)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              >
                <option value="CRITICAL">Artigo Crítico (Penetra Tecido/Osso)</option>
                <option value="SEMI_CRITICAL">Artigo Semicrítico (Mucosa Íntegra)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Marca / Fabricante
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Hu-Friedy, Golgran, Quinelato, Duflex"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Material / Liga
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Ex: Aço Inox AISI 420, Titânio"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Tag Base / Tombamento (Opcional)
              </label>
              <input
                type="text"
                value={serialOrTag}
                onChange={(e) => setSerialOrTag(e.target.value)}
                placeholder="Ex: TAG-CIR-08, #LOTE-2025"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Limite de Ciclos (Vida Útil / Reafiação)
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={maxReprocessCycles}
                onChange={(e) => setMaxReprocessCycles(parseInt(e.target.value) || 100)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
              <span className="text-[10px] text-slate-500 font-medium">
                Padrão: 80 para curetas, 150 para cirúrgicos
              </span>
            </div>
          </div>

          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-teal-950">
            <Sparkles className="w-4 h-4 shrink-0 text-teal-700 mt-0.5" />
            <p className="leading-relaxed">
              Ao registrar os instrumentais e sua quantidade real em estoque, o OdontoShield permite monitorar tanto o inventário total quanto os ciclos de esterilização sofridos pelo acervo da clínica, emitindo alertas antes do desgaste do corte ou risco de fadiga do metal.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2ECE6] shrink-0">
            {isEditing && onDelete && instrumentToEdit ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Deseja realmente excluir "${instrumentToEdit.name}" do acervo?`)) {
                    onDelete(instrumentToEdit.id);
                  }
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2.5">
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
                <span>{isEditing ? 'Salvar Alterações' : 'Salvar Instrumental'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
