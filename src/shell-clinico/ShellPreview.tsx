import { useState } from 'react'
import {
  Calendar,
  ClipboardList,
  CreditCard,
  FlaskConical,
  Home,
  MessageSquare,
  Pill,
  Settings as SettingsIcon,
  User as UserIcon,
  Users,
} from 'lucide-react'
import { AppShell, MobileShell, type NavGroup, type MobileNavItem } from './components'

type Persona = 'medico' | 'secretaria' | 'paciente'

const NAV_MEDICO: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Início', href: '/clinico/sections/inicio', icon: Home },
      { label: 'Agenda', href: '/clinico/sections/agenda', icon: Calendar },
      { label: 'Pacientes', href: '/clinico/sections/pacientes', icon: Users },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Atendimentos', href: '/clinico/sections/consultas', icon: ClipboardList },
      { label: 'Exames', href: '/clinico/sections/exames', icon: FlaskConical },
      { label: 'Prescrições', href: '/clinico/sections/prescricao', icon: Pill },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Mensagens', href: '/clinico/sections/mensagens', icon: MessageSquare },
      { label: 'Configurações', href: '/clinico/sections/configuracoes-medico', icon: SettingsIcon },
    ],
  },
]

const NAV_SECRETARIA: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Agenda', href: '/clinico/sections/agenda', icon: Calendar },
      { label: 'Pacientes', href: '/clinico/sections/pacientes', icon: Users },
      { label: 'Mensagens', href: '/clinico/sections/mensagens', icon: MessageSquare },
      { label: 'Cobrança', href: '/clinico/sections/cobranca', icon: CreditCard },
      { label: 'Configurações', href: '/clinico/sections/configuracoes-secretaria', icon: SettingsIcon },
    ],
  },
]

const NAV_PACIENTE: MobileNavItem[] = [
  { label: 'Início', href: '/clinico/paciente/inicio', icon: Home },
  { label: 'Agenda', href: '/clinico/paciente/agenda', icon: Calendar },
  { label: 'Medicação', href: '/clinico/paciente/medicacao', icon: Pill },
  { label: 'Mensagens', href: '/clinico/paciente/mensagens', icon: MessageSquare },
  { label: 'Perfil', href: '/clinico/paciente/perfil', icon: UserIcon },
]

export default function ShellPreview() {
  const [persona, setPersona] = useState<Persona>('medico')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        body, [data-nymos-clinico],
        [data-nymos-clinico] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      <div data-nymos-clinico="true" className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <PersonaToggle persona={persona} onChange={setPersona} />

        {persona === 'medico' && (
          <AppShell
            navigationGroups={NAV_MEDICO}
            activeHref="/clinico/sections/inicio"
            user={{ name: 'Dr. Pedro Lima', role: 'Endocrinologista · CRM 123456-SP' }}
            persona="medico"
            onNavigate={(href) => console.log('Navigate:', href)}
            onLogout={() => console.log('Logout')}
            onProfileClick={() => console.log('Profile')}
          >
            <PreviewContent
              title="Médico · Web"
              subtitle="Side-nav com 5 itens. Prontuário, Exames, Prescrição e Consulta ficam nested em Pacientes."
            />
          </AppShell>
        )}

        {persona === 'secretaria' && (
          <AppShell
            navigationGroups={NAV_SECRETARIA}
            activeHref="/clinico/sections/agenda"
            user={{ name: 'Carla Souza', role: 'Secretária' }}
            persona="secretaria"
            onNavigate={(href) => console.log('Navigate:', href)}
            onLogout={() => console.log('Logout')}
            onProfileClick={() => console.log('Profile')}
          >
            <PreviewContent
              title="Secretária · Web"
              subtitle="Side-nav reduzida. Abre direto em Agenda. Sem acesso a prontuário, exames, prescrição, consulta."
            />
          </AppShell>
        )}

        {persona === 'paciente' && (
          <div className="flex justify-center items-start py-10 px-4 min-h-screen">
            <MobileShell
              navItems={NAV_PACIENTE}
              activeHref="/clinico/paciente/inicio"
              notificationCount={2}
              onNavigate={(href) => console.log('Navigate:', href)}
              onNotificationsClick={() => console.log('Notifications')}
            >
              <PreviewContent
                title="Paciente · Mobile"
                subtitle="Bottom-nav com 5 abas. Tudo de 'minha conta' entra em Perfil."
                compact
              />
            </MobileShell>
          </div>
        )}
      </div>
    </>
  )
}

function PersonaToggle({
  persona,
  onChange,
}: {
  persona: Persona
  onChange: (p: Persona) => void
}) {
  const options: { value: Persona; label: string }[] = [
    { value: 'medico', label: 'Médico' },
    { value: 'secretaria', label: 'Secretária' },
    { value: 'paciente', label: 'Paciente' },
  ]
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            persona === opt.value
              ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function PreviewContent({
  title,
  subtitle,
  compact,
}: {
  title: string
  subtitle: string
  compact?: boolean
}) {
  return (
    <div className={compact ? 'p-5' : 'p-8'}>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-prose">
        {subtitle}
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-xs text-slate-400 dark:text-slate-500">
        Área de conteúdo — sections renderizam aqui
      </div>
    </div>
  )
}
