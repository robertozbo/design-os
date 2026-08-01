import data from '@/../product/sections/admin-usuarios/data.json'
import type { AdminUsuariosProps } from '@/../product/sections/admin-usuarios/types'
import { AdminUsuarios as AdminUsuariosView } from './components/AdminUsuarios'

export default function AdminUsuariosPreview() {
  const props = data as unknown as AdminUsuariosProps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-usuarios],
        [data-nymos-admin-usuarios] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-admin-usuarios] .font-mono,
        [data-nymos-admin-usuarios] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <AdminUsuariosView
        header={props.header}
        kpis={props.kpis}
        filters={props.filters}
        users={props.users}
        totalUsers={props.totalUsers}
        roleDistribution={props.roleDistribution}
        recentActivities={props.recentActivities}
        bulkActions={props.bulkActions}
        emptyStates={props.emptyStates}
        onSearch={(q) => console.log('search →', q)}
        onInviteAdmin={() => console.log('invite admin')}
        onRoleFilter={(r) => console.log('role filter →', r)}
        onStatusFilter={(s) => console.log('status filter →', s)}
        onPlanFilter={(p) => console.log('plan filter →', p)}
        onClearFilters={() => console.log('clear filters')}
        onUserClick={(id) => console.log('user click →', id)}
        onUserAction={(id, action) => console.log('user action →', id, action)}
        onBulkAction={(action, ids) => console.log('bulk action →', action, ids)}
        onManagePermissions={() => console.log('manage permissions')}
        onSeeAllActivities={() => console.log('see all activities')}
      />
    </>
  )
}
