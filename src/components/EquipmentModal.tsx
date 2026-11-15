'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Building2,
  FileCheck,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { EquipmentItem } from '@/lib/types';

interface EquipmentModalProps {
  equipmentToEdit?: EquipmentItem | null;
  defaultCategory?: EquipmentItem['category'];
  onClose: () => void;
  onSave: (equipment: EquipmentItem) => void;
  onDelete?: (equipmentId: string) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  equipmentToEdit,
  defaultCategory = 'AUTOCLAVE',
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(equipmentToEdit);

  const [category, setCategory] = useState<EquipmentItem['category']>(
    equipmentToEdit?.category || defaultCategory
  );
  const [name, setName] = useState(
    equipmentToEdit?.name || (defaultCategory === 'AUTOCLAVE' ? 'Autoclave 01 (CME)' : '')
  );
  const [brand, setBrand] = useState(equipmentToEdit?.brand || 'Cristófoli');
  const [model, setModel] = useState(equipmentToEdit?.model || 'Vitale Class 21L');
  const [serialNumber, setSerialNumber] = useState(equipmentToEdit?.serialNumber || '');
  const [locationRoom, setLocationRoom] = useState(
    equipmentToEdit?.locationRoom || (defaultCategory === 'AUTOCLAVE' ? 'CME' : 'Consultório 01')
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultNext = new Date();
  defaultNext.setDate(defaultNext.getDate() + 365);
  const defaultNextStr = defaultNext.toISOString().slice(0, 10);

  const [lastMaintenance, setLastMaintenance] = useState(
    equipmentToEdit?.lastMaintenance || todayStr
  );
  const [nextMaintenance, setNextMaintenance] = useState(
    equipmentToEdit?.nextMaintenance || defaultNextStr
  );
  const [technicianName, setTechnicianName] = useState(
    equipmentToEdit?.technicianName || 'Assistência Técnica Especializada'
  );
  const [technicianPhone, setTechnicianPhone] = useState(
    equipmentToEdit?.technicianPhone || '5511999999999'
  );

  // Campos Normativos Específicos
  const [thermalQualificationDate, setThermalQualificationDate] = useState(
    equipmentToEdit?.thermalQualificationDate || todayStr
  );
  const [nr13HydrostaticTestDate, setNr13HydrostaticTestDate] = useState(
    equipmentToEdit?.nr13HydrostaticTestDate || todayStr
  );
  const [nr13SafetyValveCalibration, setNr13SafetyValveCalibration] = useState(
    equipmentToEdit?.nr13SafetyValveCalibration || todayStr
  );
  const [radiationSurveyDate, setRadiationSurveyDate] = useState(
    equipmentToEdit?.radiationSurveyDate || todayStr
  );
  const [headLeakageTestDate, setHeadLeakageTestDate] = useState(
    equipmentToEdit?.headLeakageTestDate || todayStr
  );
  const [medicalPhysicistName, setMedicalPhysicistName] = useState(
    equipmentToEdit?.medicalPhysicistName || 'Dra. Beatriz Santos (Física Médica)'
  );
  const [medicalPhysicistRegister, setMedicalPhysicistRegister] = useState(
    equipmentToEdit?.medicalPhysicistRegister || 'ABFM-0412 / CREA-SP 506912'
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !serialNumber.trim()) return;

    // Calcula dias restantes até a próxima manutenção
    const now = new Date();
    const nextDate = new Date(nextMaintenance);
    const diffTime = nextDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const status: EquipmentItem['status'] =
      daysRemaining < 0 ? 'EXPIRED' : daysRemaining < 30 ? 'WARNING' : 'OK';

    const savedItem: EquipmentItem = {
      id: equipmentToEdit?.id || `eq-${Date.now()}`,
      name: name.trim(),
      category,
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim(),
      locationRoom: locationRoom.trim(),
      lastMaintenance,
      nextMaintenance,
      daysRemaining,
      status,
      hasLaudo: true,
      technicianName: technicianName.trim(),
      technicianPhone: technicianPhone.trim(),
      thermalQualificationDate: category === 'AUTOCLAVE' ? thermalQualificationDate : undefined,
      nr13HydrostaticTestDate: category === 'COMPRESSOR' ? nr13HydrostaticTestDate : undefined,
      nr13SafetyValveCalibration: category === 'COMPRESSOR' ? nr13SafetyValveCalibration : undefined,
      radiationSurveyDate: category === 'RAIO_X' ? radiationSurveyDate : undefined,
      headLeakageTestDate: category === 'RAIO_X' ? headLeakageTestDate : undefined,
      medicalPhysicistName: category === 'RAIO_X' ? medicalPhysicistName : undefined,
      medicalPhysicistRegister: category === 'RAIO_X' ? medicalPhysicistRegister : undefined,
    };

    onSave(savedItem);
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
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isEditing ? 'Editar Equipamento / Autoclave' : 'Cadastrar Equipamento Odontológico'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Rastreabilidade de laudos, testes e manutenções preventivas (RDC 1002 / NR-13)
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

        {/* Formulário Rolável */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Categoria do Equipamento */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Tipo / Categoria de Equipamento *
            </label>
            <select
              value={category}
              onChange={(e) => {
                const val = e.target.value as EquipmentItem['category'];
                setCategory(val);
                if (val === 'AUTOCLAVE') {
                  setName('Autoclave 01 (CME)');
                  setBrand('Cristófoli');
                  setModel('Vitale Class 21L');
                  setLocationRoom('CME');
                } else if (val === 'COMPRESSOR') {
                  setName('Compressor Odontológico Silencioso');
                  setBrand('Schuster');
                  setModel('Air Compact 40L');
                  setLocationRoom('Casa de Máquinas');
                } else if (val === 'RAIO_X') {
                  setName('Raio-X Intraoral Pantográfico');
                  setBrand('Dabi Atlante');
                  setModel('Spectro 70X');
                  setLocationRoom('Consultório 01');
                }
              }}
              className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 font-bold shadow-sm"
            >
              <option value="AUTOCLAVE">Autoclave (Esterilização a Vapor - CME)</option>
              <option value="COMPRESSOR">Compressor de Ar (Vaso de Pressão - NR-13)</option>
              <option value="RAIO_X">Aparelho de Raio-X Intraoral (Radioproteção)</option>
              <option value="SUGADOR">Bomba de Vácuo / Sugador Cirúrgico</option>
              <option value="FOTOPOLIMERIZADOR">Fotopolimerizador LED</option>
            </select>
          </div>

          {/* Nome e Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nome de Identificação / Apelido *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Autoclave 01 (CME Principal)"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Localização / Sala na Clínica *
              </label>
              <input
                type="text"
                required
                value={locationRoom}
                onChange={(e) => setLocationRoom(e.target.value)}
                placeholder="Ex: CME, Consultório 1, Casa de Máquinas"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
          </div>

          {/* Marca, Modelo e Número de Série */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Marca / Fabricante *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Cristófoli, Gnatus"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Modelo / Litragem *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Vitale Class 21L"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Número de Série *
              </label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Ex: CRIS-8841-B"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
          </div>

          {/* Manutenções Preventivas */}
          <div className="bg-[#F8FAF9] border border-[#E2ECE6] rounded-2xl p-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
              Controle de Manutenção e Validação
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Última Manutenção / Revisão *
                </label>
                <input
                  type="date"
                  required
                  value={lastMaintenance}
                  onChange={(e) => setLastMaintenance(e.target.value)}
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Próxima Manutenção Prevista *
                </label>
                <input
                  type="date"
                  required
                  value={nextMaintenance}
                  onChange={(e) => setNextMaintenance(e.target.value)}
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Técnico / Empresa Autorizada
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="Ex: Cristófoli Assistência SP"
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  WhatsApp do Técnico (para acionamento rápido)
                </label>
                <input
                  type="text"
                  value={technicianPhone}
                  onChange={(e) => setTechnicianPhone(e.target.value)}
                  placeholder="Ex: 5511999998888"
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Campos Exclusivos por Categoria Normativa (RDC 1002 / NR-13) */}
          {category === 'AUTOCLAVE' && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Exigência RDC 1002: Qualificação Térmica da Autoclave
              </span>
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Data do Laudo de Qualificação Térmica (Termopares de Carga) *
                </label>
                <input
                  type="date"
                  value={thermalQualificationDate}
                  onChange={(e) => setThermalQualificationDate(e.target.value)}
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                />
                <span className="text-[10px] text-slate-600 mt-1 block font-medium">
                  Atesta a distribuição de calor homogênea na câmara da autoclave.
                </span>
              </div>
            </div>
          )}

          {category === 'COMPRESSOR' && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Exigência Norma NR-13: Vasos Sob Pressão
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Data do Teste Hidrostático do Reservatório *
                  </label>
                  <input
                    type="date"
                    value={nr13HydrostaticTestDate}
                    onChange={(e) => setNr13HydrostaticTestDate(e.target.value)}
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Calibração da Válvula de Segurança *
                  </label>
                  <input
                    type="date"
                    value={nr13SafetyValveCalibration}
                    onChange={(e) => setNr13SafetyValveCalibration(e.target.value)}
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {category === 'RAIO_X' && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Exigência Radioproteção: Físico Médico Responsável
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Levantamento Radiométrico *
                  </label>
                  <input
                    type="date"
                    value={radiationSurveyDate}
                    onChange={(e) => setRadiationSurveyDate(e.target.value)}
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Teste de Fuga de Cabeçote *
                  </label>
                  <input
                    type="date"
                    value={headLeakageTestDate}
                    onChange={(e) => setHeadLeakageTestDate(e.target.value)}
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Físico Médico Responsável
                  </label>
                  <input
                    type="text"
                    value={medicalPhysicistName}
                    onChange={(e) => setMedicalPhysicistName(e.target.value)}
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Registro Profissional (ABFM / CREA)
                  </label>
                  <input
                    type="text"
                    value={medicalPhysicistRegister}
                    onChange={(e) => setMedicalPhysicistRegister(e.target.value)}
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rodapé de Ações */}
          <div className="pt-4 border-t border-[#E2ECE6] flex items-center justify-between shrink-0">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (equipmentToEdit?.id) {
                    onDelete(equipmentToEdit.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
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
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-700/20 transition flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Salvar Equipamento'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
