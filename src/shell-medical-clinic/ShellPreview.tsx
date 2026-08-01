import { useState } from 'react'
import { AppShell } from './components'
import { NAV_POR_PERSONA, USER_POR_PERSONA, type Persona } from './navs'


export default function ShellPreview() {
  const [persona, setPersona] = useState<Persona>('medico')

  const cfg = {
    medico: {
      nav: NAV_POR_PERSONA.medico,
      active: '/medical-clinic/sections/inicio',
      user: USER_POR_PERSONA.medico,
      title: 'Médico · Web',
      subtitle:
        'Side-nav centrado no paciente. Prontuário compartilhado da clínica (com audit log). Vê a própria agenda + encaixes.',
    },
    admin: {
      nav: NAV_POR_PERSONA.admin,
      active: '/medical-clinic/sections/inicio-gestao',
      user: USER_POR_PERSONA.admin,
      title: 'Admin · Web',
      subtitle:
        'Gestão do workspace: equipe, salas, faturamento agregado e relatórios. Sem acesso ao conteúdo clínico.',
    },
    recepcao: {
      nav: NAV_POR_PERSONA.recepcao,
      active: '/medical-clinic/sections/agenda',
      user: USER_POR_PERSONA.recepcao,
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
