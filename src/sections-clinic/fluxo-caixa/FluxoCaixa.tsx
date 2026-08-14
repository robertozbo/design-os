import { useMemo, useState } from 'react'
import data from '@/../product-clinic/sections/fluxo-caixa/data.json'
import type { FluxoCaixaData, ModoFluxo } from '@/../product-clinic/sections/fluxo-caixa/types'
import { FluxoCaixaView, montarDias } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function FluxoCaixaPreview() {
  const base = data as unknown as FluxoCaixaData

  const [modo, setModo] = useState<ModoFluxo>('completo')
  const [abertos, setAbertos] = useState<string[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  // Os dias, o saldo e o alerta saem daqui — o JSON só tem lançamento solto.
  const dias = useMemo(() => montarDias(base, modo), [base, modo])

  const alternarDia = (dataDia: string) =>
    setAbertos((prev) => (prev.includes(dataDia) ? prev.filter((d) => d !== dataDia) : [...prev, dataDia]))

  return (
    <>
      <FluxoCaixaView
        dados={base}
        dias={dias}
        modo={modo}
        abertos={abertos}
        onTrocarModo={setModo}
        onNavegarMes={(passo) =>
          pushToast(passo === -1 ? 'Mês anterior (protótipo: só julho tem dados)' : 'Próximo mês (protótipo: só julho tem dados)')
        }
        onMesAtual={() => pushToast('Voltou para o mês atual')}
        onAbrirDia={alternarDia}
        onVerLancamento={(id) => {
          const l = base.lancamentos.find((x) => x.id === id)
          pushToast(
            l
              ? `"${l.descricao}" abre em Contas a ${l.tipo === 'receber' ? 'receber' : 'pagar'}`
              : 'Lançamento não encontrado',
          )
        }}
      />

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
