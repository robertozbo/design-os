import { useState } from 'react'
import type {
  SaudeMentalProps,
  TabSaudeMental,
} from '@/../product-mobile/sections/saude-mental/types'
import { ChatTab } from './ChatTab'
import { DiarioTab } from './DiarioTab'

export function SaudeMental({
  data,
  abaInicial,
  onChangeTab,
  onSendMessage,
  onAttachFile,
  onOpenPsicologoDetail,
  onInvitePsicologo,
  onSubmitDiario,
  onEditDiario,
  onOpenHistoricoItem,
}: SaudeMentalProps) {
  const [aba, setAba] = useState<TabSaudeMental>(abaInicial ?? data.tabAtiva)

  function handleTab(t: TabSaudeMental) {
    setAba(t)
    onChangeTab?.(t)
  }

  const naoLidasChat = data.psicologo ? data.chat.naoLidas : 0

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      <div className="px-4 pt-3 pb-2 flex gap-1.5 shrink-0">
        <TabButton
          label="Diário"
          counter={0}
          active={aba === 'diario'}
          onClick={() => handleTab('diario')}
        />
        <TabButton
          label="Chat"
          counter={naoLidasChat}
          highlight={naoLidasChat > 0}
          active={aba === 'chat'}
          onClick={() => handleTab('chat')}
        />
      </div>

      {aba === 'chat' && (
        <ChatTab
          psicologo={data.psicologo}
          chat={data.chat}
          onSendMessage={onSendMessage}
          onAttachFile={onAttachFile}
          onOpenPsicologoDetail={onOpenPsicologoDetail}
          onInvitePsicologo={onInvitePsicologo}
        />
      )}

      {aba === 'diario' && (
        <DiarioTab
          diarioHoje={data.diarioHoje}
          emocoesCatalogo={data.emocoesCatalogo}
          humorSemana={data.humorSemana}
          tendenciaMensal={data.tendenciaMensal}
          historico={data.historico}
          psicologoNome={data.psicologo?.fullName ?? null}
          onSubmitDiario={onSubmitDiario}
          onEditDiario={onEditDiario}
          onOpenHistoricoItem={onOpenHistoricoItem}
        />
      )}
    </div>
  )
}

interface TabButtonProps {
  label: string
  counter: number
  active: boolean
  highlight?: boolean
  onClick: () => void
}

function TabButton({ label, counter, active, highlight, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-9 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
        active ? 'bg-slate-800 text-slate-50' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {label}
      {counter > 0 && (
        <span
          className={`min-w-4 h-4 px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center font-mono tabular-nums ${
            highlight
              ? 'bg-rose-500 text-white'
              : active
                ? 'bg-slate-950 text-slate-300'
                : 'bg-slate-800 text-slate-400'
          }`}
        >
          {counter}
        </span>
      )}
    </button>
  )
}
