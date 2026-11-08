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
              <Stethoscope className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {isEditing ? 'Editar Instrumental Odontológico' : 'Cadastrar Novo Instrumental Odontológico'}
              </h3>
              <p className="text-[11px] text-slate-400">RDC 1.002/2025 & RDC 15/2012 (Rastreabilidade e Vida Útil)</p>
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
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Nome do Instrumental *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cureta Gracey nº 7-8, Fórceps 150, Espelho Bucal, etc."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* CAMPO DE QUANTIDADE EM ESTOQUE / ACERVO (DESTAQUE) */}
          <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Quantidade em Acervo / Peças na Clínica *</span>
              </label>
              <span className="text-[10px] text-slate-400">
                (Nas clínicas nunca se tem apenas 1 peça)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition border border-slate-700"
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
                className="flex-1 bg-slate-900 border border-cyan-500/50 rounded-lg py-2 px-3 text-center text-sm font-bold text-cyan-200 focus:outline-none focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition border border-slate-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Atalhos rápidos de quantidade comuns em odontologia */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-slate-500">Adicionar rápido:</span>
              {[2, 5, 10, 15, 20].map((qtyVal) => (
                <button
                  key={qtyVal}
                  type="button"
                  onClick={() => setQuantity(qtyVal)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition border ${
                    quantity === qtyVal
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
                  }`}
                >
                  {qtyVal} un.
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
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
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
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
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Classificação de Risco (RDC 1002)
              </label>
              <select
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as InstrumentCriticality)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="CRITICAL">Artigo Crítico (Penetra Tecido/Osso)</option>
                <option value="SEMI_CRITICAL">Artigo Semicrítico (Mucosa Íntegra)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Marca / Fabricante
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Hu-Friedy, Golgran, Quinelato, Duflex"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Material / Liga
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Ex: Aço Inox AISI 420, Titânio"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Tag Base / Tombamento (Opcional)
              </label>
              <input
                type="text"
                value={serialOrTag}
                onChange={(e) => setSerialOrTag(e.target.value)}
                placeholder="Ex: TAG-CIR-08, #LOTE-2025"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Limite de Ciclos (Vida Útil / Reafiação)
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={maxReprocessCycles}
                onChange={(e) => setMaxReprocessCycles(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">
                Padrão: 80 para curetas, 150 para cirúrgicos
              </span>
            </div>
          </div>

          <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-3 flex items-start space-x-2 text-[11px] text-cyan-300">
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <p>
              Ao registrar os instrumentais e sua quantidade real em estoque, o OdontoShield permite monitorar tanto o inventário total quanto os ciclos de esterilização sofridos pelo acervo da clínica, emitindo alertas antes do desgaste do corte ou risco de fadiga do metal.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0">
            {isEditing && onDelete && instrumentToEdit ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Deseja realmente excluir "${instrumentToEdit.name}" do acervo?`)) {
                    onDelete(instrumentToEdit.id);
                  }
                }}
                className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded-lg text-xs font-medium transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-600/20 transition flex items-center space-x-1.5 cursor-pointer"
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
