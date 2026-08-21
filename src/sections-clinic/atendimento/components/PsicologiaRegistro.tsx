import { AlertTriangle, Check, EyeOff, Gauge } from 'lucide-react'
import type { AtendimentoPsi } from '@/../product-clinic/sections/atendimento/types'
import { Bloco, Campo } from './AtendimentoShell'

interface Props {
  atendimento: AtendimentoPsi
  onRegistro: (campo: keyof AtendimentoPsi['registro'], v: string) => void
  onNotaPrivada: (v: string) => void
  onTarefa: (v: string) => void
  onTecnica: (id: string) => void
  onRisco: (v: 0 | 1 | 2 | 3) => void
}

const CAMPOS: {
  chave: keyof AtendimentoPsi['registro']
  label: string
  hint: string
}[] = [
  { chave: 'subjetivo', label: 'S · Subjetivo', hint: 'o que o paciente relatou' },
  { chave: 'objetivo', label: 'O · Objetivo', hint: 'o que você observou' },
  { chave: 'avaliacao', label: 'A · Avaliação', hint: 'sua leitura clínica' },
  { chave: 'plano', label: 'P · Plano', hint: 'próximos passos' },
]

const RISCO_LABEL = ['Sem risco', 'Risco leve', 'Risco moderado', 'Risco grave']

export function PsicologiaRegistro({
  atendimento: a,
  onRegistro,
  onNotaPrivada,
  onTarefa,
  onTecnica,
  onRisco,
}: Props) {
  const categorias = [...new Set(a.tecnicas.map((t) => t.categoria))]

  return (
    <>
      <Bloco
        titulo="Foco da sessão"
        acessorio={<span className="text-[11px] text-slate-400">{a.abordagem}</span>}
      >
        <p className="rounded-xl bg-violet-50 px-3 py-2.5 text-xs leading-snug text-violet-800 dark:bg-violet-950/30 dark:text-violet-200">
          {a.focoSessao}
        </p>
      </Bloco>

      <Bloco titulo="Avaliação de risco">
        <div className="flex flex-wrap gap-1.5">
          {([0, 1, 2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => onRisco(n)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                a.risco === n
                  ? n === 0
                    ? 'bg-emerald-500 text-white'
                    : n === 1
                      ? 'bg-amber-400 text-white'
                      : 'bg-rose-500 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {RISCO_LABEL[n]}
            </button>
          ))}
        </div>
        {a.risco > 0 && (
          <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[11px] leading-snug text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Risco registrado exige plano de segurança na sessão e contato de referência
              atualizado. Finalizar sem o plano fica bloqueado.
            </span>
          </div>
        )}
      </Bloco>

      <Bloco titulo="Registro da sessão" acessorio={<span className="text-[11px] text-slate-400">SOAP</span>}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CAMPOS.map((c) => (
            <Campo
              key={c.chave}
              label={c.label}
              hint={c.hint}
              valor={a.registro[c.chave]}
              onChange={(v) => onRegistro(c.chave, v)}
              linhas={4}
            />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Técnicas aplicadas">
        <div className="space-y-3">
          {categorias.map((cat) => (
            <div key={cat}>
              <div className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {a.tecnicas
                  .filter((t) => t.categoria === cat)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onTecnica(t.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                        t.aplicada
                          ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t.aplicada && <Check className="h-3 w-3" />}
                      {t.nome}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Tarefa de casa">
        <Campo
          label="Combinado com o paciente"
          hint="vai para o app do paciente"
          valor={a.tarefaCasa}
          onChange={onTarefa}
          linhas={2}
        />
      </Bloco>

      {/* Nota privada — o bloco que só existe na psicologia, e a razão de a tela ser própria */}
      <section className="rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <EyeOff className="h-3.5 w-3.5 text-slate-400" /> Nota privada
          </h2>
          <span className="text-[11px] text-slate-400">
            não vai para o prontuário compartilhado
          </span>
        </div>
        <textarea
          value={a.notaPrivada}
          onChange={(e) => onNotaPrivada(e.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
        <p className="mt-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          Impressões e hipóteses do profissional. Ficam fora do que a equipe da clínica lê e do que
          o paciente recebe — é o que o sigilo profissional exige separar.
        </p>
      </section>
    </>
  )
}

/** Cartão lateral: as escalas aplicadas, com faixa e direção. */
export function EscalasCard({ atendimento: a }: { atendimento: AtendimentoPsi }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <Gauge className="h-3.5 w-3.5 text-slate-400" /> Escalas
      </h2>
      <ul className="mt-3 space-y-3">
        {a.escalas.map((e) => {
          const pct = (e.valor / e.maximo) * 100
          const tom =
            pct < 33 ? 'bg-emerald-500' : pct < 66 ? 'bg-amber-400' : 'bg-rose-500'
          return (
            <li key={e.sigla}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {e.sigla}
                  <span className="ml-1.5 font-normal text-slate-400">{e.faixa}</span>
                </span>
                <span className="text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                  {e.valor}
                  <span className="text-[10px] font-normal text-slate-400">/{e.maximo}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-full ${tom}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-0.5 text-[10px] text-slate-400">
                {e.nome} ·{' '}
                {e.tendencia === 'melhora'
                  ? 'em queda'
                  : e.tendencia === 'piora'
                    ? 'em alta'
                    : 'estável'}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
