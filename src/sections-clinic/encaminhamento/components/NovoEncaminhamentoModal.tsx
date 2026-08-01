import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Send, ShieldCheck, X } from 'lucide-react'
import type {
  ColegaSelector,
  ItemCompartilhado,
  PacienteSelector,
} from '@/../product-clinic/sections/encaminhamento/types'
import { AVATAR_COR, BADGE_COR, ITEM_LABEL } from './helpers'

interface Props {
  pacientes: PacienteSelector[]
  colegas: ColegaSelector[]
  onEnviar: (dados: NovoEncaminhamento) => void
  onFechar: () => void
}

const ITENS: ItemCompartilhado[] = ['prontuario', 'exames', 'medicacoes']

/**
 * O que o médico de fato preencheu. Antes só nome do paciente e do colega chegavam ao wrapper — o
 * motivo, o contexto, os itens escolhidos e o consentimento eram descartados e substituídos por
 * valores fixos. Num encaminhamento, **o que se compartilha é decisão sob consentimento**: gravar
 * "prontuário + exames" quando o médico marcou só exames é declaração falsa na trilha de auditoria.
 */
export interface NovoEncaminhamento {
  pacienteNome: string
  colegaNome: string
  motivo: string
  contexto: string
  compartilhado: ItemCompartilhado[]
  consentimentoPaciente: boolean
}

export function NovoEncaminhamentoModal({ pacientes, colegas, onEnviar, onFechar }: Props) {
  const [passo, setPasso] = useState(1)
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [colegaId, setColegaId] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')
  const [contexto, setContexto] = useState('')
  const [compartilhar, setCompartilhar] = useState<Set<ItemCompartilhado>>(
    new Set(['prontuario', 'exames']),
  )
  const [consentimento, setConsentimento] = useState(false)

  const paciente = pacientes.find((p) => p.id === pacienteId)
  const colega = colegas.find((c) => c.id === colegaId)

  const podeAvancar = passo === 1 ? !!pacienteId : passo === 2 ? !!colegaId : false
  const podeEnviar = !!paciente && !!colega && motivo.trim().length > 0 && consentimento

  const toggleItem = (i: ItemCompartilhado) =>
    setCompartilhar((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        {/* Header + stepper */}
        <div className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Novo encaminhamento
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
            Passo {passo} de 3 ·{' '}
            {passo === 1 ? 'Paciente' : passo === 2 ? 'Colega' : 'Motivo e compartilhamento'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Passo 1: paciente */}
          {passo === 1 && (
            <ul className="space-y-1.5">
              {pacientes.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setPacienteId(p.id)}
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
                        {p.idade}a · {p.condicoesCronicas.join(', ') || 'sem condições'}
                      </div>
                    </div>
                    {pacienteId === p.id && <Check className="h-4 w-4 shrink-0 text-teal-500" />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Passo 2: colega */}
          {passo === 2 && (
            <ul className="space-y-1.5">
              {colegas.map((c) => (
                <li key={c.id}>
                  <button
                    disabled={!c.disponivel}
                    onClick={() => setColegaId(c.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      colegaId === c.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[c.cor]}`}
                    >
                      {c.iniciais}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {c.nome}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COR[c.cor]}`}
                        >
                          {c.especialidade}
                        </span>
                        <span
                          className={`text-[10px] ${c.disponivel ? 'text-emerald-500' : 'text-slate-400'}`}
                        >
                          {c.disponivel ? '● disponível' : '● agenda cheia'}
                        </span>
                      </div>
                    </div>
                    {colegaId === c.id && <Check className="h-4 w-4 shrink-0 text-teal-500" />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Passo 3: motivo + contexto + compartilhar */}
          {passo === 3 && (
            <div className="space-y-4">
              {paciente && colega && (
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {paciente.nome}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {colega.nome}
                  </span>
                  <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] ${BADGE_COR[colega.cor]}`}>
                    {colega.especialidade}
                  </span>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Motivo
                </label>
                <input
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex.: Resistência à insulina"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Contexto clínico
                </label>
                <textarea
                  value={contexto}
                  onChange={(e) => setContexto(e.target.value)}
                  rows={3}
                  placeholder="Resumo clínico, achados e a pergunta ao colega…"
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Compartilhar com o colega
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ITENS.map((i) => {
                    const on = compartilhar.has(i)
                    return (
                      <button
                        key={i}
                        onClick={() => toggleItem(i)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          on
                            ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {on && <Check className="h-3 w-3" />}
                        {ITEM_LABEL[i]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => setConsentimento((v) => !v)}
                className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors ${
                  consentimento
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    consentimento
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {consentimento && <Check className="h-3 w-3" />}
                </span>
                <span className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                    <ShieldCheck className="h-3 w-3" /> Consentimento do paciente
                  </span>
                  <br />O paciente autoriza o compartilhamento do contexto clínico selecionado com o
                  colega, conforme a LGPD.
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Rodapé: navegação */}
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
              disabled={!podeEnviar}
              onClick={() =>
                paciente &&
                colega &&
                onEnviar({
                  pacienteNome: paciente.nome,
                  colegaNome: colega.nome,
                  motivo: motivo.trim(),
                  contexto: contexto.trim(),
                  compartilhado: [...compartilhar],
                  consentimentoPaciente: consentimento,
                })
              }
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" /> Enviar encaminhamento
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
