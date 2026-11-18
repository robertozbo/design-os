import { Copy, MessageCircle, QrCode, Share2 } from 'lucide-react'
import type { ConvitePendente, PersonalConvidarProps } from '@/../product-mobile/sections/personal-convidar/types'
import { Card, CardHeader, Chip, ListGroup, Row, Screen, SecondaryButton, SectionLabel } from '../../_personal/components/kit'

const STATUS: Record<ConvitePendente['status'], { label: string; tone: 'info' | 'primary' | 'danger' }> = {
  enviado: { label: 'Enviado', tone: 'info' },
  aceito: { label: 'Aceito', tone: 'primary' },
  expirado: { label: 'Expirou · reenviar', tone: 'danger' },
}

export function PersonalConvidar({ data, onCopiar, onCompartilhar, onWhatsApp, onReenviar }: PersonalConvidarProps) {
  return (
    <Screen>
      <section className="mx-4 mt-1 rounded-3xl bg-[#0E1A17] border border-emerald-500/40 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono text-emerald-400">Seu código</div>
            <div className="mt-1 text-white text-[28px] font-mono font-semibold tracking-wide">{data.codigo}</div>
            <div className="text-slate-400 text-[12.5px] font-mono">{data.link}</div>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center">
            <QrCode size={56} className="text-[#0E1A17]" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onWhatsApp} className="rounded-2xl bg-emerald-500 text-[#0E1A17] font-semibold text-[14px] py-2.5 inline-flex items-center justify-center gap-1.5">
            <MessageCircle size={16} /> WhatsApp
          </button>
          <SecondaryButton onClick={onCompartilhar}>
            <Share2 size={15} /> Compartilhar
          </SecondaryButton>
        </div>
        <button onClick={onCopiar} className="mt-2 w-full text-emerald-300 text-[13px] inline-flex items-center justify-center gap-1.5 py-1.5">
          <Copy size={14} /> Copiar link
        </button>
      </section>

      <Card>
        <CardHeader titulo="Mensagem que vai junto" />
        <p className="text-slate-300 text-[13.5px] leading-relaxed">{data.mensagemPadrao}</p>
      </Card>

      <SectionLabel>Convites · {data.aceitosNoMes} aceitos este mês</SectionLabel>
      <ListGroup>
        {data.convites.map((c) => (
          <Row
            key={c.id}
            onClick={c.status === 'expirado' ? () => onReenviar?.(c.id) : undefined}
            chevron={c.status === 'expirado'}
            titulo={c.nome}
            subtitulo={`${c.contato} · ${c.enviado}`}
            trailing={<Chip tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Chip>}
          />
        ))}
      </ListGroup>
    </Screen>
  )
}
