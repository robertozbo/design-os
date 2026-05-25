import { useMemo, useState } from 'react'
import type {
  CategoriaEvidencia,
  Evidencia,
  ItemDetailProps,
  MudancaHistorico,
  Prioridade,
  StatusItem,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import {
  ChevronRight,
  ChevronLeft,
  Pencil,
  Archive,
  User2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Plus,
  X,
  Upload,
  ArrowUpRight,
  History,
  Flame,
  Target,
  Sparkles,
  Save,
  Stethoscope,
  TrendingDown,
  Building2,
  BookOpen,
  Activity,
  FileText,
} from 'lucide-react'

const STATUS_OPCOES: { v: StatusItem; label: string; bg: string; text: string; ring: string; dot: string }[] = [
  { v: 'planejado', label: 'Planejado', bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-700 dark:text-slate-300', ring: 'ring-slate-200 dark:ring-slate-700', dot: 'bg-slate-400' },
  { v: 'em_execucao', label: 'Em execução', bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', ring: 'ring-teal-200 dark:ring-teal-900', dot: 'bg-teal-500' },
  { v: 'em_revisao', label: 'Em revisão', bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', ring: 'ring-violet-200 dark:ring-violet-900', dot: 'bg-violet-500' },
  { v: 'concluido', label: 'Concluído', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-200 dark:ring-emerald-900', dot: 'bg-emerald-500' },
]

const PRIORIDADE_TONE: Record<Prioridade, { bg: string; text: string; label: string; icon?: boolean }> = {
  alta: { bg: 'bg-rose-100 dark:bg-rose-950/50', text: 'text-rose-800 dark:text-rose-300', label: 'Alta prioridade', icon: true },
  media: { bg: 'bg-amber-100 dark:bg-amber-950/50', text: 'text-amber-800 dark:text-amber-300', label: 'Média prioridade' },
  baixa: { bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-700 dark:text-slate-300', label: 'Baixa prioridade' },
}

const CATEGORIA_LABEL: Record<CategoriaEvidencia, string> = {
  atestado: 'Atestado',
  presenteismo: 'Presenteísmo',
  turnover: 'Turnover',
  gptw_clima: 'GPTW / Clima',
  cid: 'CID',
  outro: 'Outro',
}

const CATEGORIA_ICON: Record<CategoriaEvidencia, typeof FileText> = {
  atestado: Stethoscope,
  presenteismo: TrendingDown,
  turnover: Building2,
  gptw_clima: Activity,
  cid: BookOpen,
  outro: FileText,
}

const TIPO_MUDANCA_LABEL: Record<MudancaHistorico['tipo'], string> = {
  criado: 'Item criado',
  status: 'Status alterado',
  responsavel: 'Responsável alterado',
  prazo: 'Prazo estendido',
  evidencia: 'Evidência anexada',
}

export function ItemDetail({
  empregadorContexto,
  planoVigente,
  item,
  responsaveisDisponiveis,
  onVoltar,
  onEditarItem,
  onChangeStatus,
  onChangeResponsavel,
  onEstenderPrazo,
  onAddEvidencia,
  onRemoveEvidencia,
  onSalvarImpacto,
  onArchive,
  onNavigateToAvaliacao,
  onAbrirEvidencia,
}: ItemDetailProps) {
  const [impacto, setImpacto] = useState(item.impactoObservado ?? '')
  const [editingImpacto, setEditingImpacto] = useState(false)

  const isConcluido = item.status === 'concluido'
  const prazoMs = useMemo(() => new Date(item.prazo).getTime(), [item.prazo])
  const hojeMs = Date.now()
  const diasParaPrazo = Math.ceil((prazoMs - hojeMs) / (24 * 60 * 60 * 1000))
  const isAtrasado = !isConcluido && diasParaPrazo < 0
  const isProximo = !isConcluido && diasParaPrazo >= 0 && diasParaPrazo <= 7

  const statusAtual = STATUS_OPCOES.find((s) => s.v === item.status)!
  const prioridadeTone = PRIORIDADE_TONE[item.prioridade]

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap">
          <button type="button" onClick={onVoltar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">{empregadorContexto.nomeFantasia}</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button type="button" onClick={onVoltar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Plano de Ação
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 truncate max-w-[280px]">{item.titulo}</span>
        </div>

        <button
          type="button"
          onClick={onVoltar}
          className="nymos-reveal opacity-0 inline-flex items-center gap-1 mb-3 text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition lg:hidden"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Voltar para Plano
        </button>

        {/* Hero header */}
        <header
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950 overflow-hidden"
        >
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusAtual.bg} ${statusAtual.text} ring-1 ${statusAtual.ring}`}>
                  <span className={`inline-flex w-1.5 h-1.5 rounded-full ${statusAtual.dot}`} />
                  {statusAtual.label}
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${prioridadeTone.bg} ${prioridadeTone.text}`}>
                  {prioridadeTone.icon && <Flame className="w-2.5 h-2.5" strokeWidth={2.25} />}
                  {prioridadeTone.label}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {item.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {item.titulo}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-[760px]">
                {item.descricao}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => onEditarItem?.(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition"
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onArchive?.(item.id)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Arquivar"
                title="Arquivar"
              >
                <Archive className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Status transitions */}
          <div className="px-6 py-3 border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Mover para
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_OPCOES.filter((s) => s.v !== item.status).map((s) => (
                <button
                  key={s.v}
                  type="button"
                  onClick={() => onChangeStatus?.(item.id, s.v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium ${s.bg} ${s.text} ring-1 ${s.ring} hover:brightness-105 active:translate-y-px transition`}
                >
                  <span className={`inline-flex w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {isAtrasado && (
            <div className="px-6 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20">
              <p className="text-[12px] text-rose-800 dark:text-rose-200 inline-flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                Item vencido há {Math.abs(diasParaPrazo)} dia{Math.abs(diasParaPrazo) > 1 ? 's' : ''} — estenda o prazo ou marque como concluído.
              </p>
            </div>
          )}
        </header>

        {/* 2-col layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5 min-w-0">
            {/* Origem da matriz */}
            <Panel icon={<Target className="w-3.5 h-3.5" strokeWidth={1.75} />} titulo="Origem na matriz psicossocial" delay="120ms">
              {item.origem.tipo === 'matriz' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToAvaliacao?.(planoVigente.avaliacaoOrigemId, item.origem.setorId, item.origem.fatorId)}
                    className="group w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-900/50 hover:border-violet-300 dark:hover:border-violet-800 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 text-violet-600 dark:text-violet-400 shrink-0" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-violet-900 dark:text-violet-200">
                        {item.origem.perigoNome}
                      </p>
                      <p className="text-[11px] text-violet-700 dark:text-violet-300 mt-0.5">
                        Setor <span className="font-medium">{item.origem.setorNome}</span> ·
                        Fator <span className="font-medium">{item.origem.fatorNome}</span> ·
                        Instrumento <span className="font-mono">{item.origem.instrumentoSigla}</span>
                      </p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-violet-600/70 dark:text-violet-400/70 group-hover:translate-x-0.5 transition" strokeWidth={2} />
                  </button>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Origem: <span className="font-medium text-slate-700 dark:text-slate-300">{planoVigente.avaliacaoOrigemNome}</span>
                  </p>
                </div>
              ) : (
                <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{item.origem.perigoNome}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Item criado livre, sem vínculo direto com célula da matriz.
                  </p>
                </div>
              )}
            </Panel>

            {/* Responsável + prazo */}
            <Panel icon={<User2 className="w-3.5 h-3.5" strokeWidth={1.75} />} titulo="Responsável e prazo" delay="180ms">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Responsável */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Responsável
                  </p>
                  {item.responsavel ? (
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900/40 text-teal-700 dark:text-teal-300 text-[11px] font-semibold">
                        {item.responsavel.nome.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate">
                          {item.responsavel.nome}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {item.responsavel.cargo} ·{' '}
                          <span className={item.responsavel.papel === 'sst' ? 'text-teal-700 dark:text-teal-300 font-medium' : ''}>
                            {item.responsavel.papel === 'sst' ? 'SST' : 'Gestor de linha'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const id = prompt('ID do responsável (escolha um da lista)') ?? ''
                        if (id) onChangeResponsavel?.(item.id, id)
                      }}
                      className="w-full px-3 py-2 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-[12px] text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition inline-flex items-center justify-center gap-1.5"
                    >
                      <User2 className="w-3 h-3" strokeWidth={2} />
                      Atribuir responsável
                    </button>
                  )}
                  {item.coResponsavelSst && (
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Co-responsável SST: <span className="font-medium text-slate-700 dark:text-slate-300">{item.coResponsavelSst.nome}</span>
                    </p>
                  )}
                </div>

                {/* Prazo */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Prazo
                  </p>
                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${
                    isAtrasado
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-900/50'
                      : isProximo
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-900/50'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800'
                  }`}>
                    <Calendar className={`w-3.5 h-3.5 ${
                      isAtrasado ? 'text-rose-600 dark:text-rose-400' : isProximo ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                    }`} strokeWidth={1.75} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12px] font-mono font-medium tabular-nums ${
                        isAtrasado ? 'text-rose-700 dark:text-rose-300' : isProximo ? 'text-amber-800 dark:text-amber-300' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {formatDate(item.prazo)}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isAtrasado
                          ? `vencido há ${Math.abs(diasParaPrazo)}d`
                          : diasParaPrazo === 0
                            ? 'vence hoje'
                            : `em ${diasParaPrazo}d`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const novoPrazo = prompt('Nova data (YYYY-MM-DD)') ?? ''
                        const just = prompt('Justificativa da extensão') ?? ''
                        if (novoPrazo && just) onEstenderPrazo?.(item.id, novoPrazo, just)
                      }}
                      className="text-[10px] font-medium text-teal-700 dark:text-teal-300 hover:underline"
                    >
                      Estender
                    </button>
                  </div>
                  {item.marcoIntermediario && (
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                      <Target className="w-2.5 h-2.5" strokeWidth={2} />
                      Marco intermediário: <span className="font-mono text-slate-700 dark:text-slate-300">{formatDate(item.marcoIntermediario)}</span>
                    </p>
                  )}
                </div>
              </div>
            </Panel>

            {/* Evidências */}
            <Panel
              icon={<Paperclip className="w-3.5 h-3.5" strokeWidth={1.75} />}
              titulo="Evidências"
              counter={item.evidencias.length}
              delay="240ms"
              acao={
                <button
                  type="button"
                  onClick={() => onAddEvidencia?.(item.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition"
                >
                  <Plus className="w-3 h-3" strokeWidth={2.25} />
                  Anexar evidência
                </button>
              }
            >
              {item.evidencias.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onAddEvidencia?.(item.id)}
                  className="w-full px-4 py-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 text-center hover:border-teal-400 dark:hover:border-teal-700 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition group"
                >
                  <Upload className="w-5 h-5 mx-auto mb-1.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition" strokeWidth={1.5} />
                  <p className="text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                    Anexe atestados, dados de presenteísmo, turnover, GPTW ou CIDs
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    PDF · JPG · PNG · até 10 MB
                  </p>
                </button>
              ) : (
                <ul className="space-y-1.5">
                  {item.evidencias.map((ev) => (
                    <EvidenciaRow
                      key={ev.id}
                      evidencia={ev}
                      onAbrir={() => onAbrirEvidencia?.(item.id, ev.id)}
                      onRemover={() => onRemoveEvidencia?.(item.id, ev.id)}
                    />
                  ))}
                </ul>
              )}
            </Panel>

            {/* Impacto observado — só aparece quando concluído ou em revisão */}
            {(isConcluido || item.status === 'em_revisao') && (
              <Panel
                icon={<CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
                titulo="Impacto observado"
                delay="300ms"
                acao={
                  !editingImpacto && (
                    <button
                      type="button"
                      onClick={() => setEditingImpacto(true)}
                      className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline"
                    >
                      {item.impactoObservado ? 'Editar' : 'Adicionar'}
                    </button>
                  )
                }
              >
                {editingImpacto ? (
                  <div className="space-y-2">
                    <textarea
                      value={impacto}
                      onChange={(e) => setImpacto(e.target.value)}
                      rows={4}
                      placeholder="Descreva o impacto observado após a execução do item. Ex: redução de 22% em atestados nos 60 dias seguintes; clima do setor saiu de 6.2 pra 7.4 na pesquisa pós-ação."
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-[12px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImpacto(item.impactoObservado ?? '')
                          setEditingImpacto(false)
                        }}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSalvarImpacto?.(item.id, impacto.trim())
                          setEditingImpacto(false)
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white transition"
                      >
                        <Save className="w-3 h-3" strokeWidth={2.25} />
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : item.impactoObservado ? (
                  <p className="text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl px-4 py-3">
                    {item.impactoObservado}
                  </p>
                ) : (
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center py-4">
                    Sem impacto registrado. Documente os resultados pra fortalecer o PGR.
                  </p>
                )}
              </Panel>
            )}
          </div>

          {/* Coluna lateral: histórico */}
          <aside className="lg:col-span-4 min-w-0">
            <Panel icon={<History className="w-3.5 h-3.5" strokeWidth={1.75} />} titulo="Histórico de mudanças" delay="360ms">
              {item.mudancasHistorico.length === 0 ? (
                <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center py-4">
                  Sem histórico ainda.
                </p>
              ) : (
                <ol className="relative space-y-3 pl-5 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                  {item.mudancasHistorico.map((m, idx) => (
                    <li key={m.id} className="relative">
                      <span className={`absolute -left-[17px] top-1 inline-block w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900/40 ${idx === item.mudancasHistorico.length - 1 ? 'bg-teal-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">
                          {TIPO_MUDANCA_LABEL[m.tipo]}
                        </span>
                        <span className="shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                          {formatDateTime(m.data)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {m.autor}
                        {m.valorAnterior && m.valorNovo && (
                          <>
                            <span className="opacity-50 mx-1">·</span>
                            <span className="font-mono">{m.valorAnterior}</span>
                            <ArrowUpRight className="inline w-2 h-2 mx-0.5" strokeWidth={2} />
                            <span className="font-mono">{m.valorNovo}</span>
                          </>
                        )}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Panel({
  icon,
  titulo,
  counter,
  acao,
  delay,
  children,
}: {
  icon: React.ReactNode
  titulo: string
  counter?: number
  acao?: React.ReactNode
  delay: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{ animationDelay: delay }}
      className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {icon}
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{titulo}</h2>
          {counter !== undefined && (
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 tabular-nums">
              {counter}
            </span>
          )}
        </div>
        {acao}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}

function EvidenciaRow({
  evidencia,
  onAbrir,
  onRemover,
}: {
  evidencia: Evidencia
  onAbrir: () => void
  onRemover: () => void
}) {
  const Icon = CATEGORIA_ICON[evidencia.categoria]
  return (
    <li className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50/60 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition">
      <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </span>
      <button type="button" onClick={onAbrir} className="flex-1 min-w-0 text-left">
        <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">{evidencia.nome}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {CATEGORIA_LABEL[evidencia.categoria]} · {evidencia.fonte} · ref {formatDate(evidencia.dataReferencia)}
        </p>
        {evidencia.descricao && (
          <p className="text-[11px] text-slate-600 dark:text-slate-300/80 mt-0.5 line-clamp-1">
            {evidencia.descricao}
          </p>
        )}
      </button>
      <button
        type="button"
        onClick={onRemover}
        className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
        aria-label="Remover evidência"
      >
        <X className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
    </li>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  } catch {
    return '—'
  }
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mn = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm} ${hh}:${mn}`
  } catch {
    return '—'
  }
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
