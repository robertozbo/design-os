import data from '@/../product/sections/perfil-paciente/data.json'
import type {
  PatientProfile,
  LinkedProfessionalSummary,
  UserPlan,
  SettingsSection,
  BloodTypeOption,
  ActivityLevelOption,
  GenderOption,
} from '@/../product/sections/perfil-paciente/types'
import { PerfilPaciente as PerfilPacienteView } from './components/PerfilPaciente'

export default function PerfilPacientePreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-perfil-paciente],
        [data-nymos-perfil-paciente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-perfil-paciente] .font-mono,
        [data-nymos-perfil-paciente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-perfil-paciente] .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        [data-nymos-perfil-paciente] .scrollbar-none {
          scrollbar-width: none;
        }
      `}</style>
      <PerfilPacienteView
        profile={data.patientProfile as PatientProfile}
        plan={data.userPlan as UserPlan}
        linkedProfessionals={
          data.linkedProfessionals as LinkedProfessionalSummary[]
        }
        linkedProfessionalsTotal={data.linkedProfessionalsTotal}
        sections={data.sections as SettingsSection[]}
        bloodTypeOptions={data.bloodTypeOptions as BloodTypeOption[]}
        activityLevelOptions={
          data.activityLevelOptions as ActivityLevelOption[]
        }
        genderOptions={data.genderOptions as GenderOption[]}
        onSectionChange={(id) =>
          console.log('[PerfilPaciente] section:', id)
        }
        onUpdatePersonalData={(p) =>
          console.log('[PerfilPaciente] update personal:', p)
        }
        onUpdateHealthData={(p) =>
          console.log('[PerfilPaciente] update health:', p)
        }
        onUpdatePassword={(p) =>
          console.log('[PerfilPaciente] update password (current+new redacted)')
        }
        onUploadAvatar={(p) =>
          console.log('[PerfilPaciente] upload avatar:', p.file.name)
        }
        onCepLookup={(zip) =>
          console.log('[PerfilPaciente] CEP lookup:', zip)
        }
        onSeeAllProfessionals={() =>
          console.log('[PerfilPaciente] navigate to /my-professionals')
        }
        onManagePlan={() =>
          console.log('[PerfilPaciente] open billing portal')
        }
      />
    </>
  )
}
