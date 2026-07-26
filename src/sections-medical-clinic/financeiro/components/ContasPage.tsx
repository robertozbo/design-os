import { useState } from 'react'
import type {
  Conta,
  FinanceiroData,
  TipoConta,
} from '@/../product-medical-clinic/sections/financeiro/types'
import { ConfirmarPagamentoModal } from './ConfirmarPagamentoModal'
import { FinanceiroView, type FiltroFinanceiro } from './FinanceiroView'
import { NovaContaModal } from './NovaContaModal'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let contaSeq = 0

const FILTRO_VAZIO = (base: FinanceiroData): FiltroFinanceiro => ({
  de: base.periodo.de,
  ate: base.periodo.ate,
  status: 'todos',
  busca: '',
})

/** Página de Contas a Receber ou a Pagar (rota própria, sem abas). */
export function ContasPage({ tipo, dados }: { tipo: TipoConta; dados: FinanceiroData }) {
  const [contas, setContas] = useState<Conta[]>(dados.contas)
  const [filtro, setFiltro] = useState<FiltroFinanceiro>(FILTRO_VAZIO(dados))
  const [novaAberta, setNovaAberta] = useState(false)
  const [pagando, setPagando] = useState<Conta | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const confirmarPagamento = (id: string, pagoEm: string) => {
    const c = contas.find((x) => x.id === id)
    setContas((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'pago', pagoEm } : x)))
    setPagando(null)
    pushToast(`Pagamento de ${c?.contraparte ?? c?.descricao ?? 'conta'} confirmado`)
  }

  const excluir = (id: string) => {
    const c = contas.find((x) => x.id === id)
    setContas((prev) => prev.filter((x) => x.id !== id))
    pushToast(`Conta "${c?.descricao ?? ''}" excluída`)
  }

  const salvarNova = (nova: Omit<Conta, 'id'>) => {
    setContas((prev) => [{ ...nova, id: `nova-${++contaSeq}` }, ...prev])
    setNovaAberta(false)
    // Garante que a nova conta fique visível: período abrangendo o vencimento.
    setFiltro((f) => ({
      ...f,
      status: 'todos',
      de: nova.vencimento < f.de ? nova.vencimento : f.de,
      ate: nova.vencimento > f.ate ? nova.vencimento : f.ate,
    }))
    pushToast(`Conta a ${nova.tipo === 'receber' ? 'receber' : 'pagar'} adicionada`)
  }

  return (
    <>
      <FinanceiroView
        dados={dados}
        contas={contas}
        tipo={tipo}
        filtro={filtro}
        onFiltro={setFiltro}
        onLimpar={() => setFiltro(FILTRO_VAZIO(dados))}
        onNova={() => setNovaAberta(true)}
        onConfirmar={(c) => setPagando(c)}
        onExcluir={excluir}
        onAcao={pushToast}
      />

      {novaAberta && (
        <NovaContaModal
          tipo={tipo}
          dados={dados}
          onSalvar={salvarNova}
          onFechar={() => setNovaAberta(false)}
        />
      )}

      {pagando && (
        <ConfirmarPagamentoModal
          key={pagando.id}
          conta={pagando}
          hoje={dados.hoje}
          onConfirmar={confirmarPagamento}
          onFechar={() => setPagando(null)}
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
