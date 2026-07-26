import {
  Ban,
  FileText,
  History,
  RotateCw,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import type { PrescricaoItem } from '@/../product-medical-clinic/sections/prescricao/types'
import { AVATAR_COR, BADGE_COR, MOTIVO_LABEL, STATUS_META, TIPO_META, validadeLabel } from './helpers'

interface Props {
  p: PrescricaoItem
  onFechar: () => void
  onRenovar: () => void
  onCancelar: () => void
  onAbrirPdf: () => void
}

export function PrescricaoDrawer({ p, onFechar, onRenovar, onCancelar, onAbrirPdf }: Props) {
  const status = STATUS_META[p.status]
  const tipo = TIPO_META[p.tipo]
  const validade = validadeLabel(p.diasAteVencer)
  const podeCancelar = p.status === 'ativa'

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {p.paciente.iniciais}
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {p.paciente.nome}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.chip}`}>
                  {status.label}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tipo.chip}`}>
                  {tipo.label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Meta label="Emitida" valor={p.dataEmissao} />
            <Meta label="Validade" valor={p.validade} alerta={validade.alerta} />
            <Meta
              label="Origem"
              valor={p.origemConsultaData ? `Consulta ${p.origemConsultaData}` : 'Avulsa'}
            />
            <Meta label="Prescritor" valor={p.prescritor.nome.split(' ').slice(0, 2).join(' ')} />
          </div>

          {/* Cancelada */}
          {p.status === 'cancelada' && p.canceladaEm && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs dark:border-rose-900/50 dark:bg-rose-950/20">
              <div className="font-semibold text-rose-700 dark:text-rose-300">
                Cancelada em {p.canceladaEm}
              </div>
              <div className="text-rose-600/80 dark:text-rose-300/80">
                {p.canceladaPor} · {p.motivoCancelamento && MOTIVO_LABEL[p.motivoCancelamento]}
              </div>
            </div>
          )}

          {/* Itens */}
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Medicamentos
            </h3>
            <ul className="space-y-2">
              {p.medicamentos.map((m) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {m.nome}
                    </span>
                    {m.continuo && (
                      <span className="rounded-full bg-teal-50 px-1.5 py-0.5 text-[9px] font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                        contínuo
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">{m.principioAtivo}</div>
                  <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {m.dose} · {m.posologia}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Histórico de renovações */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <History className="h-3.5 w-3.5" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wide">Histórico</h3>
            </div>
            <ul className="space-y-1.5">
              {p.historicoRenovacoes.map((h) => (
                <li key={h.id} className="flex items-center gap-2 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-slate-600 dark:text-slate-300">{h.data}</span>
                  <span className="text-slate-400">
                    · {h.tipo === 'consulta' ? 'Emitida em consulta' : 'Renovação'} · {h.medicoNome.split(' ').slice(0, 2).join(' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Acesso compartilhado */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wide">Visível para</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.medicosAutorizados.map((m) => (
                <span
                  key={m.nome}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COR[m.cor]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${AVATAR_COR[m.cor]}`} aria-hidden />
                  {m.nome.split(' ').slice(0, 2).join(' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
          {p.validadeICP && (
            <button
              onClick={onAbrirPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" /> PDF Memed
            </button>
          )}
          {(p.tipo === 'continua' && p.status !== 'cancelada') && (
            <button
              onClick={onRenovar}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600"
            >
              <RotateCw className="h-4 w-4" /> Renovar
            </button>
          )}
          {podeCancelar && (
            <button
              onClick={onCancelar}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/20"
            >
              <Ban className="h-4 w-4" /> Cancelar
            </button>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3" /> ICP-Brasil
          </span>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, valor, alerta }: { label: string; valor: string; alerta?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div
        className={`mt-0.5 font-medium ${
          alerta ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {valor}
      </div>
    </div>
  )
}
