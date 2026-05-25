import { useState } from 'react'
import data from '@/../product-clinico/sections/inicio-paciente/data.json'
import type {
  LembreteMedicacao,
  StatusLembrete,
} from '@/../product-clinico/sections/inicio-paciente/types'
import { InicioPaciente as InicioPacienteView } from './components/InicioPaciente'

export default function InicioPacientePreview() {
  const [lembretes, setLembretes] = useState<LembreteMedicacao[]>(
    data.lembretesMedicacaoHoje as LembreteMedicacao[],
  )

  return (
    <InicioPacienteView
      paciente={data.paciente}
      saudacao={data.saudacao as never}
      alertaTopo={data.alertaTopo as never}
      proximaConsulta={data.proximaConsulta as never}
      lembretesMedicacaoHoje={lembretes}
      acoesRapidas={data.acoesRapidas as never}
      profissionaisVinculados={data.profissionaisVinculados as never}
      profissionaisPlaceholder={data.profissionaisPlaceholder as never}
      onAbrirNotificacoes={() => console.log('abrir notificações')}
      onAbrirPerfil={() => console.log('abrir perfil')}
      onAbrirAlerta={(id) => console.log('abrir alerta:', id)}
      onAbrirProximaConsulta={(id) => console.log('abrir consulta:', id)}
      onEntrarSalaTele={(id) => console.log('entrar sala:', id)}
      onConfirmarPresenca={(id) => console.log('confirmar presença:', id)}
      onMarcarCumprido={(id) => {
        setLembretes((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status: 'cumprido' as StatusLembrete,
                  cumpridoEm: new Date().toISOString(),
                }
              : l,
          ),
        )
      }}
      onPularLembrete={(id, motivo) => console.log('pular lembrete:', id, motivo)}
      onAcaoRapida={(id) => console.log('ação rápida:', id)}
      onAbrirProfissional={(id) => console.log('abrir profissional:', id)}
      onBuscarProfissional={(verticalId) => console.log('buscar:', verticalId)}
    />
  )
}
