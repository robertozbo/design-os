import { Search, UserPlus, Users } from 'lucide-react'
import type { PacientesProps } from '@/../product/sections/pacientes/types'
import { CadastrarModal } from './CadastrarModal'
import { ConviteModal } from './ConviteModal'
import { ListFilters } from './ListFilters'
import { PatientCard } from './PatientCard'

export function PacientesList({
  nutri,
  inviteInfo,
  list,
  modals,
  emptyStates,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onOpenPatient,
  onOpenInviteModal,
  onOpenCadastrarModal,
  onCloseModal,
  onCopyInvite,
  onShareInvite,
  onSubmitCadastrar,
}: PacientesProps) {
  const totalCount = list.filters.find((f) => f.id === 'todos')?.count ?? list.patients.length
  const filteredCount = list.patients.length
  const isFiltered = list.selectedFilter !== 'todos' || list.searchQuery !== ''
  const showEmpty = filteredCount === 0
  const isNewProfessional = totalCount === 0

  return (
    <div
      data-nymos-pacientes
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header
          style={{ animationDelay: '0ms' }}
          className="nymos-reveal opacity-0 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Carteira
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Pacientes
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono tabular-nums">{totalCount}</span> paciente
              {totalCount === 1 ? '' : 's'} sob seu acompanhamento ·{' '}
              <span className="font-mono tabular-nums">
                {list.filters.find((f) => f.id === 'vinculados')?.count ?? 0}
              </span>{' '}
              vinculados ao app
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-100 hover:shadow-md hover:shadow-teal-500/10 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200 dark:hover:bg-teal-900/50"
            >
              <Users size={16} />
              Convidar paciente
            </button>
            <button
              type="button"
              onClick={onOpenCadastrarModal}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <UserPlus size={16} />
              Novo paciente
            </button>
          </div>
        </header>

        {/* Search */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="search"
              value={list.searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar por nome, email, telefone ou código…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Filters + sort */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-4"
        >
          <ListFilters
            filters={list.filters}
            selectedFilter={list.selectedFilter}
            sorts={list.sorts}
            selectedSort={list.selectedSort}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
          />
        </div>

        {/* Result count */}
        <div
          style={{ animationDelay: '320ms' }}
          className="nymos-reveal opacity-0 mt-5 flex items-center justify-between px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isFiltered ? (
              <>
                Mostrando{' '}
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {filteredCount}
                </span>{' '}
                de <span className="font-mono tabular-nums">{totalCount}</span>
              </>
            ) : (
              <>
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {filteredCount}
                </span>{' '}
                paciente{filteredCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>

        {/* Patient cards */}
        {showEmpty ? (
          <div
            style={{ animationDelay: '420ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              isNewProfessional={isNewProfessional}
              emptyStates={emptyStates}
              onOpenInvite={onOpenInviteModal}
              onOpenCadastrar={onOpenCadastrarModal}
            />
          </div>
        ) : (
          <div
            style={{ animationDelay: '420ms' }}
            className="nymos-reveal opacity-0 mt-4 space-y-3"
          >
            {list.patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                currentPlan={nutri.plan}
                onClick={() => onOpenPatient?.(patient.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ConviteModal
        isOpen={modals.convite.isOpen}
        invite={inviteInfo}
        onClose={() => onCloseModal?.('convite')}
        onCopy={onCopyInvite}
        onShare={onShareInvite}
      />

      <CadastrarModal
        isOpen={modals.cadastrar.isOpen}
        onClose={() => onCloseModal?.('cadastrar')}
        onSubmit={onSubmitCadastrar}
      />
    </div>
  )
}

function EmptyState({
  isNewProfessional,
  emptyStates,
  onOpenInvite,
  onOpenCadastrar,
}: {
  isNewProfessional: boolean
  emptyStates: PacientesProps['emptyStates']
  onOpenInvite?: () => void
  onOpenCadastrar?: () => void
}) {
  const state = isNewProfessional ? emptyStates.novoNutri : emptyStates.filtroVazio

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        <Users size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        {state.title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {state.description}
      </p>
      {isNewProfessional && (
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onOpenInvite}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Users size={14} />
            {emptyStates.novoNutri.primaryAction?.label ?? 'Convidar paciente'}
          </button>
          <button
            type="button"
            onClick={onOpenCadastrar}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <UserPlus size={14} />
            {emptyStates.novoNutri.secondaryAction?.label ?? 'Cadastrar manualmente'}
          </button>
        </div>
      )}
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      [data-nymos-pacientes] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-pacientes] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
