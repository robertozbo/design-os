import { useState } from 'react'
import { Sparkles, UserPlus, Watch } from 'lucide-react'
import { AuthShell, GoogleButton } from './_AuthShell'

export default function LoginPreview() {
  const [carregando, setCarregando] = useState(false)

  const entrarComGoogle = () => {
    setCarregando(true)
    setTimeout(() => {
      window.location.href = '/mobile/sections/welcome'
    }, 1400)
  }

  return (
    <AuthShell titulo="Bem-vindo de volta" subtitulo="Entre com sua conta Google pra continuar">
      <div className="flex-1 space-y-2.5 mt-2">
        <ValueRow
          icon={Sparkles}
          cor="teal"
          titulo="IA personalizada"
          descricao="Análises do seu peso, sono, glicemia e exames"
        />
        <ValueRow
          icon={UserPlus}
          cor="emerald"
          titulo="Profissional integrado"
          descricao="Nutri, personal, médico — tudo no mesmo app"
        />
        <ValueRow
          icon={Watch}
          cor="sky"
          titulo="Wearables"
          descricao="Conecta Apple Health, Garmin e mais"
        />
      </div>

      <div className="pt-6 space-y-3">
        <GoogleButton onClick={entrarComGoogle} loading={carregando} />
        <div className="text-center text-slate-400 text-[12px]">
          Não tem conta?{' '}
          <a
            href="/mobile/sections/signup"
            className="text-teal-300 font-semibold hover:text-teal-200"
          >
            Cadastre-se
          </a>
        </div>
        <div className="text-center">
          <a
            href="/mobile/sections/recuperar-senha"
            className="text-slate-400 text-[11.5px] hover:text-slate-200 underline"
          >
            Problemas pra entrar?
          </a>
        </div>
        <div className="text-center text-slate-600 text-[10px] leading-snug px-3">
          Ao entrar você aceita os Termos de Uso e a Política de Privacidade.
        </div>
      </div>
    </AuthShell>
  )
}

interface ValueRowProps {
  icon: typeof Sparkles
  cor: 'teal' | 'emerald' | 'sky' | 'amber' | 'rose' | 'violet'
  titulo: string
  descricao: string
}

const COR_BG: Record<ValueRowProps['cor'], string> = {
  teal: 'bg-teal-500/15 text-teal-300',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
  violet: 'bg-violet-500/15 text-violet-300',
}

function ValueRow({ icon: Icon, cor, titulo, descricao }: ValueRowProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex items-center gap-3 text-left">
      <div className={`w-10 h-10 rounded-xl ${COR_BG[cor]} flex items-center justify-center shrink-0`}>
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="text-slate-100 font-semibold text-[12.5px]">{titulo}</div>
        <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{descricao}</div>
      </div>
    </div>
  )
}
