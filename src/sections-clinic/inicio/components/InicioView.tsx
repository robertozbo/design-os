import {
  CalendarClock,
  Check,
  ChevronRight,
  FlaskConical,
  MapPin,
  MessageSquare,
  Play,
  Share2,
  Video,
} from 'lucide-react'
import type {
  AlertaResumo,
  ConsultaDia,
  EncaminhamentoRecebido,
  InicioData,
} from '@/../product-clinic/sections/inicio/types'
import { AVATAR_COR, STATUS_META } from './helpers'

const ALERTA_ICON = {
  mensagens: MessageSquare,
  exames: FlaskConical,
  encaminhamentos: Share2,
}

interface Props {
  dados: InicioData
  onIniciarConsulta: (c: ConsultaDia) => void
  onAlerta: (a: AlertaResumo) => void
  onAceitarEncaminhamento: (e: EncaminhamentoRecebido) => void
  onAbrirEncaminhamento: (e: EncaminhamentoRecebido) => void
}

export function InicioView({
  dados,
  onIniciarConsulta,
  onAlerta,
  onAceitarEncaminhamento,
  onAbrirEncaminhamento,
}: Props) {
  const { resumoDia } = dados

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {dados.saudacao}, {dados.medico.nome}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {dados.dataHoje} ·{' '}
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {resumoDia.consultas} consultas
          </span>
          {' · '}
          {resumoDia.realizadas} realizadas
          {resumoDia.proximaHora && (
            <>
              {' · próxima '}
              <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                {resumoDia.proximaHora}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Alertas */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {dados.alertas.map((a) => (
          <AlertaCard key={a.id} alerta={a} onClick={() => onAlerta(a)} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Agenda do dia */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-2 px-1">
            <CalendarClock className="h-4 w-4 text-slate-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Agenda de hoje
            </h2>
          </div>
          {dados.agendaDia.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
              Nenhuma consulta agendada para hoje.
            </div>
          ) : (
            <ul className="space-y-2">
              {dados.agendaDia.map((c) => (
                <ConsultaItem key={c.id} consulta={c} onIniciar={() => onIniciarConsulta(c)} />
              ))}
            </ul>
          )}
        </div>

        {/* Encaminhamentos recebidos */}
        <div>
          <div className="mb-2 flex items-center gap-2 px-1">
            <Share2 className="h-4 w-4 text-slate-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Encaminhamentos recebidos
            </h2>
          </div>
          {dados.encaminhamentos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-700">
              Nada pendente.
            </div>
          ) : (
            <ul className="space-y-2">
              {dados.encaminhamentos.map((e) => (
                <EncaminhamentoCard
                  key={e.id}
                  enc={e}
                  onAceitar={() => onAceitarEncaminhamento(e)}
                  onAbrir={() => onAbrirEncaminhamento(e)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function AlertaCard({ alerta, onClick }: { alerta: AlertaResumo; onClick: () => void }) {
  const Icon = ALERTA_ICON[alerta.tipo]
  const ativo = alerta.count > 0
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition-colors hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          ativo
            ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {alerta.count}
          </span>
          {ativo && (
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
          )}
        </div>
        <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{alerta.label}</div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
    </button>
  )
}

function ConsultaItem({ consulta, onIniciar }: { consulta: ConsultaDia; onIniciar: () => void }) {
  const meta = STATUS_META[consulta.status]
  const emAtendimento = consulta.status === 'em-atendimento'
  const iniciavel = consulta.status === 'confirmado' || consulta.status === 'chegou' || emAtendimento

  return (
    <li
      className={`group flex items-stretch gap-3 rounded-2xl border bg-white p-3 transition-all dark:bg-slate-900 ${
        emAtendimento
          ? 'border-teal-500 ring-1 ring-teal-500/30'
          : 'border-slate-200 dark:border-slate-800'
      } ${meta.esmaecido ? 'opacity-60' : ''}`}
    >
      {/* Horário */}
      <div className="flex w-12 shrink-0 flex-col items-center justify-center border-r border-slate-100 pr-3 dark:border-slate-800">
        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {consulta.hora}
        </span>
        <span className="text-[10px] tabular-nums text-slate-400">{consulta.duracaoMin}min</span>
      </div>

      {/* Paciente */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {consulta.paciente.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {consulta.paciente.nome}
            </span>
            <span className="shrink-0 text-[11px] text-slate-400">{consulta.paciente.idade}a</span>
            {consulta.viaEncaminhamento && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                <Share2 className="h-2.5 w-2.5" /> encaminhado
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">{consulta.motivo}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            {consulta.modalidade === 'tele' ? (
              <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                <Video className="h-3 w-3" /> Teleconsulta
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {consulta.sala}
              </span>
            )}
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-400">{consulta.paciente.convenio}</span>
          </div>
        </div>
      </div>

      {/* Status + ação */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
          {meta.label}
        </span>
        {iniciavel && (
          <button
            onClick={onIniciar}
            className="mt-2 inline-flex items-center gap-1 rounded-lg bg-teal-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-teal-600"
          >
            <Play className="h-3 w-3" />
            {emAtendimento ? 'Continuar' : 'Iniciar consulta'}
          </button>
        )}
      </div>
    </li>
  )
}

function EncaminhamentoCard({
  enc,
  onAceitar,
  onAbrir,
}: {
  enc: EncaminhamentoRecebido
  onAceitar: () => void
  onAbrir: () => void
}) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${AVATAR_COR[enc.de.cor]}`}
        >
          {enc.de.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
            {enc.de.nome}
          </div>
          <div className="truncate text-[10px] text-slate-400">
            {enc.de.especialidade} · {enc.recebidoEm}
          </div>
        </div>
      </div>

      <div className="mt-2.5 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {enc.paciente.iniciais}
          </span>
          <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
            {enc.paciente.nome}
          </span>
        </div>
        <div className="mt-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          {enc.motivo}
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {enc.contexto}
        </p>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button
          onClick={onAceitar}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-teal-500 px-2 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Check className="h-3 w-3" /> Aceitar
        </button>
        <button
          onClick={onAbrir}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Abrir
        </button>
      </div>
    </li>
  )
}
