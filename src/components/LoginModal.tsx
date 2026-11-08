'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Delete,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { TeamMember, UserProfile } from '@/lib/types';

interface LoginModalProps {
  teamMembers: TeamMember[];
  currentUser: UserProfile;
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  allowClose?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  teamMembers,
  isOpen,
  onClose,
  onLoginSuccess,
  allowClose = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pin' | 'email'>('pin');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(
    teamMembers[0] || null
  );
  const [pinDigits, setPinDigits] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const nextPin = pinDigits + digit;
      setPinDigits(nextPin);
      setErrorMsg(null);

      // Auto-submit quando atinge 4 dígitos
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    setPinDigits('');
    setErrorMsg(null);
  };

  const verifyPin = async (pinToTest: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToTest }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        setPinDigits('');
        if (onClose) onClose();
      } else {
        // Fallback local caso offline
        if (selectedMember && selectedMember.pin === pinToTest) {
          onLoginSuccess({
            id: selectedMember.id,
            name: selectedMember.name,
            email: selectedMember.email,
            role: selectedMember.role,
            roleName: selectedMember.roleName,
            councilNumber: selectedMember.councilNumber,
            councilState: selectedMember.councilState,
            cpf: selectedMember.cpf,
            phone: selectedMember.phone,
          });
          setPinDigits('');
          if (onClose) onClose();
          return;
        }

        setErrorMsg(data.message || 'PIN incorreto. Tente novamente.');
        setPinDigits('');
      }
    } catch {
      // Fallback local se rede falhar
      if (selectedMember && selectedMember.pin === pinToTest) {
        onLoginSuccess({
          id: selectedMember.id,
          name: selectedMember.name,
          email: selectedMember.email,
          role: selectedMember.role,
          roleName: selectedMember.roleName,
          councilNumber: selectedMember.councilNumber,
          councilState: selectedMember.councilState,
          cpf: selectedMember.cpf,
          phone: selectedMember.phone,
        });
        setPinDigits('');
        if (onClose) onClose();
      } else {
        setErrorMsg('PIN incorreto.');
        setPinDigits('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        setEmail('');
        setPassword('');
        if (onClose) onClose();
      } else {
        setErrorMsg(data.message || 'E-mail ou senha inválidos.');
      }
    } catch {
      setErrorMsg('Falha ao autenticar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center relative">
          {allowClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            OdontoShield <span className="text-cyan-400 text-xs font-mono font-normal">RDC 1002</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Identificação segura para auditoria sanitária e rastreabilidade
          </p>

          {/* Abas PIN vs E-mail */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mt-4 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pin');
                setErrorMsg(null);
                setPinDigits('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'pin'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>PIN Rápido (Bancada)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('email');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'email'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail / Senha</span>
            </button>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center space-x-2 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Conteúdo Aba PIN */}
        {activeTab === 'pin' && (
          <div className="p-6 space-y-4">
            {/* Seletor Rápido de Colaborador */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                1. Selecione o profissional:
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {teamMembers.map((member) => {
                  const isSelected = selectedMember?.id === member.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setSelectedMember(member);
                        setPinDigits('');
                        setErrorMsg(null);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md ring-1 ring-cyan-500/50'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-xs truncate leading-tight">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {member.roleName.split(' ')[0]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display do PIN de 4 Dígitos */}
            <div className="text-center pt-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                2. Digite o PIN de 4 dígitos ({selectedMember?.name}):
              </label>

              <div className="flex items-center justify-center space-x-3 my-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinDigits.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                        isFilled
                          ? 'bg-cyan-400 border-cyan-400 scale-110 shadow-lg shadow-cyan-400/50'
                          : 'bg-slate-950 border-slate-700'
                      }`}
                    />
                  );
                })}
              </div>

              {selectedMember?.pin && (
                <span className="text-[10px] font-mono text-slate-400">
                  Dica de demonstração: PIN <strong>{selectedMember.pin}</strong>
                </span>
              )}
            </div>

            {/* Teclado Numérico Touch */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitPress(digit)}
                  disabled={isLoading}
                  className="h-12 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 active:scale-95 text-white font-bold text-lg transition flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="h-12 rounded-2xl bg-slate-950/60 hover:bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-800/80 active:scale-95 transition flex items-center justify-center"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                disabled={isLoading}
                className="h-12 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 active:scale-95 text-white font-bold text-lg transition flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                disabled={isLoading}
                className="h-12 rounded-2xl bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800/80 active:scale-95 transition flex items-center justify-center"
                title="Apagar"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Aba E-mail */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                E-mail Profissional:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: dr.lucas@odontoinova.com.br"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Senha de Acesso:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 transition active:scale-98 disabled:opacity-50"
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>
        )}

        {/* Rodapé */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sincronização Cloud Multi-usuário em Tempo Real</span>
        </div>
      </div>
    </div>
  );
};
