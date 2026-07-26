import {
  Building2,
  CreditCard,
  FileSignature,
  MessageCircle,
  Save,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import type {
  Consentimento,
  ConfiguracoesClinicaData,
  Integracao,
  IntegracaoId,
} from '@/../product-medical-clinic/sections/configuracoes-clinica/types'
import { ACAO_META, AVATAR_COR, BADGE_COR, CONSENT_META, dataCurta, relativo } from './helpers'

const INTEGRACAO_ICON: Record<IntegracaoId, typeof Stethoscope> = {
  memed: Stethoscope,
  escriba: Sparkles,
  pix: CreditCard,
  whatsapp: MessageCircle,
}

interface Props {
  dados: ConfiguracoesClinicaData
  onSalvarDados: () => void
  onGerenciarPlano: () => void
  onToggleIntegracao: (i: Integracao) => void
  onVerTermo: (c: Consentimento) => void
  onVerAuditoria: () => void
}

/** Toggle controlado em Tailwind puro (sem lib externa). */
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        defaultValue={value}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
      />
    </label>
  )
}

function Card({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string
  icon: typeof Building2
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

export function ConfiguracoesClinicaView({
  dados,
  onSalvarDados,
  onGerenciarPlano,
  onToggleIntegracao,
  onVerTermo,
  onVerAuditoria,
}: Props) {
  const { clinica, plano, integracoes, consentimentos, auditoria } = dados
  const usoPct = Math.round((plano.profissionais / plano.maxProfissionais) * 100)
  const noLimite = plano.profissionais >= plano.maxProfissionais

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Configurações da clínica
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{clinica.nome}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Dados da clínica */}
        <Card
          title="Dados da clínica"
          icon={Building2}
          action={
            <button
              onClick={onSalvarDados}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
            >
              <Save className="h-3.5 w-3.5" /> Salvar
            </button>
          }
        >
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-lg font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
              {clinica.logoIniciais}
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Nome / Razão social" value={clinica.nome} />
              </div>
              <Field label="CNPJ" value={clinica.cnpj} />
              <Field label="Telefone" value={clinica.telefone} />
              <div className="sm:col-span-2">
                <Field label="Endereço" value={clinica.endereco} />
              </div>
            </div>
          </div>
        </Card>

        {/* Plano & limites */}
        <Card
          title="Plano & limites"
          icon={CreditCard}
          action={
            <button
              onClick={onGerenciarPlano}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Gerenciar plano
            </button>
          }
        >
          <div className="flex items-baseline gap-2">
            <span className="rounded-lg bg-teal-50 px-2 py-1 text-sm font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              {plano.nome}
            </span>
            <span className="text-xs text-slate-400">renova em {dataCurta(plano.renovaEm)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{plano.descricao}</p>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Profissionais</span>
              <span
                className={`font-medium tabular-nums ${
                  noLimite ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {plano.profissionais} de {plano.maxProfissionais}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${noLimite ? 'bg-amber-500' : 'bg-teal-500'}`}
                style={{ width: `${usoPct}%` }}
              />
            </div>
            {noLimite && (
              <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
                Você atingiu o limite do plano. Faça upgrade para adicionar mais profissionais.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Integrações */}
      <div className="mt-4">
        <Card title="Integrações" icon={Sparkles}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {integracoes.map((i) => {
              const Icon = INTEGRACAO_ICON[i.id]
              return (
                <div
                  key={i.id}
                  className={`flex items-start gap-3 rounded-xl border p-3 ${
                    i.indisponivel
                      ? 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-950/30'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {i.nome}
                      </span>
                      {i.indisponivel && (
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          V2
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {i.descricao}
                    </p>
                    {i.modelo && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-teal-50 px-1.5 py-0.5 font-mono text-[10px] text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                        {i.modelo} · {i.versao}
                      </span>
                    )}
                  </div>
                  <Switch
                    ativo={i.ativa}
                    disabled={i.indisponivel}
                    onToggle={() => onToggleIntegracao(i)}
                    label={`Ativar ${i.nome}`}
                  />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Consentimentos LGPD */}
        <Card title="Consentimentos (LGPD)" icon={FileSignature}>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {consentimentos.map((c) => (
              <li key={c.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {c.titulo}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${CONSENT_META[c.status].badge}`}
                    >
                      {CONSENT_META[c.status].label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{c.descricao}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-mono">{c.versao}</span>
                    <span>· atualizado {dataCurta(c.atualizadoEm)}</span>
                  </div>
                </div>
                <button
                  onClick={() => onVerTermo(c)}
                  className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Ver termo
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Audit log */}
        <Card
          title="Log de acesso"
          icon={ShieldCheck}
          action={
            <button
              onClick={onVerAuditoria}
              className="rounded-lg px-2 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40"
            >
              Ver tudo
            </button>
          }
        >
          <p className="mb-1 text-[11px] text-slate-400">
            Registro imutável de acessos e ações administrativas (LGPD).
          </p>
          <ul className="-mx-4 divide-y divide-slate-100 dark:divide-slate-800">
            {auditoria.map((e) => {
              const meta = ACAO_META[e.acao]
              const { Icon } = meta
              return (
                <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[e.cor]}`}
                  >
                    {e.iniciais}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {e.ator}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COR[e.cor]}`}
                      >
                        {e.papel}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${meta.cls}`} />
                      <span className={`text-xs font-medium ${meta.cls}`}>{meta.label}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {e.alvo}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-slate-400">
                    {relativo(e.em)}
                  </span>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}
