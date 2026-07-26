import { useState } from 'react'
import {
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  CreditCard,
  DoorOpen,
  FlaskConical,
  Home,
  MessageSquare,
  Pill,
  Settings as SettingsIcon,
  Stethoscope,
  Users,
} from 'lucide-react'
import { AppShell, type NavGroup } from './components'

type Persona = 'medico' | 'admin' | 'recepcao'

// Médico: centrado no paciente. Prontuário/Exames/Prescrição/Consulta ficam nested em Pacientes.
const NAV_MEDICO: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Início', href: '/medical-clinic/sections/inicio', icon: Home },
      { label: 'Agenda', href: '/medical-clinic/sections/agenda', icon: Calendar },
      { label: 'Pacientes', href: '/medical-clinic/sections/pacientes', icon: Users },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Atendimentos', href: '/medical-clinic/sections/atendimentos', icon: ClipboardList },
      { label: 'Exames', href: '/medical-clinic/sections/exames', icon: FlaskConical },
      { label: 'Prescrições', href: '/medical-clinic/sections/prescricao', icon: Pill },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Mensagens', href: '/medical-clinic/sections/mensagens', icon: MessageSquare },
      { label: 'Configurações', href: '/medical-clinic/sections/configuracoes-medico', icon: SettingsIcon },
    ],
  },
]

// Admin/gestor: gestão do workspace da clínica. Sem acesso ao conteúdo clínico dos pacientes.
const NAV_ADMIN: NavGroup[] = [
  {
    label: 'Gestão',
    items: [
      { label: 'Visão geral', href: '/medical-clinic/sections/inicio-gestao', icon: Building2 },
      { label: 'Equipe', href: '/medical-clinic/sections/equipe', icon: Stethoscope },
      { label: 'Salas & recursos', href: '/medical-clinic/sections/salas', icon: DoorOpen },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Faturamento', href: '/medical-clinic/sections/faturamento', icon: CreditCard },
      { label: 'Relatórios', href: '/medical-clinic/sections/relatorios', icon: BarChart3 },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Agenda', href: '/medical-clinic/sections/agenda', icon: Calendar },
      { label: 'Configurações', href: '/medical-clinic/sections/configuracoes-clinica', icon: SettingsIcon },
    ],
  },
]

// Recepção: operacional puro. Agenda multi-médico, cadastro admin, cobrança. Zero clínico.
const NAV_RECEPCAO: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Agenda', href: '/medical-clinic/sections/agenda', icon: Calendar },
      { label: 'Pacientes', href: '/medical-clinic/sections/pacientes', icon: Users },
      { label: 'Mensagens', href: '/medical-clinic/sections/mensagens', icon: MessageSquare },
      { label: 'Cobrança', href: '/medical-clinic/sections/cobranca', icon: CreditCard },
      { label: 'Configurações', href: '/medical-clinic/sections/configuracoes-recepcao', icon: SettingsIcon },
    ],
  },
]

export default function ShellPreview() {
  const [persona, setPersona] = useState<Persona>('medico')

  const cfg = {
    medico: {
      nav: NAV_MEDICO,
      active: '/medical-clinic/sections/inicio',
      user: { name: 'Dra. Helena Prado', role: 'Endocrinologista · CRM 456789-SP' },
      title: 'Médico · Web',
      subtitle:
        'Side-nav centrado no paciente. Prontuário compartilhado da clínica (com audit log). Vê a própria agenda + encaixes.',
    },
    admin: {
      nav: NAV_ADMIN,
      active: '/medical-clinic/sections/inicio-gestao',
      user: { name: 'Roberto Dias', role: 'Gestor da clínica' },
      title: 'Admin · Web',
      subtitle:
        'Gestão do workspace: equipe, salas, faturamento agregado e relatórios. Sem acesso ao conteúdo clínico.',
    },
    recepcao: {
      nav: NAV_RECEPCAO,
      active: '/medical-clinic/sections/agenda',
      user: { name: 'Carla Souza', role: 'Recepção' },
      title: 'Recepção · Web',
      subtitle:
        'Operacional puro. Agenda multi-médico, cadastro, cobrança. Sem prontuário, exames, prescrição.',
    },
  }[persona]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        body, [data-nymos-medical-clinic],
        [data-nymos-medical-clinic] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      <div data-nymos-medical-clinic="true" className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <PersonaToggle persona={persona} onChange={setPersona} />
        <AppShell
          navigationGroups={cfg.nav}
          activeHref={cfg.active}
          user={cfg.user}
          persona={persona}
          onNavigate={(href) => console.log('Navigate:', href)}
          onLogout={() => console.log('Logout')}
          onProfileClick={() => console.log('Profile')}
        >
          <PreviewContent title={cfg.title} subtitle={cfg.subtitle} />
        </AppShell>
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
    { value: 'admin', label: 'Admin' },
    { value: 'recepcao', label: 'Recepção' },
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

function PreviewContent({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-prose">{subtitle}</p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-xs text-slate-400 dark:text-slate-500">
        Área de conteúdo — sections renderizam aqui
      </div>
    </div>
  )
}
