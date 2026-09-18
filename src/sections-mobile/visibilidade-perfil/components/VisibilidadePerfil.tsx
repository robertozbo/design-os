import { useEffect, useState } from 'react'
import {
  Globe,
  UserCheck,
  Lock,
  Check,
  Loader2,
  Info,
  type LucideIcon,
} from 'lucide-react'
import type {
  VisibilidadePerfilProps,
  Visibilidade,
  Tema,
} from '@/../product-mobile/sections/visibilidade-perfil/types'

// ─── Tokens ──────────────────────────────────────────────────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgInner: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  border: string
  borderSubtle: string
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
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgInner: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
  }
}

interface OpcaoMeta {
  id: Visibilidade
  label: string
  icon: LucideIcon
  cor: 'emerald' | 'sky' | 'slate'
  descricao: string
  vejo: string[]
}

const OPCOES: OpcaoMeta[] = [
  {
    id: 'publico',
    label: 'Público',
    icon: Globe,
    cor: 'emerald',
    descricao: 'Qualquer pessoa pode encontrar e ver seu perfil. Ideal para profissionais que querem visibilidade.',
    vejo: ['Nome e foto', 'Especialidade e bio', 'Métricas públicas (sem dado sensível)'],
  },
  {
    id: 'profissionais',
    label: 'Profissionais conectados',
    icon: UserCheck,
    cor: 'sky',
    descricao: 'Apenas profissionais com vínculo ativo (nutri, personal, médico) podem ver suas informações compartilhadas.',
    vejo: ['Profissionais conectados', 'Dados explicitamente liberados', 'Métricas e exames compartilhados'],
  },
  {
    id: 'privado',
    label: 'Privado',
    icon: Lock,
    cor: 'slate',
    descricao: 'Ninguém pode ver seu perfil além de você. Conexões existentes ficam pausadas até reabertura manual.',
    vejo: ['Somente você', 'Profissionais não recebem atualizações', 'Você ainda usa todas as funções'],
  },
]

const COR_BG: Record<string, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300',
  sky: 'bg-sky-500/15 text-sky-500 dark:text-sky-300',
  slate: 'bg-slate-500/15 text-slate-500 dark:text-slate-300',
}

const COR_RING: Record<string, string> = {
  emerald: 'ring-emerald-500/40 border-emerald-500/50',
  sky: 'ring-sky-500/40 border-sky-500/50',
  slate: 'ring-slate-500/40 border-slate-500/50',
}

// ─────────────────────────────────────────────────────────────────────────

export function VisibilidadePerfil({
  data,
  onMudar,
  onReabrirConexoes,
}: VisibilidadePerfilProps) {
  const t = tokens(data.tema)
  const [atual, setAtual] = useState<Visibilidade>(data.visibilidadeAtual)
  const [mudando, setMudando] = useState<Visibilidade | null>(null)
  const [confirmacao, setConfirmacao] = useState<Visibilidade | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(id)
  }, [toast])

  const aplicar = async (nova: Visibilidade) => {
    if (nova === atual) return
    setMudando(nova)
    try {
      await onMudar?.(nova)
      setAtual(nova)
      setToast(`Visibilidade alterada para ${OPCOES.find((o) => o.id === nova)?.label}`)
    } finally {
      setMudando(null)
      setConfirmacao(null)
    }
  }

  const tentar = (nova: Visibilidade) => {
    if (nova === atual) return
    // Tornar mais restritivo (qualquer → privado) exige confirmação
    if (nova === 'privado' && atual !== 'privado' && data.profissionaisAtivos > 0) {
      setConfirmacao(nova)
      return
    }
    aplicar(nova)
  }

  return (
    <div className={`min-h-full ${t.bgPage} px-4 pb-8 pt-4 flex flex-col gap-3`}>
      {/* Intro curta */}
      <p className={`text-[12.5px] ${t.textSecondary} leading-snug px-1`}>
        Escolha quem pode encontrar e ver seu perfil. A mudança é aplicada imediatamente
        e pode ser revertida a qualquer momento.
      </p>

      {/* Cards de opção */}
      <div className="flex flex-col gap-2.5">
        {OPCOES.map((opt) => {
          const Icon = opt.icon
          const selecionado = atual === opt.id
          const carregando = mudando === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => tentar(opt.id)}
              disabled={Boolean(mudando)}
              className={`text-left rounded-2xl border ${
                selecionado
                  ? `${COR_RING[opt.cor]} ring-2 ${t.bgCard}`
                  : `${t.border} ${t.bgCard} hover:${t.bgInner}`
              } p-4 transition disabled:opacity-60`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${COR_BG[opt.cor]} flex items-center justify-center shrink-0`}>
                  <Icon size={16} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-[14px] font-semibold ${t.textPrimary}`}>
                      {opt.label}
                    </h3>
                    {selecionado ? (
                      carregando ? (
                        <Loader2 size={16} className="animate-spin text-slate-400" />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            opt.cor === 'emerald'
                              ? 'bg-emerald-500'
                              : opt.cor === 'sky'
                                ? 'bg-sky-500'
                                : 'bg-slate-500'
                          }`}
                        >
                          <Check size={11} strokeWidth={3} className="text-white" />
                        </div>
                      )
                    ) : (
                      <div className={`w-5 h-5 rounded-full border ${t.border}`} />
                    )}
                  </div>
                  <p className={`text-[12px] ${t.textSecondary} mt-1 leading-snug`}>
                    {opt.descricao}
                  </p>
                  <div className={`mt-2.5 ${t.bgInner} rounded-lg px-3 py-2 flex flex-col gap-1`}>
                    <div className={`text-[9.5px] font-semibold uppercase tracking-wider ${t.textTertiary}`}>
                      O que outras pessoas veem
                    </div>
                    {opt.vejo.map((linha) => (
                      <div key={linha} className="flex items-start gap-1.5">
                        <span
                          className={`w-1 h-1 rounded-full ${
                            opt.cor === 'emerald'
                              ? 'bg-emerald-500'
                              : opt.cor === 'sky'
                                ? 'bg-sky-500'
                                : 'bg-slate-500'
                          } mt-1.5 shrink-0`}
                        />
                        <span className={`text-[11.5px] ${t.textSecondary} leading-snug`}>{linha}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Banner Privado */}
      {atual === 'privado' && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
          <Info size={14} strokeWidth={2.2} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className={`text-[12.5px] ${t.textPrimary} font-semibold`}>
              Modo privado ativo
            </p>
            <p className={`text-[11.5px] ${t.textSecondary} mt-0.5 leading-snug`}>
              Suas conexões existentes estão pausadas — profissionais não recebem atualizações.
            </p>
            <button
              onClick={onReabrirConexoes}
              className="mt-2 text-[12px] text-amber-400 hover:underline font-semibold"
            >
              Reabrir conexões →
            </button>
          </div>
        </div>
      )}

      {/* Confirmação de mudança para Privado */}
      {confirmacao && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 pb-4">
          <div className={`w-full max-w-[380px] ${t.bgCard} rounded-2xl p-5 flex flex-col gap-3`}>
            <h3 className={`text-base font-semibold ${t.textPrimary}`}>
              Mudar para privado?
            </h3>
            <p className={`text-[13px] ${t.textSecondary} leading-snug`}>
              Suas {data.profissionaisAtivos} conexão{data.profissionaisAtivos > 1 ? 'ões' : ''}{' '}
              ativa{data.profissionaisAtivos > 1 ? 's serão pausadas' : ' será pausada'}.
              Profissionais não receberão novas atualizações de métricas, exames ou mensagens
              até você reabrir manualmente.
            </p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setConfirmacao(null)}
                disabled={mudando !== null}
                className={`flex-1 py-2.5 rounded-xl ${t.bgInner} border ${t.border} ${t.textPrimary} text-[13px] font-semibold transition disabled:opacity-50`}
              >
                Cancelar
              </button>
              <button
                onClick={() => aplicar(confirmacao)}
                disabled={mudando !== null}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold transition disabled:opacity-50"
              >
                {mudando ? 'Aplicando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-2.5 rounded-full bg-emerald-500 text-white text-[12px] font-semibold shadow-lg flex items-center gap-2">
            <Check size={13} strokeWidth={2.6} />
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
