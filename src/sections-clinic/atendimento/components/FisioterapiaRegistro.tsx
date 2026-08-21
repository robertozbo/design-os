import { Activity, Check } from 'lucide-react'
import type {
  AtendimentoFisio,
  GrupoConduta,
} from '@/../product-clinic/sections/atendimento/types'
import { Bloco, Campo } from './AtendimentoShell'
import { GRUPO_CONDUTA, corEva, textoEva } from './helpers'

interface Props {
  atendimento: AtendimentoFisio
  onEvaChegada: (v: number) => void
  onEvaSaida: (v: number) => void
  onConduta: (id: string) => void
  onEvolucao: (v: string) => void
  onPlano: (v: string) => void
}

const GRUPOS: GrupoConduta[] = ['eletroterapia', 'terapia-manual', 'cinesioterapia', 'crioterapia']

export function FisioterapiaRegistro({
  atendimento: a,
  onEvaChegada,
  onEvaSaida,
  onConduta,
  onEvolucao,
  onPlano,
}: Props) {
  const aplicadas = a.condutas.filter((c) => c.aplicada).length

  return (
    <>
      <Bloco
        titulo="Dor na sessão (EVA)"
        acessorio={
          a.evaSaida !== null ? (
            <span className="text-[11px] text-slate-400">
              variação de{' '}
              <span className={textoEva(a.evaSaida)}>
                {a.evaSaida - a.evaChegada > 0 ? '+' : ''}
                {a.evaSaida - a.evaChegada}
              </span>{' '}
              na sessão
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">preencha a saída ao fim da sessão</span>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <EscalaEva label="Na chegada" valor={a.evaChegada} onChange={onEvaChegada} />
          <EscalaEva
            label="Na saída"
            valor={a.evaSaida}
            onChange={onEvaSaida}
            placeholder="não registrada"
          />
        </div>
      </Bloco>

      <Bloco
        titulo="Condutas aplicadas"
        acessorio={
          <span className="text-[11px] text-slate-400">
            {aplicadas} de {a.condutas.length} marcadas
          </span>
        }
      >
        <div className="space-y-3">
          {GRUPOS.map((g) => {
            const doGrupo = a.condutas.filter((c) => c.grupo === g)
            if (doGrupo.length === 0) return null
            return (
              <div key={g}>
                <div className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400">
                  {GRUPO_CONDUTA[g]}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {doGrupo.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onConduta(c.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                        c.aplicada
                          ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {c.aplicada && <Check className="h-3 w-3" />}
                      {c.nome}
                      {c.aplicada && c.detalhe && (
                        <span className="text-[10px] text-sky-500 dark:text-sky-400">
                          {c.detalhe}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Bloco>

      <Bloco titulo="Amplitude de movimento (goniometria)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-96 text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                <th className="pb-1.5 text-left font-normal">Articulação</th>
                <th className="pb-1.5 text-left font-normal">Movimento</th>
                <th className="pb-1.5 text-right font-normal">Direito</th>
                <th className="pb-1.5 text-right font-normal">Esquerdo</th>
                <th className="pb-1.5 text-right font-normal">Referência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {a.adm.map((m) => (
                <tr key={m.id}>
                  <td className="py-2 text-slate-700 dark:text-slate-200">{m.articulacao}</td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">{m.movimento}</td>
                  <Grau valor={m.direito} referencia={m.referencia} />
                  <Grau valor={m.esquerdo} referencia={m.referencia} />
                  <td className="py-2 text-right tabular-nums text-slate-400">{m.referencia}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloco>

      <Bloco titulo="Testes funcionais">
        <ul className="space-y-2">
          {a.testesFuncionais.map((t) => (
            <li key={t.id} className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-200">{t.nome}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {t.resultado}
              </div>
            </li>
          ))}
        </ul>
      </Bloco>

      <Bloco titulo="Evolução e plano">
        <div className="space-y-3">
          <Campo
            label="Evolução da sessão"
            hint="o que mudou desde a última"
            valor={a.evolucaoTexto}
            onChange={onEvolucao}
            linhas={4}
          />
          <Campo
            label="Plano para a próxima sessão"
            valor={a.planoProxima}
            onChange={onPlano}
            linhas={3}
          />
        </div>
      </Bloco>
    </>
  )
}

function Grau({ valor, referencia }: { valor: number; referencia: number }) {
  const limitado = valor < referencia * 0.9
  return (
    <td
      className={`py-2 text-right font-medium tabular-nums ${
        limitado ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'
      }`}
    >
      {valor}°
    </td>
  )
}

function EscalaEva({
  label,
  valor,
  onChange,
  placeholder,
}: {
  label: string
  valor: number | null
  onChange: (v: number) => void
  placeholder?: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        {valor === null ? (
          <span className="text-[11px] text-slate-400">{placeholder}</span>
        ) : (
          <span className={`text-lg font-semibold tabular-nums ${textoEva(valor)}`}>{valor}</span>
        )}
      </div>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`EVA ${n}`}
            className={`h-8 flex-1 rounded text-[10px] font-medium transition-colors ${
              valor === n
                ? `${corEva(n)} text-white`
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Cartão lateral: a curva de dor ao longo do tratamento — a pergunta que o paciente faz. */
export function EvolucaoDorCard({ atendimento: a }: { atendimento: AtendimentoFisio }) {
  const serie = [...a.historicoEva, { sessao: a.sessaoNumero ?? 0, eva: a.evaChegada }]
  const primeira = serie[0].eva
  const atual = serie[serie.length - 1].eva

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <Activity className="h-3.5 w-3.5 text-slate-400" /> Dor por sessão
      </h2>
      <div className="mt-3 flex h-20 items-end gap-1">
        {serie.map((p, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-t ${corEva(p.eva)} ${
                i === serie.length - 1 ? '' : 'opacity-60'
              }`}
              style={{ height: `${Math.max(p.eva, 0.4) * 8}px` }}
              title={`Sessão ${p.sessao}: EVA ${p.eva}`}
            />
            <span className="text-[9px] text-slate-400">{p.sessao}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
        De EVA {primeira} na primeira sessão para{' '}
        <span className={textoEva(atual)}>EVA {atual}</span> hoje.
      </p>
    </div>
  )
}
