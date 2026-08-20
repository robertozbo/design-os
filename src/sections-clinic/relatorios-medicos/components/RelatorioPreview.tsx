import { useState } from 'react'
import { ArrowLeft, Check, Download, Mail, Pencil } from 'lucide-react'
import type {
  ClinicaRef,
  MedicoRef,
  Relatorio,
} from '@/../product-clinic/sections/relatorios-medicos/types'
import { STATUS_META, TIPO_CHIP, TIPO_LABEL, dataCurta } from './helpers'

interface Props {
  clinica: ClinicaRef
  medico: MedicoRef
  relatorio: Relatorio
  onVoltar: () => void
  onSalvarTexto: (corpo: string[]) => void
  onPdf: () => void
  onEnviar: () => void
}

export function RelatorioPreview({
  clinica,
  medico,
  relatorio: r,
  onVoltar,
  onSalvarTexto,
  onPdf,
  onEnviar,
}: Props) {
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState(r.corpo.join('\n\n'))
  const status = STATUS_META[r.status]

  const salvar = () => {
    onSalvarTexto(
      rascunho
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    )
    setEditando(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-10 dark:bg-slate-950">
      {/* Barra de ações */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-3 pl-16 lg:pl-4">
          <button
            onClick={onVoltar}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {r.numero}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TIPO_CHIP[r.tipo]}`}
              >
                {TIPO_LABEL[r.tipo]}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.chip}`}>
                {status.label}
              </span>
            </div>
            {r.enviadoEm && (
              <div className="truncate text-[11px] text-slate-400">
                Enviado para {r.enviadoPara} em {r.enviadoEm}
              </div>
            )}
          </div>

          {editando ? (
            <button
              onClick={salvar}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600"
            >
              <Check className="h-3.5 w-3.5" /> Salvar texto
            </button>
          ) : (
            <button
              onClick={() => {
                setRascunho(r.corpo.join('\n\n'))
                setEditando(true)
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar texto
            </button>
          )}
          <button
            onClick={onPdf}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" /> Baixar PDF
          </button>
          <button
            onClick={onEnviar}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600"
          >
            <Mail className="h-3.5 w-3.5" /> Enviar por e-mail
          </button>
        </div>
      </div>

      {/* Folha */}
      <div className="mx-auto mt-6 max-w-3xl px-4">
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
          {/* Timbre */}
          <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {clinica.nome}
                </div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {clinica.endereco}
                  <br />
                  {clinica.telefone} · {clinica.email} · CNPJ {clinica.cnpj}
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <div className="font-mono tabular-nums">{r.numero}</div>
                <div>Emitido em {r.emitidoEm}</div>
              </div>
            </div>
          </header>

          {/* Título */}
          <h2 className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-800 dark:text-slate-100">
            {r.titulo}
          </h2>

          {/* Identificação */}
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl bg-slate-50 p-4 text-[11px] dark:bg-slate-800/50 sm:grid-cols-4">
            <Campo rotulo="Paciente" valor={r.paciente.nome} />
            <Campo rotulo="CPF" valor={r.paciente.cpf} />
            <Campo rotulo="Idade" valor={`${r.paciente.idade} anos`} />
            <Campo rotulo="Convênio" valor={r.paciente.convenio} />
            <Campo rotulo="Data da consulta" valor={dataCurta(r.consultaData)} />
            <Campo rotulo="CID-10" valor={r.cid ?? '—'} />
            <Campo rotulo="Especialidade" valor={medico.especialidade} />
            <Campo rotulo="Profissional" valor={medico.nome} />
          </dl>

          {/* Corpo */}
          {editando ? (
            <textarea
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              rows={14}
              className="mt-6 w-full resize-y rounded-xl border border-teal-500 p-4 text-[13px] leading-7 text-slate-700 outline-none focus:ring-1 focus:ring-teal-500 dark:bg-slate-900 dark:text-slate-200"
            />
          ) : (
            <div className="mt-6 space-y-4 text-[13px] leading-7 text-slate-700 dark:text-slate-300">
              {r.corpo.map((p, i) => (
                <p key={i} className="text-justify">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Assinatura */}
          <footer className="mt-10 flex flex-col items-center gap-1 border-t border-dashed border-slate-200 pt-6 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">
              São Paulo, {r.emitidoEm}
            </div>
            <div className="mt-4 w-56 border-t border-slate-400 dark:border-slate-600" />
            <div className="text-xs font-medium text-slate-800 dark:text-slate-100">
              {medico.nome}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {medico.crm}
              {medico.rqe ? ` · ${medico.rqe}` : ''}
            </div>
            <div className="mt-3 text-[10px] text-slate-400">
              Documento assinado digitalmente (ICP-Brasil) · validação em nymos.app/verificar/
              {r.numero.toLowerCase()}
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wide text-slate-400">{rotulo}</dt>
      <dd className="truncate font-medium text-slate-700 dark:text-slate-200">{valor}</dd>
    </div>
  )
}
