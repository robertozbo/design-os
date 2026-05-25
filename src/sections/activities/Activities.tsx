import data from '@/../product/sections/activities/data.json'
import type { ActivitiesProps } from '@/../product/sections/activities/types'
import { Activities as ActivitiesView } from './components/Activities'

export default function ActivitiesPreview() {
  const props = data as unknown as ActivitiesProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-activities],
        [data-nymos-activities] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-activities] .font-mono,
        [data-nymos-activities] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-activities>
        <ActivitiesView
          hero={props.hero}
          categories={props.categories}
          types={props.types}
          durationPresets={props.durationPresets}
          activities={props.activities}
          pagination={props.pagination}
          history={props.history}
          onCreate={() => console.log('[Activities] open create modal')}
          onSubmitCreate={(payload) =>
            console.log('[Activities] submit create:', payload)
          }
          onCategoryChange={(k) => console.log('[Activities] category:', k)}
          onSearchChange={(q) => console.log('[Activities] search:', q)}
          onViewChange={(v) => console.log('[Activities] view:', v)}
          onEditActivity={(id) => console.log('[Activities] edit:', id)}
          onDeleteActivity={(id) => console.log('[Activities] delete:', id)}
          onHistoryFilterChange={(f) => console.log('[Activities] history filter:', f)}
          onPageChange={(p) => console.log('[Activities] page:', p)}
          onConnectDevice={() => console.log('[Activities] connect device')}
        />
      </div>
    </>
  )
}
