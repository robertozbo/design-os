import { useState } from 'react'
import data from '@/../product-clinic/sections/fornecedores/data.json'
import type {
  Fornecedor,
  FornecedoresData,
} from '@/../product-clinic/sections/fornecedores/types'
import { FornecedorModal, FornecedoresView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let fSeq = 0

export default function FornecedoresPreview() {
  const base = data as unknown as FornecedoresData

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(base.fornecedores)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Fornecedor | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const salvar = (dadosF: Omit<Fornecedor, 'id'>, id: string | null) => {
    if (id) {
      setFornecedores((prev) => prev.map((f) => (f.id === id ? { ...f, ...dadosF } : f)))
      pushToast(`Fornecedor "${dadosF.nomeFantasia}" atualizado`)
    } else {
      setFornecedores((prev) => [{ ...dadosF, id: `novo-${++fSeq}` }, ...prev])
      pushToast(`Fornecedor "${dadosF.nomeFantasia}" cadastrado`)
    }
    setModalAberto(false)
    setEditando(null)
  }

  const excluir = (f: Fornecedor) => {
    setFornecedores((prev) => prev.filter((x) => x.id !== f.id))
    pushToast(`Fornecedor "${f.nomeFantasia}" excluído`)
  }

  const toggleAtivo = (f: Fornecedor) => {
    setFornecedores((prev) => prev.map((x) => (x.id === f.id ? { ...x, ativo: !x.ativo } : x)))
    pushToast(`"${f.nomeFantasia}" ${f.ativo ? 'desativado' : 'reativado'}`)
  }

  return (
    <>
      <FornecedoresView
        dados={base}
        fornecedores={fornecedores}
        busca={busca}
        onBusca={setBusca}
        onNovo={() => {
          setEditando(null)
          setModalAberto(true)
        }}
        onEditar={(f) => {
          setEditando(f)
          setModalAberto(true)
        }}
        onExcluir={excluir}
        onToggleAtivo={toggleAtivo}
      />

      {modalAberto && (
        <FornecedorModal
          key={editando?.id ?? 'novo'}
          fornecedor={editando}
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
