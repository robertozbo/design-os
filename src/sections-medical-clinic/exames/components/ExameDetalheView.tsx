import {
  ArrowLeft,
  BadgeCheck,
  Check,
  FileText,
  Printer,
  ScanLine,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { Biomarker, ExameDetalhe } from '@/../product-medical-clinic/sections/exames/types'
import { AVATAR_COR, BADGE_COR, NIVEL_META, TENDENCIA_SETA } from './helpers'
import { IAApoioPanel } from './IAApoioPanel'

interface Props {
  exame: ExameDetalhe
  outrosIds: { id: string; label: string }[]
  valoresConfirmados: boolean
  revisado: boolean
  onSelecionar: (id: string) => void
  onVoltar: () => void
  onConfirmarValores: () => void
  onMarcarRevisado: () => void
  onCompartilhar: () => void
  onImprimir: () => void
}

export function ExameDetalheView({
  exame,
  outrosIds,
  valoresConfirmados,
  revisado,
  onSelecionar,
  onVoltar,
  onConfirmarValores,
  onMarcarRevisado,
  onCompartilhar,
  onImprimir,
}: Props) {
  const { paciente } = exame

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Voltar + picker */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" /> Exames
        </button>
        {outrosIds.length > 1 && (
          <select
            value={exame.id}
            onChange={(e) => onSelecionar(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {outrosIds.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Cabeçalho paciente + exame */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {paciente.iniciais}
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {paciente.nome}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {paciente.idade} anos · {paciente.genero} · {paciente.convenio}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {paciente.condicoesCronicas.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{exame.tipo}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {exame.laboratorio}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Coleta {exame.dataColeta} · Resultado {exame.dataResultado}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 sm:justify-end">
              <span className="text-[11px] text-slate-400">Solicitado por</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COR[exame.solicitante.cor]}`}
              >
                {exame.solicitante.nome.split(' ').slice(0, 2).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Coluna principal: laudo + IA */}
        <div className="space-y-4 lg:col-span-3">
          {/* Laudo */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                {exame.categoria === 'imagem' ? (
                  <ScanLine className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <h3 className="text-xs font-semibold uppercase tracking-wide">Laudo original</h3>
              </div>
              <span className="text-[10px] text-slate-400">{exame.laudoPaginas} pág.</span>
            </div>
            <div className="p-4">
              {exame.dicomDisponivel && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-[11px] text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">
                  <ScanLine className="h-3.5 w-3.5 shrink-0" />
                  Estudo DICOM disponível — viewer embutido chega no V2. Abra no PACS externo por
                  enquanto.
                </div>
              )}
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {exame.laudoTexto}
              </pre>
            </div>
          </div>

          {/* IA de apoio */}
          <IAApoioPanel analise={exame.iaAnalise} />
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4 lg:col-span-2">
          {/* Valores estruturados */}
          {exame.biomarkers.length > 0 && (
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Valores estruturados
                </h3>
                {valoresConfirmados && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-3 w-3" /> confirmados
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {exame.biomarkers.map((b) => (
                  <BiomarkerRow key={b.nome} b={b} />
                ))}
              </ul>
              {!valoresConfirmados && (
                <button
                  onClick={onConfirmarValores}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-teal-500 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40"
                >
                  <Check className="h-3.5 w-3.5" /> Confirmar valores
                </button>
              )}
            </Card>
          )}

          {/* Acesso compartilhado */}
          <Card>
            <div className="mb-2.5 flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wide">Acesso compartilhado</h3>
            </div>
            <ul className="space-y-2">
              {exame.medicosAutorizados.map((m) => (
                <li key={m.nome} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white ${AVATAR_COR[m.cor]}`}
                  >
                    {m.iniciais}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                      {m.nome}
                    </div>
                    <div className="truncate text-[10px] text-slate-400">{m.especialidade}</div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2.5 flex items-start gap-1.5 text-[10px] leading-snug text-slate-400">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" />
              Visível aos médicos com vínculo de cuidado ativo. Cada acesso é auditado.
            </p>
          </Card>

          {/* Contexto */}
          <Card>
            <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Contexto cruzado
            </h3>
            <div className="mb-1 text-[10px] font-semibold uppercase text-slate-400">Sintomas</div>
            <div className="flex flex-wrap gap-1">
              {exame.anamneseSintomas.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
            {exame.medicacaoAtiva.length > 0 && (
              <>
                <div className="mb-1 mt-2.5 text-[10px] font-semibold uppercase text-slate-400">
                  Medicação ativa
                </div>
                <ul className="space-y-1">
                  {exame.medicacaoAtiva.map((m) => (
                    <li key={m.nome} className="flex items-center gap-1.5 text-[11px]">
                      <span className={`h-1.5 w-1.5 rounded-full ${AVATAR_COR[m.cor]}`} aria-hidden />
                      <span className="text-slate-600 dark:text-slate-300">{m.nome}</span>
                      <span className="text-slate-400">· {m.posologia}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        {revisado ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <BadgeCheck className="h-4 w-4" /> Revisado por Dra. Helena Prado
          </span>
        ) : (
          <button
            onClick={onMarcarRevisado}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600"
          >
            <Check className="h-4 w-4" /> Marcar revisado
          </button>
        )}
        <button
          onClick={onCompartilhar}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-300"
        >
          <Send className="h-4 w-4" /> Compartilhar com paciente
        </button>
        <button
          onClick={onImprimir}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Printer className="h-4 w-4" /> Imprimir
        </button>
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      {children}
    </div>
  )
}

function BiomarkerRow({ b }: { b: Biomarker }) {
  const meta = NIVEL_META[b.alertNivel]
  const max = Math.max(...b.historico)
  const min = Math.min(...b.historico)
  const span = max - min || 1
  return (
    <li>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{b.nome}</span>
          <span className="ml-1 text-[10px] text-slate-400">{b.faixaReferencia}</span>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${meta.texto}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.ponto}`} aria-hidden />
          {b.valor.toLocaleString('pt-BR')} {b.unidade} {TENDENCIA_SETA[b.tendencia]}
        </span>
      </div>
      {/* Sparkline */}
      <div className="mt-1.5 flex h-6 items-end gap-0.5">
        {b.historico.map((v, i) => {
          const h = 20 + ((v - min) / span) * 80
          const ultimo = i === b.historico.length - 1
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm ${ultimo ? meta.barra : 'bg-slate-200 dark:bg-slate-700'}`}
              style={{ height: `${h}%` }}
            />
          )
        })}
      </div>
    </li>
  )
}
