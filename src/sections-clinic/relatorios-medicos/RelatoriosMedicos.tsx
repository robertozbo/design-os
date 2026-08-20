import { useState } from 'react'
import data from '@/../product-clinic/sections/relatorios-medicos/data.json'
import type {
  FiltroTipo,
  Relatorio,
  RelatorioMedicoData,
} from '@/../product-clinic/sections/relatorios-medicos/types'
import {
  EnviarEmailModal,
  NovoRelatorioModal,
  RelatorioPreview,
  RelatoriosMedicosView,
  TIPO_LABEL,
  preencherModelo,
  proximoNumero,
  type EnvioEmail,
  type NovoRelatorio,
} from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

/** Data fixa do protótipo — a base de dados vive em agosto/2026. */
const HOJE = '20 ago 2026'

function horaAgora(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function RelatoriosMedicosPreview() {
  const base = data as unknown as RelatorioMedicoData

  const [relatorios, setRelatorios] = useState<Relatorio[]>(base.relatorios)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FiltroTipo>('todos')
  const [novoAberto, setNovoAberto] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [emailId, setEmailId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const preview = relatorios.find((r) => r.id === previewId) ?? null
  const alvoEmail = relatorios.find((r) => r.id === emailId) ?? null

  const gerar = ({ pacienteId, tipo, consultaId, dias }: NovoRelatorio) => {
    const paciente = base.pacientes.find((p) => p.id === pacienteId)
    const modelo = base.modelos.find((m) => m.tipo === tipo)
    const consulta = paciente?.consultas.find((c) => c.id === consultaId)
    if (!paciente || !modelo || !consulta) return

    const { consultas: _consultas, ...pacienteRef } = paciente

    const novo: Relatorio = {
      id: `rel-${Date.now()}`,
      numero: proximoNumero(relatorios.map((r) => r.numero)),
      tipo: modelo.tipo,
      titulo: modelo.titulo,
      paciente: pacienteRef,
      consultaData: consulta.data,
      consultaDataLabel: consulta.dataLabel,
      motivo: consulta.motivo,
      cid: consulta.cid,
      corpo: preencherModelo(modelo, {
        paciente,
        consulta,
        medico: base.medicoLogado.nome,
        crm: base.medicoLogado.crm,
        especialidade: base.medicoLogado.especialidade,
        clinica: base.clinica.nome,
        dias,
        primeiraConsulta: paciente.consultas[paciente.consultas.length - 1] ?? consulta,
      }),
      status: 'emitido',
      emitidoEm: HOJE,
      enviadoPara: null,
      enviadoEm: null,
    }

    setRelatorios((prev) => [novo, ...prev])
    setNovoAberto(false)
    setPreviewId(novo.id)
    pushToast(`${modelo.titulo} ${novo.numero} gerado`)
  }

  const salvarTexto = (id: string, corpo: string[]) => {
    setRelatorios((prev) => prev.map((r) => (r.id === id ? { ...r, corpo } : r)))
    pushToast('Texto atualizado — nova versão no audit log')
  }

  const baixarPdf = (r: Relatorio) => {
    pushToast(`PDF gerado: ${r.numero.toLowerCase()}.pdf (mock)`)
  }

  const confirmarEnvio = (envio: EnvioEmail) => {
    if (!alvoEmail) return
    setRelatorios((prev) =>
      prev.map((r) =>
        r.id === alvoEmail.id
          ? {
              ...r,
              status: 'enviado',
              enviadoPara: envio.para,
              enviadoEm: `${HOJE}, ${horaAgora()}`,
            }
          : r,
      ),
    )
    setEmailId(null)
    pushToast(`${TIPO_LABEL[alvoEmail.tipo]} enviado para ${envio.para}`)
  }

  return (
    <>
      {preview ? (
        <RelatorioPreview
          clinica={base.clinica}
          medico={base.medicoLogado}
          relatorio={preview}
          onVoltar={() => setPreviewId(null)}
          onSalvarTexto={(corpo) => salvarTexto(preview.id, corpo)}
          onPdf={() => baixarPdf(preview)}
          onEnviar={() => setEmailId(preview.id)}
        />
      ) : (
        <RelatoriosMedicosView
          clinica={base.clinica.nome}
          medico={base.medicoLogado}
          relatorios={relatorios}
          busca={busca}
          filtro={filtro}
          onBusca={setBusca}
          onFiltro={setFiltro}
          onNovo={() => setNovoAberto(true)}
          onAbrir={(r) => setPreviewId(r.id)}
          onPdf={baixarPdf}
          onEnviar={(r) => setEmailId(r.id)}
        />
      )}

      {novoAberto && (
        <NovoRelatorioModal
          pacientes={base.pacientes}
          modelos={base.modelos}
          onGerar={gerar}
          onFechar={() => setNovoAberto(false)}
        />
      )}

      {alvoEmail && (
        <EnviarEmailModal
          relatorio={alvoEmail}
          clinica={base.clinica.nome}
          onEnviar={confirmarEnvio}
          onFechar={() => setEmailId(null)}
        />
      )}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
