import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '@/../product-mobile/sections/metricas/data.json'
import type { MetricasData, DerivacaoConfig } from '@/../product-mobile/sections/metricas/types'
import { AdicionarMetrica as AdicionarMetricaView } from '@/sections-mobile/metricas/components/AdicionarMetrica'
import { opcoesPorCategoria } from '@/sections-mobile/metricas/_detalheData'

// Métricas calculadas a partir de mais de uma entrada (domínio).
const DERIVACOES: Record<string, DerivacaoConfig> = {
  // IMC = peso(kg) / altura(m)²
  bmi: {
    campos: [
      { key: 'peso', label: 'Peso', unit: 'kg', placeholder: '0' },
      { key: 'altura', label: 'Altura', unit: 'cm', placeholder: '0' },
    ],
    unidade: '',
    calcular: ({ peso, altura }) => {
      if (!peso || !altura) return null
      const m = altura / 100
      if (m <= 0) return null
      return Math.round((peso / (m * m)) * 10) / 10
    },
  },
}

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

export default function AdicionarMetricaPreview() {
  const baseData = data as unknown as MetricasData
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const categorias = useMemo(() => opcoesPorCategoria(baseData), [baseData])
  const selecionadaId = searchParams.get('m')

  return (
    <>
      <style>{PREVIEW_FONTS}</style>
      <div data-nymos-mobile="true">
        <AdicionarMetricaView
          categorias={categorias}
          selecionadaId={selecionadaId}
          derivacoes={DERIVACOES}
          safeTop
          onVoltar={() =>
            navigate(
              selecionadaId
                ? `/mobile/sections/metricas-detalhe?m=${selecionadaId}`
                : '/mobile/sections/metricas',
            )
          }
          onSalvar={(registro) => {
            console.log('novo registro', registro)
            navigate(`/mobile/sections/metricas-detalhe?m=${registro.metricaId}`)
          }}
        />
      </div>
    </>
  )
}
