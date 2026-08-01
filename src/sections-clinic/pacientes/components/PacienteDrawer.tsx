import { CalendarPlus, Smartphone, FileText, Pencil, Send, X } from 'lucide-react'
import type { EscopoPacientes } from './PacientesLista'
import type { PacienteClinica } from '@/../product-clinic/sections/pacientes/types'
import { AVATAR_COR, BADGE_COR, STATUS_APP_META, dataCurta } from './helpers'

interface Props {
  /** `administrativo` (recepção) não vê condição crônica. Default `clinico`. */
  escopo?: EscopoPacientes
  paciente: PacienteClinica | null
  onClose: () => void
  onAbrirProntuario: (id: string) => void
  onAbrirAcompanhamento: (id: string) => void
  onConvidar: (id: string) => void
  onNovaConsulta: (id: string) => void
  onEditar: (id: string) => void
}

export function PacienteDrawer({
  paciente,
  onClose,
  onAbrirProntuario,
  onAbrirAcompanhamento,
  onConvidar,
  onNovaConsulta,
  onEditar, escopo = 'clinico' }: Props) {
  if (!paciente) return null
  const p = paciente

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Resumo do paciente
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditar(p.id)}
              title="Editar cadastro"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              aria-label="Fechar"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Identidade */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-400 text-base font-semibold text-white">
              {p.iniciais}
            </div>
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {p.nome}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {p.idade} anos · {p.convenio}
              </div>
            </div>
          </div>

          {/* Condições */}
          {escopo === 'clinico' && p.condicoesCronicas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {p.condicoesCronicas.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Equipe de cuidado */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Equipe de cuidado · {p.equipe.length}
            </h3>
            <ul className="space-y-2">
              {p.equipe.map((m) => (
                <li key={m.id} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[m.cor]}`}
                  >
                    {m.iniciais}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {m.nome}
                      </span>
                      {m.principal && (
                        <span className="rounded bg-teal-100 px-1 py-0.5 text-[9px] font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                          principal
                        </span>
                      )}
                    </div>
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COR[m.cor]}`}>
                      {m.especialidade}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Consultas + status */}
          <div className="grid grid-cols-2 gap-3">
            <MiniCard label="Última consulta" valor={dataCurta(p.ultimaConsultaEm)} sub={p.ultimaEspecialidade ?? '—'} />
            <MiniCard label="Próxima consulta" valor={dataCurta(p.proximaConsultaEm)} sub={p.proximaEspecialidade ?? '—'} />
          </div>
          {/* App Nymos — status do vínculo e o convite no mesmo lugar */}
          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                App Nymos
              </span>
              <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${STATUS_APP_META[p.statusApp].badge}`}>
                {STATUS_APP_META[p.statusApp].label}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              {!p.email
                ? 'Sem email cadastrado — edite o paciente para poder convidar.'
                : p.statusApp === 'vinculado'
                  ? `Vinculado por ${p.email} · compartilha dados conforme as permissões que aceitou.`
                  : p.statusApp === 'convite-pendente'
                    ? `Convite enviado para ${p.email} · aguardando o aceite no app.`
                    : `${p.email} ainda não foi convidado.`}
            </p>
            {p.statusApp !== 'vinculado' && (
              <button
                onClick={() => onConvidar(p.id)}
                disabled={!p.email}
                className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
              >
                <Send className="h-3.5 w-3.5" />
                {p.statusApp === 'convite-pendente' ? 'Reenviar convite' : 'Enviar convite'}
              </button>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={() => onAbrirProntuario(p.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <FileText className="h-4 w-4" /> Abrir prontuário compartilhado
          </button>
          {p.statusApp === 'vinculado' && (
            <button
              onClick={() => onAbrirAcompanhamento(p.id)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
            >
              <Smartphone className="h-4 w-4" /> Acompanhamento do app
            </button>
          )}
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => onNovaConsulta(p.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <CalendarPlus className="h-3.5 w-3.5" /> Nova consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniCard({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{valor}</div>
      <div className="text-[10px] text-slate-400">{sub}</div>
    </div>
  )
}
