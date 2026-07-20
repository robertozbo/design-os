import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Download,
  Copy,
  Send,
  Receipt,
  X,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Landmark,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type {
  AbaCobranca,
  CobrancaParticular,
  CobrancaProps,
  FiltroCobranca,
  MetodoPagamento,
  PeriodoFiltro,
  StatusCobranca,
  StatusConvenio,
} from '@/../product-clinico/sections/cobranca/types'

function brl(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function dataCurta(iso: string | null): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

const PERIODO_OPCOES: { id: PeriodoFiltro; label: string }[] = [
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '90d', label: '90 dias' },
  { id: 'tudo', label: 'Tudo' },
]

const PERIODO_DIAS: Record<PeriodoFiltro, number | null> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  tudo: null,
}

const STATUS_VISUAL: Record<StatusCobranca, { label: string; cor: string }> = {
  pago: { label: 'Pago', cor: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20' },
  pendente: { label: 'Pendente', cor: 'bg-amber-500/15 text-amber-300 ring-amber-500/20' },
  link_enviado: { label: 'Link enviado', cor: 'bg-sky-500/15 text-sky-300 ring-sky-500/20' },
  cancelado: { label: 'Cancelado', cor: 'bg-slate-500/15 text-slate-400 ring-slate-500/20' },
}

const CONVENIO_VISUAL: Record<StatusConvenio, { label: string; cor: string }> = {
  enviado: { label: 'Enviado', cor: 'bg-sky-500/15 text-sky-300 ring-sky-500/20' },
  em_analise: { label: 'Em análise', cor: 'bg-amber-500/15 text-amber-300 ring-amber-500/20' },
  pago: { label: 'Pago', cor: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20' },
  glosado: { label: 'Glosado', cor: 'bg-rose-500/15 text-rose-300 ring-rose-500/20' },
}

const METODO_VISUAL: Record<MetodoPagamento, { label: string; icon: LucideIcon }> = {
  pix: { label: 'PIX', icon: Landmark },
  cartao: { label: 'Cartão', icon: CreditCard },
  ambos: { label: 'PIX · Cartão', icon: CreditCard },
}

const STATUS_CHIPS: StatusCobranca[] = ['pago', 'pendente', 'link_enviado', 'cancelado']

const FILTRO_INICIAL: FiltroCobranca = { busca: '', status: [], periodo: '30d' }

export function Cobranca({
  data,
  abaAtiva,
  filtro,
  onChangeAba,
  onChangeFiltro,
  onNovoLink,
  onCopiarLink,
  onReenviar,
  onEmitirRecibo,
  onCancelar,
  onStatusConvenioChange,
  onExportarCsv,
}: CobrancaProps) {
  const [abaLocal, setAbaLocal] = useState<AbaCobranca>('particular')
  const [filtroLocal, setFiltroLocal] = useState<FiltroCobranca>(FILTRO_INICIAL)

  const aba = abaAtiva ?? abaLocal
  const f = filtro ?? filtroLocal
  const setAba = (a: AbaCobranca) => (onChangeAba ? onChangeAba(a) : setAbaLocal(a))
  const setFiltro = (nf: FiltroCobranca) => (onChangeFiltro ? onChangeFiltro(nf) : setFiltroLocal(nf))

  const toggleStatus = (s: StatusCobranca) => {
    const next = f.status.includes(s) ? f.status.filter((x) => x !== s) : [...f.status, s]
    setFiltro({ ...f, status: next })
  }

  const particularesFiltradas = useMemo(() => {
    const q = f.busca.trim().toLowerCase()
    const dias = PERIODO_DIAS[f.periodo]
    const corte = dias != null ? Date.now() - dias * 24 * 60 * 60 * 1000 : null
    return data.particulares.filter((c) => {
      if (q && !c.pacienteNome.toLowerCase().includes(q) && !c.descricao.toLowerCase().includes(q))
        return false
      if (corte != null && new Date(`${c.criadaEm}T12:00:00`).getTime() < corte) return false
      if (f.status.length && !f.status.includes(c.status)) return false
      return true
    })
  }, [data.particulares, f])

  const conveniosFiltrados = useMemo(() => {
    const q = f.busca.trim().toLowerCase()
    return data.convenios.filter(
      (c) => !q || c.pacienteNome.toLowerCase().includes(q) || c.convenio.toLowerCase().includes(q),
    )
  }, [data.convenios, f.busca])

  const temFiltro = !!f.busca || f.status.length > 0 || f.periodo !== '30d'

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-slate-50 font-bold text-[24px]">Cobrança</h1>
            <p className="text-slate-400 text-[12.5px] mt-1">
              Links de pagamento, recibos e tracking de convênio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportarCsv?.(aba)}
              className="px-3.5 h-10 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-medium text-[12.5px] flex items-center gap-2 hover:bg-slate-800/60 transition-colors"
            >
              <Download size={13} strokeWidth={2.2} />
              Exportar CSV
            </button>
            <button
              onClick={onNovoLink}
              className="px-4 h-10 rounded-xl bg-teal-500 text-white font-semibold text-[12.5px] flex items-center gap-2 hover:bg-teal-400 transition-colors"
            >
              <Plus size={14} strokeWidth={2.6} />
              Novo link de cobrança
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {data.kpis.map((k) => (
            <div key={k.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.label}</p>
              <p className="mt-1.5 text-[22px] font-semibold tabular-nums tracking-tight text-slate-50">
                {k.valor}
              </p>
              <span
                className={`mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${
                  k.deltaPositivo ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {k.deltaPositivo ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {k.delta}
              </span>
            </div>
          ))}
        </div>

        {/* Tabs + filtros */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            {(['particular', 'convenio'] as AbaCobranca[]).map((a) => (
              <button
                key={a}
                onClick={() => setAba(a)}
                className={`px-4 h-9 rounded-lg text-[12.5px] font-medium transition-colors ${
                  aba === a ? 'bg-teal-500/15 text-teal-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {a === 'particular' ? 'Particular' : 'Convênio'}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={f.busca}
              onChange={(e) => setFiltro({ ...f, busca: e.target.value })}
              placeholder="Buscar por paciente…"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-[12.5px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
            />
          </div>

          {aba === 'particular' && (
            <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              {PERIODO_OPCOES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFiltro({ ...f, periodo: p.id })}
                  className={`px-3 h-8 rounded-lg text-[11.5px] font-medium transition-colors ${
                    f.periodo === p.id ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status chips (particular) */}
        {aba === 'particular' && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {STATUS_CHIPS.map((s) => {
              const active = f.status.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  className={`px-3 h-7 rounded-full text-[11.5px] font-medium ring-1 transition-colors ${
                    active ? STATUS_VISUAL[s].cor : 'bg-transparent text-slate-500 ring-slate-800 hover:text-slate-300'
                  }`}
                >
                  {STATUS_VISUAL[s].label}
                </button>
              )
            })}
            {temFiltro && (
              <button
                onClick={() => setFiltro(FILTRO_INICIAL)}
                className="px-2 h-7 rounded-full text-[11.5px] font-medium text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <X size={12} /> Limpar
              </button>
            )}
          </div>
        )}

        {/* Conteúdo */}
        {aba === 'particular' ? (
          <ParticularTable
            rows={particularesFiltradas}
            onCopiarLink={onCopiarLink}
            onReenviar={onReenviar}
            onEmitirRecibo={onEmitirRecibo}
            onCancelar={onCancelar}
          />
        ) : (
          <ConvenioTable rows={conveniosFiltrados} onStatusChange={onStatusConvenioChange} />
        )}
      </div>
    </div>
  )
}

function Avatar({ inicial }: { inicial: string }) {
  return (
    <span className="grid place-items-center size-8 rounded-full bg-slate-800 text-slate-300 text-[12px] font-semibold shrink-0">
      {inicial}
    </span>
  )
}

function StatusPill({ label, cor }: { label: string; cor: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 h-6 rounded-full text-[11px] font-medium ring-1 ${cor}`}>
      {label}
    </span>
  )
}

function ParticularTable({
  rows,
  onCopiarLink,
  onReenviar,
  onEmitirRecibo,
  onCancelar,
}: {
  rows: CobrancaParticular[]
  onCopiarLink?: (id: string) => void
  onReenviar?: (id: string) => void
  onEmitirRecibo?: (id: string) => void
  onCancelar?: (id: string) => void
}) {
  const [menu, setMenu] = useState<string | null>(null)
  if (!rows.length) return <EmptyState />

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="hidden md:grid grid-cols-[1.6fr_1.4fr_0.8fr_0.9fr_0.9fr_auto] gap-3 px-4 py-2.5 border-b border-slate-800 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
        <span>Paciente</span>
        <span>Descrição</span>
        <span className="text-right">Valor</span>
        <span>Método</span>
        <span>Status</span>
        <span className="text-right">Ações</span>
      </div>
      <ul className="divide-y divide-slate-800/70">
        {rows.map((c) => {
          const Metodo = METODO_VISUAL[c.metodo].icon
          const pago = c.status === 'pago'
          const cancelado = c.status === 'cancelado'
          return (
            <li
              key={c.id}
              className="grid grid-cols-2 md:grid-cols-[1.6fr_1.4fr_0.8fr_0.9fr_0.9fr_auto] gap-x-3 gap-y-2 px-4 py-3 items-center text-[12.5px]"
            >
              <div className="flex items-center gap-2.5 col-span-2 md:col-span-1">
                <Avatar inicial={c.pacienteInicial} />
                <div className="min-w-0">
                  <p className="text-slate-100 font-medium truncate">{c.pacienteNome}</p>
                  <p className="text-slate-500 text-[11px] tabular-nums">{dataCurta(c.criadaEm)}</p>
                </div>
              </div>
              <span className="text-slate-300 truncate">{c.descricao}</span>
              <span className="text-slate-100 font-semibold tabular-nums md:text-right">{brl(c.valorBrl)}</span>
              <span className="inline-flex items-center gap-1.5 text-slate-400 text-[11.5px]">
                <Metodo size={13} strokeWidth={2} />
                {METODO_VISUAL[c.metodo].label}
              </span>
              <span>
                <StatusPill label={STATUS_VISUAL[c.status].label} cor={STATUS_VISUAL[c.status].cor} />
              </span>
              <div className="flex items-center justify-end gap-1 relative col-span-2 md:col-span-1">
                {!cancelado && c.linkPagamento && (
                  <button
                    onClick={() => onCopiarLink?.(c.id)}
                    title="Copiar link"
                    className="grid place-items-center size-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                )}
                {pago ? (
                  <button
                    onClick={() => onEmitirRecibo?.(c.id)}
                    title="Emitir recibo"
                    className="grid place-items-center size-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors"
                  >
                    <Receipt size={14} />
                  </button>
                ) : (
                  !cancelado && (
                    <button
                      onClick={() => onReenviar?.(c.id)}
                      title="Reenviar"
                      className="grid place-items-center size-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-sky-300 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  )
                )}
                {!cancelado && (
                  <div className="relative">
                    <button
                      onClick={() => setMenu(menu === c.id ? null : c.id)}
                      className="grid place-items-center size-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {menu === c.id && (
                      <div className="absolute right-0 top-9 z-10 w-40 rounded-xl bg-slate-800 border border-slate-700 py-1 shadow-xl">
                        <button
                          onClick={() => {
                            onCancelar?.(c.id)
                            setMenu(null)
                          }}
                          className="w-full px-3 py-2 text-left text-[12px] text-rose-300 hover:bg-slate-700/60 flex items-center gap-2"
                        >
                          <X size={13} /> Cancelar cobrança
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ConvenioTable({
  rows,
  onStatusChange,
}: {
  rows: import('@/../product-clinico/sections/cobranca/types').AtendimentoConvenio[]
  onStatusChange?: (id: string, status: StatusConvenio) => void
}) {
  if (!rows.length) return <EmptyState />
  const opcoes: StatusConvenio[] = ['enviado', 'em_analise', 'pago', 'glosado']

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="hidden md:grid grid-cols-[1.4fr_1fr_1.6fr_0.8fr_1fr] gap-3 px-4 py-2.5 border-b border-slate-800 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
        <span>Paciente</span>
        <span>Convênio</span>
        <span>Procedimento</span>
        <span className="text-right">Valor est.</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-slate-800/70">
        {rows.map((c) => (
          <li
            key={c.id}
            className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1.6fr_0.8fr_1fr] gap-x-3 gap-y-2 px-4 py-3 items-center text-[12.5px]"
          >
            <div className="flex items-center gap-2.5 col-span-2 md:col-span-1">
              <Avatar inicial={c.pacienteInicial} />
              <div className="min-w-0">
                <p className="text-slate-100 font-medium truncate">{c.pacienteNome}</p>
                <p className="text-slate-500 text-[11px] tabular-nums">{dataCurta(c.atualizadoEm)}</p>
              </div>
            </div>
            <span className="text-slate-300">{c.convenio}</span>
            <div className="min-w-0 col-span-2 md:col-span-1">
              <p className="text-slate-300 truncate">{c.procedimento}</p>
              {c.observacao && <p className="text-slate-500 text-[11px] truncate">{c.observacao}</p>}
            </div>
            <span className="text-slate-100 font-semibold tabular-nums md:text-right">{brl(c.valorEstimadoBrl)}</span>
            <div>
              <select
                value={c.status}
                onChange={(e) => onStatusChange?.(c.id, e.target.value as StatusConvenio)}
                className={`h-7 pl-2.5 pr-6 rounded-full text-[11px] font-medium ring-1 bg-transparent focus:outline-none ${CONVENIO_VISUAL[c.status].cor}`}
              >
                {opcoes.map((o) => (
                  <option key={o} value={o} className="bg-slate-800 text-slate-100">
                    {CONVENIO_VISUAL[o].label}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-slate-900 border border-dashed border-slate-800 py-16 grid place-items-center">
      <Receipt size={28} className="text-slate-700 mb-3" />
      <p className="text-slate-400 text-[13px] font-medium">Nenhuma cobrança neste filtro</p>
      <p className="text-slate-600 text-[12px] mt-1">Ajuste os filtros ou crie um novo link de cobrança.</p>
    </div>
  )
}
