import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Instagram,
  Repeat,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type {
  ContaConectada,
  PadroesMarca,
  PautaSemanal,
  QuemAprova,
  RegrasAprovacao,
} from '@/../product-clinic/sections/publicacoes/types'
import { DIA_SEMANA, diasAte, quando } from './helpers'

interface Props {
  conta: ContaConectada
  pauta: PautaSemanal
  padroes: PadroesMarca
  regras: RegrasAprovacao
  onConectarConta: () => void
  onDesconectarConta: () => void
  onAlternarPauta: (ativa: boolean) => void
  onSalvarPadroes: (p: PadroesMarca) => void
  onSalvarRegras: (r: RegrasAprovacao) => void
}

const TONS = ['acolhedor', 'informativo', 'direto', 'técnico']
const TEMPLATES = ['Dica clínica', 'Lista numerada', 'Estatística', 'Convite']

const APROVA_LABEL: Record<QuemAprova, string> = {
  gestor: 'Só o gestor',
  'gestor-e-autor': 'Gestor ou o autor do post',
  qualquer: 'Qualquer pessoa da equipe',
}

/**
 * A aba de configurações do módulo.
 *
 * Mora aqui, e não nas Configurações da clínica, porque o módulo é vendido à parte:
 * quem não compra Marketing não deve ver configuração de Instagram no cadastro da
 * clínica. O que fica lá é só o preço e a cota — que é cobrança, não preferência.
 */
export function ConfiguracoesPublicacoes({
  conta,
  pauta,
  padroes,
  regras,
  onConectarConta,
  onDesconectarConta,
  onAlternarPauta,
  onSalvarPadroes,
  onSalvarRegras,
}: Props) {
  const [rascunho, setRascunho] = useState<PadroesMarca>(padroes)
  const sujo = JSON.stringify(rascunho) !== JSON.stringify(padroes)
  const diasToken = diasAte(conta.tokenExpiraEm)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Conta do Instagram */}
      <Bloco titulo="Conta do Instagram" icone={Instagram}>
        {conta.conectada ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-slate-700 dark:text-slate-200">
                  {conta.usuario}
                </p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">{conta.nome}</p>
              </div>
              <button
                onClick={onDesconectarConta}
                className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Desconectar
              </button>
            </div>

            <dl className="mt-3 space-y-1.5 text-xs">
              <Linha rotulo="Publicações hoje">
                <span className="tabular-nums">
                  {conta.publicadosHoje} de {conta.limiteDiario}
                </span>
                <span className="text-slate-400"> · limite da API</span>
              </Linha>
              <Linha rotulo="Autorização">
                <span
                  className={
                    diasToken <= 7 ? 'font-medium text-amber-600 dark:text-amber-400' : undefined
                  }
                >
                  {diasToken <= 0 ? 'expirada' : `expira em ${diasToken} dias`}
                </span>
              </Linha>
            </dl>

            {diasToken <= 7 && (
              <button
                onClick={onConectarConta}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Renovar autorização
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Nenhuma conta conectada — nada é publicado.
            </p>
            <button
              onClick={onConectarConta}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Instagram className="h-4 w-4" /> Conectar Instagram
            </button>
          </>
        )}

        <p className="mt-3 border-t border-slate-100 pt-2.5 text-[11px] leading-relaxed text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Exige conta <strong className="font-medium">Business</strong> ou{' '}
          <strong className="font-medium">Creator</strong> — conta pessoal não publica por API. Não
          há chave para digitar: o aplicativo no Meta é da Nymos, já aprovado. Conectar abre o
          consentimento e você escolhe a conta.
        </p>
      </Bloco>

      {/* Pauta semanal */}
      <Bloco titulo="Pauta semanal" icone={Repeat}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {pauta.ativa
              ? `Toda ${DIA_SEMANA[pauta.diaSemana]} às ${pauta.hora} · próxima em ${quando(pauta.proximaGeracao)}`
              : 'Desligada — nenhum rascunho é gerado sozinho'}
          </p>
          <Toggle ativo={pauta.ativa} onToggle={() => onAlternarPauta(!pauta.ativa)} rotulo="Pauta semanal" />
        </div>

        {pauta.ativa && (
          <>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pauta.temas.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
            {/*
              O texto vai num <span> único: com `flex` no <p>, cada nó filho — inclusive
              o <strong> e cada pedaço de texto ao redor dele — virava um flex item e a
              frase quebrava em colunas.
            */}
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Gera em <strong className="font-medium">Revisar</strong>, nunca em Agendado, e usa{' '}
                {padroes.autorPadrao.nome} ({padroes.autorPadrao.conselho}) como autor — é o
                conselho dele que valida a peça.
              </span>
            </p>
          </>
        )}
      </Bloco>

      {/* Padrões da marca */}
      <Bloco titulo="Padrões da marca" icone={Sparkles}>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          O que a IA assume quando o brief não diz.
        </p>

        <Campo rotulo="Tom">
          <div className="flex flex-wrap gap-1.5">
            {TONS.map((t) => (
              <Pilula
                key={t}
                ativo={rascunho.tom === t}
                onClick={() => setRascunho({ ...rascunho, tom: t })}
              >
                {t}
              </Pilula>
            ))}
          </div>
        </Campo>

        <Campo rotulo="Template">
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((t) => (
              <Pilula
                key={t}
                ativo={rascunho.template === t}
                onClick={() => setRascunho({ ...rascunho, template: t })}
              >
                {t}
              </Pilula>
            ))}
          </div>
        </Campo>

        <Campo rotulo="Fecho fixo da legenda">
          <input
            value={rascunho.ctaFixo}
            onChange={(e) => setRascunho({ ...rascunho, ctaFixo: e.target.value })}
            placeholder="Vazio = sem CTA"
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </Campo>

        <div className="mt-3 flex items-start justify-between gap-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Registro no rodapé do cartão
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              {rascunho.autorPadrao.registro}. Os conselhos exigem identificar o responsável
              técnico na peça — desligar é decisão sua, e é você que responde por ela.
            </p>
          </div>
          <Toggle
            ativo={rascunho.mostrarRegistro}
            onToggle={() => setRascunho({ ...rascunho, mostrarRegistro: !rascunho.mostrarRegistro })}
            rotulo="Registro no cartão"
          />
        </div>

        <button
          onClick={() => onSalvarPadroes(rascunho)}
          disabled={!sujo}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          <Check className="h-3.5 w-3.5" /> Salvar padrões
        </button>
      </Bloco>

      {/* Aprovação */}
      <Bloco titulo="Aprovação" icone={ShieldCheck}>
        <Campo rotulo="Quem pode aprovar e agendar">
          <div className="space-y-1.5">
            {(Object.keys(APROVA_LABEL) as QuemAprova[]).map((q) => (
              <button
                key={q}
                onClick={() => onSalvarRegras({ ...regras, quemAprova: q })}
                className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs ${
                  regras.quemAprova === q
                    ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className={`h-3 w-3 shrink-0 rounded-full border ${
                    regras.quemAprova === q
                      ? 'border-teal-600 bg-teal-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {APROVA_LABEL[q]}
              </button>
            ))}
          </div>
        </Campo>

        <div className="mt-3 flex items-start justify-between gap-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Aviso exige ciência antes de agendar
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              Vale só para <strong className="font-medium">aviso</strong>. Bloqueio nunca tem
              caminho de passar — nem com isto ligado.
            </p>
          </div>
          <Toggle
            ativo={regras.exigirCienciaDeAviso}
            onToggle={() =>
              onSalvarRegras({ ...regras, exigirCienciaDeAviso: !regras.exigirCienciaDeAviso })
            }
            rotulo="Exigir ciência de aviso"
          />
        </div>
      </Bloco>
    </div>
  )
}

function Bloco({
  titulo,
  icone: Icone,
  children,
}: {
  titulo: string
  icone: typeof Instagram
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800">
      <header className="flex items-center gap-2 border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-800">
        <Icone className="h-3.5 w-3.5 text-slate-400" />
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {titulo}
        </h2>
      </header>
      <div className="px-3.5 py-3">{children}</div>
    </section>
  )
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {rotulo}
      </p>
      {children}
    </div>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className="text-right text-slate-700 dark:text-slate-200">{children}</dd>
    </div>
  )
}

function Pilula({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] ${
        ativo
          ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
          : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function Toggle({
  ativo,
  onToggle,
  rotulo,
}: {
  ativo: boolean
  onToggle: () => void
  rotulo: string
}) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={ativo}
      aria-label={rotulo}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        ativo ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
          ativo ? 'left-[1.125rem]' : 'left-0.5'
        }`}
      />
    </button>
  )
}
