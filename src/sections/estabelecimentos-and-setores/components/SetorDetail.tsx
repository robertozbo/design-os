import { useState } from 'react'
import type {
  ClassificacaoRisco,
  GestorSetor,
  SetorDetailProps,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import {
  ChevronRight,
  Pencil,
  Archive,
  Mail,
  BadgeCheck,
  Layers,
  Briefcase,
  Wallet,
  Users2,
  Languages,
  Accessibility,
  AlertTriangle,
  ListChecks,
  ExternalLink,
  TriangleAlert,
} from 'lucide-react'
import { SetorDrawer } from './SetorDrawer'

const NUM = new Intl.NumberFormat('pt-BR')

const RISCO_TONE: Record<
  ClassificacaoRisco,
  {
    label: string
    pillSm: string
    badgeLg: string
    bar: string
    descriptor: string
  }
> = {
  baixo: {
    label: 'Risco baixo',
    pillSm:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    badgeLg:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 ring-emerald-300/60 dark:ring-emerald-900/60',
    bar: 'from-emerald-500 to-emerald-300',
    descriptor: 'Indicadores compatíveis com saúde organizacional. Manter monitoramento periódico.',
  },
  moderado: {
    label: 'Risco moderado',
    pillSm:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    badgeLg:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200 ring-amber-300/60 dark:ring-amber-900/60',
    bar: 'from-amber-500 to-amber-300',
    descriptor:
      'Sinais relevantes em pelo menos um fator psicossocial. Recomendado plano de ação focado.',
  },
  critico: {
    label: 'Risco crítico',
    pillSm:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    badgeLg:
      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 ring-rose-300/70 dark:ring-rose-900/70',
    bar: 'from-rose-500 to-rose-300',
    descriptor:
      'Combinação de fatores em níveis preocupantes. Ações de mitigação obrigatórias por NR-1.',
  },
  prioritario: {
    label: 'Risco prioritário',
    pillSm:
      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 ring-rose-300/70 dark:ring-rose-900/70',
    badgeLg:
      'bg-rose-200 text-rose-900 dark:bg-rose-950/80 dark:text-rose-100 ring-rose-400/70 dark:ring-rose-900/80',
    bar: 'from-rose-600 to-rose-400',
    descriptor:
      'Risco máximo identificado. Intervenção imediata, com plano de ação e acompanhamento semanal.',
  },
}

function avatarInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function SetorDetail({
  empregadorContexto,
  estabelecimento,
  setor,
  profissionaisDisponiveis,
  onBackToEstabelecimentos,
  onBackToEstabelecimento,
  onEditSetor,
  onSaveSetor,
  onArchiveSetor,
  onNavigateToTrabalhadores,
  onNavigateToAvaliacoes,
  onNavigateToPlanoAcao,
  onContactGestor,
}: SetorDetailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { gestor, agrupamentoPgr, tamanho, riscoPsicossocial } = setor
  const tone = RISCO_TONE[riscoPsicossocial.classificacao]

  const totalIdiomas = tamanho.idiomas.pt + tamanho.idiomas.en + tamanho.idiomas.es
  const idiomaPctSafe = (count: number) =>
    totalIdiomas === 0 ? 0 : (count / totalIdiomas) * 100

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
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
            onClick={onBackToEstabelecimentos}
            className="text-teal-600 dark:text-teal-400 hover:underline underline-offset-2 font-medium"
          >
            Estabelecimentos
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button
            type="button"
            onClick={() => onBackToEstabelecimento?.(estabelecimento.id)}
            className="text-teal-600 dark:text-teal-400 hover:underline underline-offset-2 font-medium truncate max-w-[200px]"
          >
            {estabelecimento.nome}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 truncate">{setor.nome}</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Detalhe do setor
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium ${tone.pillSm}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  riscoPsicossocial.classificacao === 'baixo'
                    ? 'bg-emerald-500'
                    : riscoPsicossocial.classificacao === 'moderado'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
              />
              {tone.label}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {setor.nome}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Código <span className="font-mono">{setor.codigo}</span> · Vinculado a{' '}
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {estabelecimento.nome}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(true)
                  onEditSetor?.(estabelecimento.id, setor.id)
                }}
                className="
                  inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  hover:bg-slate-50 dark:hover:bg-slate-800/60
                  text-slate-700 dark:text-slate-200 font-medium text-sm
                  transition
                "
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onArchiveSetor?.(estabelecimento.id, setor.id)}
                className="
                  inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  hover:bg-slate-50 dark:hover:bg-slate-800/60
                  text-slate-700 dark:text-slate-200 font-medium text-sm
                  transition
                "
              >
                <Archive className="w-3.5 h-3.5" strokeWidth={1.75} />
                Arquivar
              </button>
            </div>
          </div>
        </header>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            style={{ animationDelay: '120ms' }}
            className="nymos-reveal opacity-0 lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <BadgeCheck className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Gestor responsável
              </span>
            </div>

            {gestor ? (
              <GestorBlock gestor={gestor} onContactGestor={onContactGestor} />
            ) : (
              <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/20 ring-1 ring-amber-200/60 dark:ring-amber-900/40 px-4 py-3 flex items-start gap-3">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                  <TriangleAlert className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Sem gestor vinculado
                  </p>
                  <p className="mt-0.5 text-[12px] text-amber-700/80 dark:text-amber-300/80">
                    Vincule um gestor para cumprir a exigência NR-1 de diagnóstico semanal do líder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(true)
                      onEditSetor?.(estabelecimento.id, setor.id)
                    }}
                    className="
                      mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      bg-amber-600 hover:bg-amber-700 text-white
                      text-[12px] font-medium transition
                    "
                  >
                    <Pencil className="w-3 h-3" strokeWidth={2} />
                    Vincular gestor
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            style={{ animationDelay: '180ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Layers className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Agrupamento PGR
              </span>
            </div>
            <dl className="space-y-2.5 text-[13px]">
              <DefinitionRow icon={<Layers className="w-3 h-3" strokeWidth={1.75} />} label="GHE">
                {agrupamentoPgr.ghe}
              </DefinitionRow>
              <DefinitionRow
                icon={<Briefcase className="w-3 h-3" strokeWidth={1.75} />}
                label="Ambiente"
              >
                {agrupamentoPgr.ambiente}
              </DefinitionRow>
              <DefinitionRow
                icon={<Wallet className="w-3 h-3" strokeWidth={1.75} />}
                label="Centro de custo"
                mono
              >
                {agrupamentoPgr.centroCusto}
              </DefinitionRow>
            </dl>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            style={{ animationDelay: '240ms' }}
            className="nymos-reveal opacity-0 lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Tamanho e elegibilidade
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTrabalhadores?.(estabelecimento.id, setor.id)}
                className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 hover:underline underline-offset-2"
              >
                Ver trabalhadores
                <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-medium">
                  Trabalhadores
                </span>
                <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
                  {NUM.format(tamanho.trabalhadores)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-medium">
                    <Languages className="w-3 h-3" strokeWidth={1.75} />
                    Distribuição de idiomas
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {NUM.format(totalIdiomas)} colab.
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {tamanho.idiomas.pt > 0 && (
                    <div
                      className="bg-teal-500"
                      style={{ width: `${idiomaPctSafe(tamanho.idiomas.pt)}%` }}
                      title={`PT-BR: ${tamanho.idiomas.pt}`}
                    />
                  )}
                  {tamanho.idiomas.en > 0 && (
                    <div
                      className="bg-violet-500"
                      style={{ width: `${idiomaPctSafe(tamanho.idiomas.en)}%` }}
                      title={`EN: ${tamanho.idiomas.en}`}
                    />
                  )}
                  {tamanho.idiomas.es > 0 && (
                    <div
                      className="bg-amber-500"
                      style={{ width: `${idiomaPctSafe(tamanho.idiomas.es)}%` }}
                      title={`ES: ${tamanho.idiomas.es}`}
                    />
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <LegendaIdioma color="bg-teal-500" label="PT-BR" count={tamanho.idiomas.pt} />
                  <LegendaIdioma color="bg-violet-500" label="EN" count={tamanho.idiomas.en} />
                  <LegendaIdioma color="bg-amber-500" label="ES" count={tamanho.idiomas.es} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-2">
                <Accessibility className="w-3 h-3 text-slate-500" strokeWidth={1.75} />
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-medium">
                  Acessibilidade declarada
                </span>
              </div>
              {tamanho.acessibilidade.length === 0 ? (
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Sem necessidades específicas registradas neste setor.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tamanho.acessibilidade.map((item) => (
                    <span
                      key={item}
                      className="
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                        bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-200/60 dark:ring-violet-900/50
                        text-[11px] font-medium text-violet-700 dark:text-violet-300
                      "
                    >
                      <Accessibility className="w-3 h-3" strokeWidth={1.75} />
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            style={{ animationDelay: '300ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Risco psicossocial
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {riscoPsicossocial.instrumento}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
                {riscoPsicossocial.scoreMedio}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                /100
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`}
                style={{ width: `${Math.min(riscoPsicossocial.scoreMedio, 100)}%` }}
              />
            </div>

            <span
              className={`mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[12px] font-medium ${tone.badgeLg}`}
            >
              {tone.label}
            </span>
            <p className="mt-2 text-[12px] text-slate-600 dark:text-slate-400 leading-snug">
              {tone.descriptor}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => onNavigateToAvaliacoes?.(estabelecimento.id, setor.id)}
                className="
                  group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                  hover:bg-slate-50 dark:hover:bg-slate-800/60 transition
                "
              >
                <span className="text-[12px] text-slate-700 dark:text-slate-200 font-medium">
                  Histórico de avaliações
                </span>
                <ExternalLink
                  className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition"
                  strokeWidth={1.75}
                />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToPlanoAcao?.(estabelecimento.id, setor.id)}
                className="
                  group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                  hover:bg-slate-50 dark:hover:bg-slate-800/60 transition
                "
              >
                <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-700 dark:text-slate-200 font-medium">
                  <ListChecks className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                  Plano de ação
                  {riscoPsicossocial.acoesAbertas > 0 && (
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-mono tabular-nums ${
                        riscoPsicossocial.acoesAbertas >= 3
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {riscoPsicossocial.acoesAbertas}
                    </span>
                  )}
                </span>
                <ExternalLink
                  className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <SetorDrawer
          open
          estabelecimentoId={estabelecimento.id}
          setorEmEdicao={setor}
          profissionaisDisponiveis={profissionaisDisponiveis}
          onClose={() => setDrawerOpen(false)}
          onSave={(input) => {
            onSaveSetor?.(input)
            setDrawerOpen(false)
          }}
        />
      )}
    </div>
  )
}

function GestorBlock({
  gestor,
  onContactGestor,
}: {
  gestor: GestorSetor
  onContactGestor?: (gestorId: string) => void
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-[14px] font-mono font-semibold text-violet-700 dark:text-violet-300 shrink-0 ring-1 ring-violet-200/60 dark:ring-violet-900/50">
        {avatarInitials(gestor.nome)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-50">{gestor.nome}</p>
        <p className="text-[12px] text-slate-600 dark:text-slate-400">{gestor.cargo}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onContactGestor?.(gestor.id)}
            className="inline-flex items-center gap-1.5 hover:text-teal-700 dark:hover:text-teal-300 transition"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
            <span className="font-mono">{gestor.email}</span>
          </button>
          {gestor.registro && (
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
              <span className="font-mono">{gestor.registro}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DefinitionRow({
  icon,
  label,
  children,
  mono,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </dt>
        <dd
          className={`text-[13px] text-slate-800 dark:text-slate-200 ${
            mono ? 'font-mono' : ''
          } leading-snug`}
        >
          {children}
        </dd>
      </div>
    </div>
  )
}

function LegendaIdioma({
  color,
  label,
  count,
}: {
  color: string
  label: string
  count: number
}) {
  if (count === 0) return null
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${color}`} aria-hidden="true" />
      <span className="font-medium">{label}</span>
      <span className="font-mono tabular-nums text-slate-500 dark:text-slate-500">{count}</span>
    </span>
  )
}

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
      @keyframes drawer-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @keyframes drawer-slide-in {
        from { transform: translateX(20px); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      .drawer-slide {
        animation: drawer-slide-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal, .drawer-fade, .drawer-slide {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
