import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings as SettingsIcon,
  Target,
  Users,
  Video,
} from 'lucide-react'
import { AppShell, type NavGroup } from './components'

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Dashboard', href: '/psicologo/sections/dashboard', icon: LayoutDashboard },
      { label: 'Pacientes', href: '/psicologo/sections/pacientes', icon: Users },
      { label: 'Sessão', href: '/psicologo/sections/sessao', icon: Video },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Instrumentos', href: '/psicologo/sections/instrumentos', icon: ClipboardList },
      { label: 'Plano terapêutico', href: '/psicologo/sections/plano-terapeutico', icon: Target },
      { label: 'Prontuário', href: '/psicologo/sections/prontuario', icon: FileText },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Configurações', href: '/psicologo/sections/configuracoes', icon: SettingsIcon },
    ],
  },
]

export default function ShellPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        body, [data-nymos-psicologo],
        [data-nymos-psicologo] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      <div data-nymos-psicologo="true">
        <AppShell
          navigationGroups={NAV_GROUPS}
          activeHref="/psicologo/sections/dashboard"
          user={{ name: 'Dra. Marina Silva', role: 'Psicóloga · CRP 06/12345' }}
          onNavigate={(href) => console.log('Navigate to:', href)}
          onLogout={() => console.log('Logout')}
          onProfileClick={() => console.log('Profile')}
        >
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Área de conteúdo
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              As sections renderizam aqui dentro do shell.
            </p>
          </div>
        </AppShell>
      </div>
    </>
  )
}
