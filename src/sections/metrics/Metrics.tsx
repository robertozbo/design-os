import data from '@/../product/sections/metrics/data.json'
import type { MetricsProps } from '@/../product/sections/metrics/types'
import { Metrics as MetricsView } from './components/Metrics'

export default function MetricsPreview() {
  const props = data as unknown as MetricsProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-metrics],
        [data-nymos-metrics] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-metrics] .font-mono,
        [data-nymos-metrics] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-metrics>
        <MetricsView
          timeframe={props.timeframe}
          metrics={props.metrics}
          manualEntryConfigs={props.manualEntryConfigs}
          recentEntries={props.recentEntries}
          entriesPagination={props.entriesPagination}
          history={props.history}
          onTimeframeChange={(t) => console.log('[Metrics] timeframe:', t)}
          onOpenManualEntry={(type) => console.log('[Metrics] open manual entry:', type)}
          onSubmitManualEntry={(payload) =>
            console.log('[Metrics] submit manual entry:', payload)
          }
          onConnectDevice={(type) => console.log('[Metrics] connect device for:', type)}
          onSelectMetric={(id) => console.log('[Metrics] select metric:', id)}
          onHistoryFilterChange={(f) => console.log('[Metrics] history filter:', f)}
          onEntriesSearchChange={(q) => console.log('[Metrics] entries search:', q)}
          onEntriesViewChange={(v) => console.log('[Metrics] entries view:', v)}
          onEntriesPageChange={(p) => console.log('[Metrics] entries page:', p)}
        />
      </div>
    </>
  )
}
