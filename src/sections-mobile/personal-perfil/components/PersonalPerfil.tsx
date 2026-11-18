import { BadgeCheck, ExternalLink, MapPin, Pencil } from 'lucide-react'
import type { PersonalPerfilProps } from '@/../product-mobile/sections/personal-perfil/types'
import { Avatar, Card, CardHeader, Chip, Screen, SecondaryButton } from '../../_personal/components/kit'

export function PersonalPerfil({ data, onEditar, onVerPublico }: PersonalPerfilProps) {
  return (
    <Screen>
      <div className="px-4 pt-2 flex flex-col items-center text-center">
        <Avatar inicial={data.inicial} size="xl" tone="primary" />
        <div className="mt-3 text-white text-[20px] font-semibold">{data.nome}</div>
        <div className="mt-1 inline-flex items-center gap-1 text-emerald-300 text-[12.5px] font-mono">
          <BadgeCheck size={14} /> {data.registro}
        </div>
        <div className="text-slate-400 text-[12.5px] mt-0.5">{data.cidade}</div>
        <div className="mt-3 w-full grid grid-cols-2 gap-2">
          <SecondaryButton onClick={onEditar}>
            <Pencil size={14} /> Editar
          </SecondaryButton>
          <SecondaryButton onClick={onVerPublico}>
            <ExternalLink size={14} /> Página pública
          </SecondaryButton>
        </div>
      </div>

      <Card>
        <CardHeader titulo="Sobre" />
        <p className="text-slate-300 text-[13.5px] leading-relaxed">{data.bio}</p>
      </Card>

      <Card>
        <CardHeader titulo="Especialidades" />
        <div className="flex flex-wrap gap-1.5">
          {data.especialidades.map((e) => (
            <Chip key={e} tone="primary">
              {e}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader titulo="Onde atende" />
        <ul className="space-y-2">
          {data.locais.map((l) => (
            <li key={l} className="flex items-center gap-2 text-slate-200 text-[13.5px]">
              <MapPin size={14} className="text-slate-500" /> {l}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-1.5">
          {data.modalidades.map((m) => (
            <Chip key={m}>{m}</Chip>
          ))}
        </div>
      </Card>

      <div className="mx-4 mt-4 text-center text-slate-500 text-[12px] font-mono">{data.linkPublico}</div>
    </Screen>
  )
}
