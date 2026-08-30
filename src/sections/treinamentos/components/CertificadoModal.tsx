import { useState } from 'react'
import type {
  Empregador,
  Trabalhador,
  Treinamento,
  Turma,
} from '@/../product/sections/treinamentos/types'
import { MODALIDADE_LABEL, TIPO_TURMA_LABEL, formatData, formatHoras } from './helpers'

interface CertificadoModalProps {
  turma: Turma
  treinamento: Treinamento
  empregador?: Empregador
  trabalhadores: Trabalhador[]
  alunoInicialId: string
  onClose: () => void
}

export function CertificadoModal({
  turma,
  treinamento,
  empregador,
  trabalhadores,
  alunoInicialId,
  onClose,
}: CertificadoModalProps) {
  const certificados = turma.alunos.filter((a) => a.certificadoEmitido)
  const [idx, setIdx] = useState(
    Math.max(0, certificados.findIndex((a) => a.trabalhadorId === alunoInicialId)),
  )
  const aluno = certificados[idx]
  const trabalhador = trabalhadores.find((t) => t.id === aluno?.trabalhadorId)
  if (!aluno || !trabalhador) return null

  const codigo = `NYM-${turma.id.slice(-3).toUpperCase()}-${trabalhador.matricula.replace(/\W/g, '')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:block print:p-0">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] print:hidden" onClick={onClose} />

      <div className="relative flex max-h-full w-full max-w-3xl flex-col print:max-w-none">
        <div className="mb-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <button
              disabled={idx === 0}
              onClick={() => setIdx((i) => i - 1)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-30"
            >
              ← Anterior
            </button>
            <span className="text-sm text-white/80 tabular-nums">
              {idx + 1} / {certificados.length}
            </span>
            <button
              disabled={idx === certificados.length - 1}
              onClick={() => setIdx((i) => i + 1)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-30"
            >
              Próximo →
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Imprimir / salvar PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
              aria-label="Fechar"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Certificado — sempre em tema claro, é um documento impresso */}
        <div className="overflow-y-auto rounded-xl bg-white shadow-2xl print:overflow-visible print:rounded-none print:shadow-none">
          <div className="border-[3px] border-teal-700 p-1.5">
            <div className="border border-teal-700/40 px-10 py-8 sm:px-14">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-700">
                    Segurança do Trabalho · {treinamento.norma}
                  </p>
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Certificado</h1>
                  <p className="text-sm text-slate-500">de conclusão de treinamento</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{empregador?.razaoSocial}</p>
                  <p className="font-mono text-xs text-slate-500">{empregador?.cnpj}</p>
                </div>
              </div>

              <div className="my-7 h-px bg-slate-200" />

              <p className="text-sm leading-relaxed text-slate-600">Certificamos que</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{trabalhador.nome}</p>
              <p className="text-sm text-slate-500">
                {trabalhador.cargo} · matrícula <span className="font-mono">{trabalhador.matricula}</span> · setor {trabalhador.setor}
              </p>

              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                concluiu com aproveitamento o treinamento{' '}
                <span className="font-semibold text-slate-900">{treinamento.nome}</span> ({treinamento.norma}),
                na modalidade {MODALIDADE_LABEL[treinamento.modalidade].toLowerCase()}, tipo{' '}
                {TIPO_TURMA_LABEL[turma.tipo].toLowerCase()}, com carga horária total de{' '}
                <span className="font-semibold text-slate-900">{formatHoras(treinamento.cargaHorariaHoras)}</span>,
                realizado em {turma.dataInicio === turma.dataFim
                  ? formatData(turma.dataFim)
                  : `${formatData(turma.dataInicio)} a ${formatData(turma.dataFim)}`}
                {turma.local ? `, ${turma.local}` : ''}.
              </p>

              {treinamento.conteudoProgramatico.length > 0 && (
                <div className="mt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Conteúdo programático
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                    {treinamento.conteudoProgramatico.map((d, i) => (
                      <li key={i} className="flex items-baseline justify-between gap-3 text-xs text-slate-600">
                        <span>{d.titulo}</span>
                        <span className="shrink-0 font-mono text-slate-400">{formatHoras(d.horas)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 grid grid-cols-2 gap-10">
                <div className="text-center">
                  <div className="mx-auto h-px w-48 bg-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-900">{turma.instrutor || 'Instrutor'}</p>
                  <p className="text-xs text-slate-500">Instrutor</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-px w-48 bg-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-900">{trabalhador.nome}</p>
                  <p className="text-xs text-slate-500">Participante</p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] text-slate-400">Código de validação</p>
                  <p className="font-mono text-xs font-semibold tracking-wider text-slate-700">{codigo}</p>
                </div>
                {treinamento.validadeMeses != null && (
                  <p className="text-[10px] text-slate-400">
                    Válido por {treinamento.validadeMeses} meses a partir da conclusão · reciclagem obrigatória
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
