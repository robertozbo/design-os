import type { WeeklySignal } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { SignalKpiCard } from './SignalKpiCard'

interface Props {
  signals: WeeklySignal[]
}

export function SignalKpiStrip({ signals }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {signals.map((signal, i) => (
        <SignalKpiCard key={signal.id} signal={signal} delayMs={200 + i * 70} />
      ))}
    </div>
  )
}
