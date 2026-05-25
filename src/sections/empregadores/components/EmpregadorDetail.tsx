import type {
  AtividadeTipo,
  EmpregadorDetailProps,
  PlanoAcaoStatus,
  SecaoEmpregador,
} from '@/../product/sections/empregadores/types'
import {
  ChevronRight,
  Pencil,
  Archive,
  ArchiveRestore,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ListChecks,
  CalendarClock,
  Building2,
  Users2,
  ClipboardList,
  FileText,
  Layers3,
  Sparkles,
  Plus,
  CheckCircle2,
  Bell,
  Radio,
  Settings2,
  ShieldAlert,
} from 'lucide-react'

const NUM = new Intl.NumberFormat('pt-BR')

const DATETIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDateTime(iso: string): string {
  return DATETIME_FORMATTER.format(new Date(iso))
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

const PLANO_TONE: Record<
  PlanoAcaoStatus,
  { label: string; pill: string }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700',
  },
  rascunho: {
    label: 'Em rascunho',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700',
  },
  em_execucao: {
    label: 'Em execução',
    pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/50',
  },
  concluido: {
    label: 'Concluído',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
  },
  encerrado: {
    label: 'Encerrado',
    pill: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 ring-slate-200 dark:ring-slate-700',
  },
}

const ATIVIDADE_ICON: Record<AtividadeTipo, React.ReactNode> = {
  empregador_criado: <Plus className="w-3 h-3" strokeWidth={2} />,
  avaliacao_publicada: <ClipboardList className="w-3 h-3" strokeWidth={2} />,
  avaliacao_encerrada: <CheckCircle2 className="w-3 h-3" strokeWidth={2} />,
  acao_concluida: <CheckCircle2 className="w-3 h-3" strokeWidth={2} />,
  perigo_detectado: <AlertTriangle className="w-3 h-3" strokeWidth={2} />,
  lembrete_enviado: <Bell className="w-3 h-3" strokeWidth={2} />,
  relatorio_gerado: <FileText className="w-3 h-3" strokeWidth={2} />,
}

const ATIVIDADE_TONE: Record<AtividadeTipo, string> = {
  empregador_criado:
    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
  avaliacao_publicada:
    'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
  avaliacao_encerrada:
    'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
  acao_concluida:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
  perigo_detectado:
    'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
  lembrete_enviado:
    'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/50',
  relatorio_gerado:
    'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
}

interface AtalhoSpec {
  secao: SecaoEmpregador
  label: string
  helper: string
  icon: React.ReactNode
  count: number
  countLabel: string
  miniStatus?: { text: string; tone: 'teal' | 'emerald' | 'amber' | 'rose' | 'slate' }
}

export function EmpregadorDetail({
  empregador,
  onBackToList,
  onEditEmpregador,
  onArchiveEmpregador,
  onUnarchiveEmpregador,
  onSelectAlerta,
  onNavigateToSecao,
}: EmpregadorDetailProps) {
  const isArquivado = empregador.status === 'arquivado'
  const { saudeNr1, planoAcao, estrutura, alertas } = empregador
  const cobertura = saudeNr1.coberturaMedia
  const cleared = cobertura >= 0.65
  const planoTone = PLANO_TONE[planoAcao.status]

  const proximoVencimento =
    saudeNr1.diasAteVigencia !== null
      ? `${saudeNr1.diasAteVigencia} dias`
      : 'Sem vigência'
  const vigenciaUrgente =
    saudeNr1.diasAteVigencia !== null && saudeNr1.diasAteVigencia <= 30

  const atalhos: AtalhoSpec[] = [
    {
      secao: 'estabelecimentos',
      label: 'Estabelecimentos & Setores',
      helper: 'Estrutura organizacional eSocial',
      icon: <Building2 className="w-4 h-4" strokeWidth={1.75} />,
      count: estrutura.estabelecimentos,
      countLabel: estrutura.estabelecimentos === 1 ? 'estabelecimento' : 'estabelecimentos',
      miniStatus: {
        text: `${estrutura.setores} setores`,
        tone: 'slate',
      },
    },
    {
      secao: 'trabalhadores',
      label: 'Trabalhadores',
      helper: 'CLT vinculados aos setores',
      icon: <Users2 className="w-4 h-4" strokeWidth={1.75} />,
      count: estrutura.trabalhadores,
      countLabel: 'trabalhadores',
      miniStatus: {
        text: 'elegíveis para campanha',
        tone: 'teal',
      },
    },
    {
      secao: 'avaliacoes',
      label: 'Avaliações de Risco',
      helper: 'Campanhas NR-1 do empregador',
      icon: <ClipboardList className="w-4 h-4" strokeWidth={1.75} />,
      count: 1,
      countLabel: 'avaliação',
      miniStatus: {
        text: saudeNr1.ultimaAvaliacaoStatus.replace('_', ' '),
        tone: cleared ? 'emerald' : cobertura > 0 ? 'amber' : 'slate',
      },
    },
    {
      secao: 'plano-acao',
      label: 'Plano de Ação',
      helper: 'Itens derivados da matriz',
      icon: <ListChecks className="w-4 h-4" strokeWidth={1.75} />,
      count: planoAcao.totalItens,
      countLabel: planoAcao.totalItens === 1 ? 'item' : 'itens',
      miniStatus: {
        text:
          planoAcao.emAtraso > 0
            ? `${planoAcao.emAtraso} em atraso`
            : planoTone.label.toLowerCase(),
        tone: planoAcao.emAtraso > 0 ? 'rose' : 'teal',
      },
    },
    {
      secao: 'relatorios',
      label: 'Relatórios',
      helper: 'Documentos oficiais NR-1',
      icon: <FileText className="w-4 h-4" strokeWidth={1.75} />,
      count: 0,
      countLabel: 'relatórios',
      miniStatus: {
        text: 'Aguardando geração',
        tone: 'slate',
      },
    },
    ...(empregador.eventosEsocial
      ? [
          {
            secao: 'eventos-esocial' as const,
            label: 'Eventos eSocial',
            helper: 'CAT, ASO, riscos e treinamentos',
            icon: <Radio className="w-4 h-4" strokeWidth={1.75} />,
            count: empregador.eventosEsocial.pendentes,
            countLabel:
              empregador.eventosEsocial.pendentes === 1
                ? 'pendente'
                : 'pendentes',
            miniStatus:
              empregador.eventosEsocial.certificado.status === 'expirado' ||
              empregador.eventosEsocial.certificado.status === 'nao_configurado'
                ? { text: 'Certificado bloqueando', tone: 'rose' as const }
                : empregador.eventosEsocial.rejeitadosMes > 0
                  ? {
                      text: `${empregador.eventosEsocial.rejeitadosMes} rejeitados no mês`,
                      tone: 'rose' as const,
                    }
                  : empregador.eventosEsocial.emTransmissao > 0
                    ? {
                        text: `${empregador.eventosEsocial.emTransmissao} em transmissão`,
                        tone: 'amber' as const,
                      }
                    : { text: 'Sem pendências', tone: 'emerald' as const },
          },
        ]
      : []),
    {
      secao: 'configuracoes' as const,
      label: 'Configurações',
      helper: 'Certificado, integrações, branding',
      icon: <Settings2 className="w-4 h-4" strokeWidth={1.75} />,
      count: 1,
      countLabel: 'área',
      miniStatus:
        empregador.eventosEsocial?.certificado.status === 'expirado' ||
        empregador.eventosEsocial?.certificado.status === 'nao_configurado'
          ? { text: 'Certificado inválido', tone: 'rose' }
          : empregador.eventosEsocial?.certificado.status === 'expirando'
            ? {
                text: `Certificado expira em ${empregador.eventosEsocial.certificado.diasAteExpiracao}d`,
                tone: 'amber',
              }
            : { text: 'Certificado A1 vigente', tone: 'teal' },
    },
  ]

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <div
          className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap"
          aria-label="Trilha"
        >
          <button
            type="button"
            onClick={onBackToList}
            className="text-teal-600 dark:text-teal-400 hover:underline underline-offset-2 font-medium"
          >
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 truncate">
            {empregador.nomeFantasia}
          </span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Detalhe do empregador
            </span>
            {!isArquivado ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-teal-50 dark:bg-teal-950/40 text-[10px] font-medium text-teal-700 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60">
                <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                Ativo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-slate-200/70 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 ring-1 ring-slate-300/60 dark:ring-slate-700">
                Arquivado
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {empregador.razaoSocial}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {empregador.nomeFantasia} · CNPJ{' '}
                <span className="font-mono">{empregador.cnpj}</span>
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                <CalendarClock
                  className={`w-3 h-3 ${vigenciaUrgente ? 'text-rose-500' : 'text-slate-400'}`}
                  strokeWidth={1.75}
                />
                Vigência NR-1 em{' '}
                <span
                  className={`font-mono ${
                    vigenciaUrgente
                      ? 'text-rose-700 dark:text-rose-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {proximoVencimento}
                </span>
                {saudeNr1.vigenciaEspecifica && (
                  <span className="text-slate-400 dark:text-slate-600">
                    · {formatDate(saudeNr1.vigenciaEspecifica)}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onEditEmpregador?.(empregador.id)}
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
              {isArquivado ? (
                <button
                  type="button"
                  onClick={() => onUnarchiveEmpregador?.(empregador.id)}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                    bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
                    text-white font-medium text-sm transition
                  "
                >
                  <ArchiveRestore className="w-3.5 h-3.5" strokeWidth={2} />
                  Desarquivar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onArchiveEmpregador?.(empregador.id)}
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
              )}
            </div>
          </div>
        </header>

        {alertas.length > 0 && (
          <div
            style={{ animationDelay: '120ms' }}
            className="nymos-reveal opacity-0 mt-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 ring-1 ring-rose-200/60 dark:ring-rose-900/50 px-4 py-3"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle
                className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400"
                strokeWidth={2}
              />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-rose-700 dark:text-rose-300">
                {alertas.length} {alertas.length === 1 ? 'alerta crítico' : 'alertas críticos'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {alertas.map((alerta) => (
                <button
                  key={alerta.id}
                  type="button"
                  onClick={() => onSelectAlerta?.(empregador.id, alerta.id)}
                  className={`
                    inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ring-1 text-[12px] font-medium
                    transition hover:brightness-105 active:translate-y-px
                    ${
                      alerta.severidade === 'critica'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50'
                    }
                  `}
                >
                  <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                  {alerta.mensagem}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            revealIndex={2}
            label="Cobertura média"
            value={`${(cobertura * 100).toFixed(0)}%`}
            sub={cleared ? 'acima do mínimo NR-1' : 'abaixo do mínimo NR-1'}
            icon={<Activity className="w-3.5 h-3.5" strokeWidth={1.75} />}
            accent={cleared ? 'teal' : 'amber'}
            barFillPct={cobertura * 100}
          />
          <KpiCard
            revealIndex={3}
            label="Avaliações ativas"
            value={
              saudeNr1.ultimaAvaliacaoStatus === 'em_aplicacao'
                ? '1'
                : saudeNr1.ultimaAvaliacaoStatus === 'rascunho'
                  ? '1'
                  : '0'
            }
            sub={`Última: ${saudeNr1.ultimaAvaliacaoStatus.replace('_', ' ')}`}
            icon={<ClipboardList className="w-3.5 h-3.5" strokeWidth={1.75} />}
            accent="violet"
          />
          <KpiCard
            revealIndex={4}
            label="Ações em aberto"
            value={NUM.format(planoAcao.emExecucao + planoAcao.emAtraso)}
            sub={
              planoAcao.emAtraso > 0
                ? `${planoAcao.emAtraso} em atraso`
                : `${planoAcao.totalItens} itens no plano`
            }
            icon={<ListChecks className="w-3.5 h-3.5" strokeWidth={1.75} />}
            accent={planoAcao.emAtraso > 0 ? 'rose' : 'slate'}
          />
          <KpiCard
            revealIndex={5}
            label="Próximo vencimento"
            value={
              saudeNr1.diasAteVigencia !== null
                ? `${saudeNr1.diasAteVigencia}d`
                : '—'
            }
            sub={
              saudeNr1.vigenciaEspecifica
                ? formatDate(saudeNr1.vigenciaEspecifica)
                : 'Sem vigência'
            }
            icon={<CalendarClock className="w-3.5 h-3.5" strokeWidth={1.75} />}
            accent={vigenciaUrgente ? 'rose' : 'slate'}
            mono
          />
        </div>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            style={{ animationDelay: '300ms' }}
            className="nymos-reveal opacity-0 lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Layers3 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Atalhos
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {atalhos.map((atalho, idx) => (
                <AtalhoCard
                  key={atalho.secao}
                  atalho={atalho}
                  revealIndex={idx + 7}
                  onClick={() => onNavigateToSecao?.(empregador.id, atalho.secao)}
                />
              ))}
            </div>
          </div>

          <div
            style={{ animationDelay: '360ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Atividade recente
              </span>
            </div>
            {empregador.atividadeRecente.length === 0 ? (
              <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-6 text-center">
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Nenhuma atividade registrada.
                </p>
              </div>
            ) : (
              <ol className="space-y-3 relative">
                <span
                  className="absolute left-[10px] top-1 bottom-1 w-px bg-slate-200 dark:bg-slate-800"
                  aria-hidden="true"
                />
                {empregador.atividadeRecente.map((ev) => (
                  <li key={ev.id} className="relative pl-6">
                    <span
                      className={`
                        absolute left-0 top-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full ring-1
                        ${ATIVIDADE_TONE[ev.tipo]}
                      `}
                    >
                      {ATIVIDADE_ICON[ev.tipo]}
                    </span>
                    <p className="text-[12px] text-slate-800 dark:text-slate-200 font-medium leading-snug">
                      {ev.titulo}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono mt-0.5">
                      {formatDateTime(ev.ocorridoEm)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-3 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-4"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`
                  inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0
                  bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300
                `}
              >
                {empregador.responsavelTecnico.nome
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Responsável técnico
                </p>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {empregador.responsavelTecnico.nome}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
                  <span>{empregador.responsavelTecnico.cargo}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-mono">{empregador.responsavelTecnico.registro}</span>
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium ${planoTone.pill}`}
            >
              <ListChecks className="w-3 h-3" strokeWidth={2} />
              Plano · {planoTone.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
  revealIndex,
  barFillPct,
  mono,
}: {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: 'teal' | 'slate' | 'violet' | 'amber' | 'rose'
  revealIndex: number
  barFillPct?: number
  mono?: boolean
}) {
  const accents = {
    teal: 'text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 ring-teal-200/60 dark:ring-teal-900/50',
    slate: 'text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 ring-slate-200/60 dark:ring-slate-700/60',
    violet: 'text-violet-700 dark:text-violet-300 bg-violet-50/70 dark:bg-violet-950/30 ring-violet-200/60 dark:ring-violet-900/50',
    amber: 'text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 ring-amber-200/60 dark:ring-amber-900/50',
    rose: 'text-rose-700 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/30 ring-rose-200/60 dark:ring-rose-900/50',
  }[accent]

  const barTone = {
    teal: 'from-teal-500 to-emerald-400',
    amber: 'from-amber-500 to-amber-300',
    slate: 'from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700',
    violet: 'from-violet-500 to-violet-300',
    rose: 'from-rose-500 to-rose-300',
  }[accent]

  return (
    <div
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        px-4 py-3.5
        flex flex-col justify-between gap-3
        min-h-[112px]
      "
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className={`inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ${accents}`}>
          {icon}
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className={`text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50 ${
              mono ? 'font-mono' : ''
            }`}
          >
            {value}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{sub}</span>
        {barFillPct !== undefined && (
          <div className="mt-1.5 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barTone}`}
              style={{ width: `${Math.min(barFillPct, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function AtalhoCard({
  atalho,
  revealIndex,
  onClick,
}: {
  atalho: AtalhoSpec
  revealIndex: number
  onClick: () => void
}) {
  const tones = {
    teal: 'text-teal-700 dark:text-teal-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    amber: 'text-amber-700 dark:text-amber-300',
    rose: 'text-rose-700 dark:text-rose-300',
    slate: 'text-slate-600 dark:text-slate-400',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${30 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group rounded-xl bg-slate-50/70 dark:bg-slate-800/40
        ring-1 ring-slate-200/60 dark:ring-slate-800
        hover:ring-teal-300 dark:hover:ring-teal-700
        hover:bg-white dark:hover:bg-slate-900/80
        transition-all duration-200
        px-4 py-3 text-left
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
      "
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-white dark:bg-slate-900 ring-1 ring-slate-200/60 dark:ring-slate-700 text-slate-600 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition">
          {atalho.icon}
        </span>
        <ChevronRight
          className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all"
          strokeWidth={1.75}
        />
      </div>
      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 leading-tight">
        {atalho.label}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
        {atalho.helper}
      </p>
      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[16px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {NUM.format(atalho.count)}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{atalho.countLabel}</span>
      </div>
      {atalho.miniStatus && (
        <p
          className={`mt-1 text-[10px] capitalize font-medium ${
            tones[atalho.miniStatus.tone]
          }`}
        >
          {atalho.miniStatus.text}
        </p>
      )}
    </button>
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
