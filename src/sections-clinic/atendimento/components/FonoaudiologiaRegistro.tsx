import { ArrowUpRight, Check, Minus, Plus, Target, TrendingUp } from 'lucide-react'
import type {
  ApoioAlvo,
  AlvoFono,
  AreaFono,
  AtendimentoFono,
} from '@/../product-clinic/sections/atendimento/types'
import { Bloco, Campo } from './AtendimentoShell'
import { corPrecisao, textoPrecisao } from './helpers'

interface Props {
  atendimento: AtendimentoFono
  onInteligibilidade: (v: 1 | 2 | 3 | 4) => void
  onAcerto: (id: string) => void
  onErro: (id: string) => void
  onApoio: (id: string, apoio: ApoioAlvo) => void
  onExercicio: (id: string) => void
  onOrientacao: (v: string) => void
  onEvolucao: (v: string) => void
  onPlano: (v: string) => void
}

const AREA_LABEL: Record<AreaFono, string> = {
  fala: 'Fala',
  linguagem: 'Linguagem',
  motricidade: 'Motricidade orofacial',
  voz: 'Voz',
}

const APOIO_LABEL: Record<ApoioAlvo, string> = {
  independente: 'Independente',
  pista: 'Com pista',
  modelo: 'Com modelo',
}

const APOIOS: ApoioAlvo[] = ['independente', 'pista', 'modelo']

/** Escala de função: subir é melhorar. O contrário da EVA, e é por isso que ela é própria. */
const INTELIGIBILIDADE = [
  { nivel: 1 as const, label: 'Só a família', hint: 'entende' },
  { nivel: 2 as const, label: 'Quem convive', hint: 'entende' },
  { nivel: 3 as const, label: 'A maioria', hint: 'entende' },
  { nivel: 4 as const, label: 'Todos', hint: 'entendem' },
]

export function precisao(alvo: AlvoFono): number {
  if (alvo.tentativas === 0) return 0
  return Math.round((alvo.acertos / alvo.tentativas) * 100)
}

/** O alvo só avança quando o critério se sustenta — uma sessão boa não é generalização. */
function prontoParaAvancar(alvo: AlvoFono): boolean {
  const anteriores = alvo.historico.slice(-2)
  return (
    alvo.tentativas > 0 &&
    precisao(alvo) >= alvo.criterio &&
    anteriores.length === 2 &&
    anteriores.every((p) => p >= alvo.criterio)
  )
}

export function FonoaudiologiaRegistro({
  atendimento: a,
  onInteligibilidade,
  onAcerto,
  onErro,
  onApoio,
  onExercicio,
  onOrientacao,
  onEvolucao,
  onPlano,
}: Props) {
  const tentativas = a.alvos.reduce((s, alvo) => s + alvo.tentativas, 0)
  const acertos = a.alvos.reduce((s, alvo) => s + alvo.acertos, 0)
  const precisaoSessao = tentativas === 0 ? 0 : Math.round((acertos / tentativas) * 100)
  const categorias = [...new Set(a.exercicios.map((e) => e.categoria))]
  const delta = a.inteligibilidade - a.inteligibilidadeAnterior

  return (
    <>
      <Bloco
        titulo="Foco da sessão"
        acessorio={
          <span className="text-[11px] text-slate-400">{a.profissional.atuacao}</span>
        }
      >
        <p className="rounded-xl bg-orange-50 px-3 py-2.5 text-xs leading-snug text-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
          {a.areaFoco}
        </p>
      </Bloco>

      <Bloco
        titulo="Inteligibilidade de fala"
        acessorio={
          <span className="text-[11px] text-slate-400">
            {delta === 0 ? (
              'igual à última avaliação'
            ) : (
              <>
                <span
                  className={
                    delta > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }
                >
                  {delta > 0 ? '+' : ''}
                  {delta} nível
                </span>{' '}
                desde a última avaliação
              </>
            )}
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {INTELIGIBILIDADE.map((n) => {
            const ativo = a.inteligibilidade === n.nivel
            return (
              <button
                key={n.nivel}
                onClick={() => onInteligibilidade(n.nivel)}
                className={`rounded-lg px-2.5 py-2 text-left transition-colors ${
                  ativo
                    ? n.nivel === 1
                      ? 'bg-rose-500 text-white'
                      : n.nivel === 2
                        ? 'bg-amber-400 text-white'
                        : 'bg-emerald-500 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wide opacity-70">
                  Nível {n.nivel}
                </div>
                <div className="text-xs font-medium">{n.label}</div>
                <div className="text-[10px] opacity-70">{n.hint}</div>
              </button>
            )
          })}
        </div>
      </Bloco>

      {/* O bloco que só a fono tem: o alvo é contado durante a sessão, não descrito depois */}
      <Bloco
        titulo="Treino por alvo"
        acessorio={
          <span className="text-[11px] text-slate-400">
            {acertos}/{tentativas} na sessão ·{' '}
            <span className={textoPrecisao(precisaoSessao, 80)}>{precisaoSessao}%</span>
          </span>
        }
      >
        <div className="space-y-2.5">
          {a.alvos.map((alvo) => (
            <AlvoLinha
              key={alvo.id}
              alvo={alvo}
              onAcerto={() => onAcerto(alvo.id)}
              onErro={() => onErro(alvo.id)}
              onApoio={(ap) => onApoio(alvo.id, ap)}
            />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Exercícios aplicados">
        <div className="space-y-3">
          {categorias.map((cat) => (
            <div key={cat}>
              <div className="mb-1.5 text-[10px] uppercase tracking-wide text-slate-400">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {a.exercicios
                  .filter((e) => e.categoria === cat)
                  .map((e) => (
                    <button
                      key={e.id}
                      onClick={() => onExercicio(e.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                        e.aplicado
                          ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {e.aplicado && <Check className="h-3 w-3" />}
                      {e.nome}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Orientação ao cuidador">
        <Campo
          label="Treino em casa"
          hint="vai para o app do responsável"
          valor={a.orientacaoCuidador}
          onChange={onOrientacao}
          linhas={3}
        />
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

function AlvoLinha({
  alvo,
  onAcerto,
  onErro,
  onApoio,
}: {
  alvo: AlvoFono
  onAcerto: () => void
  onErro: () => void
  onApoio: (apoio: ApoioAlvo) => void
}) {
  const pct = precisao(alvo)
  const avanca = prontoParaAvancar(alvo)

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-800 dark:text-slate-100">{alvo.alvo}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
            <span>{AREA_LABEL[alvo.area]}</span>
            <span>·</span>
            <span>critério {alvo.criterio}%</span>
            {avanca && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ArrowUpRight className="h-3 w-3" /> pronto para avançar
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold leading-none tabular-nums ${textoPrecisao(pct, alvo.criterio)}`}>
            {pct}%
          </div>
          <div className="mt-0.5 text-[10px] tabular-nums text-slate-400">
            {alvo.acertos}/{alvo.tentativas} tentativas
          </div>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full transition-all ${corPrecisao(pct, alvo.criterio)}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {APOIOS.map((ap) => (
            <button
              key={ap}
              onClick={() => onApoio(ap)}
              className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                alvo.apoio === ap
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {APOIO_LABEL[ap]}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={onErro}
            aria-label={`Registrar erro em ${alvo.alvo}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-rose-950/30"
          >
            <Minus className="h-3 w-3" /> Erro
          </button>
          <button
            onClick={onAcerto}
            aria-label={`Registrar acerto em ${alvo.alvo}`}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Plus className="h-3 w-3" /> Acerto
          </button>
        </div>
      </div>
    </div>
  )
}

/** Cartão lateral: a precisão sessão a sessão — a curva que diz se a terapia está andando. */
export function PrecisaoCard({ atendimento: a }: { atendimento: AtendimentoFono }) {
  const tentativas = a.alvos.reduce((s, alvo) => s + alvo.tentativas, 0)
  const acertos = a.alvos.reduce((s, alvo) => s + alvo.acertos, 0)
  const hoje = tentativas === 0 ? 0 : Math.round((acertos / tentativas) * 100)
  const serie = [...a.historicoPrecisao, { sessao: a.sessaoNumero ?? 0, precisao: hoje }]
  const primeira = serie[0].precisao
  const avancando = a.alvos.filter(prontoParaAvancar).length

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <TrendingUp className="h-3.5 w-3.5 text-slate-400" /> Precisão por sessão
      </h2>
      <div className="mt-3 flex h-20 items-end gap-1">
        {serie.map((p, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-t ${corPrecisao(p.precisao, 80)} ${
                i === serie.length - 1 ? '' : 'opacity-60'
              }`}
              style={{ height: `${Math.max(p.precisao, 4) * 0.7}px` }}
              title={`Sessão ${p.sessao}: ${p.precisao}%`}
            />
            <span className="text-[9px] text-slate-400">{p.sessao}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
        De {primeira}% na sessão {serie[0].sessao} para{' '}
        <span className={textoPrecisao(hoje, 80)}>{hoje}%</span> hoje.
      </p>

      <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3 text-[11px] leading-snug text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span>
          {avancando === 0
            ? 'Nenhum alvo sustentou o critério nas três últimas sessões.'
            : `${avancando} ${avancando === 1 ? 'alvo pronto' : 'alvos prontos'} para avançar — critério sustentado em três sessões.`}
        </span>
      </div>
    </div>
  )
}
