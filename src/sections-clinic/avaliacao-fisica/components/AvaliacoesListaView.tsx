import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, LineChart, Minus, Plus, Ruler } from 'lucide-react'
import type {
  Avaliacao,
  AvaliacoesListaProps,
  Conselho,
  PacienteAvaliacao,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import { PROTOCOLO_POR_ID, calcular, type Resultado } from './formulas'
import { ClassBadge } from './FormPrimitives'
import {
  CONSELHO_LABEL,
  COR_CONSELHO,
  OBJETIVO_LABEL,
  STATUS_LABEL,
  alturaBarra,
  escala,
  numero,
} from './helpers'

/** Resultado de uma avaliação no contexto do paciente — a lista precisa dele em toda linha. */
function resultadoDe(a: Avaliacao, p: PacienteAvaliacao): Resultado {
  return calcular(
    a.medidas,
    a.protocolo,
    {
      sexo: p.sexo,
      idade: p.idade,
      nivelAtividade: p.nivelAtividade,
      metaGorduraPct: p.metaGorduraPct,
    },
    a.usarBioimpedancia,
  )
}

/**
 * O histórico de avaliação física da clínica.
 *
 * O que esta tela existe para resolver: numa clínica multiprofissional, nutricionista e educador
 * físico medem **o mesmo corpo**. Sem um lugar comum, cada um abre o adipômetro de novo e o
 * paciente é medido duas vezes por mês — com dois números diferentes e nenhum jeito de saber qual
 * envelheceu. Por isso a lista é por paciente, e não por profissional: quem avaliou é uma coluna,
 * não uma parede.
 */
export function AvaliacoesListaView({
  clinica,
  pacientes,
  conselhoFiltro,
  onConselhoFiltro,
  onNova,
  onAbrir,
}: AvaliacoesListaProps) {
  const todas = pacientes.flatMap((p) => p.avaliacoes)
  const contaPorConselho = (c: Conselho) =>
    todas.filter((a) => a.avaliador.conselho === c).length

  const visiveis = pacientes
    .map((p) => ({
      ...p,
      avaliacoes:
        conselhoFiltro === 'todos'
          ? p.avaliacoes
          : p.avaliacoes.filter((a) => a.avaliador.conselho === conselhoFiltro),
    }))
    .filter((p) => p.avaliacoes.length > 0)

  const comDobras = todas.filter((a) => Object.keys(a.medidas.dobras).length > 0).length
  const rascunhos = todas.filter((a) => a.status === 'rascunho').length

  const filtros: { id: Conselho | 'todos'; label: string; count: number }[] = [
    { id: 'todos', label: 'Todas', count: todas.length },
    { id: 'CRN', label: CONSELHO_LABEL.CRN, count: contaPorConselho('CRN') },
    { id: 'CREF', label: CONSELHO_LABEL.CREF, count: contaPorConselho('CREF') },
  ]

  return (
    <div className="min-h-screen bg-slate-100 pb-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 pl-16 lg:pl-4">
        <header>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Avaliação física
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {clinica} · antropometria e composição corporal, compartilhadas entre a nutrição e a
            educação física da clínica
          </p>
        </header>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Kpi label="Avaliações" valor={`${todas.length}`} hint="no período" />
          <Kpi label="Pacientes avaliados" valor={`${pacientes.length}`} hint="com histórico" />
          <Kpi
            label="Com dobras"
            valor={`${comDobras}`}
            hint={`de ${todas.length} · ${Math.round((comDobras / Math.max(1, todas.length)) * 100)}%`}
          />
          <Kpi
            label="Rascunhos"
            valor={`${rascunhos}`}
            hint={rascunhos > 0 ? 'aguardando conclusão' : 'nenhum pendente'}
            alerta={rascunhos > 0}
          />
        </div>

        {/* Filtro por conselho */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {filtros.map((f) => {
            const ativo = conselhoFiltro === f.id
            return (
              <button
                key={f.id}
                onClick={() => onConselhoFiltro(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  ativo
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
                <span className="font-mono tabular-nums text-slate-400">{f.count}</span>
              </button>
            )
          })}
        </div>

        {/* Pacientes */}
        <div className="mt-3 space-y-3">
          {visiveis.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhuma avaliação deste conselho ainda.
              </p>
            </div>
          ) : (
            visiveis.map(({ paciente, avaliacoes }) => (
              <CardPaciente
                key={paciente.id}
                paciente={paciente}
                avaliacoes={avaliacoes}
                onNova={() => onNova(paciente.id)}
                onAbrir={(id) => onAbrir(paciente.id, id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Kpi({
  label,
  valor,
  hint,
  alerta = false,
}: {
  label: string
  valor: string
  hint: string
  alerta?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        alerta
          ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {valor}
      </div>
      <div className="text-[10px] text-slate-400">{hint}</div>
    </div>
  )
}

function CardPaciente({
  paciente,
  avaliacoes,
  onNova,
  onAbrir,
}: {
  paciente: PacienteAvaliacao
  avaliacoes: Avaliacao[]
  onNova: () => void
  onAbrir: (avaliacaoId: string) => void
}) {
  // Da mais recente para a mais antiga na tabela; a série de barras vai no sentido do tempo.
  const ordenadas = [...avaliacoes].sort((a, b) => b.data.localeCompare(a.data))
  const serie = [...avaliacoes].sort((a, b) => a.data.localeCompare(b.data))
  const atual = ordenadas[0]
  const rAtual = resultadoDe(atual, paciente)
  const rAnterior = ordenadas[1] ? resultadoDe(ordenadas[1], paciente) : null

  const pesos = serie.map((a) => a.medidas.pesoKg).filter((v): v is number => v != null)
  const { min, max } = escala(pesos, 1)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white dark:bg-slate-600">
          {paciente.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
              {paciente.nome}
            </span>
            <span className="text-[11px] text-slate-400">
              {paciente.idade}a · {paciente.sexo === 'M' ? 'masculino' : 'feminino'}
            </span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {OBJETIVO_LABEL[paciente.objetivo]}
            </span>
            {paciente.metaGorduraPct != null && (
              <span className="text-[10px] text-slate-400">
                meta {numero(paciente.metaGorduraPct, 0)}% de gordura
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            {avaliacoes.length} avaliaç{avaliacoes.length === 1 ? 'ão' : 'ões'} · última em{' '}
            {atual.dataLabel}
          </div>
        </div>
        <button
          onClick={onNova}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Plus className="h-3 w-3" /> Nova avaliação
        </button>
      </div>

      <div className="grid gap-3 px-4 py-3 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          {/* Estado atual */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metrica
              label="Peso"
              valor={numero(atual.medidas.pesoKg)}
              unidade="kg"
              atual={atual.medidas.pesoKg}
              anterior={ordenadas[1]?.medidas.pesoKg ?? null}
            />
            <Metrica
              label="IMC"
              valor={numero(rAtual.imc)}
              unidade=""
              atual={rAtual.imc}
              anterior={rAnterior?.imc ?? null}
              badge={<ClassBadge classificacao={rAtual.imcClasse} />}
            />
            <Metrica
              label="Gordura"
              valor={numero(rAtual.gorduraPct)}
              unidade="%"
              atual={rAtual.gorduraPct}
              anterior={rAnterior?.gorduraPct ?? null}
              badge={<ClassBadge classificacao={rAtual.gorduraClasse} />}
            />
            <Metrica
              label="Massa magra"
              valor={numero(rAtual.massaMagraKg)}
              unidade="kg"
              atual={rAtual.massaMagraKg}
              anterior={rAnterior?.massaMagraKg ?? null}
              menorEhMelhor={false}
            />
          </div>

          {/* Linha do tempo das avaliações */}
          <ul className="mt-3 space-y-1">
            {ordenadas.map((a) => {
              const cor = COR_CONSELHO[a.avaliador.conselho]
              const r = resultadoDe(a, paciente)
              return (
                <li key={a.id}>
                  <button
                    onClick={() => onAbrir(a.id)}
                    className="flex w-full flex-wrap items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span className="w-24 shrink-0 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                      {a.dataLabel}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cor.chip}`}
                    >
                      {a.avaliador.iniciais} · {a.avaliador.conselho}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] text-slate-400">
                      {a.protocolo ? PROTOCOLO_POR_ID[a.protocolo].label : 'sem protocolo'}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-300">
                      {numero(a.medidas.pesoKg)} kg
                    </span>
                    <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-300">
                      {numero(r.gorduraPct)}%
                    </span>
                    {a.status === 'rascunho' && (
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${STATUS_LABEL.rascunho.classe}`}
                      >
                        {STATUS_LABEL.rascunho.label}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Curva de peso */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <LineChart className="h-3 w-3 text-teal-500" /> Peso
          </p>
          <div className="mt-2 flex h-16 items-end gap-1.5">
            {serie.map((a, i) => {
              const p = a.medidas.pesoKg
              if (p == null) return null
              return (
                <div key={a.id} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[9px] tabular-nums text-slate-400">
                    {numero(p, 0)}
                  </span>
                  <div
                    className={`w-full rounded-t bg-teal-500 ${
                      i === serie.length - 1 ? '' : 'opacity-40'
                    }`}
                    style={{ height: `${alturaBarra(p, min, max, 40)}px` }}
                  />
                </div>
              )
            })}
          </div>
          <p className="mt-1.5 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
            <Ruler className="mr-1 inline h-2.5 w-2.5" />
            {pesos.length > 1
              ? `${numero(Math.abs(pesos[pesos.length - 1] - pesos[0]))} kg ${
                  pesos[pesos.length - 1] < pesos[0] ? 'a menos' : 'a mais'
                } desde a primeira`
              : 'primeira avaliação'}
          </p>
        </div>
      </div>
    </article>
  )
}

function Metrica({
  label,
  valor,
  unidade,
  atual,
  anterior,
  menorEhMelhor = true,
  badge,
}: {
  label: string
  valor: string
  unidade: string
  atual: number | null
  anterior: number | null
  menorEhMelhor?: boolean
  badge?: ReactNode
}) {
  const d = atual != null && anterior != null ? atual - anterior : null
  const bom = d == null ? false : menorEhMelhor ? d < 0 : d > 0
  const Icone = d == null || d === 0 ? Minus : d > 0 ? ArrowUp : ArrowDown
  const cor =
    d == null || d === 0
      ? 'text-slate-400'
      : bom
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {valor}
        {unidade && <span className="ml-0.5 text-[11px] font-normal text-slate-400">{unidade}</span>}
      </div>
      <div className={`flex items-center gap-0.5 font-mono text-[10px] tabular-nums ${cor}`}>
        <Icone className="h-2.5 w-2.5" />
        {d == null ? '—' : numero(Math.abs(d))}
      </div>
      {badge && <div className="mt-1">{badge}</div>}
    </div>
  )
}
