import { useEffect, useMemo, useState } from 'react'
import {
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  Clock4,
  Send,
  Settings2,
  Dumbbell,
} from 'lucide-react'
import type {
  AgendaSemanal,
  AlunoOption,
  AplicarEmAlunoModalProps,
  DiaSemanaId,
  DuracaoId,
  Plano,
} from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE } from './objetivoStyle'

const DIAS: { id: DiaSemanaId; label: string; full: string }[] = [
  { id: 'seg', label: 'Seg', full: 'Segunda' },
  { id: 'ter', label: 'Ter', full: 'Terça' },
  { id: 'qua', label: 'Qua', full: 'Quarta' },
  { id: 'qui', label: 'Qui', full: 'Quinta' },
  { id: 'sex', label: 'Sex', full: 'Sexta' },
  { id: 'sab', label: 'Sáb', full: 'Sábado' },
  { id: 'dom', label: 'Dom', full: 'Domingo' },
]

const DURACAO_LABEL: Record<DuracaoId, string> = {
  '4': '4 semanas',
  '8': '8 semanas',
  '12': '12 semanas',
  indeterminado: 'Indeterminado',
}

const EMPTY_AGENDA: AgendaSemanal = {
  seg: null,
  ter: null,
  qua: null,
  qui: null,
  sex: null,
  sab: null,
  dom: null,
}

export function AplicarEmAlunoModal({
  open,
  template,
  templates,
  alunosDisponiveis,
  preSelectedAlunoId,
  alunoFixo,
  onClose,
  onConfirm,
}: AplicarEmAlunoModalProps) {
  // Mode: 'template-fixo' (vem de Treinos card) | 'aluno-fixo' (vem da ficha do aluno)
  const isAlunoFixoMode = !!preSelectedAlunoId && !template

  const [alunoQuery, setAlunoQuery] = useState('')
  const [templateQuery, setTemplateQuery] = useState('')
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(
    preSelectedAlunoId ?? null,
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    template?.id ?? null,
  )
  const [dataInicio, setDataInicio] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [agenda, setAgenda] = useState<AgendaSemanal>(EMPTY_AGENDA)
  const [duracao, setDuracao] = useState<DuracaoId>('8')
  const [permitirAjusteCarga, setPermitirAjusteCarga] = useState(true)

  // Reset on open
  useEffect(() => {
    if (open) {
      setAlunoQuery('')
      setTemplateQuery('')
      setSelectedAlunoId(preSelectedAlunoId ?? null)
      setSelectedTemplateId(template?.id ?? null)
      setDataInicio(new Date().toISOString().slice(0, 10))
      setAgenda(template?.agendaPadrao ?? EMPTY_AGENDA)
      setDuracao(template?.duracaoPadrao ?? '8')
      setPermitirAjusteCarga(template?.permitirAjusteCarga ?? true)
    }
  }, [open, template, preSelectedAlunoId])

  // Quando muda o template selecionado (modo aluno-fixo), copia config padrão dele
  useEffect(() => {
    if (isAlunoFixoMode && selectedTemplateId && templates) {
      const t = templates.find((x) => x.id === selectedTemplateId)
      if (t) {
        setAgenda(t.agendaPadrao ?? EMPTY_AGENDA)
        setDuracao(t.duracaoPadrao ?? '8')
        setPermitirAjusteCarga(t.permitirAjusteCarga ?? true)
      }
    }
  }, [selectedTemplateId, isAlunoFixoMode, templates])

  const selectedTemplate: Plano | null = template
    ? template
    : templates?.find((t) => t.id === selectedTemplateId) ?? null

  const aluno: AlunoOption | null = alunoFixo
    ? alunoFixo
    : selectedAlunoId
      ? alunosDisponiveis?.find((a) => a.id === selectedAlunoId) ?? null
      : null

  const objStyle = selectedTemplate
    ? OBJETIVO_STYLE[selectedTemplate.objetivo]
    : null
  const treinoLetras = selectedTemplate?.treinos.map((t) => t.letra) ?? []

  const filteredAlunos = useMemo(() => {
    if (!alunosDisponiveis) return []
    if (!alunoQuery) return alunosDisponiveis
    const q = alunoQuery.toLowerCase()
    return alunosDisponiveis.filter((a) => a.nome.toLowerCase().includes(q))
  }, [alunosDisponiveis, alunoQuery])

  const filteredTemplates = useMemo(() => {
    if (!templates) return []
    const onlyTemplates = templates.filter((t) => t.status === 'template')
    if (!templateQuery) return onlyTemplates
    const q = templateQuery.toLowerCase()
    return onlyTemplates.filter((t) => t.nome.toLowerCase().includes(q))
  }, [templates, templateQuery])

  const diasComTreino = DIAS.filter((d) => agenda[d.id] != null)
  const totalDiasSemana = diasComTreino.length
  const dataInicioFormatada = new Date(dataInicio).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const canConfirm =
    !!aluno && !!selectedTemplate && totalDiasSemana > 0

  const handleSetDay = (dia: DiaSemanaId, letra: string | null) => {
    setAgenda((prev) => ({ ...prev, [dia]: letra }))
  }

  const handleConfirm = () => {
    if (!aluno || !selectedTemplate) return
    onConfirm?.({
      templateId: selectedTemplate.id,
      alunoId: aluno.id,
      dataInicio,
      agenda,
      duracao,
      permitirAjusteCarga,
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
          fixed inset-y-0 right-0 z-50 flex w-full max-w-[640px] flex-col bg-white shadow-2xl transition-transform duration-300
          dark:bg-slate-950
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-label="Aplicar template em aluno"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {isAlunoFixoMode
                ? `Aplicar template em ${aluno?.nome ?? 'aluno'}`
                : 'Aplicar template em aluno'}
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {selectedTemplate?.nome ?? 'Escolha um template'}
            </h2>
            {selectedTemplate && objStyle && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${objStyle.badge}`}
                >
                  {objStyle.label}
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedTemplate.treinos.length} treino
                  {selectedTemplate.treinos.length === 1 ? '' : 's'}
                  {treinoLetras.length > 0 && ` · ${treinoLetras.join(' · ')}`}
                </span>
              </div>
            )}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Step: Template (only se modo aluno-fixo) */}
          {isAlunoFixoMode && (
            <Section number={1} title="Selecionar template" icon={<Dumbbell size={14} />}>
              {!selectedTemplate ? (
                <>
                  <div className="relative">
                    <Search
                      size={14}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="search"
                      value={templateQuery}
                      onChange={(e) => setTemplateQuery(e.target.value)}
                      placeholder="Buscar template…"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
                    />
                  </div>
                  <div className="mt-2 max-h-[280px] space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-1.5 dark:border-slate-800 dark:bg-slate-900/40">
                    {filteredTemplates.map((t) => (
                      <TemplateRow
                        key={t.id}
                        template={t}
                        onClick={() => setSelectedTemplateId(t.id)}
                      />
                    ))}
                    {filteredTemplates.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                        Nenhum template encontrado
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <TemplateRow
                    template={selectedTemplate}
                    selected
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateId(null)}
                    className="mt-1.5 text-[12px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Trocar template
                  </button>
                </div>
              )}
            </Section>
          )}

          {/* Step: Aluno (skip se aluno fixo) */}
          {!alunoFixo && !preSelectedAlunoId && (
            <Section
              number={isAlunoFixoMode ? 2 : 1}
              title="Selecionar aluno"
              icon={<Search size={14} />}
            >
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
                      placeholder="Buscar aluno por nome…"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
                    />
                  </div>
                  <div className="mt-2 max-h-[260px] space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-1.5 dark:border-slate-800 dark:bg-slate-900/40">
                    {filteredAlunos.map((a) => (
                      <AlunoRow
                        key={a.id}
                        aluno={a}
                        selected={false}
                        onClick={() => setSelectedAlunoId(a.id)}
                      />
                    ))}
                    {filteredAlunos.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                        Nenhum aluno encontrado
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <AlunoRow aluno={aluno} selected />
                  <button
                    type="button"
                    onClick={() => setSelectedAlunoId(null)}
                    className="mt-1.5 text-[12px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Trocar aluno
                  </button>
                  {aluno.hasPlanoAtivo && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-900/10">
                      <AlertTriangle
                        size={14}
                        className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-amber-900 dark:text-amber-200">
                          Aluno já tem plano ativo
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-amber-800 dark:text-amber-300">
                          “{aluno.planoAtivoNome}”. Ao confirmar, o plano atual será
                          substituído pelo novo (o histórico fica preservado).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Section>
          )}

          {/* Step: Data início */}
          <Section
            number={isAlunoFixoMode ? 3 : 2}
            title="Data de início"
            icon={<CalendarDays size={14} />}
          >
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-teal-600"
            />
          </Section>

          {/* Step: Agenda semanal */}
          <Section
            number={isAlunoFixoMode ? 4 : 3}
            title="Agenda semanal"
            icon={<CalendarDays size={14} />}
          >
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              {selectedTemplate
                ? 'Atribua qual treino o aluno faz em cada dia. Toque várias vezes para alternar.'
                : 'Escolha um template primeiro pra configurar a agenda.'}
            </p>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {DIAS.map((d) => (
                <DayCell
                  key={d.id}
                  label={d.label}
                  fullLabel={d.full}
                  letra={agenda[d.id]}
                  treinoLetras={treinoLetras}
                  onChange={(letra) => handleSetDay(d.id, letra)}
                  disabled={!selectedTemplate}
                />
              ))}
            </div>
            {selectedTemplate && totalDiasSemana === 0 && (
              <p className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">
                Selecione pelo menos um dia.
              </p>
            )}
          </Section>

          {/* Step: Duração */}
          <Section
            number={isAlunoFixoMode ? 5 : 4}
            title="Duração"
            icon={<Clock4 size={14} />}
          >
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(DURACAO_LABEL) as DuracaoId[]).map((id) => {
                const active = duracao === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDuracao(id)}
                    className={`
                      rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all
                      ${
                        active
                          ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    {DURACAO_LABEL[id]}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Step: Toggle */}
          <Section
            number={isAlunoFixoMode ? 6 : 5}
            title="Autonomia do aluno"
            icon={<Settings2 size={14} />}
          >
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
              <input
                type="checkbox"
                checked={permitirAjusteCarga}
                onChange={(e) => setPermitirAjusteCarga(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  Permitir aluno ajustar carga no app
                </p>
                <p className="mt-0.5 text-[12px] leading-snug text-slate-500 dark:text-slate-400">
                  Quando ativo, o aluno pode aumentar/diminuir a carga prescrita
                  conforme evolui ou se sentir desconforto. Você vê a carga real na aba Comparação.
                  Recomendado pra alunos intermediários+. Desligue pra iniciantes ou reabilitação.
                </p>
              </div>
            </label>
          </Section>

          {/* Resumo */}
          {canConfirm && aluno && selectedTemplate && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-800 dark:bg-teal-900/20">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <CheckCircle2 size={14} />
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
                  Resumo
                </p>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-teal-900 dark:text-teal-100">
                <strong>{aluno.nome}</strong> recebe <strong>{selectedTemplate.nome}</strong>{' '}
                a partir de <strong>{dataInicioFormatada}</strong>,{' '}
                <strong>
                  {diasComTreino
                    .map((d) => `${d.full.toLowerCase()} (${agenda[d.id]})`)
                    .join(', ')}
                </strong>
                , por <strong>{DURACAO_LABEL[duracao].toLowerCase()}</strong>.
                {permitirAjusteCarga ? (
                  <> Aluno <strong>pode</strong> ajustar carga.</>
                ) : (
                  <> Aluno <strong>não pode</strong> ajustar carga.</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
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
            Confirmar e enviar pro app
          </button>
        </footer>
      </aside>
    </>
  )
}

function Section({
  number,
  title,
  icon,
  children,
}: {
  number: number
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <header className="flex items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          {number}
        </span>
        <span className="text-slate-500 dark:text-slate-400">{icon}</span>
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
  selected,
  onClick,
}: {
  aluno: AlunoOption
  selected: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={selected && !onClick}
      className={`
        flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors
        ${
          selected
            ? 'bg-teal-50 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/30 dark:ring-teal-800'
            : 'hover:bg-white dark:hover:bg-slate-800'
        }
      `}
    >
      {aluno.avatarUrl ? (
        <img
          src={aluno.avatarUrl}
          alt=""
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
        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
          {aluno.ultimaAtividade}
        </p>
      </div>
      {aluno.hasPlanoAtivo && (
        <span className="inline-flex shrink-0 items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          Em plano
        </span>
      )}
      {selected && (
        <span className="text-teal-600 dark:text-teal-400">
          <CheckCircle2 size={16} />
        </span>
      )}
    </button>
  )
}

function TemplateRow({
  template,
  selected,
  onClick,
}: {
  template: Plano
  selected?: boolean
  onClick?: () => void
}) {
  const objStyle = OBJETIVO_STYLE[template.objetivo]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={selected && !onClick}
      className={`
        flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors
        ${
          selected
            ? 'bg-teal-50 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/30 dark:ring-teal-800'
            : 'hover:bg-white dark:hover:bg-slate-800'
        }
      `}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${objStyle.badge}`}>
        <Dumbbell size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {template.nome}
        </p>
        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
          {objStyle.label} · {template.treinos.length} treino
          {template.treinos.length === 1 ? '' : 's'}
          {template.aplicadoEmAlunosCount && template.aplicadoEmAlunosCount > 0
            ? ` · aplicado em ${template.aplicadoEmAlunosCount}`
            : ''}
        </p>
      </div>
      {selected && (
        <span className="text-teal-600 dark:text-teal-400">
          <CheckCircle2 size={16} />
        </span>
      )}
    </button>
  )
}

function DayCell({
  label,
  fullLabel,
  letra,
  treinoLetras,
  onChange,
  disabled,
}: {
  label: string
  fullLabel: string
  letra: string | null
  treinoLetras: string[]
  onChange: (letra: string | null) => void
  disabled?: boolean
}) {
  const handleClick = () => {
    if (disabled || treinoLetras.length === 0) return
    if (letra == null) {
      onChange(treinoLetras[0])
      return
    }
    const idx = treinoLetras.indexOf(letra)
    if (idx === treinoLetras.length - 1) {
      onChange(null)
    } else {
      onChange(treinoLetras[idx + 1])
    }
  }

  const filled = letra != null

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={`${fullLabel}: ${letra ?? 'descanso'}`}
      className={`
        flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2.5 text-center transition-colors
        ${
          disabled
            ? 'cursor-not-allowed border border-dashed border-slate-200 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-700'
            : filled
              ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
              : 'border border-dashed border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
        }
      `}
    >
      <span className="font-mono text-[9px] font-semibold uppercase tracking-wider opacity-80">
        {label}
      </span>
      <span className="font-mono text-base font-bold tabular-nums">
        {letra ?? '—'}
      </span>
    </button>
  )
}
