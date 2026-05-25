import { CalendarDays, DollarSign, TrendingUp, Users } from 'lucide-react'
import type { InicioProps } from '@/../product-personal/sections/inicio/types'
import { KpiCard } from './KpiCard'
import { AgendaToday } from './AgendaToday'
import { AlunosRiscoBlock } from './AlunosRiscoBlock'
import { ProximasReavaliacoesBlock } from './ProximasReavaliacoesBlock'
import { AtalhosBlock } from './AtalhosBlock'
import { DiarioBlock } from './DiarioBlock'
import { AtividadeRecenteBlock } from './AtividadeRecenteBlock'
import { formatBRL, formatDeltaBRL } from './helpers'

export function InicioPage({
  greeting,
  kpis,
  agenda,
  alunosRisco,
  proximasReavaliacoes,
  atalhos,
  diario,
  atividadeRecente,
  onMarcarSessaoRealizada,
  onOpenSessao,
  onOpenAluno,
  onCreateAvaliacao,
  onOpenTreinos,
  onConvidarAluno,
  onAddNota,
  onToggleNota,
  onRemoveNota,
  onOpenAgenda,
  onOpenAtividade,
}: InicioProps) {
  return (
    <div
      data-nymos-inicio
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Greeting */}
        <header
          style={{ animationDelay: '0ms' }}
          className="nymos-reveal opacity-0 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {greeting.dataFormatada}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              {greeting.saudacao},{' '}
              <span className="text-teal-600 dark:text-teal-400">
                {greeting.nome}
              </span>
            </h1>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Personal · CREF
          </span>
        </header>

        {/* KPI strip */}
        <div
          style={{ animationDelay: '100ms' }}
          className="nymos-reveal opacity-0 mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          <KpiCard
            label="Alunos ativos"
            icon={<Users size={12} />}
            value={
              <p className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {kpis.alunosAtivos.atual}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  alunos
                </span>
              </p>
            }
            delta={
              kpis.alunosAtivos.delta === 0
                ? { sign: 'neutral', text: '', positive: false }
                : {
                    sign: kpis.alunosAtivos.delta > 0 ? 'up' : 'down',
                    text: `${Math.abs(kpis.alunosAtivos.delta)}`,
                    positive: kpis.alunosAtivos.delta > 0,
                  }
            }
            hint={`Mês anterior: ${kpis.alunosAtivos.anterior}`}
          />

          <KpiCard
            label="Sessões / mês"
            icon={<CalendarDays size={12} />}
            value={
              <p className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {kpis.sessoes.realizadas}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  / {kpis.sessoes.alvoMes}
                </span>
              </p>
            }
            progress={{
              percent: kpis.sessoes.percentual,
              tone:
                kpis.sessoes.percentual >= 80
                  ? 'emerald'
                  : kpis.sessoes.percentual >= 50
                    ? 'teal'
                    : 'amber',
            }}
            hint={`${kpis.sessoes.percentual}% do alvo`}
          />

          <KpiCard
            label="MRR estimado"
            icon={<DollarSign size={12} />}
            value={
              <p className="font-mono">
                <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {formatBRL(kpis.mrr.centavosAtual)}
                </span>
              </p>
            }
            delta={
              kpis.mrr.delta === 0
                ? { sign: 'neutral', text: '', positive: false }
                : {
                    sign: kpis.mrr.delta > 0 ? 'up' : 'down',
                    text: formatDeltaBRL(Math.abs(kpis.mrr.delta)),
                    positive: kpis.mrr.delta > 0,
                  }
            }
            hint={`Anterior: ${formatBRL(kpis.mrr.centavosAnterior)}`}
          />

          <KpiCard
            label="Indicações"
            icon={<TrendingUp size={12} />}
            value={
              <p className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {kpis.indicacoes.aceitas}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  aceitas
                </span>
              </p>
            }
            hint={
              <>
                <span className="tabular-nums">{kpis.indicacoes.pendentes}</span>{' '}
                pendentes
              </>
            }
          />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-5">
            <div style={{ animationDelay: '200ms' }} className="nymos-reveal opacity-0">
              <AgendaToday
                agenda={agenda}
                onMarcarRealizada={onMarcarSessaoRealizada}
                onOpenSessao={onOpenSessao}
                onOpenAgenda={onOpenAgenda}
              />
            </div>

            <div style={{ animationDelay: '280ms' }} className="nymos-reveal opacity-0">
              <AlunosRiscoBlock alunos={alunosRisco} onOpenAluno={onOpenAluno} />
            </div>

            <div style={{ animationDelay: '360ms' }} className="nymos-reveal opacity-0">
              <ProximasReavaliacoesBlock
                reavaliacoes={proximasReavaliacoes}
                onOpenAluno={onOpenAluno}
                onCreateAvaliacao={() => onCreateAvaliacao?.()}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-5">
            <div style={{ animationDelay: '240ms' }} className="nymos-reveal opacity-0">
              <AtalhosBlock
                atalhos={atalhos}
                onCreateAvaliacao={onCreateAvaliacao}
                onOpenTreinos={onOpenTreinos}
                onConvidarAluno={onConvidarAluno}
                onAnotar={() => onAddNota?.('')}
              />
            </div>

            <div style={{ animationDelay: '320ms' }} className="nymos-reveal opacity-0">
              <DiarioBlock
                diario={diario}
                onAddNota={onAddNota}
                onToggleNota={onToggleNota}
                onRemoveNota={onRemoveNota}
              />
            </div>

            <div style={{ animationDelay: '400ms' }} className="nymos-reveal opacity-0">
              <AtividadeRecenteBlock
                eventos={atividadeRecente}
                onOpenAluno={onOpenAluno}
                onOpenAtividade={onOpenAtividade}
              />
            </div>
          </div>
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
      [data-nymos-inicio] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-inicio] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
