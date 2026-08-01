import { useState } from 'react'
import data from '@/../product-clinic/sections/servicos/data.json'
import type { Servico, ServicosData } from '@/../product-clinic/sections/servicos/types'
import { ServicoModal, ServicosView, type FiltroServicos } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let servicoSeq = 0

export default function ServicosPreview() {
  const base = data as unknown as ServicosData

  const [servicos, setServicos] = useState<Servico[]>(base.servicos)
  const [filtro, setFiltro] = useState<FiltroServicos>({ categoria: 'todas', busca: '' })
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Servico | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const salvar = (dadosServico: Omit<Servico, 'id'>, id: string | null) => {
    if (id) {
      setServicos((prev) => prev.map((s) => (s.id === id ? { ...s, ...dadosServico } : s)))
      pushToast(`Serviço "${dadosServico.nome}" atualizado`)
    } else {
      setServicos((prev) => [{ ...dadosServico, id: `novo-${++servicoSeq}` }, ...prev])
      pushToast(`Serviço "${dadosServico.nome}" criado`)
    }
    setModalAberto(false)
    setEditando(null)
  }

  const excluir = (s: Servico) => {
    setServicos((prev) => prev.filter((x) => x.id !== s.id))
    pushToast(`Serviço "${s.nome}" excluído`)
  }

  const toggleAtivo = (s: Servico) => {
    setServicos((prev) => prev.map((x) => (x.id === s.id ? { ...x, ativo: !x.ativo } : x)))
    pushToast(`"${s.nome}" ${s.ativo ? 'desativado' : 'reativado'}`)
  }

  return (
    <>
      <ServicosView
        dados={base}
        servicos={servicos}
        filtro={filtro}
        onFiltro={setFiltro}
        onNovo={() => {
          setEditando(null)
          setModalAberto(true)
        }}
        onEditar={(s) => {
          setEditando(s)
          setModalAberto(true)
        }}
        onExcluir={excluir}
        onToggleAtivo={toggleAtivo}
      />

      {modalAberto && (
        <ServicoModal
          key={editando?.id ?? 'novo'}
          servico={editando}
          dados={base}
          onSalvar={salvar}
          onFechar={() => {
            setModalAberto(false)
            setEditando(null)
          }}
        />
      )}

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-2.5 text-sm text-emerald-900 shadow-lg backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
