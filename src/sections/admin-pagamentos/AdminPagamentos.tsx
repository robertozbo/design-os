import data from '@/../product/sections/admin-pagamentos/data.json'
import type { AdminPagamentosProps } from '@/../product/sections/admin-pagamentos/types'
import { AdminPagamentos as View } from './components/AdminPagamentos'

export default function AdminPagamentosPreview() {
  const props = data as unknown as AdminPagamentosProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-pagamentos], [data-nymos-admin-pagamentos] * { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-admin-pagamentos] .font-mono, [data-nymos-admin-pagamentos] .tabular-nums { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <View {...props} onAttentionAction={(id) => console.log('attention →', id)} onTxAction={(id, a) => console.log('tx →', id, a)} />
    </>
  )
}
