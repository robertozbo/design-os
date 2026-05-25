import { useEffect, useMemo, useState } from 'react'
import type {
  NovoEditarItemDrawerProps,
  OrigemMatriz,
  PapelResponsavel,
  Prioridade,
  StatusItem,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import {
  X,
  Save,
  Target,
  Sparkles,
  Building2,
  Calendar,
  Flag,
  User2,
  Lightbulb,
  Plus,
  Check,
} from 'lucide-react'

const PRIORIDADE_OPCOES: { v: Prioridade; label: string; bg: string; text: string; ring: string }[] = [
  { v: 'alta', label: 'Alta', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', ring: 'ring-rose-300 dark:ring-rose-800' },
  { v: 'media', label: 'Média', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', ring: 'ring-amber-300 dark:ring-amber-800' },
  { v: 'baixa', label: 'Baixa', bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-700 dark:text-slate-300', ring: 'ring-slate-300 dark:ring-slate-700' },
]

const STATUS_OPCOES: { v: StatusItem; label: string; dot: string }[] = [
  { v: 'planejado', label: 'Planejado', dot: 'bg-slate-400' },
  { v: 'em_execucao', label: 'Em execução', dot: 'bg-teal-500' },
  { v: 'em_revisao', label: 'Em revisão', dot: 'bg-violet-500' },
  { v: 'concluido', label: 'Concluído', dot: 'bg-emerald-500' },
]

export function NovoEditarItemDrawer({
  open,
  itemEmEdicao,
  setoresAfetados,
  responsaveisDisponiveis,
  acoesSugeridas = [],
  onClose,
  onSave,
}: NovoEditarItemDrawerProps) {
  const isEdicao = !!itemEmEdicao

  const [tipoOrigem, setTipoOrigem] = useState<'matriz' | 'livre'>(
    itemEmEdicao?.origem.tipo ?? 'matriz',
  )
  const [setorId, setSetorId] = useState<string | null>(itemEmEdicao?.origem.setorId ?? null)
  const [perigoNome, setPerigoNome] = useState(itemEmEdicao?.origem.perigoNome ?? '')
  const [titulo, setTitulo] = useState(itemEmEdicao?.titulo ?? '')
  const [descricao, setDescricao] = useState(itemEmEdicao?.descricao ?? '')
  const [responsavelId, setResponsavelId] = useState<string | null>(
    itemEmEdicao?.responsavel?.id ?? null,
  )
  const [coResponsavelId, setCoResponsavelId] = useState<string | null>(
    itemEmEdicao?.coResponsavelSst?.id ?? null,
  )
  const [prazo, setPrazo] = useState(
    itemEmEdicao?.prazo ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  )
  const [marcoIntermediario, setMarcoIntermediario] = useState<string>(
    itemEmEdicao?.marcoIntermediario ?? '',
  )
  const [prioridade, setPrioridade] = useState<Prioridade>(itemEmEdicao?.prioridade ?? 'media')
  const [status, setStatus] = useState<StatusItem>(itemEmEdicao?.status ?? 'planejado')
  const [subTarefasMarcadas, setSubTarefasMarcadas] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const gestoresDoSetor = useMemo(() => {
    return responsaveisDisponiveis.filter((r) => r.papel === 'gestor_linha')
  }, [responsaveisDisponiveis])

  const coResponsavelOpcoes = useMemo(() => {
    return responsaveisDisponiveis.filter((r) => r.papel === 'sst')
  }, [responsaveisDisponiveis])

  const setor = setoresAfetados.find((s) => s.id === setorId)
  const valid = titulo.trim().length >= 3 && perigoNome.trim().length >= 3 && prazo

  if (!open) return null

  const handleSubmit = () => {
    if (!valid) return
    const origem: OrigemMatriz =
      tipoOrigem === 'matriz' && setor
        ? {
            tipo: 'matriz',
            setorId: setor.id,
            setorNome: setor.nome,
            estabelecimentoNome: setor.estabelecimentoNome,
            fatorId: itemEmEdicao?.origem.fatorId ?? null,
            fatorNome: itemEmEdicao?.origem.fatorNome ?? null,
            instrumentoSigla: itemEmEdicao?.origem.instrumentoSigla ?? null,
            classificacaoRisco: itemEmEdicao?.origem.classificacaoRisco ?? null,
            perigoNome,
          }
        : {
            tipo: 'livre',
            setorId: null,
            setorNome: null,
            estabelecimentoNome: null,
            fatorId: null,
            fatorNome: null,
            instrumentoSigla: null,
            classificacaoRisco: null,
            perigoNome,
          }
    onSave?.({
      id: itemEmEdicao?.id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      prioridade,
      status,
      origem,
      responsavelId,
      coResponsavelSstId: coResponsavelId,
      prazo,
      marcoIntermediario: marcoIntermediario || null,
    })
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-sm drawer-fade"
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label={isEdicao ? 'Editar item' : 'Novo item'}
        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[640px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-[-12px_0_30px_-12px_rgba(15,23,42,0.18)] dark:shadow-[-12px_0_30px_-12px_rgba(0,0,0,0.6)] flex flex-col drawer-slide"
      >
        <DrawerStyles />

        <header className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400 mb-1 inline-flex items-center gap-1.5">
              <Target className="w-3 h-3 text-teal-600 dark:text-teal-400" strokeWidth={2} />
              Plano de Ação · {isEdicao ? 'Editar' : 'Novo item'}
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {isEdicao ? itemEmEdicao!.titulo : 'Criar novo item de ação'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Origem */}
          <Section icon={<Sparkles className="w-3 h-3" strokeWidth={2} />} titulo="Origem">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoOrigem('matriz')}
                className={`px-3 py-2.5 rounded-xl border text-left transition ${
                  tipoOrigem === 'matriz'
                    ? 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <p className={`text-[12px] font-semibold ${tipoOrigem === 'matriz' ? 'text-violet-900 dark:text-violet-200' : 'text-slate-900 dark:text-slate-100'}`}>
                  Vinculado à matriz
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Origem em célula Setor × Fator
                </p>
              </button>
              <button
                type="button"
                onClick={() => setTipoOrigem('livre')}
                className={`px-3 py-2.5 rounded-xl border text-left transition ${
                  tipoOrigem === 'livre'
                    ? 'border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <p className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  Criação livre
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Sem vínculo com matriz
                </p>
              </button>
            </div>

            {tipoOrigem === 'matriz' && (
              <label className="block mt-3">
                <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1 inline-flex items-center gap-1">
                  <Building2 className="w-2.5 h-2.5" strokeWidth={2} />
                  Setor afetado
                </span>
                <select
                  value={setorId ?? ''}
                  onChange={(e) => setSetorId(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition cursor-pointer"
                >
                  <option value="">Selecione…</option>
                  {setoresAfetados.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} · {s.estabelecimentoNome}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block mt-3">
              <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Perigo / fator <span className="text-rose-500 dark:text-rose-400">*</span>
              </span>
              <input
                type="text"
                value={perigoNome}
                onChange={(e) => setPerigoNome(e.target.value)}
                placeholder="Ex: Sobrecarga de trabalho na Linha de Envase 2"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
              />
            </label>
          </Section>

          {/* Identificação */}
          <Section icon={<Flag className="w-3 h-3" strokeWidth={2} />} titulo="Identificação">
            <label className="block">
              <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Título <span className="text-rose-500 dark:text-rose-400">*</span>
              </span>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Redistribuir cargas e rever metas operacionais"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
              />
            </label>
            <label className="block mt-3">
              <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descrição
              </span>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="O que precisa ser feito, como e por quê. Inclua escopo e indicadores esperados."
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition resize-none"
              />
            </label>
          </Section>

          {/* Responsável */}
          <Section icon={<User2 className="w-3 h-3" strokeWidth={2} />} titulo="Responsável">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Gestor de linha
                </span>
                <select
                  value={responsavelId ?? ''}
                  onChange={(e) => setResponsavelId(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition cursor-pointer"
                >
                  <option value="">Sem responsável</option>
                  {gestoresDoSetor.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome} · {r.cargo}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Co-responsável SST (opcional)
                </span>
                <select
                  value={coResponsavelId ?? ''}
                  onChange={(e) => setCoResponsavelId(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition cursor-pointer"
                >
                  <option value="">Sem co-responsável</option>
                  {coResponsavelOpcoes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Section>

          {/* Prazo */}
          <Section icon={<Calendar className="w-3 h-3" strokeWidth={2} />} titulo="Prazo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Data limite <span className="text-rose-500 dark:text-rose-400">*</span>
                </span>
                <input
                  type="date"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
                />
              </label>
              <label className="block">
                <span className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Marco intermediário (opcional)
                </span>
                <input
                  type="date"
                  value={marcoIntermediario}
                  onChange={(e) => setMarcoIntermediario(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
                />
              </label>
            </div>
          </Section>

          {/* Prioridade + Status */}
          <Section icon={<Flag className="w-3 h-3" strokeWidth={2} />} titulo="Prioridade e status inicial">
            <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Prioridade
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              {PRIORIDADE_OPCOES.map((p) => {
                const active = prioridade === p.v
                return (
                  <button
                    key={p.v}
                    type="button"
                    onClick={() => setPrioridade(p.v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                      active
                        ? `${p.bg} ${p.text} ring-1 ${p.ring}`
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" strokeWidth={2.5} />}
                    {p.label}
                  </button>
                )
              })}
            </div>

            <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Status inicial
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_OPCOES.map((s) => {
                const active = status === s.v
                return (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => setStatus(s.v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                      active
                        ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-[0_2px_8px_-2px_rgba(13,148,136,0.45)]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`inline-flex w-1.5 h-1.5 rounded-full ${active ? 'bg-white/90' : s.dot}`} />
                    {s.label}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Ações sugeridas do catálogo */}
          {acoesSugeridas.length > 0 && (
            <Section icon={<Lightbulb className="w-3 h-3" strokeWidth={2} />} titulo="Ações sugeridas (Catálogo de Perigos)">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                Marque pra adicionar como sub-tarefas — facilita execução pelo gestor de linha.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {acoesSugeridas.map((acao) => {
                  const marcada = subTarefasMarcadas.has(acao)
                  return (
                    <button
                      key={acao}
                      type="button"
                      onClick={() =>
                        setSubTarefasMarcadas((prev) => {
                          const out = new Set(prev)
                          if (marcada) out.delete(acao)
                          else out.add(acao)
                          return out
                        })
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                        marcada
                          ? 'bg-teal-600 dark:bg-teal-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {marcada ? (
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : (
                        <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
                      )}
                      {acao}
                    </button>
                  )
                })}
              </div>
            </Section>
          )}
        </div>

        <footer className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!valid}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition ${
              valid
                ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" strokeWidth={2.25} />
            {isEdicao ? 'Salvar alterações' : 'Criar item'}
          </button>
        </footer>
      </aside>
    </>
  )
}

function Section({
  icon,
  titulo,
  children,
}: {
  icon: React.ReactNode
  titulo: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2 inline-flex items-center gap-1.5">
        {icon}
        {titulo}
      </legend>
      {children}
    </fieldset>
  )
}

function DrawerStyles() {
  return (
    <style>{`
      @keyframes drawer-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @keyframes drawer-slide-in {
        from { transform: translateX(20px); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      .drawer-slide {
        animation: drawer-slide-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .drawer-fade, .drawer-slide {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
