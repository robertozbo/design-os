import { useState } from 'react'
import data from '@/../product-clinic/sections/atendimento/data.json'
import type {
  AtendimentoData,
  AtendimentoPsi,
} from '@/../product-clinic/sections/atendimento/types'
import {
  AtendimentoShell,
  ContextoLateral,
  EscalasCard,
  PsicologiaRegistro,
  Toasts,
  useToasts,
} from './components'

export default function AtendimentoPsicologiaPreview() {
  const base = (data as unknown as AtendimentoData).psicologia
  const [atd, setAtd] = useState<AtendimentoPsi>(base)
  const { toasts, push } = useToasts()

  return (
    <>
      <AtendimentoShell
        atendimento={atd}
        clinica={(data as unknown as AtendimentoData).clinica}
        titulo="Sessão de psicologia"
        onSalvar={() => push('Rascunho salvo')}
        onFinalizar={() =>
          push(
            atd.risco > 0
              ? 'Risco registrado — plano de segurança é obrigatório antes de assinar'
              : 'Sessão assinada — nota privada não foi compartilhada',
          )
        }
        onSair={() => push('Saiu sem assinar — rascunho mantido')}
        lateral={
          <ContextoLateral
            contexto={atd.contexto}
            alertas={atd.alertas}
            destaque={<EscalasCard atendimento={atd} />}
          />
        }
      >
        <PsicologiaRegistro
          atendimento={atd}
          onRegistro={(campo, v) =>
            setAtd((a) => ({ ...a, registro: { ...a.registro, [campo]: v } }))
          }
          onNotaPrivada={(v) => setAtd((a) => ({ ...a, notaPrivada: v }))}
          onTarefa={(v) => setAtd((a) => ({ ...a, tarefaCasa: v }))}
          onTecnica={(id) =>
            setAtd((a) => ({
              ...a,
              tecnicas: a.tecnicas.map((t) =>
                t.id === id ? { ...t, aplicada: !t.aplicada } : t,
              ),
            }))
          }
          onRisco={(v) => setAtd((a) => ({ ...a, risco: v }))}
        />
      </AtendimentoShell>
      <Toasts toasts={toasts} />
    </>
  )
}
