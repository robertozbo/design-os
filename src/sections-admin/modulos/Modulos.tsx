import { useState } from 'react'
import data from '@/../product-admin/sections/modulos/data.json'
import type { ModulosData } from '@/../product-admin/sections/modulos/types'
import { ModulosView } from './components'

export default function ModulosPreview() {
  const base = data as unknown as ModulosData
  const [toast, setToast] = useState<string | null>(null)

  const avisar = (t: string) => {
    setToast(t)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      <ModulosView
        {...base}
        onAbrir={(secao) => avisar(`Abrir /admin/sections/${secao} (mock)`)}
        onVerContratantes={(id) => avisar(`Clientes filtrado por ${id} (mock)`)}
      />
      {toast && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[70] rounded-lg bg-slate-900 px-3.5 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      )}
    </>
  )
}
