import { ArrowLeftRight, Check, Plus, ShieldCheck, X } from 'lucide-react'
import type {
  Direcao,
  Encaminhamento,
} from '@/../product-clinic/sections/encaminhamento/types'
import { AVATAR_COR, ITEM_LABEL, STATUS_META } from './helpers'

interface Props {
  clinica: string
  aba: Direcao
  recebidos: Encaminhamento[]
  enviados: Encaminhamento[]
  onAba: (a: Direcao) => void
  onNovo: () => void
  onAceitar: (e: Encaminhamento) => void
  onRecusar: (e: Encaminhamento) => void
  onAbrir: (e: Encaminhamento) => void
}

export function EncaminhamentosView({
  clinica,
  aba,
  recebidos,
  enviados,
  onAba,
  onNovo,
  onAceitar,
  onRecusar,
  onAbrir,
}: Props) {
  const pendentesRecebidos = recebidos.filter((e) => e.status === 'pendente').length
  const lista = aba === 'recebido' ? recebidos : enviados
  const ordenada = [...lista].sort((a, b) => {
    const peso = (e: Encaminhamento) => (e.status === 'pendente' ? 0 : 1)
    return peso(a) - peso(b)
  })

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Encaminhamentos
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Troca intra-clínica · {clinica}
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center gap-1.5 self-start rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Plus className="h-4 w-4" /> Novo encaminhamento
        </button>
      </div>

      {/* Abas */}
      <div className="mt-5 flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
        <Aba ativo={aba === 'recebido'} onClick={() => onAba('recebido')} badge={pendentesRecebidos}>
          Recebidos
        </Aba>
        <Aba ativo={aba === 'enviado'} onClick={() => onAba('enviado')}>
          Enviados
        </Aba>
      </div>

      {/* Lista */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {ordenada.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
            Nenhum encaminhamento {aba === 'recebido' ? 'recebido' : 'enviado'}.
          </div>
        ) : (
          ordenada.map((e) => (
            <EncaminhamentoCard
              key={e.id}
              enc={e}
              onAceitar={() => onAceitar(e)}
              onRecusar={() => onRecusar(e)}
              onAbrir={() => onAbrir(e)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function Aba({
  ativo,
  onClick,
  badge,
  children,
}: {
  ativo: boolean
  onClick: () => void
  badge?: number
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
        ativo
          ? 'text-teal-700 dark:text-teal-300'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
      }`}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          {badge}
        </span>
      )}
      {ativo && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal-500" />}
    </button>
  )
}

function EncaminhamentoCard({
  enc,
  onAceitar,
  onRecusar,
  onAbrir,
}: {
  enc: Encaminhamento
  onAceitar: () => void
  onRecusar: () => void
  onAbrir: () => void
}) {
  const status = STATUS_META[enc.status]
  const recebido = enc.direcao === 'recebido'
  const pendente = enc.status === 'pendente'

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-4 dark:bg-slate-900 ${
        recebido && pendente
          ? 'border-amber-200 dark:border-amber-900/50'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Topo: contraparte */}
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[enc.contraparte.cor]}`}
        >
          {enc.contraparte.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">
              {recebido ? 'De' : 'Para'}
            </span>
            <ArrowLeftRight className="h-2.5 w-2.5 text-slate-300" />
          </div>
          <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
            {enc.contraparte.nome}
          </div>
          <div className="truncate text-[11px] text-slate-400">
            {enc.contraparte.especialidade} · {enc.em}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${status.chip}`}>
          {status.label}
        </span>
      </div>

      {/* Paciente + motivo + contexto */}
      <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {enc.paciente.iniciais}
          </span>
          <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
            {enc.paciente.nome}
          </span>
          <span className="shrink-0 text-[10px] text-slate-400">{enc.paciente.idade}a</span>
        </div>
        <div className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200">{enc.motivo}</div>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {enc.contexto}
        </p>
      </div>

      {/* Compartilhado + consentimento */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {enc.compartilhado.map((c) => (
          <span
            key={c}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            {ITEM_LABEL[c]}
          </span>
        ))}
        {enc.consentimentoPaciente && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" /> consentido
          </span>
        )}
      </div>

      {/* Ações */}
      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        {recebido && pendente ? (
          <>
            <button
              onClick={onAceitar}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-teal-500 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600"
            >
              <Check className="h-3.5 w-3.5" /> Aceitar e assumir vínculo
            </button>
            <button
              onClick={onRecusar}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" /> Recusar
            </button>
          </>
        ) : (
          <button
            onClick={onAbrir}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline dark:text-teal-300"
          >
            Abrir contexto do paciente
          </button>
        )}
      </div>
    </div>
  )
}
