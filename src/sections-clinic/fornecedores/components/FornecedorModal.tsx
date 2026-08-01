import { useState } from 'react'
import { Check, Loader2, Search, X } from 'lucide-react'
import type {
  Fornecedor,
  FornecedoresData,
} from '@/../product-clinic/sections/fornecedores/types'
import { cnpjValido, consultarCnpj, formatCnpj, formatTelefone } from './helpers'

interface Props {
  fornecedor: Fornecedor | null
  dados: FornecedoresData
  onSalvar: (f: Omit<Fornecedor, 'id'>, id: string | null) => void
  onFechar: () => void
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export function FornecedorModal({ fornecedor, dados, onSalvar, onFechar }: Props) {
  const editando = fornecedor !== null
  const [cnpj, setCnpj] = useState(fornecedor?.cnpj ?? '')
  const [razaoSocial, setRazaoSocial] = useState(fornecedor?.razaoSocial ?? '')
  const [nomeFantasia, setNomeFantasia] = useState(fornecedor?.nomeFantasia ?? '')
  const [telefone, setTelefone] = useState(fornecedor?.telefone ?? '')
  const [email, setEmail] = useState(fornecedor?.email ?? '')
  const [categoria, setCategoria] = useState(fornecedor?.categoria ?? dados.categorias[0] ?? '')
  const [cidade, setCidade] = useState(fornecedor?.cidade ?? '')
  // Sem UF informada o campo fica vazio: 'SP' afirmaria um estado que ninguém escolheu.
  const [uf, setUf] = useState(fornecedor?.uf ?? '')
  const [ativo, setAtivo] = useState(fornecedor?.ativo ?? true)
  const [consultando, setConsultando] = useState(false)
  const [consultaMsg, setConsultaMsg] = useState('')

  const consultar = async () => {
    if (!cnpjValido(cnpj)) {
      setConsultaMsg('CNPJ incompleto')
      return
    }
    setConsultando(true)
    setConsultaMsg('')
    const r = await consultarCnpj(cnpj)
    setConsultando(false)
    if (!r) {
      setConsultaMsg('Não encontrado')
      return
    }
    if (r.razaoSocial) setRazaoSocial(r.razaoSocial)
    if (r.nomeFantasia) setNomeFantasia(r.nomeFantasia)
    if (r.telefone) setTelefone(r.telefone)
    if (r.cidade) setCidade(r.cidade)
    if (r.uf) setUf(r.uf)
    setConsultaMsg('Dados preenchidos pela consulta')
  }

  const podeSalvar = razaoSocial.trim().length > 1 && cnpjValido(cnpj)

  const salvar = () => {
    if (!podeSalvar) return
    onSalvar(
      {
        razaoSocial: razaoSocial.trim(),
        nomeFantasia: nomeFantasia.trim() || razaoSocial.trim(),
        cnpj: formatCnpj(cnpj),
        telefone,
        email: email.trim(),
        categoria,
        cidade: cidade.trim(),
        uf,
        ativo,
      },
      fornecedor?.id ?? null,
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {editando ? 'Editar fornecedor' : 'Novo fornecedor'}
          </h2>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* CNPJ + consultar */}
          <div>
            <Label obrigatorio>CNPJ</Label>
            <div className="flex gap-2">
              <input
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={consultar}
                disabled={consultando}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-teal-500 px-3 py-2 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 disabled:opacity-50 dark:text-teal-400 dark:hover:bg-teal-950/40"
              >
                {consultando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Consultar
              </button>
            </div>
            {consultaMsg && (
              <span className="mt-1 block text-[11px] text-slate-400">{consultaMsg}</span>
            )}
          </div>

          <label className="block">
            <Label obrigatorio>Razão social</Label>
            <input
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Ex.: Imobiliária Prado Ltda"
              className={inputCls}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <Label>Nome fantasia</Label>
              <input
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                placeholder="Ex.: Imobiliária Prado"
                className={inputCls}
              />
            </label>
            <label className="block">
              <Label>Telefone</Label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                placeholder="(11) 0000-0000"
                inputMode="tel"
                className={inputCls}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <Label>E-mail</Label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com.br"
                inputMode="email"
                className={inputCls}
              />
            </label>
            <label className="block">
              <Label>Categoria (tipo de despesa)</Label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputCls}>
                {dados.categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-[1fr_5rem] gap-3">
            <label className="block">
              <Label>Cidade</Label>
              <input
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
                className={inputCls}
              />
            </label>
            <label className="block">
              <Label>UF</Label>
              <select value={uf} onChange={(e) => setUf(e.target.value)} className={inputCls}>
                {UFS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Ativo</span>
            <button
              type="button"
              role="switch"
              aria-checked={ativo}
              onClick={() => setAtivo((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                ativo ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  ativo ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            onClick={onFechar}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={!podeSalvar}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children, obrigatorio }: { children: React.ReactNode; obrigatorio?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
      {obrigatorio && <span className="ml-0.5 text-red-500">*</span>}
    </span>
  )
}
