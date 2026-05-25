import {
  Printer,
  Download,
  ShieldCheck,
  Microscope,
  Calendar,
  Users,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Building2,
} from 'lucide-react'
import type {
  Avaliacao,
  Empregador,
  MatrizPublicada,
  SubescalaResultado,
  ClassificacaoRisco,
} from '@/../product/sections/avalia-es-de-risco/types'

interface Props {
  empregador: Empregador
  avaliacao: Avaliacao
  matriz: MatrizPublicada
  responsavelTecnicoNome: string
  responsavelTecnicoRegistro: string
  hashRelatorio?: string
  timestampGeracao?: string
}

const CLASSIFICACAO_PILL: Record<ClassificacaoRisco, { label: string; bg: string; text: string }> = {
  baixo: { label: 'Saudável', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  moderado: { label: 'Atenção', bg: 'bg-amber-100', text: 'text-amber-800' },
  critico: { label: 'Risco', bg: 'bg-rose-100', text: 'text-rose-800' },
  prioritario: { label: 'Risco Prioritário', bg: 'bg-rose-200', text: 'text-rose-900' },
}

export function RelatorioPsicossocial({
  empregador,
  avaliacao,
  matriz,
  responsavelTecnicoNome,
  responsavelTecnicoRegistro,
  hashRelatorio = 'a3f8e2c1b4d9...',
  timestampGeracao = new Date().toISOString().replace('T', ' ').slice(0, 16),
}: Props) {
  const meta = matriz.relatorioMetadados
  const subescalas = matriz.subescalas
  const subescalasComRisco = subescalas.filter(
    (s) => s.classificacao === 'critico' || s.classificacao === 'prioritario',
  )
  const totalRespondentes = avaliacao.respondentes

  const handleImprimir = () => {
    if (typeof window !== 'undefined') window.print()
  }

  return (
    <div className="min-h-full bg-slate-200 dark:bg-slate-950 print:bg-white">
      <PrintStyles />

      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="mx-auto max-w-[820px] px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="w-4 h-4 text-teal-600 dark:text-teal-400"
              strokeWidth={2}
            />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Relatório de Pesquisa Psicossocial · NR-1
            </h2>
            <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
              · {empregador.razaoSocial}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-sm font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" strokeWidth={2} />
              Imprimir
            </button>
            <button
              type="button"
              onClick={handleImprimir}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white text-sm font-medium shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={2} />
              Salvar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 sm:px-8 py-6 sm:py-10 print:px-12 print:py-8">
        <article className="bg-white text-slate-900 ring-1 ring-slate-200 print:ring-0 shadow-lg print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
          <header className="px-8 pt-10 pb-6 border-b-4 border-teal-600 print:border-b-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-teal-50 ring-1 ring-teal-200 text-teal-700">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.25} />
                <span className="text-[10px] uppercase tracking-[0.16em] font-bold">
                  Relatório Oficial NR-1
                </span>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                <p>{timestampGeracao} UTC</p>
                <p>v.{avaliacao.id}</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight leading-tight text-slate-900">
              Pesquisa de Avaliação Psicossocial
            </h1>
            <p className="mt-1 text-base text-slate-600">{avaliacao.nome}</p>

            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-[12px]">
              <DataPair label="Empregador" value={empregador.razaoSocial} />
              <DataPair label="CNPJ" value={empregador.cnpj} mono />
              <DataPair
                label="Período"
                value={`${avaliacao.janelaInicio ?? '—'} → ${avaliacao.janelaFim ?? '—'}`}
                mono
              />
              <DataPair label="Instrumento" value={avaliacao.instrumentoNome} />
              <DataPair label="Respondentes" value={`${totalRespondentes} / ${avaliacao.trabalhadoresElegíveis}`} mono />
              <DataPair label="Cobertura" value={`${avaliacao.coberturaPercent.toFixed(1)}%`} mono />
            </dl>
          </header>

          <Section title="1. Objetivo" icon={<FileText className="w-3.5 h-3.5" strokeWidth={2} />}>
            <p className="text-[13px] text-slate-700 leading-relaxed">{meta.objetivo}</p>
          </Section>

          <Section
            title="2. Metodologia Aplicada"
            icon={<Microscope className="w-3.5 h-3.5" strokeWidth={2} />}
          >
            <p className="text-[13px] text-slate-700 leading-relaxed">{meta.metodologia}</p>
            <div className="mt-3 rounded-lg bg-slate-50 ring-1 ring-slate-200 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-1">
                Marco regulatório
              </p>
              <p className="text-[12px] text-slate-700 leading-snug">{meta.marcoRegulatorio}</p>
            </div>
          </Section>

          <Section
            title="3. Como interpretar os resultados"
            icon={<AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />}
          >
            <p className="text-[13px] text-slate-700 leading-relaxed mb-3">
              {meta.legendaInterpretacao}
            </p>
            <Legenda />
          </Section>

          <Section
            title="4. Resultado da Pesquisa"
            icon={<Building2 className="w-3.5 h-3.5" strokeWidth={2} />}
            subtitle="Distribuição por subescala — modelo COPSOQ-II"
          >
            <SubescalasBarTable subescalas={subescalas} />
          </Section>

          <Section
            title="5. Análise dos Fatores em Risco (IA + Responsável Técnico)"
            icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={2} />}
            subtitle={`${subescalasComRisco.length} subescalas exigem intervenção`}
          >
            <p className="text-[11px] text-slate-500 italic leading-relaxed mb-4">
              Diagnóstico narrativo e medidas propostas geradas pela IA Nymos. Revisadas e validadas pelo
              responsável técnico antes da emissão deste relatório.
            </p>
            <div className="space-y-5">
              {subescalasComRisco.map((s) => (
                <AnaliseFatorBlock key={s.codigo} subescala={s} />
              ))}
            </div>
          </Section>

          <Section
            title="6. Banco de Perguntas Aplicadas"
            icon={<FileText className="w-3.5 h-3.5" strokeWidth={2} />}
            subtitle="Origem: COPSOQ-II Brasil"
          >
            <ApendicePerguntas subescalas={subescalas} />
          </Section>

          <Section
            title="7. Conclusão e Próximos Passos"
            icon={<CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />}
          >
            <p className="text-[13px] text-slate-700 leading-relaxed">
              A avaliação atingiu cobertura de{' '}
              <strong>{avaliacao.coberturaPercent.toFixed(1)}%</strong> ({totalRespondentes}{' '}
              respondentes de {avaliacao.trabalhadoresElegíveis} elegíveis), validando a amostra
              agregada conforme critério COPSOQ-II.{' '}
              <strong>{subescalasComRisco.length} subescalas</strong> foram classificadas em zona de
              risco e demandam plano de ação imediato (anexo PGR). As demais{' '}
              {subescalas.length - subescalasComRisco.length} subescalas estão em zona saudável ou de
              atenção, sendo recomendado monitoramento contínuo via diagnóstico semanal do líder.
            </p>
            <p className="mt-3 text-[12px] text-slate-600 leading-relaxed italic">
              Este relatório deve ser anexado ao Programa de Gerenciamento de Riscos (PGR) do
              empregador e disponibilizado à fiscalização do Ministério do Trabalho e Emprego (MTE)
              quando solicitado.
            </p>
          </Section>

          <footer className="px-8 py-6 border-t border-slate-200 bg-slate-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-2">
                  Responsável técnico
                </p>
                <p className="text-[14px] font-semibold text-slate-900">{responsavelTecnicoNome}</p>
                <p className="text-[11px] font-mono text-slate-500">{responsavelTecnicoRegistro}</p>
                <div className="mt-4 pt-4 border-t border-dashed border-slate-300">
                  <p className="text-[10px] text-slate-500 italic">
                    Assinatura digital ou impressa
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-2">
                  Integridade do documento
                </p>
                <div className="space-y-1.5">
                  <DataPair
                    label="Hash SHA-256"
                    value={hashRelatorio}
                    mono
                    icon={<Hash className="w-3 h-3" strokeWidth={2} />}
                  />
                  <DataPair label="Timestamp UTC" value={timestampGeracao} mono />
                  <DataPair label="Versão do template" value="2026.5.1" mono />
                </div>
                <p className="mt-3 text-[10px] text-slate-500 leading-snug">
                  Verifique a integridade recomputando o hash SHA-256 deste PDF e comparando com o
                  valor acima.
                </p>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] text-slate-500">
              <p>
                <strong className="text-slate-700">Nymos SST</strong> · Gestão NR-1 ·{' '}
                {empregador.razaoSocial}
              </p>
              <p className="font-mono">Página gerada em {timestampGeracao}</p>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="px-8 py-6 border-b border-slate-200 last:border-b-0">
      <header className="mb-3 flex items-baseline gap-2">
        <span className="text-teal-600">{icon}</span>
        <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <span className="text-[11px] text-slate-500">· {subtitle}</span>}
      </header>
      {children}
    </section>
  )
}

function DataPair({
  label,
  value,
  mono,
  icon,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-0.5 flex items-center gap-1">
        {icon}
        {label}
      </dt>
      <dd
        className={`text-slate-800 ${
          mono ? 'font-mono text-[11px] tabular-nums' : 'text-[12px] font-medium'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

function Legenda() {
  return (
    <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg bg-slate-50 ring-1 ring-slate-200">
      <LegendItem color="bg-emerald-400" label="Saudável" />
      <LegendItem color="bg-amber-400" label="Atenção" />
      <LegendItem color="bg-rose-500" label="Risco" />
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
      <span className={`w-3 h-3 rounded-sm ${color}`} />
      {label}
    </span>
  )
}

function SubescalasBarTable({ subescalas }: { subescalas: SubescalaResultado[] }) {
  return (
    <div className="ring-1 ring-slate-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100 text-[9px] uppercase tracking-[0.12em] font-bold text-slate-500">
            <th scope="col" className="text-right px-3 py-1.5 w-[32%]">Subescala</th>
            <th scope="col" className="text-left px-3 py-1.5 w-[48%]">Distribuição</th>
            <th scope="col" className="text-center px-3 py-1.5 w-[20%]" title="Score COPSOQ oficial 0-100 vs valor de referência Brasil">
              Score / Ref BR
            </th>
          </tr>
        </thead>
        <tbody>
          {subescalas.map((s, idx) => (
            <tr
              key={s.codigo}
              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
            >
              <th
                scope="row"
                className="text-right text-[11px] font-medium text-slate-700 px-3 py-1.5 align-middle whitespace-nowrap"
              >
                {s.nome}
              </th>
              <td className="py-1.5 pr-3">
                <StackedBar
                  saudavel={s.percentSaudavel}
                  atencao={s.percentAtencao}
                  risco={s.percentRisco}
                />
              </td>
              <td className="py-1.5 px-3 text-center">
                <ScoreOficial
                  score={s.scoreOficial}
                  referencia={s.valorReferenciaBR}
                  polaridade={s.polaridade}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-1.5 text-[9px] text-slate-500 italic bg-slate-50 border-t border-slate-200 leading-snug">
        Score 0-100 calculado conforme manual oficial COPSOQ-II (média ponderada Likert). Comparação
        com valor de referência populacional Brasil (UFPE, 2017). ↑ = score acima da referência · ↓
        = score abaixo. Cor (vermelho/verde/amarelo) indica se é pior, melhor ou neutro vs
        referência conforme polaridade da subescala.
      </p>
    </div>
  )
}

function ScoreOficial({
  score,
  referencia,
  polaridade,
}: {
  score?: number
  referencia?: number
  polaridade?: 'positiva' | 'negativa'
}) {
  if (score === undefined || referencia === undefined || !polaridade) {
    return <span className="text-[10px] text-slate-400">—</span>
  }

  const delta = score - referencia
  const absDelta = Math.abs(delta)
  // Seta segue a direção do delta (↑ = score maior, ↓ = score menor)
  const seta = delta > 2 ? '↑' : delta < -2 ? '↓' : '•'
  // Cor indica bom/ruim baseado na polaridade:
  // negativa (alto=ruim): delta+ é ruim · positiva (alto=bom): delta+ é bom
  const pior = polaridade === 'negativa' ? delta > 5 : delta < -5
  const melhor = polaridade === 'negativa' ? delta < -5 : delta > 5
  const corScore = pior
    ? 'text-rose-700'
    : melhor
      ? 'text-emerald-700'
      : 'text-amber-700'

  return (
    <div className="inline-flex flex-col items-center gap-0.5">
      <div className="flex items-baseline gap-1">
        <span className={`text-[13px] font-bold tabular-nums font-mono ${corScore}`}>{score}</span>
        <span className={`text-[10px] font-bold ${corScore}`}>{seta}</span>
      </div>
      <span className="text-[9px] text-slate-500 tabular-nums font-mono">
        ref {referencia}
        {absDelta > 0 && (
          <span className={`ml-1 ${corScore}`}>
            ({delta > 0 ? '+' : ''}
            {delta})
          </span>
        )}
      </span>
    </div>
  )
}

function StackedBar({
  saudavel,
  atencao,
  risco,
}: {
  saudavel: number
  atencao: number
  risco: number
}) {
  return (
    <div className="flex h-6 rounded-sm overflow-hidden ring-1 ring-slate-200/50">
      {saudavel > 0 && (
        <div
          className="bg-emerald-400 text-[10px] font-bold text-emerald-950 flex items-center justify-center"
          style={{ width: `${saudavel}%` }}
          title={`Saudável ${saudavel}%`}
        >
          {saudavel >= 12 && `${saudavel.toFixed(0)}%`}
        </div>
      )}
      {atencao > 0 && (
        <div
          className="bg-amber-300 text-[10px] font-bold text-amber-950 flex items-center justify-center"
          style={{ width: `${atencao}%` }}
          title={`Atenção ${atencao}%`}
        >
          {atencao >= 12 && `${atencao.toFixed(0)}%`}
        </div>
      )}
      {risco > 0 && (
        <div
          className="bg-rose-500 text-[10px] font-bold text-rose-50 flex items-center justify-center"
          style={{ width: `${risco}%` }}
          title={`Risco ${risco}%`}
        >
          {risco >= 12 && `${risco.toFixed(0)}%`}
        </div>
      )}
    </div>
  )
}

function AnaliseFatorBlock({ subescala }: { subescala: SubescalaResultado }) {
  const tone = CLASSIFICACAO_PILL[subescala.classificacao]
  return (
    <article className="rounded-lg ring-1 ring-slate-200 overflow-hidden">
      <header className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-[13px] font-bold text-slate-900 truncate">{subescala.nome}</h3>
          <span className="text-[10px] font-mono text-slate-400">·</span>
          <span className="text-[10px] text-slate-500">{subescala.fatorPai}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${tone.bg} ${tone.text} whitespace-nowrap`}
        >
          {tone.label}
        </span>
      </header>
      <div className="px-4 py-3 space-y-3">
        <StackedBar
          saudavel={subescala.percentSaudavel}
          atencao={subescala.percentAtencao}
          risco={subescala.percentRisco}
        />
        {subescala.perguntas && subescala.perguntas.length > 0 && (
          <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-1.5 flex items-center justify-between gap-2">
              <span>Perguntas avaliadas ({subescala.perguntas.length})</span>
              {subescala.escalaResposta && (
                <span className="text-[9px] font-normal text-slate-400 normal-case tracking-normal">
                  Escala: {subescala.escalaResposta.length}-pontos
                </span>
              )}
            </p>
            <ul className="space-y-1 text-[11px] text-slate-700 leading-snug">
              {subescala.perguntas.map((p, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-slate-400 font-mono shrink-0">{idx + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {subescala.diagnosticoIa && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-500" strokeWidth={2} />
              Diagnóstico (IA Nymos)
            </p>
            <p className="text-[12px] text-slate-700 leading-relaxed">{subescala.diagnosticoIa}</p>
          </div>
        )}
        {subescala.medidasPropostas && subescala.medidasPropostas.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-1">
              Medidas propostas
            </p>
            <ul className="space-y-1 text-[12px] text-slate-700 leading-relaxed list-disc list-inside marker:text-teal-500">
              {subescala.medidasPropostas.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}

function ApendicePerguntas({ subescalas }: { subescalas: SubescalaResultado[] }) {
  const comPerguntas = subescalas.filter((s) => s.perguntas && s.perguntas.length > 0)
  if (comPerguntas.length === 0) return null
  const totalPerguntas = comPerguntas.reduce((acc, s) => acc + (s.perguntas?.length ?? 0), 0)

  return (
    <details className="rounded-lg ring-1 ring-slate-200 overflow-hidden bg-white print:[&]:open">
      <summary className="px-4 py-2.5 cursor-pointer text-[12px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between">
        <span>
          Apêndice · Banco completo de perguntas ({totalPerguntas} perguntas em{' '}
          {comPerguntas.length} subescalas)
        </span>
        <span className="text-[10px] text-slate-400 font-normal">expandir / imprimir</span>
      </summary>
      <div className="px-4 py-3 space-y-4">
        {comPerguntas.map((s) => (
          <div key={s.codigo}>
            <h4 className="text-[11px] font-bold text-slate-800 mb-1">
              {s.nome}{' '}
              <span className="text-[10px] font-normal text-slate-500">· {s.fatorPai}</span>
            </h4>
            <ol className="space-y-0.5 text-[11px] text-slate-700 leading-snug list-decimal list-inside marker:text-slate-400">
              {s.perguntas!.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ol>
            {s.escalaResposta && (
              <p className="mt-1 text-[10px] text-slate-500 italic">
                Escala: {s.escalaResposta.join(' · ')}
              </p>
            )}
          </div>
        ))}
        <p className="pt-3 mt-3 border-t border-slate-200 text-[10px] text-slate-500 italic leading-relaxed">
          Perguntas baseadas no <strong>COPSOQ-II Brasil</strong> (versão portuguesa validada por
          Prof. Antônio Roberto Rocha Santos, UFPE). Instrumento desenvolvido pelo National Research
          Centre for the Working Environment (Copenhagen, Dinamarca). NR-1 / Portaria MTE
          1.419/2024 exige uso de instrumento validado — não prescreve perguntas específicas.
        </p>
      </div>
    </details>
  )
}

function PrintStyles() {
  return (
    <style>{`
      @media print {
        @page { size: A4; margin: 12mm; }
        body { background: white !important; }
      }
    `}</style>
  )
}
