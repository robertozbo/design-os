import { useState } from 'react'
import { CheckCircle2, MessageCircle, Plus, Sparkles, X } from 'lucide-react'
import type { AnamneseEntrada } from '@/../product-clinico/sections/consulta/types'
import { formatDataBR } from './helpers'

interface Props {
  anamnese: AnamneseEntrada
  /** Disparado quando o médico edita a anamnese (chips/textarea). Pode ir pro audit log. */
  onAlterar?: (campos: AnamneseEntrada['campos']) => void
}

/** Catálogo curado pra endócrino — top queixas que o médico clica frequentemente. */
const QUEIXAS_FREQUENTES = [
  'Renovação de receita',
  'Retorno de DM2',
  'Retorno de hipotireoidismo',
  'Fadiga / cansaço',
  'Ganho de peso',
  'Perda de peso',
  'Hipoglicemias frequentes',
  'Sintomas de hipertireoidismo',
  'Avaliação de nódulo tireoidiano',
  'Primeira consulta',
] as const

/** Catálogo curado de sintomas endócrinos. Clicar toggle adiciona/remove da lista. */
const SINTOMAS_CATALOGO: { categoria: string; itens: string[] }[] = [
  {
    categoria: 'Metabólicos',
    itens: ['Fadiga', 'Ganho de peso', 'Perda de peso', 'Aumento de apetite', 'Hipoglicemia'],
  },
  {
    categoria: 'Tireoide',
    itens: [
      'Tremor de extremidades',
      'Palpitação',
      'Intolerância ao calor',
      'Intolerância ao frio',
      'Bócio',
      'Queda de cabelo',
    ],
  },
  {
    categoria: 'Diabetes',
    itens: ['Polidipsia', 'Poliúria', 'Polifagia', 'Visão borrada', 'Câimbras'],
  },
  {
    categoria: 'Outros',
    itens: ['Insônia', 'Sonolência diurna', 'Constipação', 'Diarreia', 'Pele seca'],
  },
]

export function AnamneseView({ anamnese, onAlterar }: Props) {
  const [queixaPrincipal, setQueixaPrincipal] = useState(anamnese.campos.queixaPrincipal)
  const [sintomas, setSintomas] = useState<string[]>(anamnese.campos.sintomas)
  const [medicacaoAtual, setMedicacaoAtual] = useState(anamnese.campos.medicacaoAtual)
  const [duvidas, setDuvidas] = useState(anamnese.campos.duvidas)
  const [novoSintoma, setNovoSintoma] = useState('')

  const propagar = (overrides: Partial<AnamneseEntrada['campos']> = {}) => {
    onAlterar?.({
      queixaPrincipal,
      sintomas,
      medicacaoAtual,
      duvidas,
      ...overrides,
    })
  }

  const aplicarQueixa = (q: string) => {
    setQueixaPrincipal(q)
    propagar({ queixaPrincipal: q })
  }

  const toggleSintoma = (s: string) => {
    const next = sintomas.includes(s) ? sintomas.filter((x) => x !== s) : [...sintomas, s]
    setSintomas(next)
    propagar({ sintomas: next })
  }

  const adicionarSintomaManual = () => {
    const t = novoSintoma.trim()
    if (!t || sintomas.includes(t)) {
      setNovoSintoma('')
      return
    }
    const next = [...sintomas, t]
    setSintomas(next)
    setNovoSintoma('')
    propagar({ sintomas: next })
  }

  return (
    <div className="space-y-6">
      {/* Pré-preenchimento banner */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="font-medium text-emerald-900 dark:text-emerald-200">
            Pré-preenchido pelo paciente
          </p>
          <p className="mt-0.5 text-emerald-800/80 dark:text-emerald-300/80">
            Maria respondeu o formulário em {formatDataBR(anamnese.preenchidaEm)}. Você pode
            editar, adicionar sintomas via catálogo, ou deixar a IA escriba complementar via
            gravação.
          </p>
        </div>
      </div>

      {/* Queixa principal — chips + textarea */}
      <div>
        <FieldLabel>Queixa principal</FieldLabel>
        <textarea
          value={queixaPrincipal}
          onChange={(e) => {
            setQueixaPrincipal(e.target.value)
            propagar({ queixaPrincipal: e.target.value })
          }}
          rows={2}
          className="mt-1.5 block w-full rounded-md border border-slate-200/80 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
          placeholder="Descreva a queixa principal…"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="size-3" /> Frequentes
          </span>
          {QUEIXAS_FREQUENTES.map((q) => {
            const ativo = queixaPrincipal === q
            return (
              <button
                key={q}
                onClick={() => aplicarQueixa(q)}
                className={`
                  rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors
                  ${
                    ativo
                      ? 'border-teal-400 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/30'
                  }
                `}
              >
                {q}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sintomas — chips selecionáveis + adicionar manual */}
      <div>
        <FieldLabel>Sintomas relatados</FieldLabel>

        {/* Sintomas selecionados (ativos) */}
        {sintomas.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sintomas.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-50 px-2.5 py-0.5 text-[12px] font-medium text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-200"
              >
                {s}
                <button
                  onClick={() => toggleSintoma(s)}
                  aria-label={`Remover ${s}`}
                  className="rounded-full p-0.5 hover:bg-teal-100 dark:hover:bg-teal-900/40"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Catálogo por categoria */}
        <div className="mt-3 space-y-2.5 rounded-lg border border-slate-200/70 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sparkles className="size-3" /> Catálogo · clique pra adicionar
            </p>
            <p className="text-[10px] text-slate-400">{sintomas.length} selecionado(s)</p>
          </div>
          {SINTOMAS_CATALOGO.map((grupo) => (
            <div key={grupo.categoria}>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                {grupo.categoria}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {grupo.itens.map((s) => {
                  const ativo = sintomas.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSintoma(s)}
                      aria-pressed={ativo}
                      className={`
                        rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors
                        ${
                          ativo
                            ? 'border-teal-400 bg-teal-100/80 text-teal-800 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/30'
                        }
                      `}
                    >
                      {ativo ? '✓ ' : ''}
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Adicionar manual */}
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={novoSintoma}
              onChange={(e) => setNovoSintoma(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  adicionarSintomaManual()
                }
              }}
              placeholder="+ adicionar sintoma manual…"
              className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
            <button
              onClick={adicionarSintomaManual}
              disabled={!novoSintoma.trim()}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus className="size-3" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Medicação atual */}
      <div>
        <FieldLabel>Medicação atual (uso/adesão)</FieldLabel>
        <textarea
          value={medicacaoAtual}
          onChange={(e) => {
            setMedicacaoAtual(e.target.value)
            propagar({ medicacaoAtual: e.target.value })
          }}
          rows={2}
          className="mt-1.5 block w-full rounded-md border border-slate-200/80 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
          placeholder="Como o paciente está usando a medicação atual?"
        />
      </div>

      {/* Dúvidas do paciente */}
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
          <MessageCircle className="size-3.5" />
          Dúvida do paciente
        </label>
        <textarea
          value={duvidas}
          onChange={(e) => {
            setDuvidas(e.target.value)
            propagar({ duvidas: e.target.value })
          }}
          rows={2}
          className="mt-2 block w-full rounded-md border border-amber-200/80 bg-white/80 px-3 py-2 text-sm leading-relaxed text-amber-900 placeholder:text-amber-600/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100 dark:placeholder:text-amber-500/60"
          placeholder="O que o paciente quer perguntar?"
        />
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {children}
    </h3>
  )
}
