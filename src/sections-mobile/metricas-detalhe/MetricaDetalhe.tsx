import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '@/../product-mobile/sections/metricas/data.json'
import type {
  MetricasData,
  MetricaViewModel,
  PeriodoDetalhe,
} from '@/../product-mobile/sections/metricas/types'
import { MetricaDetalhe as MetricaDetalheView } from '@/sections-mobile/metricas/components/MetricaDetalhe'
import {
  PERIODOS_DETALHE,
  gerarSerie,
  calcularStats,
  faixaNormalDe,
} from '@/sections-mobile/metricas/_detalheData'

const PREVIEW_FONTS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
[data-nymos-mobile], [data-nymos-mobile] * {
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
[data-nymos-mobile] .font-mono, [data-nymos-mobile] .tabular-nums {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
}
[data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
[data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
`

function findMetrica(d: MetricasData, id: string | null): MetricaViewModel | null {
  for (const cat of d.categorias) {
    const found = cat.metricas.find((m) => m.id === id)
    if (found) return found
  }
  // Fallback: frequência cardíaca em repouso (exemplo do brief)
  for (const cat of d.categorias) {
    const hr = cat.metricas.find((m) => m.id === 'resting_heart_rate')
    if (hr) return hr
  }
  return d.categorias[0]?.metricas[0] ?? null
}

export default function MetricaDetalhePreview() {
  const baseData = data as unknown as MetricasData
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const metrica = useMemo(
    () => findMetrica(baseData, searchParams.get('m')),
    [baseData, searchParams],
  )
  const [periodo, setPeriodo] = useState<PeriodoDetalhe>('7d')

  const serie = useMemo(() => (metrica ? gerarSerie(metrica, periodo) : []), [metrica, periodo])
  const stats = useMemo(
    () => calcularStats(serie, metrica?.tipo.unit ?? ''),
    [serie, metrica],
  )
  const faixaNormal = useMemo(() => (metrica ? faixaNormalDe(metrica) : undefined), [metrica])

  if (!metrica) return null

  return (
    <>
      <style>{PREVIEW_FONTS}</style>
      <div data-nymos-mobile="true">
        <MetricaDetalheView
          metrica={metrica}
          periodos={PERIODOS_DETALHE}
          periodoSelecionado={periodo}
          serie={serie}
          stats={stats}
          faixaNormal={faixaNormal}
          safeTop
          onPeriodoChange={setPeriodo}
          onVoltar={() => navigate('/mobile/sections/metricas')}
          onAdicionarClick={() => navigate(`/mobile/sections/metricas-adicionar?m=${metrica.id}`)}
        />
      </div>
    </>
  )
}
