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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">Registrar Manutenção Imediata</h3>
              <p className="text-[11px] text-slate-400">{equipment.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Localização:</span>
              <span className="font-medium">{equipment.locationRoom}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Número de Série:</span>
              <span className="font-mono text-cyan-400">{equipment.serialNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Data do Serviço *
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Próxima Manutenção *
              </label>
              <input
                type="date"
                value={nextMaintenanceDate}
                onChange={(e) => setNextMaintenanceDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Técnico / Empresa Responsável *
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Descrição do Serviço Realizado *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Rodapé */}
          <div className="pt-2 flex justify-end space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-md transition"
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
