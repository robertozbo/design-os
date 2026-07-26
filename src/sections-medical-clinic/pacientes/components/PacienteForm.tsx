import { useState } from 'react'
import { Plus, UserPlus, X } from 'lucide-react'
import type { PacienteClinica } from '@/../product-medical-clinic/sections/pacientes/types'
import { iniciaisDe } from './helpers'

export interface PacienteFormValues {
  nome: string
  idade: number
  genero: string
  convenio: string
  /** Canal do convite pro app — sem email o convite fica indisponível. */
  email: string
  condicoesCronicas: string[]
  /** Dispara o convite pro app junto do cadastro (padrão da vertical Personal). */
  enviarConvite: boolean
}

interface Props {
  /** Paciente em edição — `null` = modo criar. */
  paciente: PacienteClinica | null
  onClose: () => void
  /** `id` é `null` no modo criar. */
  onSalvar: (values: PacienteFormValues, id: string | null) => void
}

const GENEROS = ['Feminino', 'Masculino', 'Outro']
const CONDICOES_SUGERIDAS = [
  'Diabetes tipo 2',
  'Hipertensão',
  'Hipotireoidismo',
  'Dislipidemia',
  'Obesidade grau I',
  'Asma',
  'Arritmia',
  'Insuficiência cardíaca',
  'DPOC',
  'Depressão',
  'Ansiedade',
  'Osteoporose',
  'Doença renal crônica',
]
const VAZIO: PacienteFormValues = {
  nome: '',
  idade: 30,
  genero: 'Feminino',
  convenio: 'Particular',
  email: '',
  condicoesCronicas: [],
  enviarConvite: true,
}

export function PacienteForm({ paciente, onClose, onSalvar }: Props) {
  const [form, setForm] = useState<PacienteFormValues>(() =>
    paciente
      ? {
          nome: paciente.nome,
          idade: paciente.idade,
          genero: paciente.genero,
          convenio: paciente.convenio,
          email: paciente.email ?? '',
          condicoesCronicas: [...paciente.condicoesCronicas],
          enviarConvite: false,
        }
      : VAZIO,
  )
  const [novaCondicao, setNovaCondicao] = useState('')

  const editando = paciente !== null
  const nomeValido = form.nome.trim().length > 1
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())

  const adicionar = (valor: string) => {
    const c = valor.trim()
    if (!c) return
    setForm((f) =>
      f.condicoesCronicas.includes(c)
        ? f
        : { ...f, condicoesCronicas: [...f.condicoesCronicas, c] },
    )
  }

  const addCondicao = () => {
    adicionar(novaCondicao)
    setNovaCondicao('')
  }

  const sugestoes = CONDICOES_SUGERIDAS.filter((c) => !form.condicoesCronicas.includes(c))

  const salvar = () => {
    if (!nomeValido) return
    onSalvar(
      {
        ...form,
        nome: form.nome.trim(),
        convenio: form.convenio.trim() || 'Particular',
      },
      paciente?.id ?? null,
    )
  }

  const iniciais = form.nome.trim() ? iniciaisDe(form.nome) : '—'

  return (
    <div className="fixed inset-0 z-[52] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-50">
            <UserPlus className="h-4 w-4 text-teal-600" />
            {editando ? 'Editar cadastro' : 'Novo paciente'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Avatar + nome preview */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-400 text-base font-semibold text-white">
              {iniciais}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {editando
                ? 'Alterações no cadastro. Não afeta equipe de cuidado nem consultas.'
                : 'Entra no pool compartilhado da clínica.'}
            </p>
          </div>

          {/* Nome */}
          <Campo label="Nome completo" obrigatorio>
            <input
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="Ex.: Maria Silva Santos"
              autoFocus
              className={inputCls}
            />
          </Campo>

          {/* Idade + Gênero */}
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Idade">
              <input
                type="number"
                min={0}
                max={120}
                value={form.idade}
                onChange={(e) =>
                  setForm((f) => ({ ...f, idade: Math.max(0, Math.min(120, Number(e.target.value) || 0)) }))
                }
                className={inputCls}
              />
            </Campo>
            <Campo label="Gênero">
              <select
                value={form.genero}
                onChange={(e) => setForm((f) => ({ ...f, genero: e.target.value }))}
                className={inputCls}
              >
                {GENEROS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          {/* Convênio */}
          <Campo label="Convênio">
            <input
              value={form.convenio}
              onChange={(e) => setForm((f) => ({ ...f, convenio: e.target.value }))}
              placeholder="Ex.: Unimed, Bradesco, Particular…"
              className={inputCls}
            />
          </Campo>

          {/* Email + convite pro app */}
          <Campo label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="paciente@email.com"
              className={inputCls}
            />
          </Campo>

          {!editando && (
            <label
              className={`flex items-start gap-2.5 rounded-xl border p-3 ${
                emailValido
                  ? 'cursor-pointer border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 opacity-50 dark:border-slate-800'
              }`}
            >
              <input
                type="checkbox"
                checked={form.enviarConvite && emailValido}
                disabled={!emailValido}
                onChange={(e) => setForm((f) => ({ ...f, enviarConvite: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                Enviar convite do app agora
                <span className="mt-0.5 block text-[11px] text-slate-400">
                  {emailValido
                    ? 'O paciente recebe o convite dentro do app e escolhe o que compartilhar antes de vincular.'
                    : 'Informe um email válido para poder convidar.'}
                </span>
              </span>
            </label>
          )}

          {/* Condições crônicas */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Condições crônicas
            </h3>
            {form.condicoesCronicas.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {form.condicoesCronicas.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                    <button
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          condicoesCronicas: f.condicoesCronicas.filter((x) => x !== c),
                        }))
                      }
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={novaCondicao}
                onChange={(e) => setNovaCondicao(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCondicao()
                  }
                }}
                placeholder="Adicionar condição…"
                className={`flex-1 ${inputCls}`}
              />
              <button
                onClick={addCondicao}
                className="rounded-lg border border-slate-200 px-2.5 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Modelos prontos — clique pra adicionar */}
            {sugestoes.length > 0 && (
              <div className="mt-2.5">
                <p className="mb-1.5 text-[11px] text-slate-400">Sugestões — clique para adicionar</p>
                <div className="flex flex-wrap gap-1.5">
                  {sugestoes.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => adicionar(c)}
                      className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600 transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                    >
                      <Plus className="h-3 w-3" />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={!nomeValido}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editando ? 'Salvar alterações' : 'Cadastrar paciente'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'

function Campo({
  label,
  obrigatorio,
  children,
}: {
  label: string
  obrigatorio?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
        {obrigatorio && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}
