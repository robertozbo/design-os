import {
  Activity,
  AlertTriangle,
  Bone,
  Brain,
  Calendar,
  ChevronRight,
  Image as ImageIcon,
  Pill,
  ScanSearch,
  Sparkles,
  TrendingUp,
  Waves,
} from 'lucide-react'
import type { PacienteDetalhe } from '@/../product-clinico/sections/pacientes/types'
import { formatDataExtenso, formatPercent, ALERT_NIVEL_STYLE, formatDataBR } from './helpers'
import { Sparkline } from './Sparkline'

interface Props {
  paciente: PacienteDetalhe
  onIniciarConsulta?: (id: string) => void
  onAbrirAtendimento?: (id: string) => void
}

const MOD_ICON = {
  'raio-x': Bone,
  usg: Waves,
  rm: Brain,
  tc: Brain,
  cintilografia: ScanSearch,
} as const

export function VisaoGeralTab({ paciente, onIniciarConsulta, onAbrirAtendimento }: Props) {
  const exameDestaque = paciente.examesRecentes[0]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Resumo clínico */}
      <Card spans="md:col-span-2">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Activity className="size-4" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Resumo clínico</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Visão integrada das condições, medicação e sinal mais relevante do último exame
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Condições crônicas
            </h4>
            <ul className="mt-2 space-y-1">
              {paciente.condicoesCronicas.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <span className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Medicação ativa
            </h4>
            <ul className="mt-2 space-y-1.5">
              {paciente.medicacaoAtiva.map((m, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-medium">{m.nome}</span>{' '}
                  <span className="text-xs text-slate-500">{m.dose}</span>
                  <span className="block text-[10px] text-slate-500">{m.posologia}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {paciente.imagensAnalisadasRecentes && paciente.imagensAnalisadasRecentes.length > 0 && (
          <div className="mt-4 rounded-lg border border-emerald-200/70 bg-gradient-to-r from-emerald-50/60 to-white p-3 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-900/40">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <Sparkles className="size-3" />
                Análises de imagem (IA) recentes
              </p>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {paciente.imagensAnalisadasRecentes.length}
              </span>
            </div>
            <ul className="mt-2 space-y-2">
              {paciente.imagensAnalisadasRecentes.slice(0, 3).map((img) => {
                const Icon = MOD_ICON[img.modalidade] ?? ImageIcon
                return (
                  <li key={img.id}>
                    <button
                      onClick={() => onAbrirAtendimento?.(img.atendimentoId)}
                      className="
                        group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors
                        hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30
                      "
                    >
                      <Icon className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-medium text-slate-900 dark:text-slate-100">
                          {img.tipo}
                        </p>
                        {img.comentarioMedico && (
                          <p className="mt-0.5 line-clamp-1 text-[10px] italic text-slate-600 dark:text-slate-300">
                            "{img.comentarioMedico}"
                          </p>
                        )}
                        <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-400">
                          {formatDataBR(img.dataColeta)} · {img.seriesAnalisadas} séries · {img.modeloIA}
                        </p>
                      </div>
                      <ChevronRight className="mt-0.5 size-3 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {exameDestaque && exameDestaque.biomarkers[0] && (
          <div className="mt-4 rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Biomarker em destaque · {exameDestaque.tipo}
                </p>
                <p className="mt-0.5 text-sm">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {exameDestaque.biomarkers[0].nome}
                  </span>{' '}
                  <span
                    className={`font-mono tabular-nums ${
                      ALERT_NIVEL_STYLE[exameDestaque.biomarkers[0].alertNivel]
                    }`}
                  >
                    {exameDestaque.biomarkers[0].valor}{' '}
                    <span className="text-[10px] text-slate-400">
                      {exameDestaque.biomarkers[0].unidade}
                    </span>
                  </span>
                </p>
                <p className="text-[10px] text-slate-500">
                  Ref. {exameDestaque.biomarkers[0].faixaReferencia}
                </p>
              </div>
              <Sparkline
                values={exameDestaque.biomarkers[0].historico}
                ariaLabel={`Tendência ${exameDestaque.biomarkers[0].nome}`}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Próxima consulta */}
      {paciente.proximaConsulta ? (
        <Card>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Calendar className="size-4" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Próxima consulta</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {formatDataExtenso(paciente.proximaConsulta.iniciaEm)}
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/40">
            <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
              {paciente.proximaConsulta.modalidade === 'tele' ? 'Teleconsulta' : 'Presencial'}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {paciente.proximaConsulta.observacao || 'Sem observação'}
            </p>
          </div>
          <button
            onClick={() => onIniciarConsulta?.(paciente.proximaConsulta!.agendamentoId)}
            className="
              mt-3 inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white
              transition-colors hover:bg-teal-500
            "
          >
            Iniciar consulta
            <ChevronRight className="size-3.5" />
          </button>
        </Card>
      ) : (
        <Card>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Calendar className="size-4" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Próxima consulta
              </h3>
              <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                Nenhum retorno agendado.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Adesão */}
      <Card>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <Pill className="size-4" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Adesão (30 dias)
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Diário de medicação no app · {formatPercent(paciente.adesaoMedicaoDiario30Dias)} medições registradas
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {paciente.adesao30Dias.map((a, i) => (
            <li key={i}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-200">{a.medicacao}</span>
                <span
                  className={`
                    font-mono tabular-nums
                    ${
                      a.percentCumprido >= 0.9
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : a.percentCumprido >= 0.7
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }
                  `}
                >
                  {formatPercent(a.percentCumprido)}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
                <div
                  className={`
                    h-full rounded-full transition-all
                    ${
                      a.percentCumprido >= 0.9
                        ? 'bg-emerald-500'
                        : a.percentCumprido >= 0.7
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }
                  `}
                  style={{ width: `${a.percentCumprido * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Alertas */}
      <Card spans="md:col-span-2">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <AlertTriangle className="size-4" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Alertas {paciente.alertas.length > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {paciente.alertas.length}
                </span>
              )}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Itens que precisam atenção
            </p>
          </div>
        </div>
        {paciente.alertas.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {paciente.alertas.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-2 rounded-md border border-amber-200/60 bg-amber-50/40 px-3 py-2 text-sm dark:border-amber-900/40 dark:bg-amber-950/20"
              >
                <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-700 dark:text-slate-200">{a.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">Nada pendente.</p>
        )}
      </Card>
    </div>
  )
}

function Card({ children, spans = '' }: { children: React.ReactNode; spans?: string }) {
  return (
    <section
      className={`
        rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm
        dark:border-slate-800 dark:bg-slate-900
        ${spans}
      `}
    >
      {children}
    </section>
  )
}
