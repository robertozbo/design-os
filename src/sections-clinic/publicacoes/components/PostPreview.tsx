import { useState } from 'react'
import { Bookmark, ChevronLeft, ChevronRight, Heart, ImageIcon, MessageCircle, Send } from 'lucide-react'
import type { ContaConectada, Publicacao } from '@/../product-clinic/sections/publicacoes/types'
import { acentoDe, truncarLegenda } from './helpers'

interface Props {
  publicacao: Publicacao
  conta: ContaConectada
}

/**
 * O post como o paciente vai ver.
 *
 * Fidelidade aqui não é enfeite: a legenda do Instagram corta em ~125 caracteres, e
 * quem aprova um texto num campo de formulário largo não percebe que a primeira
 * linha — a única que a maioria lê — terminou no meio da frase.
 */
export function PostPreview({ publicacao, conta }: Props) {
  const [slide, setSlide] = useState(0)
  const [expandida, setExpandida] = useState(false)
  const total = publicacao.slides.length

  const atual = publicacao.slides[Math.min(slide, Math.max(total - 1, 0))]
  const acento = acentoDe(publicacao.midia.acento)
  const story = publicacao.formato === 'story'
  const { visivel, cortou } = truncarLegenda(publicacao.legenda)
  const iniciais = conta.nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Cabeçalho da conta */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-[11px] font-semibold text-white">
          {iniciais}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
            {conta.usuario.replace('@', '')}
          </p>
          <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{conta.nome}</p>
        </div>
      </div>

      {/* Mídia */}
      <div className={`relative ${story ? 'aspect-[9/16]' : 'aspect-[4/5]'} bg-slate-100 dark:bg-slate-800`}>
        {total === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-600">
            <ImageIcon className="h-8 w-8" />
            <p className="text-[11px]">o cartão aparece quando a IA termina</p>
          </div>
        ) : publicacao.midia.tipo === 'upload' ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 border border-dashed border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500">
            <ImageIcon className="h-8 w-8" />
            <p className="px-6 text-center text-[11px]">
              Foto própria · <span className="font-medium">{publicacao.midia.template}</span>
            </p>
          </div>
        ) : (
          <div className={`relative flex h-full flex-col items-start justify-center p-6 ${acento.fundo}`}>
            <div className={`absolute left-6 top-6 h-1 w-10 rounded-full ${acento.barra}`} />
            <div>
              <p className="text-xl font-semibold leading-tight text-white sm:text-2xl">
                {atual?.titulo}
              </p>
              {atual?.texto && (
                <p className={`mt-2 text-xs leading-relaxed sm:text-sm ${acento.texto}`}>
                  {atual.texto}
                </p>
              )}
            </div>
            <div className="absolute inset-x-6 bottom-5 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                {conta.usuario}
              </span>
              <span className="text-[10px] text-white/60">{publicacao.autor.registro}</span>
            </div>
          </div>
        )}

        {/* Navegação do carrossel */}
        {total > 1 && (
          <>
            {slide > 0 && (
              <button
                onClick={() => setSlide((s) => s - 1)}
                aria-label="Slide anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur hover:bg-black/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {slide < total - 1 && (
              <button
                onClick={() => setSlide((s) => s + 1)}
                aria-label="Próximo slide"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur hover:bg-black/50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white tabular-nums backdrop-blur">
              {slide + 1}/{total}
            </div>
          </>
        )}
      </div>

      {/* Pontos do carrossel */}
      {total > 1 && (
        <div className="flex justify-center gap-1 py-2">
          {publicacao.slides.map((s, i) => (
            <button
              key={s.ordem}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === slide ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Barra de ações — decorativa, existe para o texto ocupar a posição real */}
      <div className="flex items-center gap-4 px-3 pb-1 pt-2 text-slate-400 dark:text-slate-500">
        <Heart className="h-5 w-5" />
        <MessageCircle className="h-5 w-5" />
        <Send className="h-5 w-5" />
        <Bookmark className="ml-auto h-5 w-5" />
      </div>

      {/* Legenda */}
      <div className="px-3 pb-3.5">
        {publicacao.legenda ? (
          <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {conta.usuario.replace('@', '')}
            </span>{' '}
            {expandida ? publicacao.legenda : visivel}
            {cortou && !expandida && (
              <button
                onClick={() => setExpandida(true)}
                className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                mais
              </button>
            )}
          </p>
        ) : (
          <p className="text-xs italic text-slate-300 dark:text-slate-600">sem legenda ainda</p>
        )}

        {publicacao.hashtags.length > 0 && (
          <p className="mt-2 text-xs leading-relaxed text-sky-600/80 dark:text-sky-400/80">
            {publicacao.hashtags.join(' ')}
          </p>
        )}
      </div>
    </div>
  )
}
