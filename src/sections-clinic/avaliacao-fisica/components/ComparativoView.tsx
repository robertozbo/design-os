import { ArrowDown, ArrowRight, ArrowUp, FileDown, Minus, Send } from 'lucide-react'
import type {
  Avaliacao,
  ComparativoProps,
  DobraId,
  PacienteAvaliacao,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import {
  DOBRAS_ORDEM,
  DOBRA_LABEL,
  PROTOCOLO_POR_ID,
  calcular,
  resumirFuncional,
  type Resultado,
} from './formulas'
import { ClassBadge } from './FormPrimitives'
import { CONSELHO_LABEL, escala, numero } from './helpers'

interface Linha {
  label: string
  unidade: string
  casas: number
  /** Direção desejável. `true` = cair é melhorar. */
  menorEhMelhor: boolean
  atual: number | null
  referencia: number | null
  /** Recuo na tabela — dobra individual é detalhe da Σ. */
  filha?: boolean
}

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
 * A tela que responde "adiantou?".
 *
 * Regra que ela carrega inteira: **a cor segue a direção desejável, não o sinal aritmético.**
 * Massa magra e TMB caindo é piora, ainda que o número tenha diminuído junto com o peso — perder
 * peso derrubando músculo é exatamente o resultado que a avaliação existe para flagrar, e uma
 * tabela que pinta toda queda de verde esconde o único achado que importava.
 */
export function ComparativoView({
  paciente,
  avaliacoes,
  atualId,
  referenciaId,
  onAtual,
  onReferencia,
  onExportar,
  onEnviarAoPaciente,
}: ComparativoProps) {
  const serie = [...avaliacoes].sort((a, b) => a.data.localeCompare(b.data))
  const atual = serie.find((a) => a.id === atualId) ?? serie[serie.length - 1]
  const referencia = serie.find((a) => a.id === referenciaId) ?? serie[0]

  const rA = resultadoDe(atual, paciente)
  const rR = resultadoDe(referencia, paciente)
  const fA = resumirFuncional(atual.funcional, atual.medidas.pesoKg)
  const fR = resumirFuncional(referencia.funcional, referencia.medidas.pesoKg)

  const dobrasComDado = DOBRAS_ORDEM.filter(
    (d) => atual.medidas.dobras[d] != null || referencia.medidas.dobras[d] != null,
  )

  const linhas: Linha[] = [
    l('Peso', 'kg', 1, true, atual.medidas.pesoKg, referencia.medidas.pesoKg),
    l('IMC', '', 1, true, rA.imc, rR.imc),
    l('% Gordura', '%', 1, true, rA.gorduraPct, rR.gorduraPct),
    l('Massa gorda', 'kg', 1, true, rA.massaGordaKg, rR.massaGordaKg),
    l('Massa magra', 'kg', 1, false, rA.massaMagraKg, rR.massaMagraKg),
    l('Cintura', 'cm', 1, true, atual.medidas.circunferencias.cintura ?? null, referencia.medidas.circunferencias.cintura ?? null),
    l('Abdômen', 'cm', 1, true, atual.medidas.circunferencias.abdomen ?? null, referencia.medidas.circunferencias.abdomen ?? null),
    l('Quadril', 'cm', 1, true, atual.medidas.circunferencias.quadril ?? null, referencia.medidas.circunferencias.quadril ?? null),
    l('Braço relaxado', 'cm', 1, false, atual.medidas.circunferencias.bracoRelaxado ?? null, referencia.medidas.circunferencias.bracoRelaxado ?? null),
    l('Coxa', 'cm', 1, false, atual.medidas.circunferencias.coxa ?? null, referencia.medidas.circunferencias.coxa ?? null),
    l('RCQ', '', 2, true, rA.rcq, rR.rcq),
    l('RCE', '', 2, true, rA.rce, rR.rce),
    l('CMB', 'cm', 1, false, rA.cmb, rR.cmb),
    l('TMB', 'kcal', 0, false, rA.tmb, rR.tmb),
    l('Σ dobras', 'mm', 0, true, rA.somaDobras, rR.somaDobras),
    ...dobrasComDado.map((d: DobraId) =>
      l(DOBRA_LABEL[d], 'mm', 0, true, atual.medidas.dobras[d] ?? null, referencia.medidas.dobras[d] ?? null, true),
    ),
    // Funcional: aqui a direção desejável inverte quase toda — subir é melhorar.
    ...fA.rm.map((x, i) =>
      l(`1RM ${x.label}`, 'kg', 0, false, x.estimado, fR.rm[i]?.estimado ?? null),
    ),
    l('Força relativa', '× peso', 2, false, fA.forcaRelativa, fR.forcaRelativa),
    l('FMS', '/21', 0, false, fA.fmsTotal, fR.fmsTotal),
    l('VO₂máx', 'mL/kg/min', 1, false, fA.vo2, fR.vo2),
    l(
      'Flexões',
      'reps',
      0,
      false,
      atual.funcional?.resistenciaLocal?.flexoesMax ?? null,
      referencia.funcional?.resistenciaLocal?.flexoesMax ?? null,
    ),
    l(
      'Prancha',
      's',
      0,
      false,
      atual.funcional?.resistenciaLocal?.pranchaSegundos ?? null,
      referencia.funcional?.resistenciaLocal?.pranchaSegundos ?? null,
    ),
    l(
      'Senta-e-alcança',
      'cm',
      1,
      false,
      atual.funcional?.flexibilidade?.sentaEAlcancaCm ?? null,
      referencia.funcional?.flexibilidade?.sentaEAlcancaCm ?? null,
    ),
  ].filter((x) => x.atual != null || x.referencia != null)

  const series: { titulo: string; unidade: string; casas: number; menorEhMelhor: boolean; valores: (number | null)[]; meta?: number | null }[] = [
    {
      titulo: 'Peso',
      unidade: 'kg',
      casas: 1,
      menorEhMelhor: true,
      valores: serie.map((a) => a.medidas.pesoKg),
    },
    {
      titulo: '% Gordura',
      unidade: '%',
      casas: 1,
      menorEhMelhor: true,
      valores: serie.map((a) => resultadoDe(a, paciente).gorduraPct),
      meta: paciente.metaGorduraPct,
    },
    {
      titulo: 'Massa magra',
      unidade: 'kg',
      casas: 1,
      menorEhMelhor: false,
      valores: serie.map((a) => resultadoDe(a, paciente).massaMagraKg),
    },
    {
      titulo: 'Cintura',
      unidade: 'cm',
      casas: 1,
      menorEhMelhor: true,
      valores: serie.map((a) => a.medidas.circunferencias.cintura ?? null),
    },
    {
      titulo: 'Força relativa',
      unidade: '× peso',
      casas: 2,
      menorEhMelhor: false,
      valores: serie.map((a) => resumirFuncional(a.funcional, a.medidas.pesoKg).forcaRelativa),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100 pb-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 pl-16 lg:pl-4">
        <header className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white dark:bg-slate-600">
            {paciente.iniciais}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {paciente.nome}
            </h1>
            <p className="text-[11px] text-slate-400">
              {paciente.idade}a · {paciente.sexo === 'M' ? 'masculino' : 'feminino'} ·{' '}
              {serie.length} avaliações no acompanhamento
            </p>
          </div>
          <button
            onClick={onExportar}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FileDown className="h-3.5 w-3.5" /> Exportar laudo
          </button>
          <button
            onClick={onEnviarAoPaciente}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600"
          >
            <Send className="h-3.5 w-3.5" /> Enviar ao paciente
          </button>
        </header>

        {/* Seletores das duas pontas */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Seletor
            titulo="Comparar com"
            avaliacoes={serie}
            valor={referencia.id}
            onChange={onReferencia}
          />
          <Seletor titulo="Avaliação atual" avaliacoes={serie} valor={atual.id} onChange={onAtual} />
        </div>

        {/* Aviso quando o protocolo mudou entre as duas pontas */}
        {atual.protocolo !== referencia.protocolo && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            Protocolos diferentes nas duas pontas —{' '}
            {referencia.protocolo ? PROTOCOLO_POR_ID[referencia.protocolo].label : 'sem protocolo'}{' '}
            contra {atual.protocolo ? PROTOCOLO_POR_ID[atual.protocolo].label : 'sem protocolo'}.
            Cada equação estima a densidade de um jeito, então parte da diferença de % de gordura é
            do método, não do paciente. Compare a Σ das dobras e as circunferências junto.
          </p>
        )}

        <div className="mt-3 lg:grid lg:grid-cols-[1fr_340px] lg:gap-3">
          {/* Tabela comparativa */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-[1.4fr_1fr_64px_1fr] items-baseline gap-2 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Métrica
              </span>
              <span className="text-right font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {referencia.dataLabel}
              </span>
              <span className="text-center font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Δ
              </span>
              <span className="text-right font-mono text-[10px] uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {atual.dataLabel}
              </span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {linhas.map((linha) => (
                <LinhaComparativa key={linha.label} linha={linha} />
              ))}
            </ul>
            <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <ClassBadge prefixo="IMC" classificacao={rA.imcClasse} />
                <ClassBadge prefixo="Gordura" classificacao={rA.gorduraClasse} />
                <ClassBadge prefixo="RCQ" classificacao={rA.rcqClasse} />
                <ClassBadge prefixo="Cintura" classificacao={rA.cinturaClasse} />
              </div>
            </div>
          </section>

          {/* Séries */}
          <div className="mt-3 space-y-3 lg:mt-0">
            {series.map((s) => (
              <SerieCard
                key={s.titulo}
                titulo={s.titulo}
                unidade={s.unidade}
                casas={s.casas}
                menorEhMelhor={s.menorEhMelhor}
                valores={s.valores}
                rotulos={serie.map((a) => a.dataLabel)}
                meta={s.meta ?? null}
              />
            ))}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Parecer · {atual.dataLabel}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {atual.parecer || 'Sem parecer registrado nesta avaliação.'}
              </p>
              <p className="mt-2 text-[10px] text-slate-400">
                {atual.avaliador.nome} · {atual.avaliador.registro}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function l(
  label: string,
  unidade: string,
  casas: number,
  menorEhMelhor: boolean,
  atual: number | null,
  referencia: number | null,
  filha = false,
): Linha {
  return { label, unidade, casas, menorEhMelhor, atual, referencia, filha }
}

function Seletor({
  titulo,
  avaliacoes,
  valor,
  onChange,
}: {
  titulo: string
  avaliacoes: Avaliacao[]
  valor: string
  onChange: (id: string) => void
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {titulo}
      </span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent text-xs font-medium text-slate-700 outline-none dark:text-slate-200"
      >
        {avaliacoes.map((a) => (
          <option key={a.id} value={a.id}>
            {a.dataLabel} · {a.avaliador.iniciais} ({CONSELHO_LABEL[a.avaliador.conselho]})
          </option>
        ))}
      </select>
    </label>
  )
}

function LinhaComparativa({ linha }: { linha: Linha }) {
  const { atual, referencia, menorEhMelhor, casas, unidade } = linha
  const completo = atual != null && referencia != null
  const d = completo ? atual - referencia : null
  const bom = d == null ? false : menorEhMelhor ? d < 0 : d > 0
  const Icone = !completo ? ArrowRight : d === 0 ? Minus : d! > 0 ? ArrowUp : ArrowDown
  const cor = !completo
    ? 'text-slate-300 dark:text-slate-600'
    : d === 0
      ? 'text-slate-400'
      : bom
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <li className="grid grid-cols-[1.4fr_1fr_64px_1fr] items-baseline gap-2 px-4 py-2">
      <span
        className={`truncate text-[11px] ${
          linha.filha
            ? 'pl-3 text-slate-400'
            : 'font-medium text-slate-600 dark:text-slate-300'
        }`}
      >
        {linha.label}
      </span>
      <span className="text-right font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
        {numero(referencia, casas)}
        {unidade && referencia != null && (
          <span className="ml-0.5 text-[9px] text-slate-400">{unidade}</span>
        )}
      </span>
      <span className={`flex items-center justify-center gap-0.5 font-mono text-[11px] tabular-nums ${cor}`}>
        <Icone className="h-2.5 w-2.5 shrink-0" />
        {d == null ? '' : numero(Math.abs(d), casas)}
      </span>
      <span className="text-right font-mono text-[11px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {numero(atual, casas)}
        {unidade && atual != null && (
          <span className="ml-0.5 text-[9px] font-normal text-slate-400">{unidade}</span>
        )}
      </span>
    </li>
  )
}

/** Sparkline em SVG inline — a section não carrega biblioteca de gráfico. */
function SerieCard({
  titulo,
  unidade,
  casas,
  menorEhMelhor,
  valores,
  rotulos,
  meta,
}: {
  titulo: string
  unidade: string
  casas: number
  menorEhMelhor: boolean
  valores: (number | null)[]
  rotulos: string[]
  meta: number | null
}) {
  const pontos = valores
    .map((v, i) => ({ v, i }))
    .filter((p): p is { v: number; i: number } => p.v != null)

  if (pontos.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">{titulo}</p>
        <p className="mt-2 text-[11px] text-slate-400">Sem dados para visualizar.</p>
      </div>
    )
  }

  const W = 292
  const H = 56
  const candidatos = meta != null ? [...pontos.map((p) => p.v), meta] : pontos.map((p) => p.v)
  const { min, max } = escala(candidatos)
  const x = (i: number) => (valores.length === 1 ? W / 2 : (i / (valores.length - 1)) * W)
  const y = (v: number) => H - ((v - min) / (max - min)) * H

  const path = pontos.map((p, k) => `${k === 0 ? 'M' : 'L'} ${x(p.i)} ${y(p.v)}`).join(' ')
  const area = `${path} L ${x(pontos[pontos.length - 1].i)} ${H} L ${x(pontos[0].i)} ${H} Z`

  const primeiro = pontos[0].v
  const ultimo = pontos[pontos.length - 1].v
  const d = ultimo - primeiro
  const bom = menorEhMelhor ? d < 0 : d > 0
  const cor =
    d === 0
      ? 'text-slate-400'
      : bom
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'
  const gradId = `grad-${titulo.replace(/\W/g, '')}`

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">{titulo}</p>
        <span className={`font-mono text-[11px] tabular-nums ${cor}`}>
          {d > 0 ? '+' : d < 0 ? '−' : ''}
          {numero(Math.abs(d), casas)} {unidade}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-14 w-full overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {meta != null && meta >= min && meta <= max && (
          <line
            x1="0"
            x2={W}
            y1={y(meta)}
            y2={y(meta)}
            stroke="rgb(16 185 129)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke="rgb(20 184 166)" strokeWidth="1.5" />
        {pontos.map((p, k) => (
          <circle
            key={p.i}
            cx={x(p.i)}
            cy={y(p.v)}
            r={k === pontos.length - 1 ? 3.5 : 1.5}
            fill={k === pontos.length - 1 ? 'rgb(20 184 166)' : 'rgb(148 163 184)'}
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[9px] tabular-nums text-slate-400">
        <span>{rotulos[pontos[0].i]}</span>
        {meta != null && <span className="text-emerald-500">meta {numero(meta, casas)}</span>}
        <span>{rotulos[pontos[pontos.length - 1].i]}</span>
      </div>
    </div>
  )
}
