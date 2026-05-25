import {
  Bell,
  Stethoscope,
  Video,
  MapPin,
  Check,
  Clock,
  AlertCircle,
  Scale,
  Droplet,
  Camera,
  FileText,
  ChevronRight,
  MessageCircle,
  Plus,
  Sparkles,
} from 'lucide-react'
import type {
  InicioPacienteProps,
  AcaoRapidaId,
  LembreteMedicacao,
  AcaoRapida,
  ProfissionalVinculado,
  ProfissionalPlaceholder,
} from '@/../product-clinico/sections/inicio-paciente/types'
import { MobileFrameClinico } from './MobileFrameClinico'
import {
  formatHora,
  formatRelativoMin,
  ACAO_RAPIDA_GRADIENT,
  ACAO_RAPIDA_TEXT,
} from './helpers'

const ACAO_ICON: Record<AcaoRapidaId, typeof Scale> = {
  peso: Scale,
  glicemia: Droplet,
  exame: Camera,
  receita: FileText,
}

export function InicioPaciente({
  paciente,
  saudacao,
  alertaTopo,
  proximaConsulta,
  lembretesMedicacaoHoje,
  acoesRapidas,
  profissionaisVinculados,
  profissionaisPlaceholder,
  onAbrirNotificacoes,
  onAbrirPerfil,
  onAbrirAlerta,
  onAbrirProximaConsulta,
  onEntrarSalaTele,
  onConfirmarPresenca,
  onMarcarCumprido,
  onAcaoRapida,
  onAbrirProfissional,
  onBuscarProfissional,
}: InicioPacienteProps) {
  return (
    <MobileFrameClinico activeTab="inicio" notificacoesNaoLidas={paciente.notificacoesNaoLidas}>
      <div className="px-5 pb-8 pt-4">
        {/* Topbar */}
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
              Nymos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAbrirNotificacoes}
              className="
                relative flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600
                transition-colors active:scale-95
                dark:bg-slate-800 dark:text-slate-300
              "
              aria-label="Notificações"
            >
              <Bell size={16} />
              {paciente.notificacoesNaoLidas > 0 && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-slate-100 dark:ring-slate-800" />
              )}
            </button>
            <button
              onClick={onAbrirPerfil}
              className="
                flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600
                text-xs font-medium text-white shadow-sm transition-all active:scale-95
              "
              aria-label="Perfil"
            >
              {paciente.iniciais}
            </button>
          </div>
        </header>

        {/* Saudação */}
        <section className="mb-6">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
            {saudacao.texto}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {saudacao.dica}
          </p>
        </section>

        {/* Alerta topo (mensagem nova) */}
        {alertaTopo && (
          <button
            onClick={() => onAbrirAlerta?.(alertaTopo.id)}
            className="
              mb-5 flex w-full items-center gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/70 px-3 py-2.5 text-left
              transition-all active:scale-[0.98]
              dark:border-emerald-900/50 dark:bg-emerald-950/30
            "
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-200/60 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              <MessageCircle size={14} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-emerald-900 dark:text-emerald-100">
                {alertaTopo.label}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                {alertaTopo.ctaLabel} →
              </span>
            </span>
          </button>
        )}

        {/* Próxima consulta */}
        {proximaConsulta && (
          <ProximaConsultaCard
            consulta={proximaConsulta}
            onAbrir={() => onAbrirProximaConsulta?.(proximaConsulta.agendamentoId)}
            onEntrarSala={() => onEntrarSalaTele?.(proximaConsulta.agendamentoId)}
            onConfirmar={() => onConfirmarPresenca?.(proximaConsulta.agendamentoId)}
          />
        )}

        {/* Lembretes medicação */}
        <section className="mt-6">
          <SectionHeader
            title="Hoje"
            subtitle={`${lembretesMedicacaoHoje.length} doses programadas`}
            count={lembretesMedicacaoHoje.length}
          />
          <ul className="space-y-2">
            {lembretesMedicacaoHoje.map((l) => (
              <LembreteRow key={l.id} l={l} onMarcar={() => onMarcarCumprido?.(l.id)} />
            ))}
          </ul>
        </section>

        {/* Ações rápidas */}
        <section className="mt-6">
          <SectionHeader title="Ações rápidas" subtitle="Atalhos do dia a dia" />
          <div className="grid grid-cols-2 gap-3">
            {acoesRapidas.map((a) => (
              <AcaoRapidaCard key={a.id} a={a} onClick={() => onAcaoRapida?.(a.id)} />
            ))}
          </div>
        </section>

        {/* Profissionais */}
        <section className="mt-6">
          <SectionHeader
            title="Seus profissionais"
            subtitle="Cada profissional vê apenas o que é dele (LGPD)"
          />
          <div className="space-y-2">
            {profissionaisVinculados.map((p) => (
              <ProfissionalVinculadoCard
                key={p.id}
                p={p}
                onClick={() => onAbrirProfissional?.(p.id)}
              />
            ))}
            {profissionaisPlaceholder.map((p) => (
              <ProfissionalPlaceholderCard
                key={p.verticalId}
                p={p}
                onClick={() => onBuscarProfissional?.(p.verticalId)}
              />
            ))}
          </div>
        </section>
      </div>
    </MobileFrameClinico>
  )
}

function SectionHeader({
  title,
  subtitle,
  count,
}: {
  title: string
  subtitle?: string
  count?: number
}) {
  return (
    <header className="mb-2 flex items-baseline justify-between">
      <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
        {count !== undefined && (
          <span className="ml-1.5 font-mono text-xs font-normal tabular-nums text-slate-400">
            {count}
          </span>
        )}
      </h2>
      {subtitle && (
        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {subtitle}
        </span>
      )}
    </header>
  )
}

function ProximaConsultaCard({
  consulta,
  onAbrir,
  onEntrarSala,
  onConfirmar,
}: {
  consulta: NonNullable<InicioPacienteProps['proximaConsulta']>
  onAbrir?: () => void
  onEntrarSala?: () => void
  onConfirmar?: () => void
}) {
  const ehTele = consulta.modalidade === 'tele'
  const podeAcao = consulta.podeEntrarSala
  return (
    <article
      className="
        relative overflow-hidden rounded-2xl border border-teal-200/80
        bg-gradient-to-br from-teal-50 via-emerald-50/60 to-white p-4 shadow-sm
        dark:border-teal-900/40 dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-slate-900
      "
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-8 -top-12 size-32 rounded-full bg-teal-300/30 blur-2xl"
        aria-hidden="true"
      />

      <button onClick={onAbrir} className="relative block w-full text-left">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
            <Stethoscope size={14} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700 dark:text-teal-300">
            {consulta.ehHoje ? 'Hoje' : 'Próxima consulta'}
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
            {consulta.hora}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-teal-800 backdrop-blur-sm dark:border-teal-900/60 dark:bg-slate-900/60 dark:text-teal-300">
            {ehTele ? <Video size={10} /> : <MapPin size={10} />}
            {ehTele ? 'Teleconsulta' : 'Presencial'}
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
          {consulta.medicoNome}{' '}
          <span className="font-normal text-slate-500 dark:text-slate-400">
            · {consulta.medicoEspecialidade}
          </span>
        </p>
        {consulta.observacao && (
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {consulta.observacao}
          </p>
        )}
      </button>

      <div className="relative mt-4 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-teal-700 dark:text-teal-300">
          {formatRelativoMin(consulta.minutosAteInicio)}
        </span>
        {podeAcao ? (
          <button
            onClick={ehTele ? onEntrarSala : onConfirmar}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md
              transition-all active:scale-95
            "
          >
            {ehTele ? <Video size={14} /> : <Check size={14} />}
            {ehTele ? 'Entrar na sala' : 'Confirmar presença'}
          </button>
        ) : (
          <button
            onClick={onAbrir}
            className="
              inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-teal-800 backdrop-blur-sm
              transition-all active:scale-95
              dark:border-teal-900/60 dark:bg-slate-900/60 dark:text-teal-300
            "
          >
            Detalhes
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </article>
  )
}

function LembreteRow({ l, onMarcar }: { l: LembreteMedicacao; onMarcar?: () => void }) {
  const cumprido = l.status === 'cumprido'
  const atrasado = l.status === 'atrasado'

  return (
    <li
      className={`
        flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all
        ${
          cumprido
            ? 'border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
            : atrasado
            ? 'border-rose-200/80 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/30'
            : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
        }
      `}
    >
      <div className="flex flex-col items-center justify-center">
        <span
          className={`
            font-mono text-xs font-semibold tabular-nums
            ${
              cumprido
                ? 'text-emerald-700 dark:text-emerald-400'
                : atrasado
                ? 'text-rose-700 dark:text-rose-400'
                : 'text-slate-700 dark:text-slate-200'
            }
          `}
        >
          {formatHora(l.horario)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`
            text-sm font-medium leading-tight
            ${
              cumprido
                ? 'text-slate-500 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }
          `}
        >
          {l.medicacao}{' '}
          <span className="text-xs font-normal text-slate-500">{l.dose}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{l.instrucao}</p>
        {atrasado && (
          <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-rose-600 dark:text-rose-400">
            <AlertCircle size={10} />
            Atrasada
          </p>
        )}
      </div>
      <button
        onClick={onMarcar}
        disabled={cumprido}
        className={`
          flex size-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-90
          ${
            cumprido
              ? 'bg-emerald-500 text-white'
              : atrasado
              ? 'border-2 border-rose-400 bg-white text-rose-600 dark:bg-slate-900'
              : 'border-2 border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900'
          }
        `}
        aria-label={cumprido ? 'Cumprida' : 'Marcar como cumprida'}
      >
        {cumprido ? <Check size={18} strokeWidth={3} /> : <Clock size={16} />}
      </button>
    </li>
  )
}

function AcaoRapidaCard({ a, onClick }: { a: AcaoRapida; onClick?: () => void }) {
  const Icon = ACAO_ICON[a.id]
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-start justify-between gap-2 overflow-hidden rounded-2xl
        border border-slate-200/80 bg-gradient-to-br ${ACAO_RAPIDA_GRADIENT[a.id]} p-4 text-left
        shadow-sm transition-all active:scale-[0.97]
        dark:border-slate-800
      `}
      style={{ minHeight: 112 }}
    >
      <Icon className={`size-6 ${ACAO_RAPIDA_TEXT[a.id]}`} strokeWidth={2.2} />
      <div>
        <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-50">
          {a.label}
        </p>
        {a.valorAtual ? (
          <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
            <span className={`font-medium ${ACAO_RAPIDA_TEXT[a.id]}`}>{a.valorAtual}</span>
            {a.ultimoRegistro && (
              <span className="text-slate-400"> · {a.ultimoRegistro}</span>
            )}
          </p>
        ) : (
          a.ultimoRegistro && (
            <p className="mt-0.5 text-[11px] text-slate-500">Último: {a.ultimoRegistro}</p>
          )
        )}
      </div>
    </button>
  )
}

function ProfissionalVinculadoCard({
  p,
  onClick,
}: {
  p: ProfissionalVinculado
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left
        shadow-sm transition-all active:scale-[0.99]
        dark:border-slate-800 dark:bg-slate-900
      "
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-medium text-white shadow-sm">
        {p.iniciais}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
          {p.nome}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.especialidade}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {p.pendencias.proximaConsultaTexto && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-medium text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
              <Stethoscope size={10} />
              {p.pendencias.proximaConsultaTexto}
            </span>
          )}
          {p.pendencias.mensagensNaoLidas > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <MessageCircle size={10} />
              {p.pendencias.mensagensNaoLidas}{' '}
              {p.pendencias.mensagensNaoLidas === 1 ? 'mensagem' : 'mensagens'}
            </span>
          )}
          {p.pendencias.planoAtivoLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
              <Sparkles size={10} />
              Plano ativo
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />
    </button>
  )
}

function ProfissionalPlaceholderCard({
  p,
  onClick,
}: {
  p: ProfissionalPlaceholder
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex w-full items-start gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-3 text-left
        transition-all active:scale-[0.99] hover:border-teal-300 hover:bg-teal-50/30
        dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-teal-700 dark:hover:bg-teal-950/20
      "
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500">
        <Plus size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {p.verticalLabel}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {p.explicacao}
        </p>
        <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-medium text-teal-600 dark:text-teal-400">
          {p.ctaLabel} <ChevronRight size={11} />
        </span>
      </div>
    </button>
  )
}
