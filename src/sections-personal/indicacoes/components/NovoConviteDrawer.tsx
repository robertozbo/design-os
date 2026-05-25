import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, Search, Send, X } from 'lucide-react'
import type {
  AlunoSemApp,
  ConviteCanal,
  NovoConviteData,
} from '@/../product-personal/sections/indicacoes/types'
import { CANAL_STYLE } from './helpers'

interface NovoConviteDrawerProps {
  open: boolean
  alunosSemApp: AlunoSemApp[]
  onClose?: () => void
  onSave?: (data: NovoConviteData) => void
}

const CANAIS: ConviteCanal[] = ['link', 'qr', 'email', 'sms-whatsapp']

const ACTION_LABEL: Record<ConviteCanal, string> = {
  link: 'Gerar e copiar link',
  qr: 'Mostrar QR code',
  email: 'Enviar email',
  'sms-whatsapp': 'Enviar SMS/WhatsApp',
}

export function NovoConviteDrawer({
  open,
  alunosSemApp,
  onClose,
  onSave,
}: NovoConviteDrawerProps) {
  const [alunoQuery, setAlunoQuery] = useState('')
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null)
  const [selectedCanal, setSelectedCanal] = useState<ConviteCanal>('link')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (open) {
      setAlunoQuery('')
      setSelectedAlunoId(null)
      setSelectedCanal('link')
      setMensagem('')
    }
  }, [open])

  const filteredAlunos = useMemo(() => {
    if (!alunoQuery) return alunosSemApp
    const q = alunoQuery.toLowerCase()
    return alunosSemApp.filter(
      (a) =>
        a.nome.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
    )
  }, [alunosSemApp, alunoQuery])

  const aluno = selectedAlunoId
    ? alunosSemApp.find((a) => a.id === selectedAlunoId) ?? null
    : null

  const canConfirm = !!aluno && !!selectedCanal

  const handleConfirm = () => {
    if (!aluno) return
    onSave?.({
      alunoId: aluno.id,
      canal: selectedCanal,
      mensagem,
    })
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}
        `}
        aria-hidden
      />

      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col bg-white shadow-2xl transition-transform duration-300
          dark:bg-slate-950
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-label="Novo convite"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Convidar aluno pro app
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-snug text-slate-900 dark:text-slate-50">
              Novo convite
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Step 1: Aluno */}
          <Section number={1} title="Selecionar aluno">
            {!aluno ? (
              <>
                <div className="relative">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="search"
                    value={alunoQuery}
                    onChange={(e) => setAlunoQuery(e.target.value)}
                    placeholder="Buscar aluno sem app vinculado…"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
                  />
                </div>
                <div className="mt-2 max-h-[260px] space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-1.5 dark:border-slate-800 dark:bg-slate-900/40">
                  {filteredAlunos.map((a) => (
                    <AlunoRow
                      key={a.id}
                      aluno={a}
                      onClick={() => setSelectedAlunoId(a.id)}
                    />
                  ))}
                  {filteredAlunos.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                      Nenhum aluno sem app encontrado.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-teal-50 p-3 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/30 dark:ring-teal-800">
                {aluno.avatarUrl ? (
                  <img
                    src={aluno.avatarUrl}
                    alt={aluno.nome}
                    className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    {aluno.nome.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                    {aluno.nome}
                  </p>
                  <p className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {aluno.email} · {aluno.telefone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAlunoId(null)}
                  className="shrink-0 text-[11px] font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Trocar
                </button>
              </div>
            )}
          </Section>

          {/* Step 2: Canal */}
          <Section number={2} title="Escolher canal">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CANAIS.map((id) => (
                <CanalTile
                  key={id}
                  canalId={id}
                  selected={selectedCanal === id}
                  onClick={() => setSelectedCanal(id)}
                />
              ))}
            </div>
          </Section>

          {/* Step 3: Mensagem */}
          <Section number={3} title="Mensagem (opcional)">
            <textarea
              rows={3}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Adicione uma mensagem pessoal pro aluno (opcional)…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {mensagem.length}/240 caracteres
            </p>
          </Section>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={handleConfirm}
            className={`
              inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors
              ${
                canConfirm
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
              }
            `}
          >
            <Send size={14} strokeWidth={2.5} />
            {ACTION_LABEL[selectedCanal]}
          </button>
        </footer>
      </aside>
    </>
  )
}

function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <header className="flex items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          {number}
        </span>
        <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>
      </header>
      <div className="mt-3 pl-7">{children}</div>
    </section>
  )
}

function AlunoRow({
  aluno,
  onClick,
}: {
  aluno: AlunoSemApp
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white dark:hover:bg-slate-800"
    >
      {aluno.avatarUrl ? (
        <img
          src={aluno.avatarUrl}
          alt={aluno.nome}
          className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          {aluno.nome.charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {aluno.nome}
        </p>
        <p className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {aluno.email}
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        Sem app
      </span>
      <ArrowRight size={14} className="text-slate-400 dark:text-slate-500" />
    </button>
  )
}

function CanalTile({
  canalId,
  selected,
  onClick,
}: {
  canalId: ConviteCanal
  selected: boolean
  onClick?: () => void
}) {
  const style = CANAL_STYLE[canalId]
  const Icon = style.icon
  const recommended = canalId === 'link'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col gap-2 rounded-xl border p-3.5 text-left transition-all
        ${
          selected
            ? 'border-teal-400 bg-teal-50/40 ring-2 ring-teal-200 dark:border-teal-700 dark:bg-teal-900/20 dark:ring-teal-900'
            : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700 dark:hover:bg-slate-800/50'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
        >
          <Icon size={16} />
        </span>
        {selected && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
            <Check size={11} strokeWidth={3} />
          </span>
        )}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {style.label}
          {recommended && (
            <span className="ml-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Rec.
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {style.description}
        </p>
      </div>
    </button>
  )
}
