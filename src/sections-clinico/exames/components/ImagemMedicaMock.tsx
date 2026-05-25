import type { ImagemSerie } from '@/../product-clinico/sections/exames/types'

interface Props {
  imagem: ImagemSerie
  /** Posição do destaque do achado (em %, opcional). */
  highlight?: { x: number; y: number; r: number; label?: string }
}

/**
 * Mock visual de imagem médica.
 * Não pretende parecer um exame real — comunica honestamente "aqui vai a imagem"
 * com hint anatômico via gradiente + outline. Em produção, substituir por DICOM viewer.
 */
export function ImagemMedicaMock({ imagem, highlight }: Props) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-950">
      {/* Bg gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,41,59,0.9)_0%,_rgba(2,6,23,1)_70%)]" />

      {/* Modality-specific shape */}
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <ModalityShape mockVisual={imagem.mockVisual} />
        {highlight && (
          <>
            <circle
              cx={highlight.x * 4}
              cy={highlight.y * 3}
              r={highlight.r}
              fill="none"
              stroke="#facc15"
              strokeWidth="1.5"
              strokeDasharray="3,2"
            >
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
            {highlight.label && (
              <text
                x={highlight.x * 4 + highlight.r + 6}
                y={highlight.y * 3 + 3}
                fill="#facc15"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
              >
                {highlight.label}
              </text>
            )}
          </>
        )}
      </svg>

      {/* Header chrome (DICOM-style overlays) */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2.5 py-1.5 font-mono text-[9px] text-emerald-400/70">
        <span>{imagem.rotulo}</span>
        <span>MOCK · NÃO DIAGNÓSTICO</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2.5 py-1.5 font-mono text-[9px] text-emerald-400/70">
        <span className="truncate">{imagem.descricao}</span>
        <span className="ml-2 shrink-0">512×512</span>
      </div>

      {/* Crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-400/30" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-emerald-400/30" />
      </div>
    </div>
  )
}

function ModalityShape({ mockVisual }: { mockVisual: ImagemSerie['mockVisual'] }) {
  const stroke = '#94a3b8'
  const fill = 'rgba(148,163,184,0.05)'

  switch (mockVisual) {
    case 'torax-pa':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          {/* Cage */}
          <rect x="60" y="40" width="280" height="220" rx="10" stroke="rgba(148,163,184,0.2)" />
          {/* Lungs */}
          <path d="M120 70 Q90 130 100 220 Q120 240 160 230 Q170 150 160 70 Z" />
          <path d="M280 70 Q310 130 300 220 Q280 240 240 230 Q230 150 240 70 Z" />
          {/* Heart silhouette */}
          <path
            d="M170 130 Q170 100 200 100 Q230 100 230 130 Q230 175 200 215 Q170 175 170 130 Z"
            fill="rgba(248,113,113,0.1)"
            stroke="rgba(248,113,113,0.4)"
          />
          {/* Spine */}
          <line x1="200" y1="40" x2="200" y2="260" stroke="rgba(148,163,184,0.3)" strokeWidth="6" strokeLinecap="round" />
          {/* Ribs hints */}
          {[60, 90, 120, 150, 180].map((y) => (
            <g key={y} opacity="0.25">
              <path d={`M120 ${y + 10} Q160 ${y} 200 ${y + 5}`} fill="none" />
              <path d={`M200 ${y + 5} Q240 ${y} 280 ${y + 10}`} fill="none" />
            </g>
          ))}
        </g>
      )

    case 'torax-perfil':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          <path d="M120 50 Q100 100 110 250 L130 270 L260 270 L290 250 Q300 150 280 50 Z" />
          <path
            d="M180 130 Q180 105 210 105 Q240 105 240 135 Q240 175 210 200 Q180 175 180 130 Z"
            fill="rgba(248,113,113,0.1)"
            stroke="rgba(248,113,113,0.4)"
          />
          {/* Sternum */}
          <line x1="120" y1="60" x2="130" y2="240" stroke="rgba(148,163,184,0.4)" strokeWidth="3" />
          {/* Spine */}
          <line x1="285" y1="60" x2="280" y2="260" stroke="rgba(148,163,184,0.4)" strokeWidth="6" />
        </g>
      )

    case 'tireoide-long':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          <ellipse cx="200" cy="150" rx="120" ry="50" fill="rgba(148,163,184,0.08)" />
          {/* Heterogeneity texture */}
          {Array.from({ length: 14 }).map((_, i) => (
            <circle
              key={i}
              cx={120 + (i * 12) % 160}
              cy={130 + (i * 17) % 50}
              r={2 + (i % 3)}
              fill="rgba(148,163,184,0.15)"
              stroke="none"
            />
          ))}
          {/* Nodule (TI-RADS 3) */}
          <circle cx="280" cy="155" r="14" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="296" y="160" fill="#f59e0b" fontSize="8" fontFamily="ui-monospace, monospace">
            8mm
          </text>
          {/* Trachea behind */}
          <ellipse cx="200" cy="150" rx="20" ry="40" stroke="rgba(148,163,184,0.3)" fill="none" strokeDasharray="2,2" />
        </g>
      )

    case 'tireoide-trans':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          {/* Two lobes (butterfly) */}
          <path d="M80 130 Q100 100 150 110 Q170 130 170 160 Q160 200 120 200 Q80 195 70 160 Z" />
          <path d="M320 130 Q300 100 250 110 Q230 130 230 160 Q240 200 280 200 Q320 195 330 160 Z" />
          {/* Isthmus */}
          <rect x="170" y="135" width="60" height="20" rx="5" />
          {/* Trachea */}
          <circle cx="200" cy="145" r="22" fill="rgba(15,23,42,1)" stroke="rgba(148,163,184,0.4)" />
          {/* Carotids */}
          <circle cx="100" cy="180" r="8" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" />
          <circle cx="300" cy="180" r="8" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" />
          {/* Nodule highlight on right lobe */}
          <circle cx="280" cy="155" r="11" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
        </g>
      )

    case 'abdome-fig-hepatico':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          {/* Liver outline */}
          <path
            d="M60 90 Q70 60 130 65 Q220 70 290 80 Q330 95 340 140 Q330 200 280 230 Q200 250 130 240 Q70 220 55 170 Z"
            fill="rgba(245,158,11,0.06)"
          />
          {/* Echogenic texture (steatosis) */}
          {Array.from({ length: 22 }).map((_, i) => (
            <circle
              key={i}
              cx={80 + (i * 13) % 240}
              cy={90 + (i * 11) % 150}
              r={1.5 + (i % 2)}
              fill="rgba(252,211,77,0.25)"
              stroke="none"
            />
          ))}
          {/* Portal vein hint (faint) */}
          <path d="M150 130 Q200 140 230 160" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" fill="none" />
          {/* Diaphragm */}
          <path d="M55 170 Q200 250 340 140" stroke="rgba(148,163,184,0.4)" fill="none" strokeWidth="1.5" />
        </g>
      )

    case 'abdome-rim':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          {/* Kidney bean shape */}
          <path
            d="M150 60 Q230 50 270 100 Q290 160 270 220 Q230 260 150 250 Q100 220 100 150 Q105 80 150 60 Z"
            fill="rgba(148,163,184,0.08)"
          />
          {/* Cortex/medulla differentiation */}
          <path
            d="M170 90 Q230 80 250 120 Q260 160 250 200 Q230 230 170 225 Q140 200 140 155 Q145 105 170 90 Z"
            fill="rgba(148,163,184,0.04)"
            stroke="rgba(148,163,184,0.3)"
          />
          {/* Pelvis */}
          <ellipse cx="200" cy="155" rx="22" ry="30" fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.4)" />
        </g>
      )

    case 'crânio-sagital-t1':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          {/* Skull outline (sagital) */}
          <path
            d="M70 130 Q70 60 160 50 Q260 50 320 90 Q340 130 330 170 Q310 220 240 235 L150 240 Q90 230 70 200 Z"
            fill="rgba(148,163,184,0.06)"
          />
          {/* Brain parenchyma */}
          <path
            d="M85 135 Q85 75 165 65 Q260 65 310 100 Q325 135 318 165 Q300 205 235 220 L155 222 Q100 215 85 190 Z"
            fill="rgba(148,163,184,0.1)"
            stroke="rgba(148,163,184,0.3)"
          />
          {/* Sella turcica */}
          <circle cx="195" cy="170" r="14" fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.5)" />
          {/* Pituitary */}
          <ellipse cx="195" cy="172" rx="9" ry="6" fill="rgba(148,163,184,0.3)" stroke="rgba(148,163,184,0.5)" />
          {/* Microadenoma highlight */}
          <circle cx="200" cy="172" r="5" fill="rgba(245,158,11,0.3)" stroke="#f59e0b" strokeWidth="1" />
          {/* Nasal/sphenoid */}
          <path d="M150 180 Q170 200 200 195 Q230 185 250 180" stroke="rgba(148,163,184,0.4)" fill="none" />
        </g>
      )

    case 'crânio-coronal-t1':
      return (
        <g stroke={stroke} fill={fill} strokeWidth="1">
          {/* Skull oval */}
          <ellipse cx="200" cy="135" rx="140" ry="90" fill="rgba(148,163,184,0.06)" />
          {/* Brain hemispheres */}
          <path
            d="M70 135 Q70 65 200 60 Q330 65 330 135 Q320 200 200 220 Q80 200 70 135 Z"
            fill="rgba(148,163,184,0.1)"
            stroke="rgba(148,163,184,0.3)"
          />
          {/* Falx cerebri */}
          <line x1="200" y1="60" x2="200" y2="220" stroke="rgba(148,163,184,0.5)" strokeWidth="1" />
          {/* Sella turcica (centered) */}
          <ellipse cx="200" cy="178" rx="20" ry="12" fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.5)" />
          {/* Pituitary */}
          <ellipse cx="200" cy="180" rx="14" ry="6" fill="rgba(148,163,184,0.3)" />
          {/* Microadenoma (right side, ~4mm) */}
          <circle cx="208" cy="180" r="4" fill="rgba(245,158,11,0.4)" stroke="#f59e0b" strokeWidth="1" />
          {/* Internal carotid arteries */}
          <circle cx="170" cy="180" r="5" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" />
          <circle cx="230" cy="180" r="5" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" />
        </g>
      )

    default:
      return null
  }
}
