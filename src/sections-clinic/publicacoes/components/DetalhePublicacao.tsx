import { useState } from 'react'
import {
  AlertTriangle,
  CalendarClock,
  ExternalLink,
  Mic,
  Pencil,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react'
import type { ContaConectada, Publicacao } from '@/../product-clinic/sections/publicacoes/types'
import { PostPreview } from './PostPreview'
import { FORMATO_LABEL, STATUS_META, motivoNaoAgendar, quando } from './helpers'

interface Props {
  publicacao: Publicacao
  conta: ContaConectada
  /** Cota do add-on no fim: gerar e refazer desligam, agendar e publicar continuam. */
  quotaEsgotada: boolean
  /** Padrão da marca — registro profissional no rodapé do cartão. */
  mostrarRegistro: boolean
  onRefazer: (id: string, instrucao: string) => void
  onEditarLegenda: (id: string, legenda: string) => void
  onAbrirAgendar: (p: Publicacao) => void
  onPublicarAgora: (p: Publicacao) => void
  onExcluir: (p: Publicacao) => void
  onTentarNovamente: (p: Publicacao) => void
  onReconectarConta: () => void
  /** Só no mobile, onde o detalhe é drawer de tela cheia. */
  onFechar?: () => void
}

export function DetalhePublicacao({
  publicacao,
  conta,
  quotaEsgotada,
  mostrarRegistro,
  onRefazer,
  onEditarLegenda,
  onAbrirAgendar,
  onPublicarAgora,
  onExcluir,
  onTentarNovamente,
  onReconectarConta,
  onFechar,
}: Props) {
  const [refazendo, setRefazendo] = useState(false)
  const [instrucao, setInstrucao] = useState('')
  const [editando, setEditando] = useState(false)
  const [rascunhoLegenda, setRascunhoLegenda] = useState(publicacao.legenda)

  const meta = STATUS_META[publicacao.status]
  const naoAgendar = motivoNaoAgendar(publicacao, conta.publicadosHoje, conta.limiteDiario)
  const bloqueios = publicacao.alertas.filter((a) => a.severidade === 'bloqueio')
  const avisos = publicacao.alertas.filter((a) => a.severidade === 'aviso')
  const publicado = publicacao.status === 'publicado'
  const semTexto = publicacao.status === 'gerando' || publicacao.status === 'rascunho'

  return (
    <div className="flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${meta.badge}`}>
              {meta.label}
            </span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {FORMATO_LABEL[publicacao.formato]}
            </span>
            {publicacao.origem === 'voz' && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <Mic className="h-3 w-3" /> ditado
              </span>
            )}
            {publicacao.origem === 'pauta' && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">pauta semanal</span>
            )}
            {publicacao.versoes > 1 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                versão {publicacao.versoes}
              </span>
            )}
          </div>
          <h2 className="mt-1.5 text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">
            {publicacao.tema}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {publicacao.autor.nome} · {publicacao.autor.registro}
            {publicacao.agendadoPara && ` · ${quando(publicacao.agendadoPara)}`}
          </p>
        </div>
        {onFechar && (
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* A frase ditada, crua — é o que permite julgar se a IA entendeu o pedido */}
      {publicacao.briefOriginal && (
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            <Mic className="h-3 w-3" /> o que foi ditado
          </p>
          <p className="mt-1 text-xs italic leading-relaxed text-slate-600 dark:text-slate-300">
            “{publicacao.briefOriginal}”
          </p>
        </div>
      )}

      <PostPreview publicacao={publicacao} conta={conta} mostrarRegistro={mostrarRegistro} />

      {/* Alertas de publicidade */}
      {bloqueios.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            {bloqueios.length === 1 ? 'Bloqueado por 1 regra' : `Bloqueado por ${bloqueios.length} regras`}
          </p>
          <ul className="mt-2 space-y-2.5">
            {bloqueios.map((a) => (
              <li key={a.id} className="text-xs leading-relaxed">
                <p className="font-medium text-red-800 dark:text-red-200">{a.regra}</p>
                <p className="mt-0.5 rounded bg-red-100/70 px-1.5 py-0.5 font-mono text-[11px] text-red-900 dark:bg-red-900/40 dark:text-red-100">
                  “{a.trecho}”
                </p>
                <p className="mt-1 text-red-700/90 dark:text-red-300/90">{a.explicacao}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] text-red-600/80 dark:text-red-400/80">
            Não há “publicar mesmo assim”: a regra é do conselho do autor
            ({publicacao.autor.conselho}), não da clínica. Edite o trecho ou refaça.
          </p>
        </div>
      )}

      {avisos.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/30">
          {avisos.map((a) => (
            <div key={a.id} className="text-xs leading-relaxed">
              <p className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" /> Aviso · {a.regra}
              </p>
              <p className="mt-1 rounded bg-amber-100/70 px-1.5 py-0.5 font-mono text-[11px] text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
                “{a.trecho}”
              </p>
              <p className="mt-1 text-amber-700/90 dark:text-amber-300/90">{a.explicacao}</p>
            </div>
          ))}
          <p className="mt-2 text-[11px] text-amber-600/80 dark:text-amber-400/80">
            Aviso não impede agendar.
          </p>
        </div>
      )}

      {/* Falha do publish */}
      {publicacao.falha && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
          <p className="text-xs font-semibold text-red-700 dark:text-red-300">
            Não foi publicado · tentativa {publicacao.falha.tentativas}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-red-700/90 dark:text-red-300/90">
            {publicacao.falha.mensagem}
          </p>
          {publicacao.falha.codigo === 'token_expirado' ? (
            <button
              onClick={onReconectarConta}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reconectar {conta.usuario}
            </button>
          ) : (
            <button
              onClick={() => onTentarNovamente(publicacao)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Tentar novamente
            </button>
          )}
        </div>
      )}

      {/* Publicado: o único dado que volta é o link */}
      {publicado && publicacao.permalink && (
        <a
          href={publicacao.permalink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Ver no Instagram · publicado{' '}
          {quando(publicacao.publicadoEm)}
        </a>
      )}

      {/* Editor de legenda */}
      {editando && (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <textarea
            value={rascunhoLegenda}
            onChange={(e) => setRascunhoLegenda(e.target.value)}
            rows={8}
            className="w-full resize-y rounded-lg border border-slate-200 bg-white p-2.5 text-xs leading-relaxed text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Salvar devolve o post para <span className="font-medium">Revisar</span> — texto
              editado não segue aprovado.
            </p>
            <div className="flex shrink-0 gap-1.5">
              <button
                onClick={() => {
                  setEditando(false)
                  setRascunhoLegenda(publicacao.legenda)
                }}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onEditarLegenda(publicacao.id, rascunhoLegenda)
                  setEditando(false)
                }}
                className="rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
              >
                Salvar texto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refazer com instrução */}
      {refazendo && (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            o que mudar
          </label>
          <input
            value={instrucao}
            onChange={(e) => setInstrucao(e.target.value)}
            autoFocus
            placeholder="mais curto · sem emoji · cita a consulta no fim"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['Mais curto', 'Menos formal', 'Sem emoji', 'Fecha com convite'].map((sug) => (
              <button
                key={sug}
                onClick={() => setInstrucao(sug.toLowerCase())}
                className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {sug}
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Refazer gasta 1 da cota do mês.
            </p>
            <div className="flex shrink-0 gap-1.5">
              <button
                onClick={() => setRefazendo(false)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onRefazer(publicacao.id, instrucao.trim() || 'melhore o texto')
                  setRefazendo(false)
                  setInstrucao('')
                }}
                className="rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
              >
                Refazer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-start justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
        <Acao
          onClick={() => setRefazendo(true)}
          icone={<RefreshCw className="h-3.5 w-3.5" />}
          desabilitadoPor={
            publicado
              ? 'Post já publicado'
              : quotaEsgotada
                ? 'Cota de IA do mês esgotada'
                : publicacao.status === 'gerando'
                  ? 'A IA ainda está escrevendo'
                  : null
          }
        >
          Refazer
        </Acao>
        <Acao
          onClick={() => setEditando(true)}
          icone={<Pencil className="h-3.5 w-3.5" />}
          desabilitadoPor={publicado ? 'Post já publicado' : semTexto ? 'Sem texto ainda' : null}
        >
          Editar
        </Acao>
        <Acao
          onClick={() => onAbrirAgendar(publicacao)}
          icone={<CalendarClock className="h-3.5 w-3.5" />}
          desabilitadoPor={naoAgendar}
          primario
        >
          {publicacao.status === 'agendado' ? 'Reagendar' : 'Agendar'}
        </Acao>
        <Acao
          onClick={() => onPublicarAgora(publicacao)}
          icone={<Send className="h-3.5 w-3.5" />}
          desabilitadoPor={naoAgendar}
        >
          Publicar
        </Acao>
        </div>
        <Acao
          onClick={() => onExcluir(publicacao)}
          icone={<Trash2 className="h-3.5 w-3.5" />}
          desabilitadoPor={
            publicado
              ? 'Publicado não se exclui por aqui — saia pelo Instagram'
              : publicacao.status === 'publicando'
                ? 'Já está sendo publicado'
                : null
          }
          className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Excluir
        </Acao>
      </div>
    </div>
  )
}

/**
 * Botão de ação que, quando desabilitado, **diz por quê** — no rótulo do `title` e
 * no cursor. Botão morto e silencioso é o que gera o clique repetido.
 */
function Acao({
  onClick,
  icone,
  children,
  desabilitadoPor,
  primario = false,
  className = '',
}: {
  onClick: () => void
  icone: React.ReactNode
  children: React.ReactNode
  desabilitadoPor: string | null
  primario?: boolean
  className?: string
}) {
  const off = desabilitadoPor !== null
  const base =
    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors'
  const tom = primario
    ? 'bg-teal-600 text-white hover:bg-teal-700'
    : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'

  return (
    <button
      onClick={onClick}
      disabled={off}
      title={desabilitadoPor ?? undefined}
      className={`${base} ${primario && !off ? tom : off ? 'cursor-not-allowed border border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-600' : tom} ${off ? '' : className}`}
    >
      {icone}
      {children}
    </button>
  )
}
