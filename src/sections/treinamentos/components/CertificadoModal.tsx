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

              <div className="mt-8 grid grid-cols-2 gap-10">
                <div className="text-center">
                  {/* Assinatura manuscrita do instrutor (no app real: imagem carregada no cadastro do instrutor) */}
                  <svg viewBox="0 0 200 44" className="mx-auto -mb-2 h-11 w-44 text-slate-700" fill="none">
                    <path
                      d="M12 34 C 22 8, 34 6, 38 20 C 41 31, 33 38, 28 33 C 24 29, 34 18, 48 16 C 62 14, 58 30, 52 32 C 47 34, 50 22, 64 18 C 76 15, 72 30, 68 31 C 65 32, 70 20, 84 17 C 96 15, 92 28, 100 24 C 108 20, 112 14, 122 16 C 132 18, 128 30, 138 26 C 148 22, 154 16, 168 18 C 178 20, 184 24, 190 22"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="mx-auto h-px w-48 bg-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-900">{turma.instrutor || 'Instrutor'}</p>
                  <p className="text-xs text-slate-500">Instrutor</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mt-9 h-px w-48 bg-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-900">{trabalhador.nome}</p>
                  <p className="text-xs text-slate-500">Participante</p>
                </div>
              </div>

              {/* Carimbo de assinatura digital */}
              <div className="mt-8 flex items-center gap-4 rounded-lg border border-teal-700/30 bg-teal-50/50 px-4 py-3">
                <svg viewBox="0 0 21 21" className="h-12 w-12 shrink-0 text-slate-800" shapeRendering="crispEdges">
                  {/* QR simbólico de validação */}
                  {[
                    '111011010110111',
                    '100010111010001',
                    '101110010101011',
                    '100010110100101',
                    '111011011011101',
                    '000001010010000',
                    '110110111011011',
                    '010100010110010',
                    '111010110101110',
                    '100011010010001',
                    '101110110110101',
                    '100010010101101',
                    '111011101011011',
                  ].map((row, y) =>
                    [...row].map((c, x) =>
                      c === '1' ? <rect key={`${x}-${y}`} x={x + 3} y={y + 4} width="1" height="1" fill="currentColor" /> : null,
                    ),
                  )}
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.6 2c0 5-3.8 7.7-8.6 9.4C7.2 19.7 3.4 17 3.4 12V6.4L12 3l8.6 3.4V12z"
                      />
                    </svg>
                    Documento assinado digitalmente
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                    {turma.instrutor || 'Responsável técnico'} · {formatData(turma.dataFim)} · conforme MP 2.200-2/2001 (ICP-Brasil)
                  </p>
                  <p className="font-mono text-[10px] tracking-wider text-slate-500">
                    {codigo} · valide em nymos.app/validar
                  </p>
                </div>
                {treinamento.validadeMeses != null && (
                  <p className="max-w-[140px] shrink-0 text-right text-[10px] leading-snug text-slate-400">
                    Válido por {treinamento.validadeMeses} meses · reciclagem obrigatória
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
