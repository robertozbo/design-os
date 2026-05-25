import { useState } from 'react'
import { Check, Shield, FileText, Sparkles } from 'lucide-react'
import { AuthShell, GoogleButton } from '@/sections-mobile/login/_AuthShell'

interface Consents {
  termosDeUso: boolean
  politicaPrivacidade: boolean
  tratamentoDados: boolean
}

export default function SignupPreview() {
  const [consents, setConsents] = useState<Consents>({
    termosDeUso: false,
    politicaPrivacidade: false,
    tratamentoDados: false,
  })
  const [carregando, setCarregando] = useState(false)

  const todosAceitos =
    consents.termosDeUso && consents.politicaPrivacidade && consents.tratamentoDados

  const toggleConsent = (key: keyof Consents) =>
    setConsents((c) => ({ ...c, [key]: !c[key] }))

  const aceitarTodos = () =>
    setConsents({ termosDeUso: true, politicaPrivacidade: true, tratamentoDados: true })

  const cadastrar = () => {
    if (!todosAceitos) return
    setCarregando(true)
    setTimeout(() => {
      window.location.href = '/mobile/sections/welcome'
    }, 1400)
  }

  return (
    <AuthShell
      titulo="Crie sua conta"
      subtitulo="Aceite os termos e continue com sua conta Google"
    >
      <div className="flex-1 mt-2 rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 text-[10.5px] font-semibold uppercase tracking-wider">
            Consentimentos <span className="text-rose-400">*</span>
          </span>
          <button
            onClick={aceitarTodos}
            disabled={todosAceitos}
            className="text-teal-300 text-[11px] font-semibold hover:text-teal-200 disabled:text-slate-600 disabled:cursor-default"
          >
            {todosAceitos ? '✓ Todos aceitos' : 'Aceitar todos'}
          </button>
        </div>

        <div className="space-y-2">
          <ConsentRow
            ativo={consents.termosDeUso}
            onToggle={() => toggleConsent('termosDeUso')}
            icon={FileText}
            label="Termos de Uso"
            descricao="O Nymos é apoio à saúde, não substitui orientação médica."
          />
          <ConsentRow
            ativo={consents.politicaPrivacidade}
            onToggle={() => toggleConsent('politicaPrivacidade')}
            icon={Shield}
            label="Política de Privacidade"
            descricao="Dados criptografados e protegidos pela LGPD."
          />
          <ConsentRow
            ativo={consents.tratamentoDados}
            onToggle={() => toggleConsent('tratamentoDados')}
            icon={Sparkles}
            label="Tratamento de Dados pela IA"
            descricao="Permite que a IA processe seus dados pra gerar análises."
          />
        </div>

        {!todosAceitos && (
          <div className="mt-3 text-rose-300/80 text-[10.5px] leading-snug">
            ⚠ Aceite os 3 consentimentos pra criar sua conta.
          </div>
        )}
      </div>

      <div className="pt-6 space-y-3">
        <GoogleButton
          onClick={cadastrar}
          loading={carregando}
          disabled={!todosAceitos}
          label="Continuar com Google"
        />
        <div className="text-center text-slate-400 text-[12px]">
          Já tem conta?{' '}
          <a href="/mobile/sections/login" className="text-teal-300 font-semibold hover:text-teal-200">
            Entrar
          </a>
        </div>
      </div>
    </AuthShell>
  )
}

interface ConsentRowProps {
  ativo: boolean
  onToggle: () => void
  icon: typeof Sparkles
  label: string
  descricao: string
}

function ConsentRow({ ativo, onToggle, icon: Icon, label, descricao }: ConsentRowProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full px-2.5 py-2 rounded-xl flex items-start gap-2.5 text-left transition-colors ${
        ativo
          ? 'bg-teal-500/10 border border-teal-500/30'
          : 'bg-slate-950/40 border border-slate-800 hover:border-slate-700'
      }`}
    >
      <div
        className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
          ativo ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-700'
        }`}
      >
        {ativo && <Check size={11} strokeWidth={3.4} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Icon size={11} className={ativo ? 'text-teal-300' : 'text-slate-500'} strokeWidth={2.2} />
          <span className={`text-[12px] font-semibold ${ativo ? 'text-teal-200' : 'text-slate-200'}`}>
            {label}
          </span>
          <span className="text-teal-300 text-[10px] underline">Ler</span>
        </div>
        <div className={`text-[10.5px] mt-0.5 leading-snug ${ativo ? 'text-teal-200/70' : 'text-slate-500'}`}>
          {descricao}
        </div>
      </div>
    </button>
  )
}
