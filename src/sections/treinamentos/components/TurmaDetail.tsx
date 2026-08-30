import { useState } from 'react'
import type {
  Empregador,
  Trabalhador,
  Treinamento,
  Turma,
} from '@/../product/sections/treinamentos/types'
import {
  STATUS_TURMA_CLASSES,
  STATUS_TURMA_LABEL,
  TIPO_TURMA_LABEL,
  formatData,
  formatHoras,
  formatPeriodo,
} from './helpers'

interface TurmaDetailProps {
  turma: Turma
  treinamento?: Treinamento
  empregador?: Empregador
  trabalhadores: Trabalhador[]
  onBack: () => void
  onTogglePresenca?: (turmaId: string, trabalhadorId: string, presente: boolean) => void
  onToggleAprovacao?: (turmaId: string, trabalhadorId: string, aprovado: boolean) => void
  onEmitirCertificados?: (turmaId: string) => void
}

export function TurmaDetail({
  turma,
  treinamento,
  empregador,
  trabalhadores,
  onBack,
  onTogglePresenca,
  onToggleAprovacao,
  onEmitirCertificados,
}: TurmaDetailProps) {
  const [confirmando, setConfirmando] = useState(false)

  const aprovados = turma.alunos.filter((a) => a.aprovado).length
  const podeEmitir = turma.status === 'concluida' && aprovados > 0
  const nomeDe = (id: string) => trabalhadores.find((t) => t.id === id)

  const Toggle = ({
    value,
    onChange,
    disabled,
  }: {
    value: boolean | null
    onChange: (v: boolean) => void
    disabled?: boolean
  }) => (
    <button
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={`relative h-5 w-9 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        value ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'
      }`}
      role="switch"
      aria-checked={value === true}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
          value ? 'left-[18px]' : 'left-0.5'
        }`}
      />
    </button>
  )

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Turmas
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {treinamento && (
              <span className="rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                {treinamento.norma}
              </span>
            )}
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TURMA_CLASSES[turma.status]}`}>
              {STATUS_TURMA_LABEL[turma.status]}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {treinamento?.nome ?? 'Treinamento'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {TIPO_TURMA_LABEL[turma.tipo]} · {formatPeriodo(turma)}
          </p>
        </div>
        <button
          disabled={!podeEmitir}
          onClick={() => setConfirmando(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          title={
            turma.status === 'certificados_emitidos'
              ? 'Certificados já emitidos'
              : !podeEmitir
                ? 'Disponível quando a turma estiver concluída e houver alunos aprovados'
                : undefined
          }
        >
          {turma.status === 'certificados_emitidos' ? 'Certificados emitidos ✓' : 'Emitir certificados'}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Empregador', valor: empregador?.razaoSocial ?? '—', sub: empregador?.cnpj, mono: true },
          { label: 'Carga horária', valor: treinamento ? formatHoras(treinamento.cargaHorariaHoras) : '—', sub: treinamento && `${treinamento.conteudoProgramatico.length} disciplinas` },
          { label: 'Instrutor', valor: turma.instrutor || '—', sub: turma.local },
          { label: 'Alunos', valor: String(turma.alunos.length), sub: `${aprovados} aprovado${aprovados === 1 ? '' : 's'}` },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{c.label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">{c.valor}</p>
            {c.sub && (
              <p className={`truncate text-xs text-slate-500 dark:text-slate-400 ${c.mono ? 'font-mono' : ''}`}>{c.sub}</p>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="max-md:hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <th className="px-4 py-3 font-medium">Aluno</th>
                <th className="px-4 py-3 font-medium">Setor</th>
                <th className="px-4 py-3 text-center font-medium">Presença</th>
                <th className="px-4 py-3 text-center font-medium">Aprovado</th>
                <th className="px-4 py-3 text-right font-medium">Certificado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {turma.alunos.map((a) => {
                const t = nomeDe(a.trabalhadorId)
                return (
                  <tr key={a.trabalhadorId}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{t?.nome ?? a.trabalhadorId}</p>
                      <p className="font-mono text-xs text-slate-400 dark:text-slate-500">{t?.matricula}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{t?.setor ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Toggle
                        value={a.presente}
                        disabled={turma.status === 'agendada' || turma.status === 'certificados_emitidos'}
                        onChange={(v) => onTogglePresenca?.(turma.id, a.trabalhadorId, v)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Toggle
                        value={a.aprovado}
                        disabled={turma.status === 'agendada' || turma.status === 'certificados_emitidos'}
                        onChange={(v) => onToggleAprovacao?.(turma.id, a.trabalhadorId, v)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {a.certificadoEmitido ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Emitido
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
          {turma.alunos.map((a) => {
            const t = nomeDe(a.trabalhadorId)
            return (
              <div key={a.trabalhadorId} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{t?.nome ?? a.trabalhadorId}</p>
                  {a.certificadoEmitido && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Certificado ✓
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-slate-400">{t?.matricula} · {t?.setor}</p>
                <div className="mt-2 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    Presença
                    <Toggle
                      value={a.presente}
                      disabled={turma.status === 'agendada' || turma.status === 'certificados_emitidos'}
                      onChange={(v) => onTogglePresenca?.(turma.id, a.trabalhadorId, v)}
                    />
                  </span>
                  <span className="flex items-center gap-2">
                    Aprovado
                    <Toggle
                      value={a.aprovado}
                      disabled={turma.status === 'agendada' || turma.status === 'certificados_emitidos'}
                      onChange={(v) => onToggleAprovacao?.(turma.id, a.trabalhadorId, v)}
                    />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {turma.alunos.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum aluno na turma ainda</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Edite a turma para carregar os funcionários do empregador.</p>
          </div>
        )}
      </div>

      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={() => setConfirmando(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.8 21h8.4a2 2 0 002-2V5a2 2 0 00-2-2H7.8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Emitir {aprovados} certificado{aprovados === 1 ? '' : 's'}?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Será gerado um certificado para cada aluno aprovado, constando:
            </p>
            <ul className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              <li><span className="text-slate-400 dark:text-slate-500">Curso:</span> {treinamento?.norma} — {treinamento?.nome}</li>
              <li><span className="text-slate-400 dark:text-slate-500">Carga horária:</span> {treinamento ? formatHoras(treinamento.cargaHorariaHoras) : '—'}</li>
              <li><span className="text-slate-400 dark:text-slate-500">Conclusão:</span> {formatData(turma.dataFim)}</li>
            </ul>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmando(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onEmitirCertificados?.(turma.id)
                  setConfirmando(false)
                }}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Emitir certificados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
