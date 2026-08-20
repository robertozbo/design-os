import { useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar, Check, FileText, Sparkles, X } from 'lucide-react'
import type {
  ModeloRelatorio,
  PacienteSelector,
  TipoRelatorio,
} from '@/../product-clinic/sections/relatorios-medicos/types'
import { dataExtenso, diasExtenso, somarDias } from './helpers'

export interface NovoRelatorio {
  pacienteId: string
  tipo: TipoRelatorio
  consultaId: string
  dias: number
}

interface Props {
  pacientes: PacienteSelector[]
  modelos: ModeloRelatorio[]
  onGerar: (dados: NovoRelatorio) => void
  onFechar: () => void
}

const PASSO_LABEL = ['Paciente', 'Tipo de relatório', 'Consulta']

export function NovoRelatorioModal({ pacientes, modelos, onGerar, onFechar }: Props) {
  const [passo, setPasso] = useState(1)
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [tipo, setTipo] = useState<TipoRelatorio | null>(null)
  const [consultaId, setConsultaId] = useState<string | null>(null)
  const [dias, setDias] = useState(2)

  const paciente = pacientes.find((p) => p.id === pacienteId) ?? null
  const modelo = modelos.find((m) => m.tipo === tipo) ?? null
  const consulta = paciente?.consultas.find((c) => c.id === consultaId) ?? null

  const podeAvancar = passo === 1 ? !!paciente : passo === 2 ? !!modelo : false
  const podeGerar = !!paciente && !!modelo && !!consulta && (modelo.campo !== 'dias' || dias >= 1)

  // Trocar de paciente invalida a consulta escolhida: a lista do passo 3 é a dele.
  const escolherPaciente = (id: string) => {
    setPacienteId(id)
    setConsultaId(null)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        {/* Header + stepper */}
        <div className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Novo relatório
            </h2>
            <button
              aria-label="Fechar"
              onClick={onFechar}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full ${
                  n <= passo ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400">
            Passo {passo} de 3 · {PASSO_LABEL[passo - 1]}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Passo 1 — paciente */}
          {passo === 1 && (
            <ul className="space-y-1.5">
              {pacientes.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => escolherPaciente(p.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                      pacienteId === p.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                      {p.iniciais}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {p.nome}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {p.idade}a · {p.convenio} · {p.consultas.length}{' '}
                        {p.consultas.length === 1 ? 'consulta' : 'consultas'}
                      </div>
                    </div>
                    {pacienteId === p.id && <Check className="h-4 w-4 shrink-0 text-teal-500" />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Passo 2 — tipo */}
          {passo === 2 && (
            <ul className="space-y-1.5">
              {modelos.map((m) => (
                <li key={m.tipo}>
                  <button
                    onClick={() => setTipo(m.tipo)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                      tipo === m.tipo
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {m.titulo}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-slate-400">
                        {m.descricao}
                      </div>
                    </div>
                    {tipo === m.tipo && <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Passo 3 — consulta + campo do tipo */}
          {passo === 3 && paciente && modelo && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {paciente.nome}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">{modelo.titulo}</span>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Data da consulta
                </label>
                {paciente.consultas.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-700">
                    Este paciente ainda não tem consulta registrada com você.
                  </div>
                ) : (
                  <ul className="space-y-1.5">
                    {paciente.consultas.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => setConsultaId(c.id)}
                          className={`flex w-full items-start gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                            consultaId === c.id
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                              : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                              {c.dataLabel}
                            </div>
                            <div className="mt-0.5 truncate text-[11px] text-slate-400">
                              {c.horaInicio}–{c.horaFim} · {c.motivo}
                              {c.cid ? ` · CID ${c.cid}` : ' · sem CID'}
                            </div>
                          </div>
                          {consultaId === c.id && (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Campo que só existe em alguns tipos */}
              {modelo.campo === 'dias' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Dias de afastamento
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[1, 2, 3, 5, 7, 15].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDias(d)}
                        className={`w-10 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                          dias === d
                            ? 'bg-teal-500 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={dias}
                      onChange={(e) => setDias(Math.max(1, Math.min(90, Number(e.target.value))))}
                      className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    />
                  </div>
                  {consulta && (
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      {diasExtenso(dias)} a contar de {dataExtenso(consulta.data)} · retorno em{' '}
                      {dataExtenso(somarDias(consulta.data, dias))}
                    </p>
                  )}
                </div>
              )}

              {modelo.campo === 'horario' && consulta && (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                  Horário vem da consulta: das {consulta.horaInicio} às {consulta.horaFim}.
                </p>
              )}

              {modelo.campo === 'periodo' && consulta && (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                  Período do acompanhamento:{' '}
                  {dataExtenso(paciente.consultas[paciente.consultas.length - 1].data)} a{' '}
                  {dataExtenso(consulta.data)}.
                </p>
              )}

              {consulta && !consulta.cid && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                  A consulta não tem CID registrado — as linhas de CID saem do documento. Registre o
                  CID no prontuário se o convênio exigir.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          {passo > 1 && (
            <button
              onClick={() => setPasso((p) => p - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar
            </button>
          )}
          {passo < 3 ? (
            <button
              disabled={!podeAvancar}
              onClick={() => setPasso((p) => p + 1)}
              className="ml-auto inline-flex items-center gap-1 rounded-lg bg-teal-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Avançar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              disabled={!podeGerar}
              onClick={() =>
                paciente &&
                modelo &&
                consulta &&
                onGerar({
                  pacienteId: paciente.id,
                  tipo: modelo.tipo,
                  consultaId: consulta.id,
                  dias,
                })
              }
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="h-3.5 w-3.5" /> Gerar relatório
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
