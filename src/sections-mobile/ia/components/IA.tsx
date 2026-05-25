import type { IAProps } from '@/../product-mobile/sections/ia/types'
import { HeroIA } from './HeroIA'
import { QuickActionGrid } from './QuickActionGrid'
import { HistoricoList } from './HistoricoList'

export function IA({ data, onQuickActionClick, onHistoricoClick, onChatClick }: IAProps) {
  return (
    <div className="min-h-full bg-slate-950 pb-6 pt-3">
      <HeroIA hero={data.hero} onChatClick={onChatClick} />
      <QuickActionGrid actions={data.quickActions} onClick={onQuickActionClick} />
      <HistoricoList items={data.historico} onClick={onHistoricoClick} />
    </div>
  )
}
