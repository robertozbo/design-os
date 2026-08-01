import { useState } from 'react'
import {
  User,
  Lock,
  Bell,
  SlidersHorizontal,
  ShieldCheck,
  Save,
  Check,
  Camera,
  Ban,
  type LucideIcon,
} from 'lucide-react'
import type {
  ConfiguracoesSecretariaProps,
  NotificacoesSecretaria,
  Tema,
} from '@/../product-doctor/sections/configuracoes-secretaria/types'

type Aba = 'perfil' | 'senha' | 'notificacoes' | 'preferencias' | 'escopo'

const ABAS: { id: Aba; label: string; icon: LucideIcon }[] = [
  { id: 'perfil', label: 'Perfil pessoal', icon: User },
  { id: 'senha', label: 'Senha', icon: Lock },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'preferencias', label: 'Preferências', icon: SlidersHorizontal },
  { id: 'escopo', label: 'Escopo de acesso', icon: ShieldCheck },
]

const NOTIF_GRUPOS: { titulo: string; itens: { key: keyof NotificacoesSecretaria; label: string }[] }[] = [
  {
    titulo: 'Push',
    itens: [
      { key: 'pushNovoAgendamento', label: 'Novo agendamento' },
      { key: 'pushCancelamento', label: 'Cancelamento' },
      { key: 'pushMensagemAdmin', label: 'Mensagem administrativa' },
    ],
  },
  {
    titulo: 'Email',
    itens: [
      { key: 'emailResumoAgenda', label: 'Resumo diário da agenda' },
      { key: 'emailPagamentoConfirmado', label: 'Pagamento confirmado' },
    ],
  },
  {
    titulo: 'SMS',
    itens: [{ key: 'smsLembretePlantao', label: 'Lembrete de plantão' }],
  },
]

const TEMAS: { id: Tema; label: string }[] = [
  { id: 'sistema', label: 'Sistema' },
  { id: 'claro', label: 'Claro' },
  { id: 'escuro', label: 'Escuro' },
]

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-6 rounded-full transition-colors ${on ? 'bg-teal-500' : 'bg-slate-700'}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${
          on ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputCls =
  'w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-[13px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50'

export function Configuracoes({
  data,
  onNotificacaoToggle,
  onPreferenciaChange,
  onAlterarSenha,
  onSalvar,
}: ConfiguracoesSecretariaProps) {
  const [aba, setAba] = useState<Aba>('perfil')
  const [senha, setSenha] = useState({ atual: '', nova: '', confirma: '' })

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div>
              <h1 className="text-slate-50 font-bold text-[24px]">Configurações</h1>
              <p className="text-slate-400 text-[12.5px] mt-1">Sua conta e preferências pessoais</p>
            </div>
            <span className="mt-1 px-2 h-6 grid place-items-center rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold ring-1 ring-slate-700">
              Secretaria
            </span>
          </div>
          <button
            onClick={onSalvar}
            className="px-4 h-10 rounded-xl bg-teal-500 text-white font-semibold text-[12.5px] flex items-center gap-2 hover:bg-teal-400 transition-colors"
          >
            <Save size={13} strokeWidth={2.4} />
            Salvar alterações
          </button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-2 md:sticky md:top-6">
              <nav className="flex md:flex-col gap-0.5 overflow-x-auto">
                {ABAS.map((a) => {
                  const Icon = a.icon
                  const active = aba === a.id
                  return (
                    <button
                      key={a.id}
                      onClick={() => setAba(a.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-colors ${
                        active ? 'bg-teal-500/15 text-teal-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon size={14} strokeWidth={2.2} />
                      <span className="flex-1 text-left">{a.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="col-span-12 md:col-span-9 space-y-4">
            {aba === 'perfil' && (
              <Card>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <span className="grid place-items-center size-16 rounded-full bg-slate-800 text-slate-200 text-[22px] font-semibold">
                      {data.perfil.inicial}
                    </span>
                    <button className="absolute -bottom-1 -right-1 grid place-items-center size-7 rounded-full bg-teal-500 text-white ring-2 ring-slate-900">
                      <Camera size={13} />
                    </button>
                  </div>
                  <div>
                    <p className="text-slate-100 font-semibold text-[15px]">{data.perfil.nomeCompleto}</p>
                    <p className="text-slate-500 text-[12px]">{data.perfil.cargo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nome completo">
                    <input className={inputCls} defaultValue={data.perfil.nomeCompleto} />
                  </Field>
                  <Field label="Cargo">
                    <input className={`${inputCls} opacity-60`} value={data.perfil.cargo} disabled />
                  </Field>
                  <Field label="Email">
                    <input className={inputCls} type="email" defaultValue={data.perfil.email} />
                  </Field>
                  <Field label="Telefone">
                    <input className={inputCls} defaultValue={data.perfil.telefone} />
                  </Field>
                </div>
              </Card>
            )}

            {aba === 'senha' && (
              <Card>
                <h2 className="text-slate-100 font-semibold text-[14px] mb-4">Alterar senha</h2>
                <div className="space-y-4 max-w-md">
                  <Field label="Senha atual">
                    <input
                      className={inputCls}
                      type="password"
                      value={senha.atual}
                      onChange={(e) => setSenha((s) => ({ ...s, atual: e.target.value }))}
                    />
                  </Field>
                  <Field label="Nova senha">
                    <input
                      className={inputCls}
                      type="password"
                      value={senha.nova}
                      onChange={(e) => setSenha((s) => ({ ...s, nova: e.target.value }))}
                    />
                  </Field>
                  <Field label="Confirmar nova senha">
                    <input
                      className={inputCls}
                      type="password"
                      value={senha.confirma}
                      onChange={(e) => setSenha((s) => ({ ...s, confirma: e.target.value }))}
                    />
                  </Field>
                  <button
                    onClick={() => onAlterarSenha?.(senha.atual, senha.nova)}
                    disabled={!senha.atual || !senha.nova || senha.nova !== senha.confirma}
                    className="px-4 h-10 rounded-xl bg-teal-500 text-white font-semibold text-[12.5px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-400 transition-colors"
                  >
                    Atualizar senha
                  </button>
                </div>
              </Card>
            )}

            {aba === 'notificacoes' && (
              <div className="space-y-4">
                {NOTIF_GRUPOS.map((g) => (
                  <Card key={g.titulo}>
                    <h2 className="text-slate-100 font-semibold text-[13px] mb-3">{g.titulo}</h2>
                    <div className="divide-y divide-slate-800/70">
                      {g.itens.map((it) => (
                        <div key={it.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                          <span className="text-slate-300 text-[13px]">{it.label}</span>
                          <Toggle
                            on={data.notificacoes[it.key]}
                            onClick={() => onNotificacaoToggle?.(it.key, !data.notificacoes[it.key])}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {aba === 'preferencias' && (
              <Card>
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Tema</span>
                    <div className="mt-2 inline-flex rounded-xl bg-slate-950 border border-slate-800 p-1">
                      {TEMAS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => onPreferenciaChange?.('tema', t.id)}
                          className={`px-4 h-9 rounded-lg text-[12.5px] font-medium transition-colors ${
                            data.preferencias.tema === t.id ? 'bg-teal-500/15 text-teal-300' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Idioma">
                    <input className={`${inputCls} opacity-60 max-w-xs`} value={data.preferencias.idioma} disabled />
                  </Field>
                  <Field label="Fuso horário">
                    <input className={`${inputCls} max-w-md`} defaultValue={data.preferencias.fusoHorario} />
                  </Field>
                </div>
              </Card>
            )}

            {aba === 'escopo' && (
              <Card>
                <div className="flex items-start gap-3 mb-5">
                  <span className="grid place-items-center size-9 rounded-xl bg-teal-500/15 text-teal-300 shrink-0">
                    <ShieldCheck size={17} />
                  </span>
                  <div>
                    <h2 className="text-slate-100 font-semibold text-[14px]">Escopo de acesso</h2>
                    <p className="text-slate-400 text-[12px] mt-0.5">
                      Sua conta é operacional. Dados clínicos ficam restritos ao médico por exigência de LGPD e ética médica.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-2">Você pode acessar</p>
                    <ul className="space-y-2">
                      {data.escopo.permitido.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[12.5px] text-slate-300">
                          <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Restrito ao médico</p>
                    <ul className="space-y-2">
                      {data.escopo.bloqueado.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[12.5px] text-slate-500">
                          <Ban size={15} className="text-slate-600 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
