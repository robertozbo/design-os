import { useState } from 'react'
import { ArrowRight, Check, Send, Share2, ShieldCheck, X } from 'lucide-react'
import type { CorEspecialidade } from '@/../product-clinic/sections/consulta/types'
import { AVATAR_COR } from './helpers'

interface Colega {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  disponivel: boolean
}

interface Props {
  pacienteNome: string
  onEnviar: (colegaNome: string, especialidade: string) => void
  onFechar: () => void
}

/** Colegas da equipe da clínica — mock. */
const COLEGAS: Colega[] = [
  { id: 'c1', nome: 'Dr. Rafael Aguiar', iniciais: 'RA', especialidade: 'Cardiologia', cor: 'rose', disponivel: true },
  { id: 'c2', nome: 'Dra. Marina Nunes', iniciais: 'MN', especialidade: 'Nutrologia', cor: 'violet', disponivel: true },
  { id: 'c3', nome: 'Dr. Paulo Sette', iniciais: 'PS', especialidade: 'Clínica Geral', cor: 'slate', disponivel: true },
  { id: 'c4', nome: 'Dra. Sofia Prado', iniciais: 'SP', especialidade: 'Reumatologia', cor: 'amber', disponivel: false },
]

const ITENS = [
  { key: 'prontuario', label: 'Prontuário' },
  { key: 'exames', label: 'Exames' },
  { key: 'medicacoes', label: 'Medicações' },
] as const
type ItemKey = (typeof ITENS)[number]['key']

export function EncaminharModal({ pacienteNome, onEnviar, onFechar }: Props) {
  const [colegaId, setColegaId] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')
  const [contexto, setContexto] = useState('')
  const [compartilhar, setCompartilhar] = useState<Set<ItemKey>>(new Set(['prontuario', 'exames']))
  const [consentimento, setConsentimento] = useState(false)

  const colega = COLEGAS.find((c) => c.id === colegaId)
  const podeEnviar = !!colega && motivo.trim().length > 0 && consentimento

  const toggleItem = (i: ItemKey) =>
    setCompartilhar((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-white">
              <Share2 className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Encaminhar para colega
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                {pacienteNome} <ArrowRight className="h-2.5 w-2.5" />{' '}
                {colega ? `${colega.nome} · ${colega.especialidade}` : 'selecione um colega'}
              </div>
            </div>
          </div>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Colega */}
          <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Colega da equipe
          </div>
          <ul className="space-y-1.5">
            {COLEGAS.map((c) => (
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
                    <div className="text-[11px] text-slate-400">
                      {c.especialidade} ·{' '}
                      <span className={c.disponivel ? 'text-emerald-500' : 'text-slate-400'}>
                        {c.disponivel ? 'disponível' : 'agenda cheia'}
                      </span>
                    </div>
                  </div>
                  {colegaId === c.id && <Check className="h-4 w-4 shrink-0 text-teal-500" />}
                </button>
              </li>
            ))}
          </ul>

          {/* Motivo */}
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Motivo do encaminhamento
            </label>
            <input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex.: Avaliação cardiológica pré-início de levotiroxina"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Contexto */}
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Contexto clínico (opcional)
            </label>
            <textarea
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              rows={3}
              placeholder="Resumo clínico, achados e a pergunta ao colega…"
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Compartilhar */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Compartilhar com o colega
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ITENS.map(({ key, label }) => {
                const on = compartilhar.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleItem(key)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {on && <Check className="h-3 w-3" />}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Consentimento */}
          <button
            onClick={() => setConsentimento((v) => !v)}
            className={`mt-4 flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors ${
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
              <br />O paciente autoriza compartilhar o contexto clínico selecionado com o colega,
              conforme a LGPD.
            </span>
          </button>
        </div>

        {/* Rodapé */}
        <div className="border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            disabled={!podeEnviar}
            onClick={() => colega && onEnviar(colega.nome, colega.especialidade)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Enviar encaminhamento
          </button>
        </div>
      </div>
    </div>
  )
}
