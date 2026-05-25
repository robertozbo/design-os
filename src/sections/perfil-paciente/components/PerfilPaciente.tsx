import { useState } from 'react'
import type {
  PerfilPacienteProps,
  SettingsSectionId,
} from '@/../product/sections/perfil-paciente/types'
import { Sidebar } from './Sidebar'
import { Overview } from './Overview'
import { PersonalInfo } from './PersonalInfo'
import { HealthInfo } from './HealthInfo'
import { AccountInfo } from './AccountInfo'
import {
  AvatarModal,
  HealthModal,
  PasswordModal,
  PersonalDataModal,
} from './Modals'

type ModalKey = 'personal' | 'health' | 'password' | 'avatar' | null

export function PerfilPaciente({
  profile,
  plan,
  linkedProfessionals,
  linkedProfessionalsTotal,
  sections,
  bloodTypeOptions,
  activityLevelOptions,
  genderOptions,
  activeSection: controlledSection,
  onSectionChange,
  onUpdatePersonalData,
  onUpdateHealthData,
  onUpdatePassword,
  onUploadAvatar,
  onCepLookup,
  onSeeAllProfessionals,
  onManagePlan,
  isUpdatingProfile,
  isUpdatingPassword,
  isUploadingAvatar,
  isLoadingCep,
}: PerfilPacienteProps) {
  const [internalSection, setInternalSection] =
    useState<SettingsSectionId>('overview')
  const activeSection = controlledSection ?? internalSection
  const [openModal, setOpenModal] = useState<ModalKey>(null)

  function setSection(id: SettingsSectionId) {
    setInternalSection(id)
    onSectionChange?.(id)
  }

  function renderActiveSection() {
    switch (activeSection) {
      case 'overview':
        return (
          <Overview
            profile={profile}
            plan={plan}
            linkedProfessionals={linkedProfessionals}
            linkedProfessionalsTotal={linkedProfessionalsTotal}
            onEditPersonalData={() => setOpenModal('personal')}
            onEditAvatar={() => setOpenModal('avatar')}
            onEditPassword={() => setOpenModal('password')}
            onSeeAllProfessionals={onSeeAllProfessionals}
          />
        )
      case 'personal':
        return (
          <PersonalInfo
            profile={profile}
            genderOptions={genderOptions}
            onEdit={() => setOpenModal('personal')}
          />
        )
      case 'health':
        return (
          <HealthInfo
            profile={profile}
            activityLevelOptions={activityLevelOptions}
            onEdit={() => setOpenModal('health')}
          />
        )
      case 'account':
        return (
          <AccountInfo
            profile={profile}
            plan={plan}
            onChangePassword={() => setOpenModal('password')}
            onManagePlan={onManagePlan}
          />
        )
    }
  }

  return (
    <div
      data-nymos-perfil-paciente
      className="min-h-full bg-slate-50/60 dark:bg-slate-950"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        {/* Page header */}
        <header className="mb-6 md:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
            Conta
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            Perfil
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Suas informações e preferências de conta. Funcionalidades completas
            estão no app mobile.
          </p>
        </header>

        {/* Layout: sidebar + content */}
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <Sidebar
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setSection}
          />
          <main className="min-w-0 flex-1">{renderActiveSection()}</main>
        </div>
      </div>

      {/* Modals */}
      <PersonalDataModal
        open={openModal === 'personal'}
        onClose={() => setOpenModal(null)}
        profile={profile}
        genderOptions={genderOptions}
        onCepLookup={onCepLookup}
        isUpdating={isUpdatingProfile}
        isLoadingCep={isLoadingCep}
        onSubmit={(payload) => {
          onUpdatePersonalData?.(payload)
          setOpenModal(null)
        }}
      />
      <HealthModal
        open={openModal === 'health'}
        onClose={() => setOpenModal(null)}
        profile={profile}
        bloodTypeOptions={bloodTypeOptions}
        activityLevelOptions={activityLevelOptions}
        isUpdating={isUpdatingProfile}
        onSubmit={(payload) => {
          onUpdateHealthData?.(payload)
          setOpenModal(null)
        }}
      />
      <PasswordModal
        open={openModal === 'password'}
        onClose={() => setOpenModal(null)}
        isUpdating={isUpdatingPassword}
        onSubmit={(payload) => {
          onUpdatePassword?.(payload)
          setOpenModal(null)
        }}
      />
      <AvatarModal
        open={openModal === 'avatar'}
        onClose={() => setOpenModal(null)}
        currentImage={profile.image}
        fallbackName={profile.name}
        isUploading={isUploadingAvatar}
        onSubmit={(file) => {
          onUploadAvatar?.({ file })
          setOpenModal(null)
        }}
      />
    </div>
  )
}
