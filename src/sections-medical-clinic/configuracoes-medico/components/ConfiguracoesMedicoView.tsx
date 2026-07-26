import {
  Bell,
  Download,
  FileSignature,
  KeyRound,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  UserCog,
} from 'lucide-react'
import type {
  CanalNotificacao,
  ConfiguracoesMedicoData,
  NotificacaoEvento,
  Tema,
} from '@/../product-medical-clinic/sections/configuracoes-medico/types'
import { TEMA_OPCOES, dataLonga } from './helpers'

interface Props {
  dados: ConfiguracoesMedicoData
  onAlterarSenha: () => void
  onToggle2FA: () => void
  onToggleNotificacao: (evento: NotificacaoEvento, canal: CanalNotificacao) => void
  onToggleEscriba: () => void
  onToggleTeleconsulta: () => void
  onTemplateAnamnese: (value: string) => void
  onDuracaoConsulta: (value: string) => void
  onReconectarMemed: () => void
  onToggleAssinatura: () => void
  onToggleGravacao: () => void
  onExportarDados: () => void
  onTema: (t: Tema) => void
}

/** Toggle controlado em Tailwind puro — mesmo look de configuracoes-clinica. */
function Switch({
  ativo,
  disabled,
  onToggle,
  label,
}: {
  ativo: boolean
  disabled?: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        disabled
          ? 'cursor-not-allowed bg-slate-200 opacity-60 dark:bg-slate-700'
          : ativo
            ? 'bg-teal-500'
            : 'bg-slate-300 dark:bg-slate-600'
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

function Card({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string
  icon: typeof UserCog
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

/** Linha "label + descrição + controle à direita". */
function Row({
  titulo,
  descricao,
  children,
}: {
  titulo: string
  descricao?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{titulo}</div>
        {descricao && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{descricao}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Select({
  value,
  options,
  onChange,
  label,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
  label: string
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

const TEMA_ICON: Record<Tema, typeof Sun> = {
  claro: Sun,
  escuro: Moon,
  sistema: Monitor,
}

export function ConfiguracoesMedicoView({
  dados,
  onAlterarSenha,
  onToggle2FA,
  onToggleNotificacao,
  onToggleEscriba,
  onToggleTeleconsulta,
  onTemplateAnamnese,
  onDuracaoConsulta,
  onReconectarMemed,
  onToggleAssinatura,
  onToggleGravacao,
  onExportarDados,
  onTema,
}: Props) {
  const { medico, conta, notificacoes, atendimento, prescricao, privacidade, tema } = dados

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-base font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
          {medico.iniciais}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Configurações</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {medico.nome} · {medico.especialidade} · {medico.crm}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Conta */}
        <Card title="Conta" icon={UserCog}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <Row titulo="E-mail da conta" descricao={medico.email}>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                último acesso {dataLonga(medico.ultimoAcesso)}
              </span>
            </Row>
            <Row
              titulo="Senha"
              descricao={`Alterada em ${dataLonga(conta.ultimaTrocaSenha)}`}
            >
              <button
                onClick={onAlterarSenha}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <KeyRound className="h-3.5 w-3.5" /> Alterar senha
              </button>
            </Row>
            <Row
              titulo="Autenticação em 2 fatores"
              descricao="Código extra no login por app autenticador"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    conta.doisFatores
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {conta.doisFatores ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  ativo={conta.doisFatores}
                  onToggle={onToggle2FA}
                  label="Autenticação em 2 fatores"
                />
              </div>
            </Row>
          </div>
        </Card>

        {/* Aparência */}
        <Card title="Aparência" icon={Palette}>
          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Tema</div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Aplica ao seu painel — não afeta outros usuários da clínica.
          </p>
          <div className="mt-3 inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            {TEMA_OPCOES.map((o) => {
              const Icon = TEMA_ICON[o.value]
              const ativo = tema === o.value
              return (
                <button
                  key={o.value}
                  onClick={() => onTema(o.value)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    ativo
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {o.label}
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Notificações */}
      <div className="mt-4">
        <Card title="Notificações" icon={Bell}>
          <div className="mb-1 flex items-center justify-end gap-3 pr-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            <span className="w-11 text-center">E-mail</span>
            <span className="w-11 text-center">Push</span>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {notificacoes.map((n) => (
              <li key={n.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {n.titulo}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.descricao}</p>
                </div>
                <div className="flex w-11 justify-center">
                  <Switch
                    ativo={n.email}
                    onToggle={() => onToggleNotificacao(n, 'email')}
                    label={`${n.titulo} por e-mail`}
                  />
                </div>
                <div className="flex w-11 justify-center">
                  <Switch
                    ativo={n.push}
                    onToggle={() => onToggleNotificacao(n, 'push')}
                    label={`${n.titulo} por push`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Atendimento & consulta */}
        <Card title="Atendimento & consulta" icon={Stethoscope}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <Row
              titulo="Escriba IA ligado por padrão"
              descricao="Transcreve e estrutura a consulta automaticamente"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-500" />
                <Switch
                  ativo={atendimento.escribaPadrao}
                  onToggle={onToggleEscriba}
                  label="Escriba IA por padrão"
                />
              </div>
            </Row>
            <Row titulo="Template de anamnese" descricao="Modelo aplicado a novas consultas">
              <Select
                value={atendimento.templateAnamnese}
                options={atendimento.templatesDisponiveis}
                onChange={onTemplateAnamnese}
                label="Template de anamnese"
              />
            </Row>
            <Row titulo="Duração padrão de consulta" descricao="Bloco reservado na agenda">
              <Select
                value={atendimento.duracaoConsulta}
                options={atendimento.duracoesDisponiveis}
                onChange={onDuracaoConsulta}
                label="Duração padrão de consulta"
              />
            </Row>
            <Row titulo="Teleconsulta habilitada" descricao="Permite atendimentos por vídeo">
              <Switch
                ativo={atendimento.teleconsulta}
                onToggle={onToggleTeleconsulta}
                label="Teleconsulta habilitada"
              />
            </Row>
          </div>
        </Card>

        {/* Prescrição */}
        <Card title="Prescrição" icon={FileSignature}>
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Memed</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    prescricao.memedVinculada
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {prescricao.memedVinculada ? 'Vinculada' : 'Desconectada'}
                </span>
              </div>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {prescricao.memedConta}
              </p>
            </div>
            <button
              onClick={onReconectarMemed}
              className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Reconectar
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            <Row
              titulo="Assinatura click-to-attest"
              descricao="Confirmação de autoria por clique ao emitir (V1)"
            >
              <Switch
                ativo={prescricao.assinaturaAttest}
                onToggle={onToggleAssinatura}
                label="Assinatura click-to-attest"
              />
            </Row>
          </div>
          <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
            Assinatura por certificado ICP-Brasil (A3) entra no V2.
          </p>
        </Card>
      </div>

      {/* Privacidade (LGPD) */}
      <div className="mt-4">
        <Card title="Privacidade (LGPD)" icon={ShieldCheck}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <Row
              titulo="Confirmar consentimento de gravação por consulta"
              descricao="Exige aceite do paciente antes de gravar cada atendimento"
            >
              <Switch
                ativo={privacidade.confirmarGravacaoPorConsulta}
                onToggle={onToggleGravacao}
                label="Confirmar consentimento de gravação por consulta"
              />
            </Row>
            <Row
              titulo="Exportar meus dados"
              descricao="Baixa uma cópia dos seus dados pessoais (LGPD)"
            >
              <button
                onClick={onExportarDados}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5" /> Exportar
              </button>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  )
}
