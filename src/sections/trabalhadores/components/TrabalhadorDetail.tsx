import { useState } from 'react'
import type {
  ParticipacaoCampanha,
  StatusEncaminhamento,
  StatusVinculoNymos,
  TrabalhadorDetailProps,
} from '@/../product/sections/trabalhadores/types'
import {
  ChevronRight,
  Pencil,
  Archive,
  Sparkles,
  Building,
  Building2,
  Layers3,
  Mail,
  Languages,
  Accessibility,
  Calendar,
  ShieldCheck,
  Hourglass,
  CircleDashed,
  Headphones,
  ClipboardCheck,
  CalendarRange,
  AlertCircle,
  Stethoscope,
  Lock,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  Hash,
} from 'lucide-react'
import { IdiomaBadge } from './IdiomaBadge'
import { TrabalhadorDrawer } from './TrabalhadorDrawer'

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

function avatarInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

const NYMOS_TONE: Record<
  StatusVinculoNymos,
  { label: string; pill: string; icon: React.ReactNode }
> = {
  ativo: {
    label: 'Nymos ativo',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
    icon: <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  convidado: {
    label: 'Convite enviado',
    pill: 'bg-violet-50/60 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400 ring-violet-200/40 dark:ring-violet-900/30',
    icon: <Hourglass className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  sem_vinculo: {
    label: 'Sem Nymos',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
    icon: <CircleDashed className="w-3.5 h-3.5" strokeWidth={2} />,
  },
}

const PARTICIPACAO_TONE: Record<
  ParticipacaoCampanha,
  { label: string; pill: string; icon: React.ReactNode }
> = {
  concluida: {
    label: 'Concluída',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    icon: <CheckCircle2 className="w-3 h-3" strokeWidth={2} />,
  },
  pulou: {
    label: 'Pulou',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    icon: <CircleDashed className="w-3 h-3" strokeWidth={2} />,
  },
  em_curso: {
    label: 'Em curso',
    pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/50',
    icon: <Hourglass className="w-3 h-3" strokeWidth={2} />,
  },
}

const ENC_TONE: Record<StatusEncaminhamento, { label: string; pill: string }> = {
  em_acompanhamento: {
    label: 'Em acompanhamento',
    pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/50',
  },
  concluido: {
    label: 'Concluído',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
  },
  recusado: {
    label: 'Recusado',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
  },
  aguardando: {
    label: 'Aguardando',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
  },
}

const IDIOMA_LABEL: Record<'pt' | 'en' | 'es', string> = {
  pt: 'Português · Brasil',
  en: 'English',
  es: 'Español',
}

export function TrabalhadorDetail({
  empregadorContexto,
  trabalhador,
  estabelecimento,
  setor,
  onBackToList,
  onEditTrabalhador,
  onSaveTrabalhador,
  onArchiveTrabalhador,
  onInviteNymos,
  onNavigateToEstabelecimento,
  onNavigateToSetor,
  onSelectCampanha,
}: TrabalhadorDetailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const nymos = NYMOS_TONE[trabalhador.vinculoNymos.status]
  const hasAcess = trabalhador.acessibilidade.length > 0
  const semCanal = trabalhador.canalContato.status === 'sem_canal'
  const optOut = trabalhador.canalContato.status === 'opt_out_ciclo'

  const modoAplicacao = semCanal
    ? { label: 'Não elegível para campanha', tone: 'amber', helper: 'Sem canal de contato individual — excluído de campanhas. Plataforma não usa canais de terceiros (anti-coerção).' }
    : optOut
    ? { label: 'Opt-out do ciclo atual', tone: 'slate', helper: 'Colaborador exerceu direito de não responder neste ciclo. Decisão respeitada — não receberá novos lembretes.' }
    : hasAcess
      ? {
          label: 'Modo assistido',
          tone: 'violet',
          helper: 'Aplicação acompanhada por um facilitador conforme necessidades declaradas.',
        }
      : { label: 'Modo auto', tone: 'teal', helper: 'Trabalhador responde diretamente via app/web no horário de trabalho.' }

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
            onClick={onBackToList}
            className="text-teal-600 dark:text-teal-400 hover:underline underline-offset-2 font-medium"
          >
            Trabalhadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 truncate">{trabalhador.nome}</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Detalhe do trabalhador
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-px rounded-md ring-1 text-[10px] font-medium ${nymos.pill}`}
            >
              {nymos.icon}
              {nymos.label}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <span
                className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl shrink-0
                  text-[18px] font-mono font-semibold ring-1
                  ${
                    trabalhador.vinculoNymos.status === 'ativo'
                      ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-200/60 dark:ring-slate-700'
                  }
                `}
              >
                {avatarInitials(trabalhador.nome)}
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {trabalhador.nome}
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Matrícula <span className="font-mono">{trabalhador.matricula}</span> ·{' '}
                  {trabalhador.cargo}
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span
                    className={`
                      inline-flex items-center px-1.5 py-px rounded-md ring-1 text-[10px] font-medium
                      ${
                        trabalhador.regime === 'CLT'
                          ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700'
                          : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60'
                      }
                    `}
                  >
                    {trabalhador.regime === 'CLT' ? 'CLT' : 'Estatutário'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3" strokeWidth={1.75} />
                    Admitido em <span className="font-mono">{formatDate(trabalhador.dataAdmissao)}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {trabalhador.vinculoNymos.status === 'sem_vinculo' && !semEmail && (
                <button
                  type="button"
                  onClick={() => onInviteNymos?.(trabalhador.id)}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                    bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                    dark:bg-violet-500 dark:hover:bg-violet-400
                    text-white font-medium text-sm
                    shadow-[0_4px_14px_-4px_rgba(124,58,237,0.45)]
                    dark:shadow-[0_4px_14px_-4px_rgba(167,139,250,0.55)]
                    transition
                  "
                >
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                  Convidar para Nymos
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(true)
                  onEditTrabalhador?.(trabalhador.id)
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
                onClick={() => onArchiveTrabalhador?.(trabalhador.id)}
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
              <Layers3 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Vinculação organizacional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNavigateToEstabelecimento?.(estabelecimento.id)}
                className="
                  group rounded-xl bg-slate-50/70 dark:bg-slate-800/40
                  ring-1 ring-slate-200/60 dark:ring-slate-800
                  hover:ring-teal-300 dark:hover:ring-teal-700
                  transition px-4 py-3 text-left
                "
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                    {estabelecimento.tipo === 'matriz' ? (
                      <Building2 className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <Building className="w-3 h-3" strokeWidth={2} />
                    )}
                    Estabelecimento
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-500 transition" strokeWidth={1.75} />
                </div>
                <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {estabelecimento.nome}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {estabelecimento.tipo === 'matriz' ? 'Matriz' : 'Filial'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToSetor?.(estabelecimento.id, setor.id)}
                className="
                  group rounded-xl bg-slate-50/70 dark:bg-slate-800/40
                  ring-1 ring-slate-200/60 dark:ring-slate-800
                  hover:ring-teal-300 dark:hover:ring-teal-700
                  transition px-4 py-3 text-left
                "
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                    <Briefcase className="w-3 h-3" strokeWidth={2} />
                    Setor
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-500 transition" strokeWidth={1.75} />
                </div>
                <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {setor.nome}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{setor.codigo}</span>
                  {setor.gestorNome && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span>Gestor: {setor.gestorNome}</span>
                    </>
                  )}
                </p>
              </button>
            </div>
          </div>

          <div
            style={{ animationDelay: '180ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Vínculo Nymos
              </span>
            </div>
            <NymosBlock
              status={trabalhador.vinculoNymos.status}
              userId={trabalhador.vinculoNymos.userId}
              convidadoEm={trabalhador.vinculoNymos.convidadoEm}
              vinculadoEm={trabalhador.vinculoNymos.vinculadoEm}
              email={trabalhador.emailCorporativo}
              onInvite={() => onInviteNymos?.(trabalhador.id)}
            />
          </div>
        </div>

        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-3 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
        >
          <div className="flex items-center gap-1.5 mb-4">
            <Languages className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Elegibilidade para avaliações NR-1
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-medium mb-2">
                Idioma preferido
              </div>
              <div className="flex items-center gap-3">
                <IdiomaBadge idioma={trabalhador.idiomaPreferido} size="md" />
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-50">
                  {IDIOMA_LABEL[trabalhador.idiomaPreferido]}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Versão do instrumento entregue durante a campanha.
              </p>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-medium mb-2">
                Modo de aplicação sugerido
              </div>
              <span
                className={`
                  inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[12px] font-medium
                  ${
                    modoAplicacao.tone === 'violet'
                      ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50'
                      : modoAplicacao.tone === 'amber'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/50'
                  }
                `}
              >
                <Headphones className="w-3 h-3" strokeWidth={2} />
                {modoAplicacao.label}
              </span>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {modoAplicacao.helper}
              </p>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-medium mb-2 inline-flex items-center gap-1.5">
                <Accessibility className="w-3 h-3" strokeWidth={1.75} />
                Acessibilidade declarada
              </div>
              {hasAcess ? (
                <div className="flex flex-wrap gap-1.5">
                  {trabalhador.acessibilidade.map((item) => (
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
              ) : (
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Sem necessidades específicas registradas.
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mt-3 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Histórico de campanhas
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
              <Lock className="w-3 h-3" strokeWidth={2} />
              Respostas anônimas
            </span>
          </div>

          {trabalhador.campanhasHistorico.length === 0 ? (
            <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhuma campanha registrada para este trabalhador ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trabalhador.campanhasHistorico.map((c) => {
                const t = PARTICIPACAO_TONE[c.participacao]
                return (
                  <button
                    key={c.avaliacaoId}
                    type="button"
                    onClick={() => onSelectCampanha?.(c.avaliacaoId)}
                    className="
                      group w-full flex items-center justify-between gap-3
                      rounded-xl bg-slate-50/70 dark:bg-slate-800/40
                      ring-1 ring-slate-200/60 dark:ring-slate-800
                      hover:ring-teal-300 dark:hover:ring-teal-700
                      px-4 py-3 text-left transition
                    "
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-50">
                          {c.nome}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {c.instrumento}
                        </span>
                      </div>
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <CalendarRange className="w-3 h-3" strokeWidth={1.75} />
                        <span className="font-mono">{c.janela}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium ${t.pill}`}
                      >
                        {t.icon}
                        {t.label}
                      </span>
                      <ExternalLink
                        className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 transition"
                        strokeWidth={1.75}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div
          style={{ animationDelay: '360ms' }}
          className="nymos-reveal opacity-0 mt-3 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Encaminhamentos clínicos
            </span>
          </div>

          {trabalhador.encaminhamentosHistorico.length === 0 ? (
            <div className="rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-200/40 dark:ring-emerald-900/30 px-4 py-5 flex items-center gap-3">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shrink-0">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[13px] font-medium text-emerald-800 dark:text-emerald-200">
                  Sem encaminhamentos
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                  Nenhum encaminhamento clínico necessário até o momento.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {trabalhador.encaminhamentosHistorico.map((e) => {
                const t = ENC_TONE[e.status]
                return (
                  <div
                    key={e.id}
                    className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-3 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-50">
                        {e.profissionalNome}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {e.profissionalCargo}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" strokeWidth={1.75} />
                        <span className="font-mono">{formatDate(e.ocorridoEm)}</span>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium shrink-0 ${t.pill}`}
                    >
                      {t.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-6 px-4 py-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-800 text-[11px] text-slate-600 dark:text-slate-400 inline-flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 mt-px text-slate-500 shrink-0" strokeWidth={1.75} />
          <span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Anonimato preservado
            </span>{' '}
            · Respostas individuais a Avaliações NR-1 nunca são exibidas no perfil do Trabalhador. O
            empregador acessa somente análises agregadas por Setor/Estabelecimento.
          </span>
        </div>
      </div>

      {drawerOpen && (
        <TrabalhadorDrawer
          open
          trabalhadorEmEdicao={trabalhador}
          estabelecimentos={[
            {
              id: estabelecimento.id,
              nome: estabelecimento.nome,
              tipo: estabelecimento.tipo,
              totalTrabalhadores: estabelecimento.totalTrabalhadores,
            },
          ]}
          setores={[
            {
              id: setor.id,
              nome: setor.nome,
              codigo: setor.codigo,
              estabelecimentoId: setor.estabelecimentoId,
              gestorNome: setor.gestorNome,
            },
          ]}
          onClose={() => setDrawerOpen(false)}
          onSave={(input) => {
            onSaveTrabalhador?.(input)
            setDrawerOpen(false)
          }}
        />
      )}
    </div>
  )
}

function NymosBlock({
  status,
  userId,
  convidadoEm,
  vinculadoEm,
  email,
  onInvite,
}: {
  status: StatusVinculoNymos
  userId: string | null
  convidadoEm: string | null
  vinculadoEm: string | null
  email: string
  onInvite?: () => void
}) {
  if (status === 'ativo') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[13px] font-medium text-slate-900 dark:text-slate-50">Conta ativa</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Vinculado em <span className="font-mono">{formatDate(vinculadoEm)}</span>
            </p>
          </div>
        </div>
        <DefinitionPill icon={<Mail className="w-3 h-3" strokeWidth={1.75} />} label="E-mail" mono>
          {email || '—'}
        </DefinitionPill>
        {userId && (
          <DefinitionPill icon={<Hash className="w-3 h-3" strokeWidth={1.75} />} label="User ID" mono>
            {userId}
          </DefinitionPill>
        )}
      </div>
    )
  }

  if (status === 'convidado') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-violet-100/70 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
            <Hourglass className="w-4 h-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[13px] font-medium text-slate-900 dark:text-slate-50">
              Convite enviado
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Em <span className="font-mono">{formatDate(convidadoEm)}</span>
            </p>
          </div>
        </div>
        <DefinitionPill icon={<Mail className="w-3 h-3" strokeWidth={1.75} />} label="E-mail" mono>
          {email || '—'}
        </DefinitionPill>
        <button
          type="button"
          onClick={onInvite}
          className="
            w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
            bg-white/60 dark:bg-slate-900/40
            border border-slate-200 dark:border-slate-800
            hover:bg-slate-50 dark:hover:bg-slate-800/60
            text-[12px] font-medium text-slate-700 dark:text-slate-200
            transition
          "
        >
          Reenviar convite
        </button>
      </div>
    )
  }

  if (email === '') {
    return (
      <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/20 ring-1 ring-amber-200/60 dark:ring-amber-900/40 px-3.5 py-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-300 mt-0.5 shrink-0" strokeWidth={2} />
        <div>
          <p className="text-[13px] font-medium text-amber-800 dark:text-amber-200">
            Sem e-mail corporativo
          </p>
          <p className="mt-0.5 text-[11px] text-amber-700/80 dark:text-amber-300/80">
            Cadastre um e-mail no perfil para habilitar o convite Nymos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
          <CircleDashed className="w-4 h-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-slate-900 dark:text-slate-50">Sem vínculo</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Trabalhador ainda não usa o Nymos.
          </p>
        </div>
      </div>
      <DefinitionPill icon={<Mail className="w-3 h-3" strokeWidth={1.75} />} label="E-mail" mono>
        {email}
      </DefinitionPill>
      <button
        type="button"
        onClick={onInvite}
        className="
          w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
          bg-violet-600 hover:bg-violet-700 active:bg-violet-800
          dark:bg-violet-500 dark:hover:bg-violet-400
          text-white font-medium text-[12px]
          shadow-[0_4px_12px_-4px_rgba(124,58,237,0.45)]
          dark:shadow-[0_4px_12px_-4px_rgba(167,139,250,0.55)]
          transition
        "
      >
        <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
        Convidar para Nymos
      </button>
    </div>
  )
}

function DefinitionPill({
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
        <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </div>
        <div
          className={`text-[12px] text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''} truncate`}
        >
          {children}
        </div>
      </div>
    </div>
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
