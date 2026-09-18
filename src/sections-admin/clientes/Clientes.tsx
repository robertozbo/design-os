import { useState } from 'react'
import data from '@/../product-admin/sections/clientes/data.json'
import type { ClientesData } from '@/../product-admin/sections/clientes/types'
import { ClientesView, type FiltroSituacao } from './components'

export default function ClientesPreview() {
  const base = data as unknown as ClientesData
  const [filtro, setFiltro] = useState<FiltroSituacao>('todos')
  const [busca, setBusca] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const avisar = (texto: string) => {
    setToast(texto)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      <ClientesView
        {...base}
        filtro={filtro}
        busca={busca}
        onFiltro={setFiltro}
        onBusca={setBusca}
        onAbrir={(id) => avisar(`Abrir workspace ${id} — contrato e uso (mock)`)}
        onCobrar={(id) => avisar(`Régua de cobrança disparada para ${id} (mock)`)}
      />
      {toast && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[70] rounded-lg bg-slate-900 px-3.5 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      )}
    </>
  )
}
