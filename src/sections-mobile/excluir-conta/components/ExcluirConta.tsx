import { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Fingerprint,
  Mail,
  Trash2,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import type {
  ExcluirContaProps,
  Tema,
} from '@/../product-mobile/sections/excluir-conta/types'

// ─── Tokens ──────────────────────────────────────────────────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgInner: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textMuted: string
  border: string
  borderSubtle: string
  inputBg: string
  inputBorder: string
}

function tokens(tema: Tema): TT {
  if (tema === 'claro') {
    return {
      bgPage: 'bg-stone-50',
      bgCard: 'bg-white',
      bgInner: 'bg-stone-100',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-500',
      textTertiary: 'text-stone-400',
      textMuted: 'text-stone-400',
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
      inputBg: 'bg-stone-50',
      inputBorder: 'border-stone-300',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgInner: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    textMuted: 'text-slate-600',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
    inputBg: 'bg-slate-950',
    inputBorder: 'border-slate-700',
  }
}

const ITENS_APAGADOS: { icon: LucideIcon; label: string }[] = [
  { icon: Trash2, label: 'Perfil e identidade' },
  { icon: Trash2, label: 'Métricas de saúde' },
  { icon: Trash2, label: 'Fotos corporais' },
  { icon: Trash2, label: 'Exames e laudos' },
  { icon: Trash2, label: 'Mensagens com profissionais' },
  { icon: Trash2, label: 'Conexões ativas' },
  { icon: Trash2, label: 'Plano e benefícios' },
  { icon: Trash2, label: 'Histórico de chat IA' },
]

function formatLocalizedDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

// ─────────────────────────────────────────────────────────────────────────

export function ExcluirConta({
  data,
  onConfirmar,
  onConfirmarBiometria,
  onCancelar,
  onConcluido,
  onReverterExclusao,
}: ExcluirContaProps) {
  const t = tokens(data.tema)
  const [aceitou, setAceitou] = useState(false)
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [revertendo, setRevertendo] = useState(false)
  const [concluido, setConcluido] = useState(false)

  // ── Modo read-only quando já existe exclusão pendente ──────────────────
  if (data.exclusao.pendenteExclusao) {
    return (
      <div className={`min-h-full ${t.bgPage} px-4 pb-6 pt-4`}>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock size={20} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>
                Janela de exclusão ativa
              </h2>
              <p className={`text-[12px] ${t.textSecondary} mt-0.5`}>
                Conta será removida em{' '}
                {data.exclusao.exclusaoEm
                  ? formatLocalizedDate(data.exclusao.exclusaoEm)
                  : '30 dias'}
              </p>
            </div>
          </div>
          <p className={`text-[12.5px] leading-snug ${t.textSecondary}`}>
            Você ainda pode reverter. Email de confirmação enviado para{' '}
            <span className="font-mono">
              {data.exclusao.emailNotificacao ?? 'seu email'}
            </span>
            .
          </p>
          <button
            disabled={revertendo}
            onClick={async () => {
              setRevertendo(true)
              try {
                await onReverterExclusao?.()
              } finally {
                setRevertendo(false)
              }
            }}
            className={`mt-1 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] transition disabled:opacity-50`}
          >
            {revertendo ? 'Cancelando…' : 'Cancelar exclusão'}
          </button>
        </div>
      </div>
    )
  }

  // ── Modal de conclusão ─────────────────────────────────────────────────
  if (concluido) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
        <div className={`w-full max-w-[320px] ${t.bgCard} rounded-3xl p-6 flex flex-col items-center text-center`}>
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
            <Mail size={26} strokeWidth={2.2} />
          </div>
          <h2 className={`text-base font-semibold ${t.textPrimary}`}>
            Conta marcada para exclusão
          </h2>
          <p className={`text-[12.5px] ${t.textSecondary} mt-2 leading-snug`}>
            Enviamos email com link para cancelar. Você tem 30 dias para reverter.
          </p>
          <button
            onClick={onConcluido}
            className="mt-5 w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-[13px] transition"
          >
            Entendi
          </button>
        </div>
      </div>
    )
  }

  // ── Fluxo principal de exclusão ────────────────────────────────────────
  const podeConfirmar = aceitou && senha.length >= 8 && !enviando

  const submeter = async () => {
    if (!aceitou || senha.length < 8) return
    setEnviando(true)
    setErro(null)
    try {
      await onConfirmar?.(senha)
      setConcluido(true)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível concluir. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const submeterBiometria = async () => {
    if (!aceitou) return
    setEnviando(true)
    setErro(null)
    try {
      await onConfirmarBiometria?.()
      setConcluido(true)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha na biometria. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={`min-h-full ${t.bgPage} px-4 pb-8 pt-4 flex flex-col gap-3.5`}>
      {/* Hero rose */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/15 to-transparent p-5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
          <AlertTriangle size={22} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <h1 className={`text-[18px] font-semibold ${t.textPrimary} leading-tight`}>
            Excluir minha conta
          </h1>
          <p className={`text-[12px] ${t.textSecondary} mt-0.5`}>
            Reversível por 30 dias após confirmação
          </p>
        </div>
      </div>

      {/* O que será apagado */}
      <div className={`${t.bgCard} rounded-2xl border ${t.border} p-4`}>
        <div className={`text-[10px] font-semibold uppercase tracking-wider ${t.textSecondary} mb-2.5`}>
          O que será apagado
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {ITENS_APAGADOS.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${t.bgInner}`}
              >
                <Icon size={12} strokeWidth={2.2} className="text-rose-400 shrink-0" />
                <span className={`text-[12.5px] ${t.textPrimary}`}>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dados de pesquisa (condicional) */}
      {data.compartilhaDadosAnonimos && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <UserCheck size={14} strokeWidth={2.2} className="text-amber-400 shrink-0 mt-0.5" />
          <p className={`text-[12px] leading-snug ${t.textSecondary}`}>
            <span className={`font-semibold ${t.textPrimary}`}>
              Sobre dados anônimos de pesquisa:
            </span>{' '}
            métricas agregadas que você compartilhou permanecem na plataforma — não há
            vínculo com sua identidade, portanto não são apagadas.
          </p>
        </div>
      )}

      {/* Como funciona */}
      <div className={`rounded-2xl border ${t.border} ${t.bgCard} p-4 flex gap-3`}>
        <Clock size={14} strokeWidth={2.2} className="text-sky-400 shrink-0 mt-0.5" />
        <p className={`text-[12.5px] leading-snug ${t.textSecondary}`}>
          <span className={`font-semibold ${t.textPrimary}`}>Como funciona:</span> sua
          conta entra em janela de 30 dias. Faça login novamente nesse período para
          cancelar. Após 30 dias, dados são removidos permanentemente.
        </p>
      </div>

      {/* Checkbox de aceitação */}
      <label
        className={`w-full px-4 py-3.5 rounded-2xl border ${
          aceitou
            ? 'border-rose-500/40 bg-rose-500/5 ring-2 ring-rose-500/20'
            : `${t.border} ${t.bgCard}`
        } flex items-start gap-3 cursor-pointer transition-all`}
      >
        <input
          type="checkbox"
          checked={aceitou}
          onChange={(e) => setAceitou(e.target.checked)}
          className="w-5 h-5 mt-0.5 rounded accent-rose-500 cursor-pointer shrink-0"
        />
        <span className={`text-[13px] leading-snug ${t.textPrimary}`}>
          Entendo que esta ação é{' '}
          <span className="font-semibold text-rose-400">irreversível após 30 dias</span>
        </span>
      </label>

      {/* Campo de senha (revelado quando aceitou) */}
      {aceitou && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className={`text-[12px] font-semibold ${t.textSecondary} px-1`}>
            Confirme sua senha
          </label>
          <div className="relative">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className={`w-full px-3.5 py-3 rounded-xl ${t.inputBg} border ${t.inputBorder} ${t.textPrimary} text-[14px] focus:outline-none focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20 pr-11`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.textTertiary} hover:${t.textPrimary} transition`}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>
          {data.biometriaAtiva && (
            <button
              type="button"
              onClick={submeterBiometria}
              disabled={enviando}
              className={`mt-1 w-full py-2.5 rounded-xl ${t.bgCard} border ${t.border} ${t.textPrimary} text-[12.5px] font-semibold flex items-center justify-center gap-2 hover:${t.bgInner} transition disabled:opacity-50`}
            >
              <Fingerprint size={14} strokeWidth={2.2} />
              Usar biometria
            </button>
          )}
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 text-[12px] text-rose-300">
          {erro}
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col gap-2 mt-1">
        <button
          type="button"
          disabled={!podeConfirmar}
          onClick={submeter}
          className={`w-full py-3.5 rounded-xl font-semibold text-[14px] text-white transition ${
            podeConfirmar
              ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
              : 'bg-rose-600/30 cursor-not-allowed'
          }`}
        >
          {enviando ? 'Excluindo…' : 'Excluir conta agora'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
          className={`w-full py-3.5 rounded-xl font-semibold text-[14px] ${t.textPrimary} ${t.bgCard} border ${t.border} hover:${t.bgInner} transition disabled:opacity-50`}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
