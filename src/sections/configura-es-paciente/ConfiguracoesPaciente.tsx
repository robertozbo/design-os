import data from '@/../product/sections/configura-es-paciente/data.json'
import type {
  Preferences,
  NotificationSettings,
  PrivacySettings,
  LegalDocument,
  DataExportRequest,
  ConsentHistoryEntry,
  CurrentPlan,
  AvailablePlan,
  PaymentMethod,
  LanguageOption,
  TimezoneOption,
  MetricSystemOption,
  ThemeOption,
  ProfileVisibilityOption,
  DateFormatOption,
  TimeFormatOption,
  SettingsSection,
} from '@/../product/sections/configura-es-paciente/types'
import { ConfiguracoesPaciente as ConfiguracoesPacienteView } from './components/ConfiguracoesPaciente'

export default function ConfiguracoesPacientePreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-configuracoes-paciente],
        [data-nymos-configuracoes-paciente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-configuracoes-paciente] .font-mono,
        [data-nymos-configuracoes-paciente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-configuracoes-paciente] .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        [data-nymos-configuracoes-paciente] .scrollbar-none {
          scrollbar-width: none;
        }
      `}</style>
      <ConfiguracoesPacienteView
        preferences={data.preferences as Preferences}
        notificationSettings={data.notificationSettings as NotificationSettings}
        privacySettings={data.privacySettings as PrivacySettings}
        legalDocuments={data.legalDocuments as LegalDocument[]}
        dataExportRequests={data.dataExportRequests as DataExportRequest[]}
        consentHistory={data.consentHistory as ConsentHistoryEntry[]}
        currentPlan={data.currentPlan as CurrentPlan}
        availablePlans={data.availablePlans as AvailablePlan[]}
        paymentMethods={data.paymentMethods as PaymentMethod[]}
        languageOptions={data.languageOptions as LanguageOption[]}
        timezoneOptions={data.timezoneOptions as TimezoneOption[]}
        metricSystemOptions={data.metricSystemOptions as MetricSystemOption[]}
        themeOptions={data.themeOptions as ThemeOption[]}
        profileVisibilityOptions={
          data.profileVisibilityOptions as ProfileVisibilityOption[]
        }
        dateFormatOptions={data.dateFormatOptions as DateFormatOption[]}
        timeFormatOptions={data.timeFormatOptions as TimeFormatOption[]}
        sections={data.sections as SettingsSection[]}
        userEmail={data.userEmail}
        onSectionChange={(id) =>
          console.log('[ConfiguracoesPaciente] section:', id)
        }
        onUpdatePreferences={(p) =>
          console.log('[ConfiguracoesPaciente] preferences:', p)
        }
        onUpdateNotifications={(p) =>
          console.log('[ConfiguracoesPaciente] notifications:', p)
        }
        onUpdatePrivacy={(p) =>
          console.log('[ConfiguracoesPaciente] privacy:', p)
        }
        onViewLegalDocument={(id) =>
          console.log('[ConfiguracoesPaciente] view legal:', id)
        }
        onRequestDataExport={(p) =>
          console.log('[ConfiguracoesPaciente] export:', p)
        }
        onDownloadDataExport={(id) =>
          console.log('[ConfiguracoesPaciente] download export:', id)
        }
        onOpenConsentHistory={() =>
          console.log('[ConfiguracoesPaciente] open history')
        }
        onDeleteAccount={(p) =>
          console.log('[ConfiguracoesPaciente] delete account')
        }
        onChangePlan={(p) =>
          console.log('[ConfiguracoesPaciente] change plan:', p)
        }
        onCancelSubscription={(p) =>
          console.log('[ConfiguracoesPaciente] cancel:', p)
        }
        onToggleAutoRenew={(b) =>
          console.log('[ConfiguracoesPaciente] autoRenew:', b)
        }
        onAddPaymentMethod={(p) =>
          console.log('[ConfiguracoesPaciente] add payment')
        }
        onSetDefaultPaymentMethod={(id) =>
          console.log('[ConfiguracoesPaciente] set default:', id)
        }
        onRemovePaymentMethod={(id) =>
          console.log('[ConfiguracoesPaciente] remove:', id)
        }
      />
    </>
  )
}
