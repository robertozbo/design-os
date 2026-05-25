import { useMemo, useState } from 'react'
import {
  X,
  CreditCard,
  Lock,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import type {
  CicloFaturamento,
  PlanoTier,
  PlanoTierConfig,
} from '@/../product-mobile/sections/plano/types'

interface CheckoutSheetProps {
  tierConfig: PlanoTierConfig
  ciclo: CicloFaturamento
  /** Email do usuário (read-only, vem da conta) */
  emailUsuario: string
  onClose: () => void
  /**
   * Em produção, esse callback dispara a integração real:
   * 1. POST /payment/stripe/subscription com stripePriceId → recebe clientSecret
   * 2. Stripe.js tokeniza os dados do cartão (não passam pelo nosso servidor)
   * 3. confirmCardPayment(clientSecret, paymentMethod)
   * 4. Webhook customer.subscription.updated atualiza userPlans
   */
  onConfirmar?: (payload: {
    tier: PlanoTier
    ciclo: CicloFaturamento
    stripePriceId: string
  }) => void
}

type Estado = 'form' | 'processando' | 'sucesso' | 'erro'

export function CheckoutSheet({ tierConfig, ciclo, emailUsuario, onClose, onConfirmar }: CheckoutSheetProps) {
  const [estado, setEstado] = useState<Estado>('form')
  const [errorMsg, setErrorMsg] = useState('')

  const [numeroCartao, setNumeroCartao] = useState('')
  const [validade, setValidade] = useState('')
  const [cvv, setCvv] = useState('')
  const [nomeTitular, setNomeTitular] = useState('')
  const [cpf, setCpf] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)

  const preco = ciclo === 'monthly' || !tierConfig.precoAnual ? tierConfig.precoMensal : tierConfig.precoAnual
  const stripePriceId = preco.stripePriceId ?? ''

  const numeroLimpo = numeroCartao.replace(/\s/g, '')
  const bandeira = detectBrand(numeroLimpo)

  const formularioValido = useMemo(() => {
    if (!aceitouTermos) return false
    if (numeroLimpo.length < 13) return false
    if (!/^\d{2}\/\d{2}$/.test(validade)) return false
    if (cvv.length < 3) return false
    if (nomeTitular.trim().length < 3) return false
    if (cpf.replace(/\D/g, '').length !== 11) return false
    return true
  }, [numeroLimpo, validade, cvv, nomeTitular, cpf, aceitouTermos])

  const submeter = () => {
    if (!formularioValido) return
    setEstado('processando')
    setTimeout(() => {
      // Em produção: confirmCardPayment via Stripe.js com clientSecret
      // Mock: 80% sucesso, 20% erro pra demonstrar ambos os fluxos
      if (Math.random() > 0.2) {
        setEstado('sucesso')
        onConfirmar?.({ tier: tierConfig.tier, ciclo, stripePriceId })
      } else {
        setErrorMsg('Cartão recusado pelo banco. Tente outro método.')
        setEstado('erro')
      }
    }, 1800)
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col" data-nymos-mobile="true">
      <div className="h-12 shrink-0" />

      <div className="px-4 h-[64px] shrink-0 flex items-center gap-3 border-b border-slate-900">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Fechar"
        >
          <X size={17} strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Checkout
          </div>
          <div className="text-slate-100 font-semibold text-[14px] truncate leading-tight">
            Assinar {tierConfig.label} · {ciclo === 'monthly' ? 'Mensal' : 'Anual'}
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 shrink-0">
          <Lock size={11} strokeWidth={2.4} />
          <span className="text-[10px] font-semibold">SSL</span>
        </div>
      </div>

      {estado === 'sucesso' ? (
        <SucessoView tierConfig={tierConfig} preco={preco.label} onClose={onClose} />
      ) : estado === 'processando' ? (
        <ProcessandoView />
      ) : (
        <FormularioView
          tierConfig={tierConfig}
          ciclo={ciclo}
          precoLabel={preco.label}
          emailUsuario={emailUsuario}
          numeroCartao={numeroCartao}
          setNumeroCartao={setNumeroCartao}
          validade={validade}
          setValidade={setValidade}
          cvv={cvv}
          setCvv={setCvv}
          nomeTitular={nomeTitular}
          setNomeTitular={setNomeTitular}
          cpf={cpf}
          setCpf={setCpf}
          aceitouTermos={aceitouTermos}
          setAceitouTermos={setAceitouTermos}
          bandeira={bandeira}
          formularioValido={formularioValido}
          erro={estado === 'erro' ? errorMsg : null}
          onSubmeter={submeter}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface FormularioViewProps {
  tierConfig: PlanoTierConfig
  ciclo: CicloFaturamento
  precoLabel: string
  emailUsuario: string
  numeroCartao: string
  setNumeroCartao: (v: string) => void
  validade: string
  setValidade: (v: string) => void
  cvv: string
  setCvv: (v: string) => void
  nomeTitular: string
  setNomeTitular: (v: string) => void
  cpf: string
  setCpf: (v: string) => void
  aceitouTermos: boolean
  setAceitouTermos: (v: boolean) => void
  bandeira: string | null
  formularioValido: boolean
  erro: string | null
  onSubmeter: () => void
}

function FormularioView(props: FormularioViewProps) {
  const {
    tierConfig,
    ciclo,
    precoLabel,
    emailUsuario,
    numeroCartao,
    setNumeroCartao,
    validade,
    setValidade,
    cvv,
    setCvv,
    nomeTitular,
    setNomeTitular,
    cpf,
    setCpf,
    aceitouTermos,
    setAceitouTermos,
    bandeira,
    formularioValido,
    erro,
    onSubmeter,
  } = props

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-500/10 border border-slate-800 p-3.5">
          <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-2">
            Resumo do pedido
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-300 shrink-0">
              <Sparkles size={16} strokeWidth={2.4} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-100 font-bold text-[14px]">Plano {tierConfig.label}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                {ciclo === 'monthly' ? 'Cobrança mensal · cancele quando quiser' : 'Cobrança anual · 20% off'}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[12px] font-medium">Total</span>
            <span className="text-slate-100 font-bold text-[18px] font-mono tabular-nums">{precoLabel}</span>
          </div>
        </div>

        {erro && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-rose-300 mt-0.5 shrink-0" strokeWidth={2.2} />
            <div className="min-w-0">
              <div className="text-rose-200 text-[12.5px] font-semibold">Pagamento não autorizado</div>
              <div className="text-rose-200/70 text-[11px] mt-0.5 leading-snug">{erro}</div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
              Dados do cartão
            </span>
            <BrandIcons />
          </div>

          <CardField label="Número do cartão">
            <div className="relative flex items-center">
              <CreditCard size={14} className="absolute left-3 text-slate-500 shrink-0" strokeWidth={2.2} />
              <input
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(formatCartao(e.target.value))}
                maxLength={23}
                className="w-full h-11 pl-9 pr-14 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700 font-mono tabular-nums"
              />
              {bandeira && (
                <div className="absolute right-3 px-2 h-6 rounded bg-slate-800 text-slate-200 text-[10px] font-bold uppercase font-mono flex items-center">
                  {bandeira}
                </div>
              )}
            </div>
          </CardField>

          <div className="grid grid-cols-2 gap-2">
            <CardField label="Validade">
              <input
                inputMode="numeric"
                placeholder="MM/AA"
                value={validade}
                onChange={(e) => setValidade(formatValidade(e.target.value))}
                maxLength={5}
                className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700 font-mono tabular-nums"
              />
            </CardField>
            <CardField label="CVV" hint="3 dígitos no verso">
              <input
                inputMode="numeric"
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700 font-mono tabular-nums"
              />
            </CardField>
          </div>

          <CardField label="Nome no cartão">
            <input
              placeholder="ROBERTO ZBORALSKI"
              value={nomeTitular}
              onChange={(e) => setNomeTitular(e.target.value.toUpperCase())}
              className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700"
            />
          </CardField>

          <CardField label="CPF" hint="Necessário pra emissão de nota fiscal">
            <input
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              maxLength={14}
              className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700 font-mono tabular-nums"
            />
          </CardField>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
            @
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              Email pra recibo
            </div>
            <div className="text-slate-100 text-[12.5px] font-medium truncate">{emailUsuario}</div>
          </div>
        </div>

        <button
          onClick={() => setAceitouTermos(!aceitouTermos)}
          className="w-full flex items-start gap-2.5 text-left px-1"
        >
          <div
            className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
              aceitouTermos ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-700 bg-slate-900'
            }`}
          >
            {aceitouTermos && <Check size={11} strokeWidth={3.4} />}
          </div>
          <span className="text-slate-400 text-[11px] leading-snug">
            Concordo com os <span className="text-teal-300 underline">Termos de Uso</span> e{' '}
            <span className="text-teal-300 underline">Política de Privacidade</span>. Autorizo a cobrança
            recorrente em meu cartão até cancelar.
          </span>
        </button>

        <div className="flex flex-col items-center gap-1.5 pt-2">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck size={11} strokeWidth={2.4} />
            <span className="text-[10.5px] font-medium">Pagamento processado pela Stripe</span>
          </div>
          <span className="text-slate-700 text-[9.5px] font-mono">
            Seus dados nunca passam pelos nossos servidores
          </span>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-900 bg-slate-950 shrink-0">
        <button
          disabled={!formularioValido}
          onClick={onSubmeter}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-[14px] flex items-center justify-center gap-2 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
        >
          <Lock size={13} strokeWidth={2.6} />
          Pagar {precoLabel}
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function ProcessandoView() {
  return (
    <div className="flex-1 flex items-center justify-center px-5 py-12">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center animate-pulse">
          <Lock size={26} className="text-white" strokeWidth={2.4} />
        </div>
        <div className="text-slate-100 font-semibold text-[14px] mt-3">Processando pagamento</div>
        <div className="text-slate-500 text-[11.5px] mt-1">Confirmando com seu banco...</div>
      </div>
    </div>
  )
}

interface SucessoViewProps {
  tierConfig: PlanoTierConfig
  preco: string
  onClose: () => void
}

function SucessoView({ tierConfig, preco, onClose }: SucessoViewProps) {
  return (
    <div className="flex-1 flex flex-col px-5 py-12 items-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 flex items-center justify-center text-emerald-300 mb-4">
        <Check size={36} strokeWidth={3} />
      </div>
      <div className="text-slate-100 font-bold text-[20px]">Bem-vindo ao {tierConfig.label}!</div>
      <div className="text-slate-400 text-[12.5px] mt-2 leading-snug max-w-[280px]">
        Pagamento de <span className="font-mono font-semibold">{preco}</span> aprovado.
        Sua assinatura já está ativa.
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mt-6 w-full max-w-[280px] space-y-2.5">
        <CheckLine texto={`${tierConfig.label} ativado`} />
        <CheckLine texto="Recibo enviado por email" />
        <CheckLine texto="Acesso liberado agora" />
      </div>

      <div className="mt-auto pt-6 w-full">
        <button
          onClick={onClose}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px]"
        >
          Começar a usar
        </button>
      </div>
    </div>
  )
}

function CheckLine({ texto }: { texto: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
        <Check size={11} strokeWidth={3} />
      </div>
      <span className="text-slate-200 text-[12px]">{texto}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface CardFieldProps {
  label: string
  hint?: string
  children: React.ReactNode
}

function CardField({ label, hint, children }: CardFieldProps) {
  return (
    <div>
      <label className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1 block">
        {label}
      </label>
      {children}
      {hint && <div className="text-slate-600 text-[10px] mt-1">{hint}</div>}
    </div>
  )
}

function BrandIcons() {
  return (
    <div className="flex items-center gap-1">
      {['VISA', 'MC', 'ELO', 'AMEX'].map((b) => (
        <span
          key={b}
          className="px-1.5 h-4 rounded bg-slate-800 text-slate-500 text-[8.5px] font-bold flex items-center"
        >
          {b}
        </span>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function detectBrand(numero: string): string | null {
  if (!numero) return null
  if (/^4/.test(numero)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(numero)) return 'Master'
  if (/^3[47]/.test(numero)) return 'Amex'
  if (/^(4011|4312|4389|4514|4573|5041|5066|5067|6362|6363|6504|6505|6506|6509|6516|6550)/.test(numero))
    return 'Elo'
  if (/^6(011|22|4|5)/.test(numero)) return 'Discover'
  return null
}

function formatCartao(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatValidade(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function formatCpf(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}
