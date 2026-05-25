import { useEffect, useState } from 'react'
import type {
  ExportarPgrDrawerProps,
  FormatoExportPgr,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import {
  X,
  Download,
  FileText,
  Braces,
  Check,
  Paperclip,
  History,
  FileSignature,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export function ExportarPgrDrawer({
  open,
  empregadorContexto,
  planoVigente,
  totalItens,
  totalEvidencias,
  onClose,
  onConfirmar,
}: ExportarPgrDrawerProps) {
  const [formatos, setFormatos] = useState<Set<FormatoExportPgr>>(new Set(['pdf']))
  const [incluirEvidencias, setIncluirEvidencias] = useState(true)
  const [incluirHistorico, setIncluirHistorico] = useState(false)

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const valid = formatos.size > 0

  const handleConfirmar = () => {
    if (!valid) return
    onConfirmar?.({
      formatos: Array.from(formatos),
      incluirEvidencias,
      incluirHistorico,
    })
  }

  const toggleFormato = (f: FormatoExportPgr) => {
    setFormatos((prev) => {
      const out = new Set(prev)
      if (out.has(f)) out.delete(f)
      else out.add(f)
      return out
    })
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-sm drawer-fade"
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Exportar PGR"
        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[560px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-[-12px_0_30px_-12px_rgba(15,23,42,0.18)] dark:shadow-[-12px_0_30px_-12px_rgba(0,0,0,0.6)] flex flex-col drawer-slide"
      >
        <DrawerStyles />

        <header className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400 mb-1 inline-flex items-center gap-1.5">
              <FileSignature className="w-3 h-3 text-teal-600 dark:text-teal-400" strokeWidth={2} />
              Plano de Ação · Exportar PGR
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {planoVigente.nome}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {empregadorContexto.nomeFantasia} · {planoVigente.ciclo} · derivado de{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {planoVigente.avaliacaoOrigemNome}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Resumo do que vai ser exportado */}
          <div className="rounded-2xl bg-gradient-to-br from-teal-50 via-white to-emerald-50/40 dark:from-teal-950/30 dark:via-slate-900 dark:to-emerald-950/20 border border-teal-200/70 dark:border-teal-900/60 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-teal-700 dark:text-teal-300 mb-2 inline-flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5" strokeWidth={2.25} />
              Conteúdo do export
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Itens de ação
                </p>
                <p className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {totalItens}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Evidências
                </p>
                <p className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {totalEvidencias}
                </p>
              </div>
            </div>
          </div>

          {/* Formato */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Formatos
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormatoCard
                Icon={FileText}
                titulo="PDF formal"
                descricao="Documento assinado eletronicamente, formatado para auditoria MTE e arquivo físico."
                snippet={
                  <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 space-y-1 mt-2">
                    <div>━━━ PGR · Vegamax · 2025-S2 ━━━</div>
                    <div>Ciclo: 2025-10-21 → vigente</div>
                    <div>Itens: 14 · Concluídos: 9</div>
                    <div>RT: Renato Holanda · MTE 187432</div>
                  </div>
                }
                active={formatos.has('pdf')}
                onToggle={() => toggleFormato('pdf')}
                tone="rose"
              />
              <FormatoCard
                Icon={Braces}
                titulo="JSON estruturado"
                descricao="Integração com sistemas externos de PGR (e-Risco, MasterFile, eSocial)."
                snippet={
                  <pre className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-2 whitespace-pre-wrap break-all">
{`{
  "plano": "pln-2025s2",
  "ciclo": "2025-S2",
  "itens": [...]
}`}
                  </pre>
                }
                active={formatos.has('json')}
                onToggle={() => toggleFormato('json')}
                tone="indigo"
              />
            </div>
          </fieldset>

          {/* Opções avançadas */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Opções avançadas
            </legend>
            <div className="space-y-1.5">
              <OpcaoToggle
                Icon={Paperclip}
                titulo="Incluir evidências anexadas"
                descricao={`${totalEvidencias} arquivo${totalEvidencias !== 1 ? 's' : ''} (atestados, presenteísmo, GPTW, CIDs) — adiciona como apêndices no PDF e referências no JSON`}
                ativo={incluirEvidencias}
                onChange={setIncluirEvidencias}
              />
              <OpcaoToggle
                Icon={History}
                titulo="Incluir histórico de mudanças"
                descricao="Log de quem mudou o quê e quando — útil pra auditoria mas aumenta significativamente o tamanho do arquivo"
                ativo={incluirHistorico}
                onChange={setIncluirHistorico}
              />
            </div>
          </fieldset>

          {/* Aviso compliance */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 px-4 py-3 flex items-start gap-2.5">
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              O PDF é assinado digitalmente com o certificado vinculado ao empregador. Validade
              jurídica garantida pra fiscalização MTE e arquivamento NR-1.
            </p>
          </div>
        </div>

        <footer className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {formatos.size === 0
              ? 'Selecione ao menos 1 formato'
              : `${formatos.size === 2 ? 'PDF + JSON' : formatos.has('pdf') ? 'Só PDF' : 'Só JSON'}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={!valid}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition ${
                valid
                  ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" strokeWidth={2.25} />
              Gerar export
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}

function FormatoCard({
  Icon,
  titulo,
  descricao,
  snippet,
  active,
  onToggle,
  tone,
}: {
  Icon: typeof FileText
  titulo: string
  descricao: string
  snippet: React.ReactNode
  active: boolean
  onToggle: () => void
  tone: 'rose' | 'indigo'
}) {
  const tones = {
    rose: {
      border: 'border-rose-300 dark:border-rose-800',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      iconBg: 'bg-rose-600 dark:bg-rose-500 text-white',
      text: 'text-rose-900 dark:text-rose-100',
    },
    indigo: {
      border: 'border-indigo-300 dark:border-indigo-800',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      iconBg: 'bg-indigo-600 dark:bg-indigo-500 text-white',
      text: 'text-indigo-900 dark:text-indigo-100',
    },
  }
  const t = tones[tone]
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative text-left p-3 rounded-xl border transition ${
        active
          ? `${t.border} ${t.bg} shadow-[0_4px_14px_-4px_rgba(15,23,42,0.15)]`
          : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl transition ${
            active ? t.iconBg : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {active ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Icon className="w-4 h-4" strokeWidth={1.75} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-semibold ${active ? t.text : 'text-slate-900 dark:text-slate-100'}`}>
            {titulo}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            {descricao}
          </p>
        </div>
      </div>
      <div className="mt-2 rounded-lg bg-white/70 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 px-2.5 py-2 overflow-hidden">
        {snippet}
      </div>
    </button>
  )
}

function OpcaoToggle({
  Icon,
  titulo,
  descricao,
  ativo,
  onChange,
}: {
  Icon: typeof FileText
  titulo: string
  descricao: string
  ativo: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer">
      <span
        className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-md transition ${
          ativo
            ? 'bg-teal-600 dark:bg-teal-500'
            : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700'
        }`}
      >
        {ativo && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={ativo}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <Icon className="w-3.5 h-3.5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100">{titulo}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
          {descricao}
        </p>
      </div>
    </label>
  )
}

function DrawerStyles() {
  return (
    <style>{`
      @keyframes drawer-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @keyframes drawer-slide-in {
        from { transform: translateX(20px); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      .drawer-slide {
        animation: drawer-slide-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .drawer-fade, .drawer-slide {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
