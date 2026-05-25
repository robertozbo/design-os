import { useState } from 'react'
import type {
  CsvImportacaoState,
  CsvLinhaEstabelecimento,
  ImportacaoEtapa,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

interface CsvImportDialogProps {
  open: boolean
  initialState?: CsvImportacaoState
  onClose?: () => void
  onConfirm?: (linhas: CsvLinhaEstabelecimento[]) => void
}

const FAKE_PREVIEW: CsvImportacaoState = {
  etapa: 'preview',
  arquivoNome: 'estrutura-vegamax-2026.csv',
  totalLinhas: 6,
  validas: 4,
  comAviso: 1,
  comErro: 1,
  linhas: [
    {
      linha: 2,
      raw: { nome: 'Filial Belo Horizonte', cnpj: '12.345.678/0007-90', cep: '30130-160' },
      parsed: { nome: 'Filial Belo Horizonte' },
      status: 'valida',
      mensagens: [],
    },
    {
      linha: 3,
      raw: { nome: 'Filial Salvador', cnpj: '12.345.678/0008-71', cep: '40010-010' },
      parsed: { nome: 'Filial Salvador' },
      status: 'valida',
      mensagens: [],
    },
    {
      linha: 4,
      raw: { nome: 'Filial Porto Alegre', cnpj: '12.345.678/0009-52', cep: '90010-150' },
      parsed: { nome: 'Filial Porto Alegre' },
      status: 'valida',
      mensagens: [],
    },
    {
      linha: 5,
      raw: { nome: 'Filial Belém', cnpj: '12.345.678/0010-95', cep: '66010-020' },
      parsed: { nome: 'Filial Belém' },
      status: 'aviso',
      mensagens: ['Nome fantasia opcional ausente'],
    },
    {
      linha: 6,
      raw: { nome: 'Filial Manaus', cnpj: '12.345.678/0011-76', cep: '69010-040' },
      parsed: { nome: 'Filial Manaus' },
      status: 'valida',
      mensagens: [],
    },
    {
      linha: 7,
      raw: { nome: '', cnpj: '12.345.678/0012-57', cep: 'INVALIDO' },
      parsed: {},
      status: 'erro',
      mensagens: ['Nome obrigatório', 'CEP inválido'],
    },
  ],
}

export function CsvImportDialog({ open, initialState, onClose, onConfirm }: CsvImportDialogProps) {
  const [etapa, setEtapa] = useState<ImportacaoEtapa>(initialState?.etapa ?? 'upload')
  const [estado, setEstado] = useState<CsvImportacaoState>(initialState ?? FAKE_PREVIEW)
  const [linhasSelecionadas, setLinhasSelecionadas] = useState<Set<number>>(
    new Set(estado.linhas.filter((l) => l.status !== 'erro').map((l) => l.linha)),
  )

  if (!open) return null

  const toggleLinha = (linha: number) => {
    setLinhasSelecionadas((prev) => {
      const next = new Set(prev)
      if (next.has(linha)) next.delete(linha)
      else next.add(linha)
      return next
    })
  }

  const linhasParaImportar = estado.linhas.filter((l) => linhasSelecionadas.has(l.linha))

  const handleSimulateUpload = () => {
    setEstado(FAKE_PREVIEW)
    setLinhasSelecionadas(
      new Set(FAKE_PREVIEW.linhas.filter((l) => l.status !== 'erro').map((l) => l.linha)),
    )
    setEtapa('preview')
  }

  const handleConfirm = () => {
    onConfirm?.(linhasParaImportar)
    setEtapa('confirmacao')
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Importar CSV">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px] drawer-fade"
      />
      <div
        className="
          drawer-slide
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[min(820px,calc(100%-2rem))] max-h-[calc(100vh-2rem)]
          bg-white dark:bg-slate-950
          ring-1 ring-slate-200/80 dark:ring-slate-800
          rounded-2xl shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]
          flex flex-col overflow-hidden
        "
      >
        <header className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Importar CSV
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Importar estabelecimentos em massa
            </h2>
            <Steps current={etapa} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {etapa === 'upload' && (
            <UploadStep onSimulate={handleSimulateUpload} />
          )}
          {etapa === 'preview' && (
            <PreviewStep
              estado={estado}
              linhasSelecionadas={linhasSelecionadas}
              toggleLinha={toggleLinha}
            />
          )}
          {etapa === 'confirmacao' && (
            <ConfirmStep total={linhasParaImportar.length} arquivoNome={estado.arquivoNome} />
          )}
        </div>

        <footer className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-2">
          {etapa === 'preview' ? (
            <button
              type="button"
              onClick={() => setEtapa('upload')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
              Trocar arquivo
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {etapa === 'confirmacao' ? 'Fechar' : 'Cancelar'}
            </button>
            {etapa === 'preview' && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={linhasParaImportar.length === 0}
                className="
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                  bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                  dark:bg-teal-500 dark:hover:bg-teal-400
                  text-white font-medium text-sm
                  shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                  dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  transition
                "
              >
                Importar {linhasParaImportar.length} linhas válidas
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

function Steps({ current }: { current: ImportacaoEtapa }) {
  const items: { value: ImportacaoEtapa; label: string }[] = [
    { value: 'upload', label: '1. Upload' },
    { value: 'preview', label: '2. Validar' },
    { value: 'confirmacao', label: '3. Concluído' },
  ]
  return (
    <div className="mt-2 flex items-center gap-2 text-[11px]">
      {items.map((it, idx) => {
        const passed =
          (current === 'preview' && it.value === 'upload') ||
          (current === 'confirmacao' && (it.value === 'upload' || it.value === 'preview'))
        const active = current === it.value
        return (
          <span key={it.value} className="inline-flex items-center gap-2">
            <span
              className={`
                inline-flex items-center justify-center px-2 py-0.5 rounded-md
                ${
                  active
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60'
                    : passed
                      ? 'bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600'
                }
                font-medium
              `}
            >
              {it.label}
            </span>
            {idx < items.length - 1 && (
              <span className="w-3 h-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            )}
          </span>
        )
      })}
    </div>
  )
}

function UploadStep({ onSimulate }: { onSimulate: () => void }) {
  return (
    <div
      className="
        rounded-2xl border border-dashed border-slate-300 dark:border-slate-700
        bg-slate-50/40 dark:bg-slate-900/30
        px-8 py-12 flex flex-col items-center text-center
      "
    >
      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <UploadCloud className="w-6 h-6 text-slate-500" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Arraste seu CSV ou selecione do disco
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Aceita CSV exportado direto do eSocial ou o template Vegamax. Validamos colunas obrigatórias e
        retornamos linhas com erro destacadas.
      </p>
      <button
        type="button"
        onClick={onSimulate}
        className="
          mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
          bg-slate-900 hover:bg-slate-800
          dark:bg-slate-100 dark:hover:bg-slate-200
          text-white dark:text-slate-900
          font-medium text-sm transition
        "
      >
        <FileSpreadsheet className="w-4 h-4" strokeWidth={2} />
        Selecionar arquivo
      </button>
      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-500">
        <a className="underline underline-offset-2 hover:text-teal-700 dark:hover:text-teal-300">
          Baixar template CSV
        </a>{' '}
        · 9 colunas · UTF-8
      </p>
    </div>
  )
}

function PreviewStep({
  estado,
  linhasSelecionadas,
  toggleLinha,
}: {
  estado: CsvImportacaoState
  linhasSelecionadas: Set<number>
  toggleLinha: (linha: number) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap text-[12px]">
        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="font-medium">{estado.arquivoNome}</span>
        </span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <span className="tabular-nums text-slate-600 dark:text-slate-400">
          {estado.totalLinhas} linhas
        </span>
        <Pill tone="emerald">
          <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> {estado.validas} válidas
        </Pill>
        {estado.comAviso > 0 && (
          <Pill tone="amber">
            <AlertTriangle className="w-3 h-3" strokeWidth={2} /> {estado.comAviso} avisos
          </Pill>
        )}
        {estado.comErro > 0 && (
          <Pill tone="rose">
            <AlertTriangle className="w-3 h-3" strokeWidth={2} /> {estado.comErro} erros
          </Pill>
        )}
      </div>

      <div className="rounded-xl ring-1 ring-slate-200/80 dark:ring-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left w-10">#</th>
              <th className="px-3 py-2 text-left">Nome</th>
              <th className="px-3 py-2 text-left">CNPJ</th>
              <th className="px-3 py-2 text-left">CEP</th>
              <th className="px-3 py-2 text-right pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {estado.linhas.map((l) => {
              const selected = linhasSelecionadas.has(l.linha)
              const disabled = l.status === 'erro'
              return (
                <tr
                  key={l.linha}
                  className={`
                    ${l.status === 'erro' ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}
                    ${l.status === 'aviso' ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''}
                  `}
                >
                  <td className="px-3 py-2.5 align-top">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => toggleLinha(l.linha)}
                      className="accent-teal-600 dark:accent-teal-400 disabled:opacity-50"
                      aria-label={`Selecionar linha ${l.linha}`}
                    />
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {l.raw.nome || <span className="italic text-rose-600 dark:text-rose-400">vazio</span>}
                    </div>
                    {l.mensagens.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {l.mensagens.map((m, idx) => (
                          <li
                            key={idx}
                            className={`text-[11px] inline-flex items-center gap-1 mr-2 ${
                              l.status === 'erro'
                                ? 'text-rose-700 dark:text-rose-300'
                                : 'text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                            {m}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-3 py-2.5 align-top font-mono text-[12px] text-slate-600 dark:text-slate-400">
                    {l.raw.cnpj}
                  </td>
                  <td className="px-3 py-2.5 align-top font-mono text-[12px] text-slate-600 dark:text-slate-400">
                    {l.raw.cep}
                  </td>
                  <td className="px-3 py-2.5 align-top text-right pr-4">
                    <StatusPill status={l.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ConfirmStep({
  total,
  arquivoNome,
}: {
  total: number
  arquivoNome: string | null
}) {
  return (
    <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-200/60 dark:ring-emerald-900/40 px-6 py-8 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-300" strokeWidth={2} />
      </div>
      <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
        {total} estabelecimentos importados
      </h3>
      <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-200/80 max-w-sm">
        Os novos estabelecimentos foram adicionados à carteira. Você já pode estruturar os setores e
        vincular gestores.
      </p>
      {arquivoNome && (
        <p className="mt-3 text-[11px] font-mono text-emerald-700/70 dark:text-emerald-300/70">
          Origem: {arquivoNome}
        </p>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: 'valida' | 'aviso' | 'erro' }) {
  const tones = {
    valida:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/40',
    aviso:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/40',
    erro:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/40',
  }
  const labels = { valida: 'Válida', aviso: 'Aviso', erro: 'Erro' }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium ${tones[status]}`}
    >
      {labels[status]}
    </span>
  )
}

function Pill({ tone, children }: { tone: 'emerald' | 'amber' | 'rose'; children: React.ReactNode }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/40',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/40',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/40',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
