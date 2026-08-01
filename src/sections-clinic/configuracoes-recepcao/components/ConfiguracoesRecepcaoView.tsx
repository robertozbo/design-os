import type React from 'react'
import {
  Bell,
  CalendarDays,
  CreditCard,
  KeyRound,
  Lock,
  MessageCircle,
  Palette,
  ShieldAlert,
  UserRound,
} from 'lucide-react'
import type {
  Antecedencia,
  ConfiguracoesRecepcaoData,
  FormaLink,
  NotificacaoRecepcao,
  Tema,
  VisaoAgenda,
} from '@/../product-clinic/sections/configuracoes-recepcao/types'
import {
  ANTECEDENCIA_OPCOES,
  FORMA_OPCOES,
  TEMA_OPCOES,
  VISAO_OPCOES,
} from './helpers'

interface Props {
  dados: ConfiguracoesRecepcaoData
  onAlterarSenha: () => void
  onToggleDoisFatores: () => void
  onToggleNotificacao: (n: NotificacaoRecepcao) => void
  onVisaoAgenda: (v: VisaoAgenda) => void
  onToggleLembrete: () => void
  onAntecedencia: (a: Antecedencia) => void
  onFormaPadrao: (f: FormaLink) => void
  onToggleRecibo: () => void
  onTema: (t: Tema) => void
}

/** Toggle controlado em Tailwind puro (cópia local — sem cross-import). */
function Switch({
  ativo,
  onToggle,
  label,
}: {
  ativo: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        ativo ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          ativo ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function Segmented<T extends string>({
  value,
  options,
  onSelect,
}: {
  value: T
  options: { value: T; label: string }[]
  onSelect: (v: T) => void
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onSelect(o.value)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            value === o.value
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof UserRound
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function ToggleRow({
  titulo,
  descricao,
  ativo,
  onToggle,
}: {
  titulo: string
  descricao: string
  ativo: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{titulo}</div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{descricao}</p>
      </div>
      <Switch ativo={ativo} onToggle={onToggle} label={titulo} />
    </div>
  )
}

export function ConfiguracoesRecepcaoView({
  dados,
  onAlterarSenha,
  onToggleDoisFatores,
  onToggleNotificacao,
  onVisaoAgenda,
  onToggleLembrete,
  onAntecedencia,
  onFormaPadrao,
  onToggleRecibo,
  onTema,
}: Props) {
  const { conta, notificacoes, agenda, cobranca, mensagens, aparencia } = dados

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
          {conta.iniciais}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Configurações da recepção
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {conta.nome} · {conta.persona}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Conta */}
        <Card title="Conta" icon={UserRound}>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Nome
            </span>
            <input
              defaultValue={conta.nome}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
            />
          </label>
          <label className="mt-3 block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              E-mail
            </span>
            <input
              defaultValue={conta.email}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
            />
          </label>

          <button
            onClick={onAlterarSenha}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <KeyRound className="h-3.5 w-3.5" /> Alterar senha
          </button>

          <div className="mt-4 flex items-start gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Verificação em duas etapas
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Exige um código extra ao entrar de um novo dispositivo.
              </p>
            </div>
            <Switch
              ativo={conta.doisFatores}
              onToggle={onToggleDoisFatores}
              label="Verificação em duas etapas"
            />
          </div>
        </Card>

        {/* Notificações */}
        <Card title="Notificações" icon={Bell}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notificacoes.map((n) => (
              <ToggleRow
                key={n.id}
                titulo={n.titulo}
                descricao={n.descricao}
                ativo={n.ativa}
                onToggle={() => onToggleNotificacao(n)}
              />
            ))}
          </div>
        </Card>

        {/* Agenda */}
        <Card title="Agenda" icon={CalendarDays}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Visão padrão
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Como a agenda abre por padrão.
              </p>
            </div>
            <Segmented value={agenda.visaoPadrao} options={VISAO_OPCOES} onSelect={onVisaoAgenda} />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Horário de funcionamento
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                gerenciado pela clínica
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {agenda.horarioFuncionamento}
            </p>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Lembrete automático ao paciente
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Envia um lembrete antes da consulta.
                </p>
              </div>
              <Switch
                ativo={agenda.lembreteAtivo}
                onToggle={onToggleLembrete}
                label="Lembrete automático ao paciente"
              />
            </div>
            <label className="mt-3 block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Antecedência
              </span>
              <select
                value={agenda.antecedencia}
                disabled={!agenda.lembreteAtivo}
                onChange={(e) => onAntecedencia(e.target.value as Antecedencia)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
              >
                {ANTECEDENCIA_OPCOES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        {/* Cobrança */}
        <Card title="Cobrança" icon={CreditCard}>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Forma de pagamento padrão do link
            </span>
            <select
              value={cobranca.formaPadrao}
              onChange={(e) => onFormaPadrao(e.target.value as FormaLink)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
            >
              {FORMA_OPCOES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 flex items-start gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Enviar recibo automático
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Envia o recibo ao paciente assim que o pagamento é confirmado.
              </p>
            </div>
            <Switch
              ativo={cobranca.reciboAutomatico}
              onToggle={onToggleRecibo}
              label="Enviar recibo automático"
            />
          </div>
        </Card>

        {/* Mensagens */}
        <Card title="Mensagens (canal administrativo)" icon={MessageCircle}>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Assinatura automática nas respostas
            </span>
            <input
              defaultValue={mensagens.assinatura}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Horário de atendimento do canal
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {mensagens.horarioAtendimento}
            </span>
          </div>
        </Card>

        {/* Aparência */}
        <Card title="Aparência" icon={Palette}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Tema</div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Aparência da interface.
              </p>
            </div>
            <Segmented value={aparencia.tema} options={TEMA_OPCOES} onSelect={onTema} />
          </div>
        </Card>
      </div>

      {/* Aviso de escopo */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-800 dark:text-amber-200">
          Canais clínicos, prontuário, exames e prescrições <strong>não estão disponíveis</strong>{' '}
          para a recepção — por escopo de acesso e LGPD. Estas configurações cobrem apenas a operação
          do balcão (agenda, cobrança e mensagens administrativas).
        </p>
      </div>
    </div>
  )
}
