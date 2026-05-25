import { CreditCard, Check, MoreHorizontal, Star, Plus, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type {
  CardBrand,
  CurrentPlan,
  PaymentMethod,
} from '@/../product/sections/configura-es-paciente/types'
import { Toggle } from './Toggle'

interface BillingSectionProps {
  currentPlan: CurrentPlan
  paymentMethods: PaymentMethod[]
  onChangePlan: () => void
  onCancelSubscription: () => void
  onToggleAutoRenew: (next: boolean) => void
  onAddPaymentMethod: () => void
  onSetDefaultPaymentMethod?: (id: string) => void
  onRemovePaymentMethod?: (id: string) => void
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'BRL') {
    return `R$ ${price.toFixed(2).replace('.', ',')}`
  }
  if (currency === 'USD') return `US$ ${price.toFixed(2)}`
  if (currency === 'EUR') return `€ ${price.toFixed(2)}`
  return `${currency} ${price.toFixed(2)}`
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const BRAND_COLORS: Record<CardBrand, string> = {
  visa: 'from-blue-600 via-blue-700 to-indigo-800',
  mastercard: 'from-orange-500 via-red-500 to-rose-600',
  amex: 'from-sky-500 via-cyan-600 to-blue-700',
  elo: 'from-yellow-500 via-amber-600 to-orange-700',
  hipercard: 'from-red-600 via-rose-700 to-rose-800',
  diners: 'from-slate-700 via-slate-800 to-slate-900',
  discover: 'from-orange-400 via-orange-500 to-amber-600',
  jcb: 'from-emerald-500 via-teal-600 to-cyan-700',
  unionpay: 'from-blue-500 via-red-500 to-blue-700',
}

const BRAND_LABELS: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
  elo: 'ELO',
  hipercard: 'Hipercard',
  diners: 'Diners',
  discover: 'Discover',
  jcb: 'JCB',
  unionpay: 'UnionPay',
}

const PLAN_TYPE_STYLES = {
  free: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  premium: 'bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-500/30',
  professional: 'bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-500/20 dark:text-violet-200 dark:ring-violet-500/30',
}

const PLAN_STATUS_LABELS = {
  active: 'Ativo',
  cancelled: 'Cancelado',
  expired: 'Expirado',
}

const PLAN_STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
  expired: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

function PaymentMethodCard({
  method,
  onSetDefault,
  onRemove,
}: {
  method: PaymentMethod
  onSetDefault?: () => void
  onRemove?: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="group relative">
      <div
        className={`relative aspect-[1.586/1] overflow-hidden rounded-2xl bg-gradient-to-br ${BRAND_COLORS[method.brand]} p-5 text-white shadow-lg ring-1 ring-black/5`}
      >
        {/* Decorative shine */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-12 items-center justify-center rounded-md bg-yellow-400/90 shadow-sm">
              <div className="h-6 w-9 rounded-sm bg-yellow-600/30 ring-1 ring-yellow-700/40" />
            </div>
            {method.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-sm">
                <Star className="h-2.5 w-2.5 fill-current" />
                Padrão
              </span>
            )}
          </div>

          <div>
            <p className="font-mono text-lg tracking-[0.2em] text-white/90">
              •••• {method.last4}
            </p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-60">
                  Válido até
                </p>
                <p className="font-mono text-xs font-semibold">
                  {String(method.expiryMonth).padStart(2, '0')}/
                  {String(method.expiryYear).slice(-2)}
                </p>
              </div>
              <span className="font-mono text-sm font-bold tracking-wider">
                {BRAND_LABELS[method.brand]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu kebab */}
      <div className="absolute right-2 top-2" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white"
          aria-label="Opções"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 z-10 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800">
            {!method.isDefault && (
              <button
                type="button"
                onClick={() => {
                  onSetDefault?.()
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Star className="h-3.5 w-3.5" />
                Definir como padrão
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onRemove?.()
                setMenuOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              Remover cartão
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function BillingSection({
  currentPlan,
  paymentMethods,
  onChangePlan,
  onCancelSubscription,
  onToggleAutoRenew,
  onAddPaymentMethod,
  onSetDefaultPaymentMethod,
  onRemovePaymentMethod,
}: BillingSectionProps) {
  const visibleFeatures = currentPlan.features.slice(0, 5)
  const hiddenCount = currentPlan.features.length - visibleFeatures.length
  const isFree = currentPlan.type === 'free'

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-300/10 to-transparent blur-3xl dark:from-teal-500/20 dark:via-emerald-500/10"
        />
        <div className="relative grid gap-6 p-6 md:p-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${PLAN_TYPE_STYLES[currentPlan.type]}`}
              >
                <Sparkles className="h-3 w-3" />
                {currentPlan.type}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${PLAN_STATUS_STYLES[currentPlan.status]}`}
              >
                {PLAN_STATUS_LABELS[currentPlan.status]}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {currentPlan.name}
            </h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-slate-900 dark:text-slate-50">
                {formatPrice(currentPlan.price, currentPlan.currency)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                / {currentPlan.interval === 'month' ? 'mês' : 'ano'}
              </span>
            </div>
            {!isFree && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Próxima cobrança em{' '}
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(currentPlan.nextBilling)}
                </span>
              </p>
            )}
          </div>

          <div className="md:min-w-[240px]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              O que está incluído
            </p>
            <ul className="mt-2 space-y-1.5">
              {visibleFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={3}
                  />
                  {feature}
                </li>
              ))}
              {hiddenCount > 0 && (
                <li className="text-xs font-medium text-teal-700 dark:text-teal-400">
                  + {hiddenCount} mais
                </li>
              )}
            </ul>
          </div>
        </div>

        {!isFree && (
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <Toggle
                checked={currentPlan.autoRenew}
                onChange={onToggleAutoRenew}
                label="Renovação automática"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Renovação automática
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentPlan.autoRenew
                    ? 'Será renovado automaticamente'
                    : 'Sem renovação — acesso até a próxima cobrança'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onChangePlan}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                Trocar plano
              </button>
              <button
                type="button"
                onClick={onCancelSubscription}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                Cancelar assinatura
              </button>
            </div>
          </div>
        )}

        {isFree && (
          <div className="relative border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
            <button
              type="button"
              onClick={onChangePlan}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Fazer upgrade
            </button>
          </div>
        )}
      </section>

      {/* Payment methods */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Métodos de pagamento
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cartões cadastrados para cobrança
            </p>
          </div>
          <button
            type="button"
            onClick={onAddPaymentMethod}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar cartão
          </button>
        </header>
        <div className="p-6">
          {paymentMethods.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <CreditCard className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Nenhum método de pagamento
              </p>
              <button
                type="button"
                onClick={onAddPaymentMethod}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar primeiro cartão
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onSetDefault={() => onSetDefaultPaymentMethod?.(method.id)}
                  onRemove={() => onRemovePaymentMethod?.(method.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
