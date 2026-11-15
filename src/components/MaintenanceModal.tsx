'use client';

import React, { useState, useEffect } from 'react';
import { X, Wrench, CheckCircle2, Calendar, User, FileText } from 'lucide-react';
import { EquipmentItem } from '@/lib/types';

interface MaintenanceModalProps {
  equipment: EquipmentItem;
  onClose: () => void;
  onMaintenanceRecorded: (
    equipmentId: string,
    technicianName: string,
    notes: string,
    nextDate: string
  ) => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  equipment,
  onClose,
  onMaintenanceRecorded,
}) => {
  const [technicianName, setTechnicianName] = useState('Assistência Técnica Especializada');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(
    'Substituição de filtros, limpeza de tubulação com pastilha enzimática e teste de sucção conforme POP-MAN-08.'
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Calcula próxima manutenção em 180 dias
  const defaultNextDate = new Date();
  defaultNextDate.setDate(defaultNextDate.getDate() + 180);
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState(
    defaultNextDate.toISOString().slice(0, 10)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianName.trim() || !notes.trim()) return;

    onMaintenanceRecorded(equipment.id, technicianName, notes, nextMaintenanceDate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E2ECE6] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2ECE6] bg-[#F8FAF9] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Registrar Manutenção Imediata</h3>
              <p className="text-[11px] text-slate-500 font-medium">{equipment.name}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#E2ECE6] space-y-1.5">
            <div className="flex justify-between text-slate-700 font-medium">
              <span className="text-slate-500">Localização:</span>
              <span className="font-bold text-slate-800">{equipment.locationRoom}</span>
            </div>
            <div className="flex justify-between text-slate-700 font-medium">
              <span className="text-slate-500">Número de Série:</span>
              <span className="font-mono font-bold text-teal-800">{equipment.serialNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-800 block mb-1">
                Data do Serviço *
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-800 block mb-1">
                Próxima Manutenção *
              </label>
              <input
                type="date"
                value={nextMaintenanceDate}
                onChange={(e) => setNextMaintenanceDate(e.target.value)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-800 block mb-1">
              Técnico / Empresa Responsável *
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-800 block mb-1">
              Descrição do Serviço Realizado *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#E2ECE6] rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed shadow-sm"
            />
          </div>

          {/* Rodapé */}
          <div className="pt-3 border-t border-[#E2ECE6] flex justify-end space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-700/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir & Regularizar Equipamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
