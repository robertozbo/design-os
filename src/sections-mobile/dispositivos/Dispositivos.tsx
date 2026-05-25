import { useEffect, useState } from 'react'
import data from '@/../product-mobile/sections/dispositivos/data.json'
import type { DispositivosData, FiltroStatus } from '@/../product-mobile/sections/dispositivos/types'
import { Dispositivos as DispositivosComponent } from './components/Dispositivos'
import { NovoDispositivoModal } from './components/NovoDispositivoModal'

function setOverlay(node: React.ReactNode | null) {
  window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node } }))
}

export default function DispositivosPreview() {
  const baseData = data as unknown as DispositivosData
  const [selectedFiltro, setSelectedFiltro] = useState<FiltroStatus>('todos')
  const [pickerOpen, setPickerOpen] = useState(false)

  // Listen to header "+" button click via custom event
  useEffect(() => {
    const handler = () => setPickerOpen(true)
    window.addEventListener('nymos:open-add', handler)
    return () => window.removeEventListener('nymos:open-add', handler)
  }, [])

  // Push the modal into the MobileFrame overlay slot
  useEffect(() => {
    if (pickerOpen) {
      setOverlay(
        <NovoDispositivoModal
          open={pickerOpen}
          onClose={() => {
            setPickerOpen(false)
            setOverlay(null)
          }}
          categorias={baseData.categoriasPicker}
          onIntegracaoSelecionada={(deviceType) => {
            setPickerOpen(false)
            setOverlay(null)
            console.log('Conectar integração:', deviceType)
          }}
        />,
      )
    } else {
      setOverlay(null)
    }
    return () => setOverlay(null)
  }, [pickerOpen, baseData.categoriasPicker])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true">
        <DispositivosComponent
          data={baseData}
          selectedFiltro={selectedFiltro}
          onFiltroChange={setSelectedFiltro}
          onDispositivoClick={(id) => console.log('Open device:', id)}
          onSincronizarDispositivo={(id) => console.log('Sync device:', id)}
          onAdicionarClick={() => setPickerOpen(true)}
          onIntegracaoSelecionada={(deviceType) => console.log('Conectar integração:', deviceType)}
        />
      </div>
    </>
  )
}
