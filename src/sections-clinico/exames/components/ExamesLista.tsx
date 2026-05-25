import { useState } from 'react'
import {
  ChevronRight,
  CloudUpload,
  FileQuestion,
  FlaskConical,
  Image as ImageIcon,
  Search,
} from 'lucide-react'
import type {
  ExamesListaProps,
  ExameListItem,
  StatusRevisao,
  CategoriaExame,
} from '@/../product-clinico/sections/exames/types'
import {
  formatDataBR,
  formatRelativo,
  ALERT_NIVEL_TEXT,
  TENDENCIA_LABEL,
} from './helpers'
import { Sparkline } from './Sparkline'
import { UploadImagemSection } from './UploadImagemSection'

const STATUS_OPCOES: { id: StatusRevisao; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'a-revisar', label: 'A revisar' },
  { id: 'revisado', label: 'Revisados' },
]

const TIPO_OPCOES: { id: CategoriaExame; label: string; icon: typeof FlaskConical }[] = [
  { id: 'laboratorial', label: 'Laboratorial', icon: FlaskConical },
  { id: 'imagem', label: 'Imagem', icon: ImageIcon },
]

export function ExamesLista({
  exames,
  filtroAtivo,
  onAplicarFiltro,
  onLimparFiltros,
  onAbrirExame,
}: ExamesListaProps) {
  const [mode, setMode] = useState<'lista' | 'upload'>('lista')
  const setBusca = (busca: string) => onAplicarFiltro?.({ ...filtroAtivo, busca })
  const setStatus = (status: StatusRevisao) =>
    onAplicarFiltro?.({ ...filtroAtivo, statusRevisao: status })
  const toggleTipo = (t: CategoriaExame) => {
    const tipos = filtroAtivo.tipos.includes(t)
      ? filtroAtivo.tipos.filter((x) => x !== t)
      : [...filtroAtivo.tipos, t]
    onAplicarFiltro?.({ ...filtroAtivo, tipos })
  }

  const filtrados = exames.filter((e) => {
    if (
      filtroAtivo.busca &&
      !e.pacienteNome.toLowerCase().includes(filtroAtivo.busca.toLowerCase()) &&
      !e.tipo.toLowerCase().includes(filtroAtivo.busca.toLowerCase())
    )
      return false
    if (filtroAtivo.statusRevisao !== 'todos' && e.statusRevisao !== filtroAtivo.statusRevisao)
      return false
    if (filtroAtivo.tipos.length > 0 && !filtroAtivo.tipos.includes(e.categoria)) return false
    return true
  })

  const aRevisarCount = exames.filter((e) => e.statusRevisao === 'a-revisar').length

  const temFiltro =
    filtroAtivo.busca ||
    filtroAtivo.tipos.length > 0 ||
    filtroAtivo.statusRevisao !== 'todos'

  if (mode === 'upload') {
    return (
      <div
        data-clinico-exames-upload
        className="
          relative min-h-screen
          bg-gradient-to-b from-slate-50 via-white to-slate-100/60
          text-slate-900
          dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
        "
      >
        <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-10">
          <UploadImagemSection
            onVoltar={() => setMode('lista')}
            onSalvo={(form, files) => console.log('exame salvo:', form, files)}
            onAnalisadoComIA={(form) => console.log('IA concluída pra:', form.tipo)}
            onVerDetalhe={() => setMode('lista')}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      data-clinico-exames-lista
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Exames
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {exames.length} exames recebidos ·{' '}
              {aRevisarCount > 0 ? (
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  {aRevisarCount} a revisar
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">tudo revisado ✓</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setMode('upload')}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors
              hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            "
          >
            <CloudUpload className="size-4" />
            Carregar imagem
          </button>
        </header>

        {/* Filtros */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por paciente ou tipo de exame…"
              value={filtroAtivo.busca}
              onChange={(e) => setBusca(e.target.value)}
              className="
                w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm
                placeholder:text-slate-400
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500
              "
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50/60 p-0.5 dark:border-slate-800 dark:bg-slate-900/60">
              {STATUS_OPCOES.map((s) => {
                const ativo = filtroAtivo.statusRevisao === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id)}
                    className={`
                      rounded-md px-2.5 py-1 text-xs font-medium transition-colors
                      ${
                        ativo
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }
                    `}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
            {TIPO_OPCOES.map(({ id, label, icon: Icon }) => {
              const ativo = filtroAtivo.tipos.includes(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleTipo(id)}
                  className={`
                    inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all
                    ${
                      ativo
                        ? 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <Icon className="size-3" />
                  {label}
                </button>
              )
            })}
            {temFiltro && (
              <button
                onClick={onLimparFiltros}
                className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <FileQuestion className="size-5" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Nenhum exame encontrado
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Solicite exame na consulta — paciente envia pelo app.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtrados.map((e) => (
              <ExameRow key={e.id} e={e} onAbrir={() => onAbrirExame?.(e.id)} />
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

function ExameRow({ e, onAbrir }: { e: ExameListItem; onAbrir?: () => void }) {
  const aRevisar = e.statusRevisao === 'a-revisar'
  return (
    <li>
      <button
        onClick={onAbrir}
        className={`
          group/exr flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left
          shadow-sm transition-all hover:border-teal-300 hover:shadow
          focus:outline-none focus:ring-2 focus:ring-teal-500/40
          dark:bg-slate-900 dark:hover:border-teal-700
          ${
            aRevisar
              ? 'border-rose-200/70 dark:border-rose-900/40'
              : 'border-slate-200/80 dark:border-slate-800'
          }
        `}
      >
        {/* Avatar */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
          {e.iniciais}
        </div>

        {/* Info paciente + tipo */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
              {e.pacienteNome}
            </p>
            {aRevisar && (
              <span className="inline-flex items-center rounded-full bg-rose-500 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-white">
                Novo
              </span>
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              {e.categoria === 'laboratorial' ? (
                <FlaskConical className="size-3" />
              ) : (
                <ImageIcon className="size-3" />
              )}
              {e.tipo}
            </span>
            <span aria-hidden="true">·</span>
            <span>{e.laboratorio}</span>
            <span aria-hidden="true">·</span>
            <span title={formatDataBR(e.dataColeta)}>
              recebido {formatRelativo(e.recebidoEm)}
            </span>
          </p>
          {e.condicoesCronicas.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {e.condicoesCronicas.slice(0, 2).map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Biomarker destaque */}
        {e.destaqueBiomarker && (
          <div className="hidden items-center gap-3 sm:flex">
            <Sparkline
              values={e.destaqueBiomarker.historico}
              alertNivel={e.destaqueBiomarker.alertNivel}
              showArea={true}
            />
            <div className="text-right">
              <p
                className={`font-mono text-lg font-semibold tabular-nums ${
                  ALERT_NIVEL_TEXT[e.destaqueBiomarker.alertNivel]
                }`}
              >
                {e.destaqueBiomarker.valor}
                <span className="ml-0.5 text-[9px] text-slate-400">
                  {e.destaqueBiomarker.unidade}
                </span>
              </p>
              <p className="text-[10px] text-slate-500">
                {e.destaqueBiomarker.nome} · {TENDENCIA_LABEL[e.destaqueBiomarker.tendencia]}
              </p>
            </div>
          </div>
        )}

        <ChevronRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover/exr:text-teal-500 dark:text-slate-600" />
      </button>
    </li>
  )
}
