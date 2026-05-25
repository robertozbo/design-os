import type {
  AvaliacaoPublicada,
  EmpregadorContexto,
  ResponsavelTecnico,
  SecoesIncluidas,
} from '@/../product/sections/relat-rios-de-conformidade/types'
import {
  Lock,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Hash,
  ShieldCheck,
} from 'lucide-react'

interface PdfPreviewProps {
  empregadorContexto: EmpregadorContexto
  avaliacao: AvaliacaoPublicada | null
  nome: string
  responsavel: ResponsavelTecnico | null
  secoes: SecoesIncluidas
  paginasEstimadas: number
}

export function PdfPreview({
  empregadorContexto,
  avaliacao,
  nome,
  responsavel,
  secoes,
  paginasEstimadas,
}: PdfPreviewProps) {
  return (
    <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200/80 dark:ring-slate-800 overflow-hidden flex flex-col h-full min-h-[640px]">
      <div className="px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-200">
          <Lock className="w-3 h-3 text-slate-400" strokeWidth={2} />
          Pré-visualização · marca d'água
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-lg
              text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
            aria-label="Diminuir zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums px-1.5">
            100%
          </span>
          <button
            type="button"
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-lg
              text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
          <button
            type="button"
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-lg
              text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums px-1.5">
            1/{paginasEstimadas}
          </span>
          <button
            type="button"
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-lg
              text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
            aria-label="Próxima página"
          >
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <PdfPage
          empregadorContexto={empregadorContexto}
          avaliacao={avaliacao}
          nome={nome}
          responsavel={responsavel}
          secoes={secoes}
        />
      </div>
    </div>
  )
}

function PdfPage({
  empregadorContexto,
  avaliacao,
  nome,
  responsavel,
  secoes,
}: {
  empregadorContexto: EmpregadorContexto
  avaliacao: AvaliacaoPublicada | null
  nome: string
  responsavel: ResponsavelTecnico | null
  secoes: SecoesIncluidas
}) {
  const secoesIncluidas = [
    { key: 'capa', label: 'Capa e identificação', incluido: true, fixo: true },
    { key: 'apresentacaoLegal', label: 'Apresentação legal NR-1', incluido: true, fixo: true },
    { key: 'caracteristicas', label: 'Características da pesquisa', incluido: true, fixo: true },
    { key: 'metodologia', label: 'Metodologia (aplicação, anonimato, gates)', incluido: true, fixo: true },
    { key: 'matriz', label: 'Resultado · matriz psicossocial', incluido: true, fixo: true },
    { key: 'analiseIa', label: 'Análise narrativa (IA Nymos)', incluido: true, fixo: true },
    { key: 'medidasPropostas', label: 'Medidas propostas por fator crítico', incluido: true, fixo: true },
    { key: 'planoAcao', label: 'Plano de Ação detalhado', incluido: secoes.planoAcao, fixo: false },
    { key: 'evidencias', label: 'Evidências cruzadas', incluido: secoes.evidencias, fixo: false },
    { key: 'diagnosticoLider', label: 'Diagnóstico do Líder', incluido: secoes.diagnosticoLider, fixo: false },
    { key: 'comparacao', label: 'Comparação com ciclos anteriores', incluido: secoes.comparacaoCiclos, fixo: false },
    { key: 'glossario', label: 'Glossário do instrumento', incluido: true, fixo: true },
    { key: 'conclusao', label: 'Conclusão + responsável técnico', incluido: true, fixo: true },
    { key: 'integridade', label: 'Rodapé de integridade (hash SHA-256)', incluido: true, fixo: true },
  ]

  return (
    <div
      className="
        relative w-full max-w-[480px] aspect-[210/297]
        bg-white dark:bg-slate-50
        ring-1 ring-slate-300 dark:ring-slate-700
        shadow-[0_8px_30px_-10px_rgba(15,23,42,0.25)]
        text-slate-900
        flex flex-col
      "
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[64px] font-bold text-slate-300/50 -rotate-12 select-none tracking-wider">
          PRÉVIA
        </span>
      </div>

      <div className="relative px-6 pt-6 pb-3 border-b-2 border-teal-600">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg bg-teal-600 text-white text-[10px] font-mono font-bold">
            LOGO
          </span>
          <span className="text-[8px] uppercase tracking-[0.16em] font-bold text-teal-700">
            Relatório oficial NR-1
          </span>
        </div>
        <h1 className="text-[14px] font-bold text-slate-900 leading-tight">
          {nome || 'Nome do relatório'}
        </h1>
        <p className="mt-1 text-[8px] text-slate-600 leading-relaxed">
          {empregadorContexto.razaoSocial} · CNPJ {empregadorContexto.cnpj}
        </p>
      </div>

      <div className="relative flex-1 px-6 py-4 space-y-3 overflow-hidden">
        {avaliacao && (
          <div>
            <p className="text-[7px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-0.5">
              Avaliação de origem
            </p>
            <p className="text-[9px] text-slate-700 leading-snug">
              {avaliacao.nome}
            </p>
            <p className="text-[8px] text-slate-500 font-mono">
              {avaliacao.instrumentoSigla} · publicada em {avaliacao.publicadaEm}
            </p>
          </div>
        )}

        <div>
          <p className="text-[7px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-1">
            Sumário do conteúdo
          </p>
          <ol className="space-y-0.5">
            {secoesIncluidas.map((sec, idx) => (
              <li
                key={sec.key}
                className={`
                  flex items-center justify-between gap-2 text-[8px] leading-tight
                  ${sec.incluido ? 'text-slate-700' : 'text-slate-300 line-through'}
                `}
              >
                <span className="truncate flex items-center gap-1">
                  {String(idx + 1).padStart(2, '0')}. {sec.label}
                  {sec.fixo && sec.incluido && (
                    <span className="text-[6px] uppercase tracking-wider font-bold text-teal-700">·obrigatório</span>
                  )}
                </span>
                <span className="font-mono shrink-0 text-slate-400">
                  pág. {String(idx + 2).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-md ring-1 ring-teal-200 bg-teal-50/60 px-2.5 py-1.5">
          <p className="text-[7px] uppercase tracking-[0.12em] font-bold text-teal-700 mb-0.5">
            Marco regulatório
          </p>
          <p className="text-[7px] text-slate-700 leading-snug">
            NR-1 · Portaria MTE 1.419/2024 · Gestão de Riscos Ocupacionais. Análise psicossocial como agente nocivo, participação voluntária e anonimato garantido.
          </p>
        </div>

        {responsavel && (
          <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
            <p className="text-[7px] uppercase tracking-[0.12em] font-bold text-slate-500 mb-0.5">
              Responsável técnico
            </p>
            <p className="text-[9px] font-semibold text-slate-800">{responsavel.nome}</p>
            <p className="text-[7px] text-slate-600 font-mono">{responsavel.registro}</p>
          </div>
        )}
      </div>

      <div className="relative px-6 py-2 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-2 text-[7px] text-slate-500">
          <span className="inline-flex items-center gap-1 font-mono">
            <Hash className="w-2 h-2" strokeWidth={2} />
            será computado ao gerar
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-2 h-2 text-emerald-600" strokeWidth={2} />
            Integridade SHA-256
          </span>
        </div>
      </div>
    </div>
  )
}
