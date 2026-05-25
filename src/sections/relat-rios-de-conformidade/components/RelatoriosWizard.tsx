import { useMemo, useState } from 'react'
import type {
  AvaliacaoPublicada,
  ExpiracaoLink,
  NovoRelatorioInput,
  RelatoriosCreateProps,
  ResponsavelTecnico,
  SecoesIncluidas,
} from '@/../product/sections/relat-rios-de-conformidade/types'
import {
  ChevronRight,
  ArrowLeft,
  Check,
  ClipboardList,
  IdCard,
  ListChecks,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarRange,
  ListTree,
  StickyNote,
  Diff,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react'
import { PdfPreview } from './PdfPreview'

const EXPIRACAO_OPCOES: { value: ExpiracaoLink; label: string }[] = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
  { value: 180, label: '180 dias' },
  { value: 365, label: '1 ano' },
]

interface SecaoOpcao {
  key: keyof SecoesIncluidas
  label: string
  helper: string
  icon: React.ReactNode
  paginasExtras: number
}

const SECOES_OPCIONAIS: SecaoOpcao[] = [
  {
    key: 'planoAcao',
    label: 'Plano de Ação detalhado',
    helper: 'Lista completa de itens com responsáveis, prazos e impactos.',
    icon: <ListTree className="w-3.5 h-3.5" strokeWidth={1.75} />,
    paginasExtras: 12,
  },
  {
    key: 'evidencias',
    label: 'Evidências cruzadas',
    helper: 'Apêndice com atestados, GPTW, turnover, CIDs anexados.',
    icon: <StickyNote className="w-3.5 h-3.5" strokeWidth={1.75} />,
    paginasExtras: 8,
  },
  {
    key: 'diagnosticoLider',
    label: 'Diagnóstico do Líder',
    helper: 'Registros semanais agregados por setor.',
    icon: <ClipboardList className="w-3.5 h-3.5" strokeWidth={1.75} />,
    paginasExtras: 6,
  },
  {
    key: 'comparacaoCiclos',
    label: 'Comparação com ciclos anteriores',
    helper: 'Gráficos de evolução entre matrizes psicossociais.',
    icon: <Diff className="w-3.5 h-3.5" strokeWidth={1.75} />,
    paginasExtras: 4,
  },
]

const PAGINAS_BASE = 22

export function RelatoriosWizard({
  empregadorContexto,
  responsaveisDisponiveis,
  avaliacoesPublicadas,
  onCancel,
  onCreate,
}: RelatoriosCreateProps) {
  const [avaliacaoId, setAvaliacaoId] = useState<string>(
    avaliacoesPublicadas[0]?.id ?? '',
  )
  const [nome, setNome] = useState<string>(() => {
    const aval = avaliacoesPublicadas[0]
    if (!aval) return ''
    return `Relatório NR-1 · ${empregadorContexto.nomeFantasia} · Ciclo ${aval.ciclo}`
  })
  const [responsavelId, setResponsavelId] = useState<string>(
    responsaveisDisponiveis[0]?.id ?? '',
  )
  const [secoes, setSecoes] = useState<SecoesIncluidas>({
    planoAcao: true,
    evidencias: true,
    diagnosticoLider: false,
    comparacaoCiclos: false,
  })
  const [gerarLink, setGerarLink] = useState<boolean>(true)
  const [expiracao, setExpiracao] = useState<ExpiracaoLink>(30)

  const avaliacao = useMemo<AvaliacaoPublicada | null>(
    () => avaliacoesPublicadas.find((a) => a.id === avaliacaoId) ?? null,
    [avaliacaoId, avaliacoesPublicadas],
  )

  const responsavel = useMemo<ResponsavelTecnico | null>(
    () => responsaveisDisponiveis.find((r) => r.id === responsavelId) ?? null,
    [responsavelId, responsaveisDisponiveis],
  )

  const paginasEstimadas = useMemo(() => {
    let total = PAGINAS_BASE
    SECOES_OPCIONAIS.forEach((sec) => {
      if (secoes[sec.key]) total += sec.paginasExtras
    })
    return total
  }, [secoes])

  const prerequisitos = useMemo(() => {
    return [
      {
        ok: !!avaliacao,
        label: 'Avaliação publicada selecionada',
      },
      {
        ok: !!responsavel,
        label: 'Responsável técnico com registro válido',
      },
      {
        ok: !!empregadorContexto.logoUrl,
        label: 'Logo do empregador cadastrado',
        warning: !empregadorContexto.logoUrl,
      },
      {
        ok: nome.trim().length > 0,
        label: 'Nome do relatório preenchido',
      },
    ]
  }, [avaliacao, responsavel, empregadorContexto.logoUrl, nome])

  const canSubmit = prerequisitos.filter((p) => !p.warning).every((p) => p.ok)

  const toggleSecao = (key: keyof SecoesIncluidas) => {
    setSecoes((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = () => {
    if (!canSubmit || !avaliacao) return
    const input: NovoRelatorioInput = {
      avaliacaoId,
      ciclo: avaliacao.ciclo,
      nome,
      responsavelTecnicoId: responsavelId,
      secoesIncluidas: secoes,
      gerarLinkCompartilhavel: gerarLink,
      expiracaoLinkDias: expiracao,
    }
    onCreate?.(input)
  }

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div
          className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap"
          aria-label="Trilha"
        >
          <span className="text-teal-600 dark:text-teal-400 font-medium">Empregadores</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button
            type="button"
            onClick={onCancel}
            className="text-teal-600 dark:text-teal-400 hover:underline underline-offset-2 font-medium"
          >
            Relatórios de Conformidade
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Novo relatório</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Wizard de criação de relatório
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Novo relatório oficial NR-1
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Configure as opções à esquerda e veja o resultado em tempo real à direita.
          </p>
        </header>

        <div
          className="nymos-reveal opacity-0 mt-7 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4"
          style={{ animationDelay: '120ms' }}
        >
          <div className="space-y-3">
            <Step
              number={1}
              icon={<ClipboardList className="w-3.5 h-3.5" strokeWidth={1.75} />}
              title="Avaliação de origem"
              description="Apenas avaliações publicadas estão disponíveis."
            >
              <div className="space-y-2">
                {avaliacoesPublicadas.map((aval) => {
                  const active = avaliacaoId === aval.id
                  return (
                    <button
                      key={aval.id}
                      type="button"
                      onClick={() => {
                        setAvaliacaoId(aval.id)
                        setNome(
                          `Relatório NR-1 · ${empregadorContexto.nomeFantasia} · Ciclo ${aval.ciclo}`,
                        )
                      }}
                      className={`
                        w-full flex items-start gap-3 px-4 py-3 rounded-xl ring-1 transition text-left
                        ${
                          active
                            ? 'bg-teal-50 ring-teal-200/70 dark:bg-teal-950/40 dark:ring-teal-900/60'
                            : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }
                      `}
                    >
                      <span
                        className={`
                          inline-flex items-center justify-center w-4 h-4 rounded-full ring-1 mt-0.5 shrink-0
                          ${
                            active
                              ? 'bg-teal-600 ring-teal-600 text-white'
                              : 'bg-white dark:bg-slate-900 ring-slate-300 dark:ring-slate-700'
                          }
                        `}
                      >
                        {active && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[13px] font-semibold truncate ${
                            active
                              ? 'text-teal-800 dark:text-teal-200'
                              : 'text-slate-900 dark:text-slate-50'
                          }`}
                        >
                          {aval.nome}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 px-1.5 py-px rounded bg-slate-100 dark:bg-slate-800 font-mono uppercase tracking-wider text-[10px]">
                            {aval.instrumentoSigla}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarRange className="w-3 h-3" strokeWidth={1.75} />
                            Ciclo {aval.ciclo}
                          </span>
                          <span>
                            Cobertura{' '}
                            <span className="font-mono tabular-nums">
                              {(aval.coberturaFinal * 100).toFixed(0)}%
                            </span>
                          </span>
                          <span>
                            <span className="font-mono tabular-nums">{aval.fatoresCriticos}</span>{' '}
                            críticos
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step
              number={2}
              icon={<IdCard className="w-3.5 h-3.5" strokeWidth={1.75} />}
              title="Identificação"
              description="Nome do relatório e responsável técnico assinante."
            >
              <FormField id="nome" label="Nome do relatório" required>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Relatório NR-1 Vegamax 2025-S2"
                  className={fieldInput}
                />
              </FormField>
              <FormField
                id="responsavel"
                label="Responsável técnico"
                required
                helper="Profissional SST que assina o relatório oficialmente."
              >
                <select
                  id="responsavel"
                  value={responsavelId}
                  onChange={(e) => setResponsavelId(e.target.value)}
                  className={fieldInput}
                >
                  {responsaveisDisponiveis.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome} · {r.registro}
                    </option>
                  ))}
                </select>
              </FormField>
            </Step>

            <Step
              number={3}
              icon={<ListChecks className="w-3.5 h-3.5" strokeWidth={1.75} />}
              title="Seções opcionais"
              description="Adicione conteúdo conforme a necessidade do empregador ou da fiscalização."
            >
              <div className="space-y-2">
                {SECOES_OPCIONAIS.map((sec) => {
                  const active = secoes[sec.key]
                  return (
                    <button
                      key={sec.key}
                      type="button"
                      onClick={() => toggleSecao(sec.key)}
                      className={`
                        w-full flex items-start gap-3 px-4 py-3 rounded-xl ring-1 transition text-left
                        ${
                          active
                            ? 'bg-teal-50 ring-teal-200/70 dark:bg-teal-950/40 dark:ring-teal-900/60'
                            : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }
                      `}
                    >
                      <span
                        className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5
                          ${
                            active
                              ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }
                        `}
                      >
                        {sec.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p
                            className={`text-[13px] font-semibold ${
                              active
                                ? 'text-teal-800 dark:text-teal-200'
                                : 'text-slate-900 dark:text-slate-50'
                            }`}
                          >
                            {sec.label}
                          </p>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-px rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono tabular-nums text-slate-600 dark:text-slate-400">
                            +{sec.paginasExtras} pág
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {sec.helper}
                        </p>
                      </div>
                      <Toggle checked={active} />
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step
              number={4}
              icon={<Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
              title="Compartilhamento"
              description="Configure um link público de leitura com expiração."
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                    Gerar link compartilhável
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Permite acesso de leitura sem login.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={gerarLink}
                  onClick={() => setGerarLink((v) => !v)}
                  className={`
                    relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
                    ${gerarLink ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}
                  `}
                >
                  <span
                    className={`
                      inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-150
                      ${gerarLink ? 'translate-x-[18px]' : 'translate-x-[3px]'}
                    `}
                  />
                </button>
              </div>

              {gerarLink && (
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Expiração do link
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {EXPIRACAO_OPCOES.map((opt) => {
                      const active = expiracao === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setExpiracao(opt.value)}
                          className={`
                            inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ring-1 text-[12px] font-medium transition
                            ${
                              active
                                ? 'bg-teal-50 ring-teal-200/60 text-teal-700 dark:bg-teal-950/40 dark:ring-teal-900/60 dark:text-teal-300'
                                : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }
                          `}
                        >
                          <LinkIcon className="w-3 h-3" strokeWidth={1.75} />
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </Step>

            <div className="rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-4 py-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Pré-requisitos
                </span>
              </div>
              <ul className="space-y-1.5 mb-3">
                {prerequisitos.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-[12px]"
                  >
                    {req.ok ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                        strokeWidth={2}
                      />
                    ) : req.warning ? (
                      <AlertCircle
                        className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0"
                        strokeWidth={2}
                      />
                    ) : (
                      <XCircle
                        className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                    <span
                      className={`
                        ${
                          req.ok
                            ? 'text-slate-700 dark:text-slate-300'
                            : req.warning
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-rose-700 dark:text-rose-300'
                        }
                      `}
                    >
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
                  Total estimado
                </span>
                <span className="text-[14px] font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {paginasEstimadas} páginas
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="
                    flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl
                    bg-white/80 dark:bg-slate-900/40
                    border border-slate-200 dark:border-slate-800
                    hover:bg-slate-50 dark:hover:bg-slate-800/60
                    text-slate-700 dark:text-slate-200 font-medium text-sm transition
                  "
                >
                  <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="
                    flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl
                    bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                    dark:bg-teal-500 dark:hover:bg-teal-400
                    text-white font-medium text-sm
                    shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                    dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                    transition
                  "
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
                  Gerar relatório
                </button>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 self-start">
            <PdfPreview
              empregadorContexto={empregadorContexto}
              avaliacao={avaliacao}
              nome={nome}
              responsavel={responsavel}
              secoes={secoes}
              paginasEstimadas={paginasEstimadas}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({
  number,
  icon,
  title,
  description,
  children,
}: {
  number: number
  icon: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60 text-[12px] font-mono font-bold shrink-0">
          {number}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {icon && <span className="text-slate-500">{icon}</span>}
            <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function FormField({
  id,
  label,
  required,
  helper,
  children,
}: {
  id: string
  label: string
  required?: boolean
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helper && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{helper}</p>
      )}
    </div>
  )
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span
      className={`
        relative inline-flex items-center h-5 w-9 rounded-full shrink-0 mt-0.5
        ${checked ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}
      `}
    >
      <span
        className={`
          inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-150
          ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'}
        `}
      />
    </span>
  )
}

const fieldInput = `
  w-full px-3 py-2 rounded-xl
  bg-white/80 dark:bg-slate-900/40
  border border-slate-200 dark:border-slate-800
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  text-sm text-slate-800 dark:text-slate-200
  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
  transition
`

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
