import { useState } from 'react'
import data from '@/../product-clinic/sections/categorias-financeiras/data.json'
import type {
  CategoriasData,
  TipoFinanceiro,
} from '@/../product-clinic/sections/categorias-financeiras/types'
import { CategoriasView, TipoModal, type FiltroComp } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let tipoSeq = 0

export default function CategoriasFinanceirasPreview() {
  const base = data as unknown as CategoriasData

  const [tipos, setTipos] = useState<TipoFinanceiro[]>(base.tipos)
  const [filtroDespesa, setFiltroDespesa] = useState<FiltroComp>('todas')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<TipoFinanceiro | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const abrirNovo = () => {
    setEditando(null)
    setModalAberto(true)
  }
  const abrirEditar = (t: TipoFinanceiro) => {
    setEditando(t)
    setModalAberto(true)
  }

  const salvar = (dados: Omit<TipoFinanceiro, 'id'>, id: string | null) => {
    if (id) {
      setTipos((prev) => prev.map((t) => (t.id === id ? { ...t, ...dados } : t)))
      pushToast(`Tipo "${dados.nome}" atualizado`)
    } else {
      setTipos((prev) => [{ ...dados, id: `novo-${++tipoSeq}` }, ...prev])
      pushToast(`Tipo "${dados.nome}" criado`)
    }
    setModalAberto(false)
    setEditando(null)
  }

  const excluir = (t: TipoFinanceiro) => {
    setTipos((prev) => prev.filter((x) => x.id !== t.id))
    pushToast(`Tipo "${t.nome}" excluído`)
  }

  const toggleAtivo = (t: TipoFinanceiro) => {
    setTipos((prev) => prev.map((x) => (x.id === t.id ? { ...x, ativo: !x.ativo } : x)))
    pushToast(`"${t.nome}" ${t.ativo ? 'desativado' : 'reativado'}`)
  }

  return (
    <>
      <CategoriasView
        dados={base}
        tipos={tipos}
        filtroDespesa={filtroDespesa}
        onFiltroDespesa={setFiltroDespesa}
        onNovo={abrirNovo}
        onEditar={abrirEditar}
        onExcluir={excluir}
        onToggleAtivo={toggleAtivo}
      />

      {modalAberto && (
        <TipoModal
          key={editando?.id ?? 'novo'}
          tipo={editando}
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
