import { useEffect, useState } from 'react'
import {
  Mail,
  Loader2,
  ArrowRight,
  MailCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  UserX,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import { AuthShell, AuthField } from '@/sections-mobile/login/_AuthShell'

type Fase = 'menu' | 'identificar-conta' | 'enviado' | 'conta-excluida' | 'outro'

interface OpcaoMenu {
  id: Exclude<Fase, 'menu' | 'enviado'>
  icon: LucideIcon
  cor: 'teal' | 'amber' | 'rose'
  titulo: string
  descricao: string
}

const OPCOES: OpcaoMenu[] = [
  {
    id: 'identificar-conta',
    icon: HelpCircle,
    cor: 'teal',
    titulo: 'Não lembro qual conta usei',
    descricao: 'Te enviamos a lista de Googles vinculados',
  },
  {
    id: 'conta-excluida',
    icon: UserX,
    cor: 'amber',
    titulo: 'Acho que minha conta foi excluída',
    descricao: 'Ver opções pra restaurar acesso',
  },
  {
    id: 'outro',
    icon: AlertCircle,
    cor: 'rose',
    titulo: 'Outro problema',
    descricao: 'Falar com nosso suporte',
  },
]

const COR_BG: Record<OpcaoMenu['cor'], string> = {
  teal: 'bg-teal-500/15 text-teal-300',
  amber: 'bg-amber-500/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
}

export default function RecuperarSenhaPreview() {
  const [fase, setFase] = useState<Fase>('menu')
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const enviar = () => {
    if (!valido) return
    setCarregando(true)
    setTimeout(() => {
      setCarregando(false)
      setFase('enviado')
      setCooldown(60)
    }, 1100)
  }

  const reenviar = () => {
    if (cooldown > 0) return
    setCarregando(true)
    setTimeout(() => {
      setCarregando(false)
      setCooldown(60)
    }, 800)
  }

  if (fase === 'menu') {
    return (
      <AuthShell titulo="Problemas pra entrar?" subtitulo="Conte o que aconteceu pra te ajudarmos">
        <a
          href="/mobile/sections/login"
          className="self-start mb-2 inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-[12px] font-medium"
        >
          <ChevronLeft size={13} strokeWidth={2.4} />
          Voltar pro login
        </a>

        <div className="flex-1 mt-4 space-y-2">
          {OPCOES.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => setFase(opt.id)}
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
              >
                <div className={`w-11 h-11 rounded-xl ${COR_BG[opt.cor]} flex items-center justify-center shrink-0`}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-slate-100 font-semibold text-[13px]">{opt.titulo}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{opt.descricao}</div>
                </div>
                <ChevronRight size={14} className="text-slate-500 shrink-0" />
              </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 p-3 text-slate-400 text-[10.5px] leading-snug">
          <span className="font-semibold text-slate-300">💡 Dica:</span> esqueceu a senha do Google? Recupere
          em <span className="font-mono text-teal-300">accounts.google.com</span> e volte aqui.
        </div>
      </AuthShell>
    )
  }

  if (fase === 'identificar-conta') {
    return (
      <AuthShell titulo="Identificar sua conta" subtitulo="Digite o email que você acha que usou no Nymos">
        <BackButton onClick={() => setFase('menu')} />

        <div className="mt-4">
          <AuthField icon={Mail} type="email" placeholder="seu@email.com" value={email} onChange={setEmail} />
        </div>

        <div className="mt-3 text-slate-500 text-[10.5px] leading-snug">
          Vamos verificar se existe conta Nymos vinculada e te enviar dicas pra recuperar acesso.
        </div>

        <button
          onClick={enviar}
          disabled={!valido || carregando}
          className="mt-5 w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-[14px] flex items-center justify-center gap-2 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
        >
          {carregando ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              Enviar instruções
              <ArrowRight size={14} strokeWidth={2.6} />
            </>
          )}
        </button>
      </AuthShell>
    )
  }

  if (fase === 'enviado') {
    return (
      <AuthShell titulo="Verifique seu email" subtitulo="Mandamos as instruções pra recuperar acesso">
        <div className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 mx-auto mb-3">
            <MailCheck size={26} strokeWidth={2.4} />
          </div>
          <div className="text-emerald-200 font-semibold text-[14px]">Email enviado</div>
          <div className="text-emerald-200/70 text-[11.5px] mt-1.5 leading-snug">
            Mandamos pra <span className="font-mono font-semibold text-emerald-100">{email}</span> com
            instruções pra recuperar sua conta. Não esqueça de checar a caixa de spam.
          </div>
        </div>

        <button
          onClick={reenviar}
          disabled={cooldown > 0 || carregando}
          className="mt-5 w-full h-11 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-[12.5px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {carregando ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Reenviando...
            </>
          ) : cooldown > 0 ? (
            <>
              Reenviar em <span className="font-mono tabular-nums">{cooldown}s</span>
            </>
          ) : (
            <>
              <RotateCcw size={13} strokeWidth={2.4} />
              Reenviar email
            </>
          )}
        </button>

        <a
          href="/mobile/sections/login"
          className="mt-3 w-full h-11 rounded-2xl text-teal-300 hover:text-teal-200 text-[12.5px] font-semibold flex items-center justify-center gap-1"
        >
          <ChevronLeft size={13} strokeWidth={2.4} />
          Voltar pro login
        </a>
      </AuthShell>
    )
  }

  if (fase === 'conta-excluida') {
    return (
      <AuthShell titulo="Conta excluída" subtitulo="Ainda dá pra recuperar — depende do tempo">
        <BackButton onClick={() => setFase('menu')} />

        <div className="mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <UserX size={17} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="text-amber-200 font-semibold text-[12.5px]">Janela de 30 dias</div>
              <div className="text-amber-200/70 text-[11px] mt-1 leading-snug">
                Após exclusão, mantemos seus dados por 30 dias antes de apagar permanentemente. Se foi
                recente, podemos restaurar.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <InfoRow titulo="Excluiu há menos de 30 dias?" descricao="Fale com o suporte pra restaurar" />
          <InfoRow titulo="Excluiu há mais de 30 dias?" descricao="Crie uma nova conta · dados antigos foram apagados" />
        </div>

        <button
          onClick={() => setFase('outro')}
          className="mt-5 w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-[13.5px] flex items-center justify-center gap-2"
        >
          Falar com suporte
          <ArrowRight size={14} strokeWidth={2.6} />
        </button>
      </AuthShell>
    )
  }

  // fase === 'outro'
  return (
    <AuthShell titulo="Falar com suporte" subtitulo="Te respondemos em até 24h úteis">
      <BackButton onClick={() => setFase('menu')} />

      <div className="mt-4 space-y-2">
        <ContatoRow titulo="Email" valor="suporte@nymos.app" descricao="Resposta em até 24h úteis" />
        <ContatoRow titulo="WhatsApp" valor="(11) 99999-0000" descricao="Seg–Sex · 9h às 18h" />
        <ContatoRow titulo="Status do sistema" valor="status.nymos.app" descricao="Veja se há problemas conhecidos" />
      </div>

      <a
        href="/mobile/sections/login"
        className="mt-auto pt-6 w-full h-11 rounded-2xl text-teal-300 hover:text-teal-200 text-[12.5px] font-semibold flex items-center justify-center gap-1"
      >
        <ChevronLeft size={13} strokeWidth={2.4} />
        Voltar pro login
      </a>
    </AuthShell>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="self-start inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-[12px] font-medium"
    >
      <ChevronLeft size={13} strokeWidth={2.4} />
      Voltar
    </button>
  )
}

function InfoRow({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
      <div className="text-slate-100 text-[12.5px] font-semibold">{titulo}</div>
      <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{descricao}</div>
    </div>
  )
}

function ContatoRow({ titulo, valor, descricao }: { titulo: string; valor: string; descricao: string }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{titulo}</div>
        <div className="text-slate-100 text-[12.5px] font-mono mt-0.5">{valor}</div>
        <div className="text-slate-500 text-[10.5px] mt-0.5">{descricao}</div>
      </div>
      <ChevronRight size={13} className="text-slate-500 shrink-0" />
    </div>
  )
}
