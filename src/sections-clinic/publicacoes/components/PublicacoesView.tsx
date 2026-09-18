import { useMemo } from 'react'
import {
  CalendarClock,
  CheckCircle2,
  Inbox,
  Instagram,
  Mic,
  RotateCcw,
  Repeat,
  Sparkles,
  Wand2,
} from 'lucide-react'
import type {
  AbaPublicacoes,
  ContaConectada,
  ContextoNegocio,
  FiltroPublicacao,
  PadroesMarca,
  PautaSemanal,
  Publicacao,
  QuotaAddon,
  RegrasAprovacao,
} from '@/../product-clinic/sections/publicacoes/types'
import { ConfiguracoesPublicacoes } from './ConfiguracoesPublicacoes'
import { DetalhePublicacao } from './DetalhePublicacao'
import {
  FORMATO_LABEL,
  STATUS_META,
  contarPorFiltro,
  dataLonga,
  diasAte,
  filtrar,
  quando,
  temBloqueio,
} from './helpers'

interface Props {
  conta: ContaConectada
  quota: QuotaAddon
  pauta: PautaSemanal
  contexto: ContextoNegocio
  clinica: { nome: string; especialidades: string[] }
  padroes: PadroesMarca
  regras: RegrasAprovacao
  publicacoes: Publicacao[]
  aba: AbaPublicacoes
  filtro: FiltroPublicacao
  selecionada: Publicacao | null
  /** No mobile o detalhe é drawer: só cobre a tela depois de tocar num item. */
  drawerAberto: boolean
  onAba: (a: AbaPublicacoes) => void
  onFiltro: (f: FiltroPublicacao) => void
  onSelecionar: (p: Publicacao) => void
  onFecharDrawer: () => void
  onDitar: () => void
  onNovo: () => void
  onAlternarPauta: (ativa: boolean) => void
  /** A lista inteira de assuntos da pauta — ver `ConfiguracoesPublicacoes`. */
  onAssuntosPauta: (assuntos: string[]) => void
  onConectarConta: () => void
  onDesconectarConta: () => void
  onSalvarPadroes: (p: PadroesMarca) => void
  onSalvarRegras: (r: RegrasAprovacao) => void
  onSalvarContexto: (c: ContextoNegocio) => void
  onRefazer: (id: string, instrucao: string) => void
  onEditarLegenda: (id: string, legenda: string) => void
  onAbrirAgendar: (p: Publicacao) => void
  onPublicarAgora: (p: Publicacao) => void
  onExcluir: (p: Publicacao) => void
  onTentarNovamente: (p: Publicacao) => void
  onReconectarConta: () => void
}

const FILTROS: { id: FiltroPublicacao; label: string }[] = [
  { id: 'tudo', label: 'Tudo' },
  { id: 'revisar', label: 'Revisar' },
  { id: 'agendados', label: 'Agendados' },
  { id: 'publicados', label: 'Publicados' },
  { id: 'problemas', label: 'Problemas' },
]

export function PublicacoesView({
  conta,
  quota,
  pauta,
  contexto,
  clinica,
  padroes,
  regras,
  publicacoes,
  aba,
  filtro,
  selecionada,
  drawerAberto,
  onAba,
  onFiltro,
  onSelecionar,
  onFecharDrawer,
  onDitar,
  onNovo,
  onAlternarPauta,
  onAssuntosPauta,
  onConectarConta,
  onDesconectarConta,
  onSalvarPadroes,
  onSalvarRegras,
  onSalvarContexto,
  ...acoes
}: Props) {
  const lista = useMemo(() => filtrar(publicacoes, filtro), [publicacoes, filtro])
  const quotaEsgotada = quota.postsUsados >= quota.postsIncluidos
  const diasToken = diasAte(conta.tokenExpiraEm)
  const tokenVencendo = diasToken <= 7

  const resumo = {
    revisar: contarPorFiltro(publicacoes, 'revisar'),
    agendados: contarPorFiltro(publicacoes, 'agendados'),
    publicados: contarPorFiltro(publicacoes, 'publicados'),
  }

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Publicações</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {resumo.revisar} a revisar · {resumo.agendados} agendados · {resumo.publicados}{' '}
            publicados no mês
          </p>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium ${
              quotaEsgotada
                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
            title={`Cota do add-on ${quota.addon}. Gerar e refazer gastam 1 cada.`}
          >
            <Sparkles className="h-3 w-3" />
            {quota.postsUsados}/{quota.postsIncluidos} posts · renova em{' '}
            {dataLonga(quota.renovaEm)}
          </span>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={onDitar}
            disabled={quotaEsgotada}
            title={quotaEsgotada ? 'Cota de IA do mês esgotada' : undefined}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
          >
            <Mic className="h-4 w-4" /> Ditar post
          </button>
          <button
            onClick={onNovo}
            disabled={quotaEsgotada}
            title={quotaEsgotada ? 'Cota de IA do mês esgotada' : undefined}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:disabled:text-slate-600"
          >
            <Wand2 className="h-4 w-4" /> Novo post
          </button>
        </div>
      </div>

      {/* Abas — o módulo é vendido à parte, então carrega as próprias configurações */}
      <div className="mt-5 flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'fila' as const, label: 'Fila' },
            { id: 'configuracoes' as const, label: 'Configurações' },
          ]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => onAba(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              aba === t.id
                ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/*
        Na fila a conta só aparece quando há o que fazer: autorização vencendo para de
        publicar, e isso é alerta, não configuração. O estado completo da conta mora na
        aba Configurações.
      */}
      {aba === 'fila' && tokenVencendo && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex min-w-0 items-center gap-2.5">
            <Instagram className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="min-w-0 text-xs text-amber-800 dark:text-amber-200">
              <span className="font-medium">{conta.usuario}</span> ·{' '}
              {diasToken <= 0
                ? 'autorização expirada — nada publica até reconectar.'
                : `a autorização expira em ${diasToken} dia${diasToken === 1 ? '' : 's'}.`}
            </p>
          </div>
          <button
            onClick={acoes.onReconectarConta}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-amber-700"
          >
            <RotateCcw className="h-3 w-3" /> Reconectar
          </button>
        </div>
      )}

      {aba === 'configuracoes' && (
        <div className="mt-4">
          <ConfiguracoesPublicacoes
            conta={conta}
            pauta={pauta}
            contexto={contexto}
            clinica={clinica}
            padroes={padroes}
            regras={regras}
            onConectarConta={onConectarConta}
            onDesconectarConta={onDesconectarConta}
            onAlternarPauta={onAlternarPauta}
            onAssuntosPauta={onAssuntosPauta}
            onSalvarPadroes={onSalvarPadroes}
            onSalvarRegras={onSalvarRegras}
            onSalvarContexto={onSalvarContexto}
          />
        </div>
      )}

      {/* Filtros */}
      {aba === 'fila' && (
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {FILTROS.map((f) => {
          const n = contarPorFiltro(publicacoes, f.id)
          return (
            <button
              key={f.id}
              onClick={() => onFiltro(f.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filtro === f.id
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
              <span className="ml-1 tabular-nums opacity-60">{n}</span>
            </button>
          )
        })}
      </div>
      )}

      {aba === 'fila' && (
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Fila */}
        <div className="lg:col-span-7">
          {publicacoes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
              <Mic className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                Nenhuma publicação ainda
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-500">
                O caminho mais curto é falar: toque em <strong>Ditar post</strong>, diga o assunto em
                uma frase e a IA devolve legenda, hashtags e os cartões para você revisar.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={onDitar}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  <Mic className="h-4 w-4" /> Ditar post
                </button>
                <button
                  onClick={onNovo}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Wand2 className="h-4 w-4" /> Escrever o brief
                </button>
              </div>
            </div>
          ) : lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
              <Inbox className="mx-auto mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
              Nada neste filtro.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {lista.map((p) => {
                  const meta = STATUS_META[p.status]
                  const ativo = selecionada?.id === p.id
                  const bloqueado = temBloqueio(p)
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => onSelecionar(p)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                          ativo
                            ? 'bg-teal-50/60 dark:bg-teal-950/20'
                            : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50'
                        } ${bloqueado ? 'border-l-2 border-l-amber-400' : 'border-l-2 border-l-transparent'}`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.ponto}`}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                            {p.tema}
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                            <span>{FORMATO_LABEL[p.formato]}</span>
                            <span>·</span>
                            <span className="truncate">{p.autor.nome}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              {p.status === 'publicado' ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" /> {quando(p.publicadoEm)}
                                </>
                              ) : (
                                <>
                                  <CalendarClock className="h-3 w-3" /> {quando(p.agendadoPara)}
                                </>
                              )}
                            </span>
                            {p.origem === 'voz' && <Mic className="h-3 w-3" />}
                            {p.origem === 'pauta' && <Repeat className="h-3 w-3" />}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

        </div>

        {/* Detalhe — coluna fixa no desktop, drawer no mobile */}
        {selecionada && (
          <div
            className={`${
              drawerAberto
                ? 'fixed inset-0 z-50 overflow-y-auto bg-white p-4 dark:bg-slate-900'
                : 'hidden'
            } lg:static lg:z-auto lg:col-span-5 lg:block lg:overflow-visible lg:bg-transparent lg:p-0 lg:dark:bg-transparent`}
          >
            <div className="lg:sticky lg:top-6">
              {/*
                `key` por publicação: trocar de post REMONTA o detalhe. É o que zera o
                carrossel, o editor de legenda e a instrução de refazer — sem isso a
                instrução digitada para um post é enviada para o outro.
              */}
              <DetalhePublicacao
                key={selecionada.id}
                publicacao={selecionada}
                conta={conta}
                quotaEsgotada={quotaEsgotada}
                mostrarRegistro={padroes.mostrarRegistro}
                onFechar={onFecharDrawer}
                {...acoes}
              />
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
