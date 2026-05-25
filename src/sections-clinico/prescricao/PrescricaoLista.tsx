import { useMemo, useState } from 'react'
import data from '@/../product-clinico/sections/prescricao/data.json'
import type {
  FiltroLista,
  MotivoCancelamento,
  PacienteSelector,
  PrescricaoDetalhe,
  PrescricaoListItem,
  PrescricaoKpis,
} from '@/../product-clinico/sections/prescricao/types'
import {
  CancelamentoModal,
  MemedEmbedModal,
  NovaPrescricaoModal,
  PrescricaoDrawer,
  PrescricaoLista,
  type MemedContexto,
} from './components'

interface ToastMsg {
  id: number
  texto: string
  tone: 'success' | 'info'
}

let toastSeq = 0

export default function PrescricaoListaPreview() {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroLista>(
    data.filtroAtivo as FiltroLista,
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cancelandoId, setCancelandoId] = useState<string | null>(null)
  const [novaOpen, setNovaOpen] = useState(false)
  const [memedCtx, setMemedCtx] = useState<MemedContexto>(null)
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  const detalhes = data.prescricoesDetalhes as Record<string, PrescricaoDetalhe>
  const lista = data.prescricoesLista as PrescricaoListItem[]
  const pacientes = data.pacientesParaNovaPrescricao as PacienteSelector[]
  const kpis = data.kpis as PrescricaoKpis

  const detalheSelecionado = useMemo(
    () => (selectedId ? (detalhes[selectedId] ?? null) : null),
    [detalhes, selectedId],
  )

  const detalheCancelando = useMemo(
    () => (cancelandoId ? (detalhes[cancelandoId] ?? null) : null),
    [detalhes, cancelandoId],
  )

  const pushToast = (texto: string, tone: ToastMsg['tone'] = 'success') => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto, tone }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const abrirRenovacao = (prescricaoId: string) => {
    const det = detalhes[prescricaoId]
    const item = lista.find((p) => p.id === prescricaoId)
    const meds = det
      ? det.itens.map((i) => `${i.medicamento} · ${i.dose} · ${i.posologia}`)
      : item?.medicamentosResumo.map((m) => m.nome) ?? []
    const pacienteNome = det?.pacienteNome ?? item?.pacienteNome ?? 'Paciente'
    setMemedCtx({ tipo: 'renovacao', pacienteNome, medicamentos: meds })
    console.log('abrir renovação:', prescricaoId)
  }

  const abrirNovaPrescricaoFluxo = () => {
    setNovaOpen(true)
  }

  const selecionarPacientePraNova = (pacienteId: string) => {
    const p = pacientes.find((x) => x.id === pacienteId)
    setNovaOpen(false)
    setMemedCtx({ tipo: 'nova', pacienteNome: p?.nome ?? 'Paciente' })
    console.log('nova prescrição pra:', pacienteId)
  }

  const confirmarCancelamento = (
    prescricaoId: string,
    motivo: MotivoCancelamento,
    justificativa: string,
  ) => {
    console.log('cancelamento confirmado:', { prescricaoId, motivo, justificativa })
    setCancelandoId(null)
    setSelectedId(null)
    pushToast('Receita cancelada — registro no Memed e audit log')
  }

  const emitirMemed = () => {
    const tipo = memedCtx?.tipo
    setMemedCtx(null)
    if (tipo === 'renovacao') {
      pushToast('Receita renovada — paciente notificado no app')
    } else {
      pushToast('Receita emitida — paciente notificado no app')
    }
    setSelectedId(null)
  }

  return (
    <>
      <PrescricaoLista
        filtroAtivo={filtroAtivo}
        kpis={kpis}
        prescricoesLista={lista}
        onSelectPrescricao={(id) => setSelectedId(id)}
        onAbrirRenovacao={abrirRenovacao}
        onAbrirNovaPrescricao={abrirNovaPrescricaoFluxo}
        onChangeFiltro={(f) => setFiltroAtivo(f)}
      />

      <PrescricaoDrawer
        prescricao={detalheSelecionado}
        onClose={() => setSelectedId(null)}
        onAbrirPdf={() => {
          console.log('abrir PDF Memed:', selectedId)
          pushToast('Abrindo PDF do Memed em nova aba…', 'info')
        }}
        onRenovar={() => selectedId && abrirRenovacao(selectedId)}
        onCancelar={() => {
          if (selectedId) setCancelandoId(selectedId)
        }}
        onAbrirConsulta={() => {
          console.log('abrir consulta vinculada:', detalheSelecionado?.consultaId)
          pushToast('Navegando pra consulta vinculada…', 'info')
        }}
      />

      <CancelamentoModal
        prescricao={detalheCancelando}
        onClose={() => setCancelandoId(null)}
        onConfirmar={(motivo, justif) =>
          cancelandoId && confirmarCancelamento(cancelandoId, motivo, justif)
        }
      />

      <NovaPrescricaoModal
        open={novaOpen}
        pacientes={pacientes}
        onClose={() => setNovaOpen(false)}
        onSelecionar={selecionarPacientePraNova}
      />

      <MemedEmbedModal
        contexto={memedCtx}
        onClose={() => setMemedCtx(null)}
        onEmitir={emitirMemed}
      />

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto w-full rounded-xl border px-4 py-2.5 text-sm shadow-lg backdrop-blur-sm
              ${
                t.tone === 'success'
                  ? 'border-emerald-200/80 bg-emerald-50/95 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100'
                  : 'border-slate-200/80 bg-white/95 text-slate-700 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200'
              }
            `}
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
