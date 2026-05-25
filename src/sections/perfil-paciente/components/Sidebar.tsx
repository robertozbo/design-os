import { User, Edit, Heart, FileText, type LucideIcon } from 'lucide-react'
import type {
  SettingsSection,
  SettingsSectionId,
} from '@/../product/sections/perfil-paciente/types'

const ICONS: Record<string, LucideIcon> = {
  User,
  Edit,
  Heart,
  FileText,
}

interface SidebarProps {
  sections: SettingsSection[]
  activeSection: SettingsSectionId
  onSectionChange: (id: SettingsSectionId) => void
}

export function Sidebar({ sections, activeSection, onSectionChange }: SidebarProps) {
  return (
    <nav
      aria-label="Seções do perfil"
      className="md:w-60 md:shrink-0 md:sticky md:top-6 md:self-start"
    >
      <ul className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-none">
        {sections.map((section) => {
          const Icon = ICONS[section.icon] ?? User
          const active = section.id === activeSection
          return (
            <li key={section.id} className="shrink-0 md:w-full">
              <button
                type="button"
                onClick={() => onSectionChange(section.id)}
                aria-current={active ? 'page' : undefined}
                className={`group relative w-full text-left rounded-2xl border transition-all duration-200 ${
                  active
                    ? 'border-teal-500/40 bg-teal-50 dark:bg-teal-500/10 dark:border-teal-400/30 shadow-sm'
                    : 'border-transparent hover:border-slate-200 hover:bg-white dark:hover:border-slate-700/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3 md:px-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-semibold tracking-tight ${
                        active
                          ? 'text-teal-900 dark:text-teal-100'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {section.label}
                    </span>
                    <span className="hidden md:block text-[11px] leading-tight text-slate-500 dark:text-slate-400 mt-0.5">
                      {section.description}
                    </span>
                  </span>
                  {active && (
                    <span
                      className="hidden md:block h-6 w-1 rounded-full bg-teal-500"
                      aria-hidden
                    />
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
