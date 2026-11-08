'use client';

import React, { useState, useEffect } from 'react';
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
  Keyboard,
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

  // Seleciona o primeiro membro se o atual for nulo
  useEffect(() => {
    if (!selectedMember && teamMembers.length > 0) {
      setSelectedMember(teamMembers[0]);
    }
  }, [teamMembers, selectedMember]);

  // Suporte a teclado físico no computador (teclas 0-9 e Backspace)
  useEffect(() => {
    if (!isOpen || activeTab !== 'pin') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' && allowClose && onClose) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, pinDigits, allowClose, onClose]);

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
        // Fallback local caso offline ou sem rede
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-[#E2ECE6] rounded-3xl max-w-md md:max-w-3xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[95vh] text-slate-800">
        {/* Cabeçalho Hospitalar Acetinado */}
        <div className="p-4 md:px-6 md:py-4 bg-gradient-to-b from-[#F4F8F6] to-white border-b border-[#E2ECE6] relative shrink-0">
          {allowClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>OdontoShield</span>
                  <span className="text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-300">
                    RDC 1002
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Troca rápida de operador para registro sanitário rastreável
                </p>
              </div>
            </div>

            {/* Abas PIN vs E-mail */}
            <div className="flex bg-[#F4F8F6] p-1 rounded-xl border border-[#E2ECE6] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('pin');
                  setErrorMsg(null);
                  setPinDigits('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'pin'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>PIN Rápido</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('email');
                  setErrorMsg(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'email'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>E-mail</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="mx-4 md:mx-6 mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in shake duration-200 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Conteúdo Aba PIN: Layout 2 Colunas no Computador */}
        {activeTab === 'pin' && (
          <div className="p-4 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-start">
              {/* Coluna 1: Lista de Profissionais da Equipe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    1. Selecione o profissional:
                  </label>
                  <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {teamMembers.length} profissional(is)
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 md:max-h-[300px] overflow-y-auto pr-1">
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
                        className={`w-full p-2.5 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs ring-1 ring-teal-500/40'
                            : 'bg-[#F8FAF9] border-[#E2ECE6] text-slate-800 hover:border-teal-300 hover:bg-[#F4F8F6]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected
                              ? 'bg-teal-600 text-white font-black'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div className="truncate flex-1">
                          <div className="font-bold text-xs truncate leading-tight text-slate-900">
                            {member.name}
                          </div>
                          <div className="text-[10px] text-teal-800 font-medium truncate">
                            {member.roleName}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coluna 2: PIN + Teclado Numérico */}
              <div className="flex flex-col items-center bg-[#F4F8F6] p-4 rounded-2xl border border-[#E2ECE6]">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block text-center mb-1">
                  2. Digite o PIN de 4 dígitos:
                </label>
                <div className="text-xs text-teal-800 font-bold mb-2 truncate max-w-[220px]">
                  {selectedMember?.name || 'Profissional'}
                </div>

                {/* Display dos 4 Dígitos */}
                <div className="flex items-center justify-center space-x-3 my-1.5">
                  {[0, 1, 2, 3].map((idx) => {
                    const isFilled = pinDigits.length > idx;
                    return (
                      <div
                        key={idx}
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                          isFilled
                            ? 'bg-teal-600 border-teal-600 scale-110 shadow-sm'
                            : 'bg-white border-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>

                {selectedMember?.pin && (
                  <span className="text-[10px] font-mono text-slate-500 mb-2">
                    Dica demonstração: PIN <strong>{selectedMember.pin}</strong>
                  </span>
                )}

                {/* Teclado Numérico Compacto */}
                <div className="grid grid-cols-3 gap-1.5 w-full max-w-[240px]">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleDigitPress(digit)}
                      disabled={isLoading}
                      className="h-10 rounded-xl bg-white hover:bg-teal-50 border border-[#E2ECE6] active:scale-95 text-slate-900 font-bold text-base transition flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs border border-[#E2ECE6] active:scale-95 transition flex items-center justify-center shadow-2xs"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDigitPress('0')}
                    disabled={isLoading}
                    className="h-10 rounded-xl bg-white hover:bg-teal-50 border border-[#E2ECE6] active:scale-95 text-slate-900 font-bold text-base transition flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-2xs"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    disabled={isLoading}
                    className="h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-[#E2ECE6] active:scale-95 transition flex items-center justify-center shadow-2xs"
                    title="Apagar"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2.5 text-[10px] text-slate-500 flex items-center space-x-1">
                  <Keyboard className="w-3 h-3 text-teal-600" />
                  <span>Você também pode usar o teclado físico (0-9)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Aba E-mail */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="p-4 md:p-6 space-y-4 max-w-sm mx-auto w-full">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                E-mail Profissional:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: dr.lucas@odontoinova.com.br"
                  required
                  className="w-full bg-[#F4F8F6] border border-[#E2ECE6] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Senha de Acesso:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-[#F4F8F6] border border-[#E2ECE6] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-98 disabled:opacity-50"
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>
        )}

        {/* Rodapé */}
        <div className="p-3 bg-[#F4F8F6] border-t border-[#E2ECE6] text-center text-[10px] text-slate-500 flex items-center justify-center space-x-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Sincronização Cloud Multi-usuário em Tempo Real • RDC 1002</span>
        </div>
      </div>
    </div>
  );
};
