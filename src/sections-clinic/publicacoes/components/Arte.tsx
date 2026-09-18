import { Quote } from 'lucide-react'
import type { Midia, Slide } from '@/../product-clinic/sections/publicacoes/types'
import { acentoDe } from './helpers'

interface Props {
  slide: Slide | undefined
  midia: Midia
  /** Ordem do slide no carrossel — o template `lista` imprime este número. */
  indice: number
  usuario: string
  registro: string
  mostrarRegistro: boolean
  /** `true` reduz tipografia e espaçamento para a miniatura do seletor. */
  mini?: boolean
}

/**
 * O cartão da marca.
 *
 * A tipografia é renderizada aqui, não gerada junto com a imagem. É o que garante
 * acento correto e permite corrigir uma vírgula sem pagar outra geração — e é o que
 * vai continuar valendo quando o fundo passar a vir de um modelo de imagem.
 */
export function Arte({
  slide,
  midia,
  indice,
  usuario,
  registro,
  mostrarRegistro,
  mini = false,
}: Props) {
  const a = acentoDe(midia.acento)
  const t = midia.tipo === 'upload' ? 'foto' : midia.template
  const p = mini ? 'p-2.5' : 'p-6'

  const titulo = slide?.titulo ?? ''
  const texto = slide?.texto ?? ''

  // Registro só existe para quem tem conselho. O gestor da clínica não tem, e imprimir
  // um travessão no rodapé da peça é pior que não imprimir nada.
  const temRegistro = mostrarRegistro && registro.trim() !== '' && registro.trim() !== '—'

  const rodape = !mini && (
    <div className="absolute inset-x-6 bottom-5 flex items-center justify-between">
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">
        {usuario}
      </span>
      {temRegistro && <span className="text-[10px] text-white/60">{registro}</span>}
    </div>
  )

  const base = `relative h-full overflow-hidden ${p}`

  if (t === 'lista') {
    return (
      <div className={`${base} flex flex-col justify-center ${a.fundo}`}>
        <span
          className={`pointer-events-none absolute -right-2 top-0 font-semibold leading-none text-white/15 ${
            mini ? 'text-[64px]' : 'text-[180px]'
          }`}
        >
          {String(indice + 1).padStart(2, '0')}
        </span>
        <div className="relative">
          <p
            className={`font-semibold leading-tight text-white ${mini ? 'text-[11px]' : 'text-2xl'}`}
          >
            {titulo}
          </p>
          {texto && (
            <p className={`mt-2 leading-relaxed ${a.texto} ${mini ? 'text-[8px]' : 'text-sm'}`}>
              {texto}
            </p>
          )}
        </div>
        {rodape}
      </div>
    )
  }

  if (t === 'estatistica') {
    return (
      <div className={`${base} flex flex-col items-center justify-center text-center ${a.fundo}`}>
        <p
          className={`font-semibold leading-none text-white ${mini ? 'text-2xl' : 'text-[64px]'}`}
        >
          {slide?.destaque ?? '—'}
        </p>
        <p
          className={`mt-3 font-medium leading-tight text-white ${mini ? 'text-[9px]' : 'text-lg'}`}
        >
          {titulo}
        </p>
        {texto && (
          <p className={`mt-2 leading-relaxed ${a.texto} ${mini ? 'text-[8px]' : 'text-xs'}`}>
            {texto}
          </p>
        )}
        {rodape}
      </div>
    )
  }

  if (t === 'convite') {
    return (
      <div className={`${base} flex flex-col items-center justify-center text-center ${a.fundo}`}>
        <div className={`h-1 rounded-full ${a.barra} ${mini ? 'w-5' : 'w-10'}`} />
        <p
          className={`mt-4 font-semibold leading-tight text-white ${mini ? 'text-[11px]' : 'text-2xl'}`}
        >
          {titulo}
        </p>
        {texto && (
          <p className={`mt-2 leading-relaxed ${a.texto} ${mini ? 'text-[8px]' : 'text-sm'}`}>
            {texto}
          </p>
        )}
        <span
          className={`mt-5 rounded-full bg-white/95 font-semibold text-slate-900 ${
            mini ? 'px-2 py-0.5 text-[7px]' : 'px-4 py-2 text-xs'
          }`}
        >
          Agende sua consulta
        </span>
        {rodape}
      </div>
    )
  }

  if (t === 'citacao') {
    return (
      <div className={`${base} flex flex-col justify-center ${a.fundo}`}>
        <Quote className={`${a.barra.replace('bg-', 'text-')} ${mini ? 'h-4 w-4' : 'h-10 w-10'}`} />
        <p
          className={`mt-3 font-medium italic leading-snug text-white ${
            mini ? 'text-[10px]' : 'text-xl'
          }`}
        >
          {titulo}
        </p>
        {texto && (
          <p className={`mt-3 leading-relaxed ${a.texto} ${mini ? 'text-[8px]' : 'text-sm'}`}>
            — {texto}
          </p>
        )}
        {rodape}
      </div>
    )
  }

  if (t === 'foto') {
    return (
      <div className={`relative h-full overflow-hidden bg-slate-700`}>
        {/* A fotografia. Hoje é upload da clínica; é este bloco que o fundo por IA substitui. */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-800" />
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black/80 to-transparent" />
        <div className={`absolute inset-x-0 bottom-0 ${mini ? 'p-2.5' : 'p-6'}`}>
          <div className={`h-1 rounded-full ${a.barra} ${mini ? 'w-5' : 'w-10'}`} />
          <p
            className={`mt-2 font-semibold leading-tight text-white ${
              mini ? 'text-[11px]' : 'text-2xl'
            }`}
          >
            {titulo}
          </p>
          {texto && (
            <p className={`mt-1.5 leading-relaxed text-white/80 ${mini ? 'text-[8px]' : 'text-sm'}`}>
              {texto}
            </p>
          )}
          {!mini && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                {usuario}
              </span>
              {temRegistro && <span className="text-[10px] text-white/60">{registro}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // editorial — o padrão
  return (
    <div className={`${base} flex flex-col items-start justify-center ${a.fundo}`}>
      <div
        className={`absolute h-1 rounded-full ${a.barra} ${
          mini ? 'left-2.5 top-2.5 w-5' : 'left-6 top-6 w-10'
        }`}
      />
      <div>
        <p
          className={`font-semibold leading-tight text-white ${
            mini ? 'text-[11px]' : 'text-xl sm:text-2xl'
          }`}
        >
          {titulo}
        </p>
        {texto && (
          <p className={`mt-2 leading-relaxed ${a.texto} ${mini ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
            {texto}
          </p>
        )}
      </div>
      {rodape}
    </div>
  )
}
