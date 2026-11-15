'use client';

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck, Mail, Phone, Hash } from 'lucide-react';
import { Role, TeamMember } from '@/lib/types';

interface NewMemberModalProps {
  onClose: () => void;
  onMemberAdded: (member: TeamMember) => void;
}

export const NewMemberModal: React.FC<NewMemberModalProps> = ({ onClose, onMemberAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState<Role>('DENTAL_ASSISTANT');
  const [councilNumber, setCouncilNumber] = useState('');
  const [councilState, setCouncilState] = useState('SP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    let roleName = 'Auxiliar em Saúde Bucal (ASB)';
    if (role === 'TECHNICAL_RESPONSIBLE') roleName = 'Responsável Técnico (RT)';
    if (role === 'DENTIST') roleName = 'Cirurgião-Dentista';
    if (role === 'CLINIC_ADMIN') roleName = 'Gestor Administrativo';

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      cpf: cpf.trim() || '000.000.000-00',
      role,
      roleName,
      councilNumber: councilNumber.trim() || undefined,
      councilState: councilNumber.trim() ? councilState : undefined,
      active: true,
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: 'Aguardando 1º acesso',
    };

    onMemberAdded(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-white border border-[#E2ECE6] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-slate-900">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2ECE6] bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Cadastrar / Convidar Membro da Equipe
              </h3>
              <p className="text-[11px] text-slate-500">
                Cadastro para acesso ao PWA da CME, assinatura de POPs e rastreabilidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs bg-white">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Nome Completo do Profissional *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ana Carolina Silva"
              className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Função / Papel no Sistema *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 font-semibold text-teal-800"
              >
                <option value="DENTAL_ASSISTANT">Auxiliar em Saúde Bucal (ASB)</option>
                <option value="DENTAL_ASSISTANT">Técnico em Saúde Bucal (TSB)</option>
                <option value="DENTIST">Cirurgião-Dentista</option>
                <option value="TECHNICAL_RESPONSIBLE">Responsável Técnico (RT)</option>
                <option value="CLINIC_ADMIN">Gestor Administrativo</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                CPF (Para validade jurídica de POPs) *
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                required
              />
            </div>
          </div>

          {/* Registro de Conselho (CRO / ASB / TSB) */}
          <div className="grid grid-cols-3 gap-2 bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#E2ECE6]">
            <div className="col-span-2">
              <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                Nº Registro no Conselho (CRO / ASB / TSB)
              </label>
              <input
                type="text"
                value={councilNumber}
                onChange={(e) => setCouncilNumber(e.target.value)}
                placeholder="Ex: 102.450 ou 44.890"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block mb-1">UF Conselho</label>
              <select
                value={councilState}
                onChange={(e) => setCouncilState(e.target.value)}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
              >
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
                <option value="PR">PR</option>
                <option value="RS">RS</option>
                <option value="SC">SC</option>
                <option value="BA">BA</option>
                <option value="DF">DF</option>
                <option value="GO">GO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>E-mail para Acesso *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colaborador@clinica.com.br"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>WhatsApp (Convite e Alertas) *</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-8888"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                required
              />
            </div>
          </div>

          <p className="text-[10px] text-teal-900 leading-relaxed bg-teal-50/60 p-3 rounded-xl border border-teal-200">
            Ao salvar, o colaborador receberá permissões personalizadas para o seu perfil e constará formalmente no Quadro de Pessoal do Dossiê de Fiscalização da RDC 1002/2025.
          </p>

          {/* Rodapé */}
          <div className="pt-2 flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-[#E2ECE6] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Cadastro & Liberar Acesso</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
