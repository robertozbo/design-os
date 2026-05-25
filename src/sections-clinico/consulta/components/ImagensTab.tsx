import { useState } from 'react'
import { Bone, Brain, CheckCircle2, CloudUpload, ExternalLink, ScanSearch, Waves } from 'lucide-react'
import type {
  ImagemRecente,
  ModalidadeImagem,
  SignificanciaImagem,
} from '@/../product-clinico/sections/consulta/types'
import type { ExameImagemDetalhe } from '@/../product-clinico/sections/exames/types'
import { ImagemMedicaMock } from '@/sections-clinico/exames/components/ImagemMedicaMock'
import { UploadImagemSection } from '@/sections-clinico/exames/components/UploadImagemSection'
import { ImagemViewerInline } from '@/sections-clinico/exames/components/ImagemViewerInline'
import { formatDataBR } from './helpers'

interface Props {
  imagens: ImagemRecente[]
  /** Pré-preenche o paciente no upload — vem do paciente da consulta. */
  pacienteNomeAtual?: string
  /** Iniciais do paciente — usadas no header do viewer inline. */
  pacienteIniciaisAtual?: string
  /** Lookup pra trazer o detalhe completo do exame quando o médico clica numa imagem. */
  getExameImagemDetalhe?: (imagemId: string) => ExameImagemDetalhe | null
  onAbrirImagem?: (id: string) => void
  onCarregarImagem?: (form: { tipo: string; modalidade: string; arquivos: number }) => void
  /** Disparado quando o médico salva a análise IA + comentário no prontuário. */
  onSalvarAnaliseImagem?: (data: {
    imagemId: string
    comentarioMedico: string | null
    imagensAnalisadasIds: string[]
  }) => void
  /** Análises IA já salvas pra cada imagemId. Usado pra mostrar badge "Analisado" e pré-popular o viewer. */
  analisesSalvasPorImagem?: Record<
    string,
    { comentarioMedico: string | null; imagensAnalisadasIds: string[]; salvoEm: string }
  >
}

const HIGHLIGHTS = {
  'tireoide-long': { x: 70, y: 52, r: 16, label: 'TI-RADS 3' },
  'tireoide-trans': { x: 70, y: 52, r: 13 },
  'crânio-sagital-t1': { x: 50, y: 57, r: 7, label: 'µAdenoma' },
  'crânio-coronal-t1': { x: 52, y: 60, r: 6, label: 'µAdenoma' },
  'torax-pa': { x: 50, y: 50, r: 28, label: 'ICT 0,55' },
} as const

const MODALIDADE_ICONE: Record<ModalidadeImagem, React.ComponentType<{ className?: string }>> = {
  'raio-x': Bone,
  usg: Waves,
  rm: Brain,
  tc: Brain,
  cintilografia: ScanSearch,
}

const MODALIDADE_LABEL: Record<ModalidadeImagem, string> = {
  'raio-x': 'Raio-X',
  usg: 'USG',
  rm: 'RM',
  tc: 'TC',
  cintilografia: 'Cintilo',
}

const SIG_BADGE: Record<SignificanciaImagem, string> = {
  normal:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
  atencao:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
  critico:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300',
}

const SIG_LABEL: Record<SignificanciaImagem, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
}

export function ImagensTab({
  imagens,
  pacienteNomeAtual,
  pacienteIniciaisAtual,
  getExameImagemDetalhe,
  onAbrirImagem,
  onCarregarImagem,
  onSalvarAnaliseImagem,
  analisesSalvasPorImagem,
}: Props) {
  const [mode, setMode] = useState<'lista' | 'upload' | 'view'>('lista')
  const [imagemAbertaId, setImagemAbertaId] = useState<string | null>(null)

  const detalhe = imagemAbertaId
    ? (getExameImagemDetalhe?.(imagemAbertaId) ?? null)
    : null

  if (mode === 'upload') {
    return (
      <UploadImagemSection
        pacienteNome={pacienteNomeAtual}
        onVoltar={() => setMode('lista')}
        onSalvo={(form, files) => {
          console.log('exame salvo:', form, files)
          onCarregarImagem?.({
            tipo: form.tipo,
            modalidade: form.modalidade,
            arquivos: files.length,
          })
        }}
        onAnalisadoComIA={(form) => console.log('IA concluída pra:', form.tipo)}
        onVerDetalhe={() => setMode('lista')}
      />
    )
  }

  if (mode === 'view' && detalhe) {
    return (
      <ImagemViewerInline
        pacienteNome={detalhe.pacienteNome}
        iniciais={detalhe.iniciais}
        estudoTipo={detalhe.tipo}
        modalidade={detalhe.modalidade}
        laboratorio={detalhe.laboratorio}
        dataColeta={detalhe.dataColeta}
        indicacao={detalhe.indicacao}
        imagens={detalhe.imagens}
        achados={detalhe.achados}
        comparacao={detalhe.comparacao}
        iaAnalisePreCarregada={
          analisesSalvasPorImagem?.[detalhe.id] ? detalhe.iaAnalise : null
        }
        analiseSalva={analisesSalvasPorImagem?.[detalhe.id] ?? null}
        dicomDisponivel={detalhe.dicomDisponivel}
        highlights={HIGHLIGHTS as never}
        onVoltar={() => {
          setMode('lista')
          setImagemAbertaId(null)
        }}
        onAbrirDicomExterno={(serieId) =>
          console.log('abrir DICOM externo:', detalhe.id, serieId)
        }
        onAnalisarComIA={() => {
          console.log('analisar com IA:', detalhe.id)
          return detalhe.iaAnalise
        }}
        onSalvarAnalise={(data) => {
          console.log('salvar análise IA no prontuário:', detalhe.id, data)
          onSalvarAnaliseImagem?.({
            imagemId: detalhe.id,
            comentarioMedico: data.comentarioMedico,
            imagensAnalisadasIds: data.imagensAnalisadasIds,
          })
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Imagens
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {imagens.length} {imagens.length === 1 ? 'exame de imagem' : 'exames de imagem'} —
            raio-X, ultrassonografia, ressonância. Clique pra abrir o viewer com IA de apoio.
          </p>
        </div>
        <button
          onClick={() => setMode('upload')}
          className="
            inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors
            hover:bg-teal-500
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
          "
        >
          <CloudUpload className="size-3.5" />
          Carregar imagem
        </button>
      </div>

      {imagens.length === 0 ? (
        <button
          onClick={() => setMode('upload')}
          className="
            mt-5 flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-10 text-center transition-colors
            hover:border-teal-400 hover:bg-teal-50/40
            focus:outline-none focus:ring-2 focus:ring-teal-500/40
            dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-teal-600 dark:hover:bg-teal-950/20
          "
        >
          <CloudUpload className="size-8 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Nenhuma imagem ainda
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Paciente pode enviar pelo app · ou clique aqui pra carregar agora (raio-X, USG, RM)
            </p>
          </div>
        </button>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {imagens.map((img) => {
            const Icon = MODALIDADE_ICONE[img.modalidade]
            const analiseSalva = analisesSalvasPorImagem?.[img.id]
            return (
              <li key={img.id}>
                <button
                  onClick={() => {
                    setImagemAbertaId(img.id)
                    setMode('view')
                    onAbrirImagem?.(img.id)
                  }}
                  className={`
                    group/img w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all
                    hover:shadow
                    focus:outline-none focus:ring-2 focus:ring-teal-500/40
                    dark:bg-slate-900
                    ${
                      analiseSalva
                        ? 'border-emerald-300/80 hover:border-emerald-400 dark:border-emerald-800/60 dark:hover:border-emerald-700'
                        : 'border-slate-200/80 hover:border-teal-300 dark:border-slate-800 dark:hover:border-teal-700'
                    }
                  `}
                >
                  <div className="relative">
                    <ImagemMedicaMock
                      imagem={{
                        id: img.id,
                        rotulo: MODALIDADE_LABEL[img.modalidade],
                        descricao: img.tipo,
                        mockVisual: img.mockVisual,
                      }}
                    />
                    {analiseSalva && (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-300/70 bg-emerald-50/95 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 shadow-sm backdrop-blur-sm dark:border-emerald-700/50 dark:bg-emerald-950/90 dark:text-emerald-200">
                        <CheckCircle2 className="size-3" />
                        Analisado
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2.5">
                      <div className="flex items-center gap-1.5">
                        <Icon className="size-3 text-emerald-300/80" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">
                          {MODALIDADE_LABEL[img.modalidade]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {img.tipo}
                      </p>
                      <span
                        className={`
                          shrink-0 rounded-full border px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider
                          ${SIG_BADGE[img.significancia]}
                        `}
                      >
                        {SIG_LABEL[img.significancia]}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                      {img.destaqueAchado}
                    </p>
                    <p className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>
                        {img.laboratorio} · {formatDataBR(img.dataColeta)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-teal-600 transition-colors group-hover/img:text-teal-500 dark:text-teal-400">
                        Abrir <ExternalLink className="size-3" />
                      </span>
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
