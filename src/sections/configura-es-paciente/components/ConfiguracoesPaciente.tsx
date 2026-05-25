import { useState } from 'react'
import type {
  ConfiguracoesPacienteProps,
  LegalDocument,
  SettingsSectionId,
} from '@/../product/sections/configura-es-paciente/types'
import { Sidebar } from './Sidebar'
import { PreferencesSection } from './PreferencesSection'
import { NotificationsSection } from './NotificationsSection'
import { PrivacySection } from './PrivacySection'
import { BillingSection } from './BillingSection'
import {
  AddPaymentMethodModal,
  CancelSubscriptionModal,
  ChangePlanModal,
  ConsentHistoryDrawer,
  DataExportModal,
  DeleteAccountModal,
  TermsModal,
} from './Modals'

type ModalKey =
  | 'terms'
  | 'export'
  | 'history'
  | 'delete'
  | 'changePlan'
  | 'addPayment'
  | 'cancelSubscription'
  | null

export function ConfiguracoesPaciente({
  preferences,
  notificationSettings,
  privacySettings,
  legalDocuments,
  dataExportRequests,
  consentHistory,
  currentPlan,
  availablePlans,
  paymentMethods,
  languageOptions,
  timezoneOptions,
  metricSystemOptions,
  themeOptions,
  profileVisibilityOptions,
  dateFormatOptions,
  timeFormatOptions,
  sections,
  userEmail,
  activeSection: controlledSection,
  onSectionChange,
  onUpdatePreferences,
  onUpdateNotifications,
  onUpdatePrivacy,
  onViewLegalDocument,
  onRequestDataExport,
  onDownloadDataExport,
  onOpenConsentHistory,
  onDeleteAccount,
  onChangePlan,
  onCancelSubscription,
  onToggleAutoRenew,
  onAddPaymentMethod,
  onSetDefaultPaymentMethod,
  onRemovePaymentMethod,
  isRequestingExport,
  isDeletingAccount,
  isChangingPlan,
  isCancellingSubscription,
  isAddingPaymentMethod,
}: ConfiguracoesPacienteProps) {
  const [internalSection, setInternalSection] =
    useState<SettingsSectionId>('preferences')
  const activeSection = controlledSection ?? internalSection
  const [openModal, setOpenModal] = useState<ModalKey>(null)
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocument | null>(
    null,
  )

  function setSection(id: SettingsSectionId) {
    setInternalSection(id)
    onSectionChange?.(id)
  }

  function openLegalDoc(id: string) {
    const doc = legalDocuments.find((d) => d.id === id)
    if (doc) {
      setActiveLegalDoc(doc)
      setOpenModal('terms')
    }
    onViewLegalDocument?.(id)
  }

  function renderActiveSection() {
    switch (activeSection) {
      case 'preferences':
        return (
          <PreferencesSection
            preferences={preferences}
            languageOptions={languageOptions}
            timezoneOptions={timezoneOptions}
            metricSystemOptions={metricSystemOptions}
            themeOptions={themeOptions}
            dateFormatOptions={dateFormatOptions}
            timeFormatOptions={timeFormatOptions}
            onChange={(payload) => onUpdatePreferences?.(payload)}
          />
        )
      case 'notifications':
        return (
          <NotificationsSection
            settings={notificationSettings}
            onChange={(payload) => onUpdateNotifications?.(payload)}
          />
        )
      case 'privacy':
        return (
          <PrivacySection
            privacy={privacySettings}
            profileVisibilityOptions={profileVisibilityOptions}
            legalDocuments={legalDocuments}
            dataExportRequests={dataExportRequests}
            onChange={(payload) => onUpdatePrivacy?.(payload)}
            onViewLegalDocument={openLegalDoc}
            onRequestExport={() => setOpenModal('export')}
            onDownloadExport={onDownloadDataExport}
            onOpenConsentHistory={() => {
              setOpenModal('history')
              onOpenConsentHistory?.()
            }}
            onDeleteAccount={() => setOpenModal('delete')}
          />
        )
      case 'billing':
        return (
          <BillingSection
            currentPlan={currentPlan}
            paymentMethods={paymentMethods}
            onChangePlan={() => setOpenModal('changePlan')}
            onCancelSubscription={() => setOpenModal('cancelSubscription')}
            onToggleAutoRenew={(autoRenew) => onToggleAutoRenew?.(autoRenew)}
            onAddPaymentMethod={() => setOpenModal('addPayment')}
            onSetDefaultPaymentMethod={onSetDefaultPaymentMethod}
            onRemovePaymentMethod={onRemovePaymentMethod}
          />
        )
    }
  }

  return (
    <div
      data-nymos-configuracoes-paciente
      className="min-h-full bg-slate-50/60 dark:bg-slate-950"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6 md:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
            Conta
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            Configurações
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Personalize sua experiência e governe sua conta. Mudanças simples
            salvam automaticamente.
          </p>
        </header>

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
      <TermsModal
        open={openModal === 'terms'}
        onClose={() => setOpenModal(null)}
        document={activeLegalDoc}
      />
      <DataExportModal
        open={openModal === 'export'}
        onClose={() => setOpenModal(null)}
        email={userEmail}
        isRequesting={isRequestingExport}
        onConfirm={(format) => {
          onRequestDataExport?.({ format })
          setOpenModal(null)
        }}
      />
      <ConsentHistoryDrawer
        open={openModal === 'history'}
        onClose={() => setOpenModal(null)}
        history={consentHistory}
      />
      <DeleteAccountModal
        open={openModal === 'delete'}
        onClose={() => setOpenModal(null)}
        expectedEmail={userEmail}
        isDeleting={isDeletingAccount}
        onConfirm={(payload) => {
          onDeleteAccount?.(payload)
          setOpenModal(null)
        }}
      />
      <ChangePlanModal
        open={openModal === 'changePlan'}
        onClose={() => setOpenModal(null)}
        currentPlanId={currentPlan.id}
        availablePlans={availablePlans}
        isChanging={isChangingPlan}
        onConfirm={(planId, interval) => {
          onChangePlan?.({ planId, interval })
          setOpenModal(null)
        }}
      />
      <AddPaymentMethodModal
        open={openModal === 'addPayment'}
        onClose={() => setOpenModal(null)}
        isAdding={isAddingPaymentMethod}
        onConfirm={(token, setAsDefault) => {
          onAddPaymentMethod?.({ stripeToken: token, setAsDefault })
          setOpenModal(null)
        }}
      />
      <CancelSubscriptionModal
        open={openModal === 'cancelSubscription'}
        onClose={() => setOpenModal(null)}
        accessUntil={currentPlan.nextBilling}
        isCancelling={isCancellingSubscription}
        onConfirm={(payload) => {
          onCancelSubscription?.(payload)
          setOpenModal(null)
        }}
      />
    </div>
  )
}
