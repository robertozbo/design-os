import type {
  Anexo,
  TipoEvento,
  TrabalhadorFormLite,
  ValidacaoXsd,
} from '@/../product/sections/eventos-esocial/types'
import {
  ShieldCheck,
  ShieldAlert,
  User2,
  FileEdit,
  Paperclip,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'

interface Props {
  tipo: TipoEvento
  trabalhador: TrabalhadorFormLite | null
  dados: Record<string, string>
  anexos: Anexo[]
  validacao: ValidacaoXsd | null
  onRevalidar: () => void
  onVoltarParaPasso: (passo: 0 | 1 | 2) => void
}

export function Step4Revisao({
  tipo,
  trabalhador,
  dados,
  anexos,
  validacao,
  onRevalidar,
  onVoltarParaPasso,
}: Props) {
  const dadosCount = Object.values(dados).filter((v) => v.trim() !== '').length
  const validado = validacao !== null
  const sucesso = validado && validacao.erros.length === 0
  const hasAvisos = (validacao?.avisos.length ?? 0) > 0

  return (
    <div className="space-y-4">
      {/* Resumo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard
          icon={<User2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Trabalhador"
          onEdit={() => onVoltarParaPasso(0)}
        >
          {trabalhador ? (
            <>
              <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">
                {trabalhador.nome}
              </p>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {trabalhador.cpf}
              </p>
            </>
          ) : (
            <p className="text-[12px] text-rose-700 dark:text-rose-300">Não selecionado</p>
          )}
        </SummaryCard>

        <SummaryCard
          icon={<FileEdit className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Dados específicos"
          onEdit={() => onVoltarParaPasso(1)}
        >
          <div className="flex items-center gap-2">
            <TipoEventoBadge tipo={tipo} compact />
            <span className="text-[12px] text-slate-700 dark:text-slate-300 tabular-nums">
              {dadosCount} campos preenchidos
            </span>
          </div>
        </SummaryCard>

        <SummaryCard
          icon={<Paperclip className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Anexos"
          onEdit={() => onVoltarParaPasso(2)}
        >
          {anexos.length === 0 ? (
            <p className="text-[12px] text-amber-700 dark:text-amber-300">Nenhum anexo</p>
          ) : (
            <p className="text-[13px] text-slate-700 dark:text-slate-300 tabular-nums">
              {anexos.length} arquivo{anexos.length > 1 ? 's' : ''}
            </p>
          )}
        </SummaryCard>
      </div>

      {/* Validação XSD */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 overflow-hidden">
        <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
                !validado
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  : sucesso
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
              }`}
            >
              {sucesso ? (
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5" strokeWidth={1.75} />
              )}
            </span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Validação XSD
            </h3>
          </div>
          <button
            type="button"
            onClick={onRevalidar}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition"
          >
            {validado ? 'Revalidar' : 'Validar agora'}
          </button>
        </header>

        <div className="px-5 py-4">
          {!validado && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center py-4">
              Clique em "Validar agora" para validar o XML contra o schema oficial antes de enviar.
            </p>
          )}

          {validado && sucesso && !hasAvisos && (
            <div className="flex items-center gap-3 py-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  XML válido — pronto para transmissão
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Sem erros nem avisos. Você pode enviar para a fila agora.
                </p>
              </div>
            </div>
          )}

          {validado && validacao.erros.length > 0 && (
            <div className="space-y-2">
              {validacao.erros.map((erro, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-rose-200/70 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 px-3 py-2.5 flex items-start gap-2.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700 dark:text-rose-300 mt-0.5 shrink-0" strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-rose-900 dark:text-rose-200">
                      {erro.campo}
                    </p>
                    <p className="text-[11px] text-rose-800 dark:text-rose-200/90 mt-0.5">
                      {erro.mensagem}
                    </p>
                    {erro.sugestaoCorrecao && (
                      <p className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-300/70 border-l-2 border-rose-300 dark:border-rose-800 pl-2">
                        → {erro.sugestaoCorrecao}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {validado && hasAvisos && (
            <div className="space-y-2 mt-2">
              {validacao.avisos.map((aviso, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-200/70 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 px-3 py-2.5 flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 mt-0.5 shrink-0" strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-amber-900 dark:text-amber-200">
                      {aviso.campo}
                    </p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-200/90 mt-0.5">
                      {aviso.mensagem}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  children,
  onEdit,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 px-4 py-3 group">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
          {icon}
          {label}
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="text-[10px] font-medium text-teal-700 dark:text-teal-300 hover:underline opacity-0 group-hover:opacity-100 transition"
        >
          editar
        </button>
      </div>
      <div className="min-h-[40px]">{children}</div>
    </article>
  )
}
