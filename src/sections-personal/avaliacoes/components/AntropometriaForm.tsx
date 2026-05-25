import { useEffect } from 'react'
import { Scale } from 'lucide-react'
import type { Antropometria } from '@/../product-personal/sections/avaliacoes/types'
import { CollapsibleBlock, NumberInput, PhotoUploadSlot } from './FormPrimitives'
import {
  calcularIMC,
  calcularPercentualGorduraPollock,
  somaDobras,
} from './avaliacaoFormHelpers'

interface AntropometriaFormProps {
  value: Antropometria
  onChange: (next: Antropometria) => void
}

export function AntropometriaForm({ value, onChange }: AntropometriaFormProps) {
  // Auto-calc IMC
  useEffect(() => {
    const imcCalc = calcularIMC(value.pesoKg, value.estaturaCm)
    if (imcCalc !== value.imc) {
      onChange({ ...value, imc: imcCalc })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.pesoKg, value.estaturaCm])

  // Auto-calc %G Pollock
  useEffect(() => {
    const pgCalc = calcularPercentualGorduraPollock(value.dobras)
    if (pgCalc !== value.dobras.percentualGorduraPollock) {
      onChange({
        ...value,
        dobras: { ...value.dobras, percentualGorduraPollock: pgCalc },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value.dobras.peitoral,
    value.dobras.axilarMedia,
    value.dobras.triciptal,
    value.dobras.subescapular,
    value.dobras.abdominal,
    value.dobras.suprailiaca,
    value.dobras.coxa,
  ])

  const setBasico = (patch: Partial<Antropometria>) => onChange({ ...value, ...patch })
  const setCirc = (
    patch: Partial<Antropometria['circunferencias']>,
  ) =>
    onChange({ ...value, circunferencias: { ...value.circunferencias, ...patch } })
  const setDobra = (patch: Partial<Antropometria['dobras']>) =>
    onChange({ ...value, dobras: { ...value.dobras, ...patch } })
  const setBio = (patch: Partial<Antropometria['bioimpedancia']>) =>
    onChange({
      ...value,
      bioimpedancia: { ...value.bioimpedancia, ...patch },
    })
  const setFoto = (patch: Partial<Antropometria['fotos']>) =>
    onChange({ ...value, fotos: { ...value.fotos, ...patch } })

  const basicoActive = value.pesoKg != null || value.estaturaCm != null
  const circAtive = Object.values(value.circunferencias).some((v) => v != null)
  const dobrasAtive = Object.entries(value.dobras).some(
    ([k, v]) => k !== 'percentualGorduraPollock' && v != null,
  )
  const bioActive = Object.values(value.bioimpedancia).some((v) => v != null)
  const fotoActive = Object.values(value.fotos).some((v) => v != null)

  const sumDobras = somaDobras(value.dobras)

  return (
    <div className="space-y-3">
      <CollapsibleBlock
        title="Básico"
        description="Peso, estatura, IMC (calculado)"
        defaultOpen={true}
        active={basicoActive}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberInput
            label="Peso"
            unit="kg"
            value={value.pesoKg}
            onChange={(v) => setBasico({ pesoKg: v })}
          />
          <NumberInput
            label="Estatura"
            unit="cm"
            step={1}
            value={value.estaturaCm}
            onChange={(v) => setBasico({ estaturaCm: v })}
          />
          <NumberInput
            label="IMC"
            unit="kg/m²"
            value={value.imc}
            onChange={() => {}}
            computed
            hint="auto-calculado"
          />
        </div>
        {value.imc && <ImcInterpretacao imc={value.imc} />}
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Circunferências"
        description="Cintura, quadril, braço, coxa, panturrilha, abdomen (cm)"
        active={circAtive}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <NumberInput
            label="Cintura"
            unit="cm"
            step={0.5}
            value={value.circunferencias.cintura}
            onChange={(v) => setCirc({ cintura: v })}
          />
          <NumberInput
            label="Quadril"
            unit="cm"
            step={0.5}
            value={value.circunferencias.quadril}
            onChange={(v) => setCirc({ quadril: v })}
          />
          <NumberInput
            label="Abdomen"
            unit="cm"
            step={0.5}
            value={value.circunferencias.abdomen}
            onChange={(v) => setCirc({ abdomen: v })}
          />
          <NumberInput
            label="Braço"
            unit="cm"
            step={0.5}
            value={value.circunferencias.braco}
            onChange={(v) => setCirc({ braco: v })}
          />
          <NumberInput
            label="Coxa"
            unit="cm"
            step={0.5}
            value={value.circunferencias.coxa}
            onChange={(v) => setCirc({ coxa: v })}
          />
          <NumberInput
            label="Panturrilha"
            unit="cm"
            step={0.5}
            value={value.circunferencias.panturrilha}
            onChange={(v) => setCirc({ panturrilha: v })}
          />
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Dobras cutâneas"
        description="Pollock 7-dobras → % gordura calculado"
        active={dobrasAtive}
        badge={
          sumDobras != null && (
            <span className="inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              Σ {sumDobras.toFixed(0)} mm
            </span>
          )
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <NumberInput
            label="Peitoral"
            unit="mm"
            step={1}
            value={value.dobras.peitoral}
            onChange={(v) => setDobra({ peitoral: v })}
          />
          <NumberInput
            label="Axilar média"
            unit="mm"
            step={1}
            value={value.dobras.axilarMedia}
            onChange={(v) => setDobra({ axilarMedia: v })}
          />
          <NumberInput
            label="Triciptal"
            unit="mm"
            step={1}
            value={value.dobras.triciptal}
            onChange={(v) => setDobra({ triciptal: v })}
          />
          <NumberInput
            label="Subescapular"
            unit="mm"
            step={1}
            value={value.dobras.subescapular}
            onChange={(v) => setDobra({ subescapular: v })}
          />
          <NumberInput
            label="Abdominal"
            unit="mm"
            step={1}
            value={value.dobras.abdominal}
            onChange={(v) => setDobra({ abdominal: v })}
          />
          <NumberInput
            label="Suprailíaca"
            unit="mm"
            step={1}
            value={value.dobras.suprailiaca}
            onChange={(v) => setDobra({ suprailiaca: v })}
          />
          <NumberInput
            label="Coxa"
            unit="mm"
            step={1}
            value={value.dobras.coxa}
            onChange={(v) => setDobra({ coxa: v })}
          />
          <NumberInput
            label="% Gordura"
            unit="%"
            value={value.dobras.percentualGorduraPollock}
            onChange={() => {}}
            computed
            hint="Pollock · idade=30 (ajustar)"
          />
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Bioimpedância"
        description="Composição corporal via balança de bioimpedância"
        active={bioActive}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberInput
            label="Peso"
            unit="kg"
            value={value.bioimpedancia.pesoKg}
            onChange={(v) => setBio({ pesoKg: v })}
          />
          <NumberInput
            label="% Gordura"
            unit="%"
            value={value.bioimpedancia.percentualGordura}
            onChange={(v) => setBio({ percentualGordura: v })}
          />
          <NumberInput
            label="Massa magra"
            unit="kg"
            value={value.bioimpedancia.massaMagraKg}
            onChange={(v) => setBio({ massaMagraKg: v })}
          />
          <NumberInput
            label="% Água"
            unit="%"
            value={value.bioimpedancia.percentualAgua}
            onChange={(v) => setBio({ percentualAgua: v })}
          />
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Fotos"
        description="Frontal · Lateral · Posterior (LGPD: aluno autoriza no app)"
        active={fotoActive}
      >
        <div className="grid grid-cols-3 gap-3">
          <PhotoUploadSlot
            label="Frontal"
            url={value.fotos.frontalUrl}
            onChange={(url) => setFoto({ frontalUrl: url })}
          />
          <PhotoUploadSlot
            label="Lateral"
            url={value.fotos.lateralUrl}
            onChange={(url) => setFoto({ lateralUrl: url })}
          />
          <PhotoUploadSlot
            label="Posterior"
            url={value.fotos.posteriorUrl}
            onChange={(url) => setFoto({ posteriorUrl: url })}
          />
        </div>
      </CollapsibleBlock>
    </div>
  )
}

function ImcInterpretacao({ imc }: { imc: number }) {
  let label = 'Eutrófico'
  let tone = 'text-emerald-600 dark:text-emerald-400'
  let bg = 'bg-emerald-50 dark:bg-emerald-900/30'
  if (imc < 18.5) {
    label = 'Abaixo do peso'
    tone = 'text-amber-600 dark:text-amber-400'
    bg = 'bg-amber-50 dark:bg-amber-900/30'
  } else if (imc >= 25 && imc < 30) {
    label = 'Sobrepeso'
    tone = 'text-amber-600 dark:text-amber-400'
    bg = 'bg-amber-50 dark:bg-amber-900/30'
  } else if (imc >= 30) {
    label = 'Obesidade'
    tone = 'text-rose-600 dark:text-rose-400'
    bg = 'bg-rose-50 dark:bg-rose-900/30'
  }

  return (
    <div
      className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${tone} ${bg}`}
    >
      <Scale size={11} />
      IMC {imc.toFixed(1)} · {label}
    </div>
  )
}
