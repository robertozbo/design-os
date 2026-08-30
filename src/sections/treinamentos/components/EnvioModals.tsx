import { useState } from 'react'
import type { Trabalhador, Treinamento, Turma } from '@/../product/sections/treinamentos/types'
import { formatData, formatPeriodo } from './helpers'

const isGmail = (email: string | null) => !!email && /@(gmail|googlemail)\.com$/i.test(email)

/* ─── Enviar certificados por e-mail ─────────────────────────────── */

interface EnviarCertificadosModalProps {
  turma: Turma
  treinamento?: Treinamento
  trabalhadores: Trabalhador[]
  onClose: () => void
  onEnviar?: (turmaId: string, trabalhadorIds: string[]) => void
}

export function EnviarCertificadosModal({
  turma,
  treinamento,
  trabalhadores,
  onClose,
  onEnviar,
}: EnviarCertificadosModalProps) {
  const certificados = turma.alunos.filter((a) => a.certificadoEmitido)
  const trabDe = (id: string) => trabalhadores.find((t) => t.id === id)

  const [marcados, setMarcados] = useState<Set<string>>(
    () =>
      new Set(
        certificados
          .filter((a) => !a.certificadoEnviado && trabDe(a.trabalhadorId)?.email)
          .map((a) => a.trabalhadorId),
      ),
  )

  const toggle = (id: string) =>
    setMarcados((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex max-h-full w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enviar certificados por e-mail</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {treinamento?.norma} — {treinamento?.nome} · concluído em {formatData(turma.dataFim)}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {certificados.map((a) => {
              const t = trabDe(a.trabalhadorId)
              const semEmail = !t?.email
              return (
                <li key={a.trabalhadorId} className="flex items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    disabled={semEmail || a.certificadoEnviado}
                    checked={marcados.has(a.trabalhadorId)}
                    onChange={() => toggle(a.trabalhadorId)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{t?.nome}</p>
                    {semEmail ? (
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Sem e-mail cadastrado — entregar impresso</p>
                    ) : (
                      <p className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">{t?.email}</p>
                    )}
                  </div>
                  {a.certificadoEnviado && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Enviado ✓
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            Cada aluno recebe o próprio certificado em PDF anexado, com o código de validação no corpo do e-mail.
          </p>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            disabled={marcados.size === 0}
            onClick={() => {
              onEnviar?.(turma.id, [...marcados])
              onClose()
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.9 5.3a2 2 0 002.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Enviar {marcados.size} certificado{marcados.size === 1 ? '' : 's'}
          </button>
        </footer>
      </div>
    </div>
  )
}

/* ─── Google Agenda ──────────────────────────────────────────────── */

interface AgendaGoogleModalProps {
  turma: Turma
  treinamento?: Treinamento
  trabalhadores: Trabalhador[]
  onClose: () => void
  onCriar?: (turmaId: string) => void
}

export function AgendaGoogleModal({ turma, treinamento, trabalhadores, onClose, onCriar }: AgendaGoogleModalProps) {
  const trabDe = (id: string) => trabalhadores.find((t) => t.id === id)
  const inscritos = turma.alunos.map((a) => trabDe(a.trabalhadorId)).filter(Boolean) as Trabalhador[]
  const comGmail = inscritos.filter((t) => isGmail(t.email))
  const outroEmail = inscritos.filter((t) => t.email && !isGmail(t.email))
  const semEmail = inscritos.filter((t) => !t.email)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex max-h-full w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="flex items-center gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          {/* Marca do Google Agenda */}
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <rect x="3" y="4" width="18" height="17" rx="2" fill="#fff" stroke="#4285F4" strokeWidth="1.5" />
              <path d="M3 9h18" stroke="#4285F4" strokeWidth="1.5" />
              <path d="M8 2v4M16 2v4" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" />
              <text x="12" y="17.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4285F4">31</text>
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Adicionar ao Google Agenda</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Evento no calendário do instrutor + convite aos inscritos</p>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {treinamento?.norma} · {treinamento?.nome}
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 2" /></svg>
                <span className="tabular-nums">{formatPeriodo(turma)} · 08:00–17:00</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.7 13.9L12 21l-5.7-7.1a7 7 0 1111.4 0z" /><circle cx="12" cy="10" r="2.5" /></svg>
                {turma.local || 'Local a definir'}
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Organizador: {turma.instrutor || 'Instrutor'}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Convidados ({comGmail.length + outroEmail.length})
            </p>
            <ul className="space-y-1">
              {comGmail.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">{t.nome}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="truncate font-mono text-xs text-slate-400">{t.email}</span>
                    <span className="rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">Gmail</span>
                  </span>
                </li>
              ))}
              {outroEmail.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">{t.nome}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="truncate font-mono text-xs text-slate-400">{t.email}</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">convite .ics</span>
                  </span>
                </li>
              ))}
            </ul>
            {semEmail.length > 0 && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                {semEmail.map((t) => t.nome.split(' ')[0]).join(', ')} não {semEmail.length === 1 ? 'tem' : 'têm'} e-mail cadastrado — não {semEmail.length === 1 ? 'receberá' : 'receberão'} convite.
              </p>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onCriar?.(turma.id)
              onClose()
            }}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
          >
            Criar evento e enviar convites
          </button>
        </footer>
      </div>
    </div>
  )
}
