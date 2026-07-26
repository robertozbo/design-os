import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import type {
  Conta,
  FinanceiroData,
  StatusConta,
  TipoConta,
} from '@/../product-medical-clinic/sections/financeiro/types'
import { mascaraMoeda, moeda, parseValorBR } from './helpers'

interface Props {
  tipo: TipoConta
  dados: FinanceiroData
  onSalvar: (conta: Omit<Conta, 'id'>) => void
  onFechar: () => void
}

const baseInput =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-1 dark:bg-slate-800 dark:text-slate-100'
const okBorder = 'border-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700'
const errBorder = 'border-red-400 focus:border-red-500 focus:ring-red-500'

export function NovaContaModal({ tipo, dados, onSalvar, onFechar }: Props) {
  const receber = tipo === 'receber'
  const metodos = receber ? dados.metodosReceber : dados.metodosPagar
  const gruposTipo = receber ? dados.tiposReceita : dados.tiposDespesa

  const [descricao, setDescricao] = useState('')
  const [outroServico, setOutroServico] = useState(false)
  const [outroForn, setOutroForn] = useState(false)
  const [contraparte, setContraparte] = useState('')
  const [categoria, setCategoria] = useState('')
  const [vencimento, setVencimento] = useState(dados.hoje)
  const [valor, setValor] = useState('')
  // Vazio até escolherem: o 1º da lista afirmava um meio de pagamento que ninguém informou.
  const [metodo, setMetodo] = useState('')
  const [recorrencia, setRecorrencia] = useState(dados.recorrencias[0] ?? '')
  const [status, setStatus] = useState<StatusConta>('aberto')
  const [tentou, setTentou] = useState(false)

  const valorNum = parseValorBR(valor)

  // Validação dos obrigatórios.
  const err = {
    descricao: descricao.trim().length < 2,
    categoria: !categoria,
    contraparte: receber ? contraparte === '' : contraparte.trim() === '',
    valor: !(valorNum > 0),
    vencimento: !vencimento,
  }
  const invalido = Object.values(err).some(Boolean)
  const cls = (e: boolean) => `${baseInput} ${tentou && e ? errBorder : okBorder}`

  const salvar = () => {
    if (invalido) {
      setTentou(true)
      return
    }
    onSalvar({
      tipo,
      descricao: descricao.trim(),
      contraparte: receber
        ? contraparte === '__avulso__'
          ? null
          : contraparte
        : contraparte.trim() || null,
      categoria,
      vencimento,
      valor: valorNum,
      metodo,
      status,
      // Quando nasce paga, o dinheiro se moveu HOJE — não no vencimento, que pode ser futuro
      // ou passado. Assumir o vencimento inventaria a data do recebimento.
      pagoEm: status === 'pago' ? dados.hoje : null,
      recorrencia,
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-teal-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Nova conta a {receber ? 'receber' : 'pagar'}
            </h2>
          </div>
          <button
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Serviço / descrição */}
          {receber ? (
            <Campo label="Serviço" obrigatorio erro={tentou && err.descricao ? 'Selecione um serviço' : ''}>
              {outroServico ? (
                <div className="space-y-1.5">
                  <input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva o serviço"
                    autoFocus
                    className={cls(err.descricao)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOutroServico(false)
                      setDescricao('')
                    }}
                    className="text-[11px] font-medium text-teal-600 hover:underline dark:text-teal-400"
                  >
                    Escolher da lista de serviços
                  </button>
                </div>
              ) : (
                <select
                  value={descricao}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '__outro__') {
                      setOutroServico(true)
                      setDescricao('')
                      return
                    }
                    setDescricao(v)
                    const s = dados.servicos.find((x) => x.nome === v)
                    if (s) setValor(moeda(s.valor))
                  }}
                  className={cls(err.descricao)}
                >
                  <option value="" disabled>
                    Selecione um serviço…
                  </option>
                  {dados.servicos.map((s) => (
                    <option key={s.nome} value={s.nome}>
                      {s.nome} · R$ {moeda(s.valor)}
                    </option>
                  ))}
                  <option value="__outro__">Outro serviço…</option>
                </select>
              )}
            </Campo>
          ) : (
            <Campo label="Descrição" obrigatorio erro={tentou && err.descricao ? 'Informe a descrição' : ''}>
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex.: Aluguel do consultório"
                autoFocus
                className={cls(err.descricao)}
              />
            </Campo>
          )}

          {/* Tipo de conta + contraparte */}
          {receber ? (
            <div className="grid grid-cols-2 gap-3">
              <Campo
                label="Tipo de receita"
                obrigatorio
                erro={tentou && err.categoria ? 'Selecione o tipo' : ''}
              >
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={cls(err.categoria)}
                >
                  <option value="" disabled>
                    Selecione…
                  </option>
                  {gruposTipo.map((g) => (
                    <optgroup key={g.grupo} label={g.grupo}>
                      {g.itens.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Campo>
              <Campo
                label="Paciente"
                obrigatorio
                erro={tentou && err.contraparte ? 'Selecione o paciente' : ''}
              >
                <select
                  value={contraparte}
                  onChange={(e) => setContraparte(e.target.value)}
                  className={cls(err.contraparte)}
                >
                  <option value="" disabled>
                    Selecione…
                  </option>
                  <option value="__avulso__">Avulso (não vinculado)</option>
                  {dados.pacientes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Campo
                label="Fornecedor"
                obrigatorio
                erro={tentou && err.contraparte ? 'Selecione o fornecedor' : ''}
              >
                {outroForn ? (
                  <div className="space-y-1.5">
                    <input
                      value={contraparte}
                      onChange={(e) => setContraparte(e.target.value)}
                      placeholder="Nome do fornecedor"
                      className={cls(err.contraparte)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOutroForn(false)
                        setContraparte('')
                      }}
                      className="text-[11px] font-medium text-teal-600 hover:underline dark:text-teal-400"
                    >
                      Escolher do cadastro
                    </button>
                  </div>
                ) : (
                  <select
                    value={contraparte}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === '__outro__') {
                        setOutroForn(true)
                        setContraparte('')
                        return
                      }
                      setContraparte(v)
                      const f = dados.fornecedores.find((x) => x.nome === v)
                      if (f) setCategoria(f.categoria)
                    }}
                    className={cls(err.contraparte)}
                  >
                    <option value="" disabled>
                      Selecione…
                    </option>
                    {dados.fornecedores.map((f) => (
                      <option key={f.nome} value={f.nome}>
                        {f.nome} · {f.cnpj}
                      </option>
                    ))}
                    <option value="__outro__">Outro (não cadastrado)…</option>
                  </select>
                )}
              </Campo>
              <Campo
                label="Tipo de despesa"
                obrigatorio
                erro={tentou && err.categoria ? 'Selecione o tipo' : ''}
              >
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={cls(err.categoria)}
                >
                  <option value="" disabled>
                    Selecione…
                  </option>
                  {gruposTipo.map((g) => (
                    <optgroup key={g.grupo} label={g.grupo}>
                      {g.itens.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Campo>
            </div>
          )}

          {/* Vencimento + valor */}
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Vencimento" obrigatorio erro={tentou && err.vencimento ? 'Informe a data' : ''}>
              <input
                type="date"
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
                className={cls(err.vencimento)}
              />
            </Campo>
            <Campo label="Valor (R$)" obrigatorio erro={tentou && err.valor ? 'Informe um valor' : ''}>
              <input
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(mascaraMoeda(e.target.value))}
                placeholder="0,00"
                className={cls(err.valor)}
              />
            </Campo>
          </div>

          {/* Método + recorrência */}
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Método de pagamento">
              <select value={metodo} onChange={(e) => setMetodo(e.target.value)} className={cls(false)}>
                <option value="">Não informado</option>
                {metodos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Recorrência">
              <select
                value={recorrencia}
                onChange={(e) => setRecorrencia(e.target.value)}
                className={cls(false)}
              >
                {dados.recorrencias.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <Campo label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusConta)}
              className={cls(false)}
            >
              <option value="aberto">Em aberto</option>
              <option value="pago">Pago</option>
            </select>
          </Campo>

          {tentou && invalido && (
            <p className="text-xs text-red-500">Preencha os campos obrigatórios destacados.</p>
          )}
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Check className="h-4 w-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

function Campo({
  label,
  obrigatorio,
  erro,
  children,
}: {
  label: string
  obrigatorio?: boolean
  erro?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
        {obrigatorio && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {erro && <span className="mt-1 block text-[11px] text-red-500">{erro}</span>}
    </label>
  )
}
