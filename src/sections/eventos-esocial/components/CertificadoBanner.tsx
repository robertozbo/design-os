import type { CertificadoStatus } from '@/../product/sections/eventos-esocial/types'
import { ShieldAlert, ShieldCheck, ChevronRight } from 'lucide-react'

interface Props {
  certificado: CertificadoStatus
  onConfigurarCertificado?: () => void
}

export function CertificadoBanner({ certificado, onConfigurarCertificado }: Props) {
  if (certificado.status === 'valido' && !certificado.alertaExpiracao) {
    return null
  }

  if (certificado.status === 'valido' && certificado.alertaExpiracao) {
    return (
      <div className="nymos-reveal opacity-0 rounded-2xl border border-amber-300/70 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-3">
        <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
          <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Certificado eSocial expira em breve
          </p>
          <p className="text-[12px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
            {certificado.titular} · válido até{' '}
            <span className="font-mono">{certificado.validoAte}</span>{' '}
            <span className="opacity-70">({certificado.diasAteExpiracao} dias restantes)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onConfigurarCertificado}
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition"
        >
          Renovar
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>
    )
  }

  const titulo =
    certificado.status === 'expirado'
      ? 'Certificado eSocial expirado'
      : certificado.status === 'invalido'
        ? 'Certificado eSocial inválido'
        : 'Certificado eSocial não configurado'

  const descricao =
    certificado.status === 'expirado'
      ? `Expirou em ${certificado.validoAte}. Transmissões bloqueadas até renovação.`
      : certificado.status === 'invalido'
        ? 'O arquivo enviado não é um certificado A1 ou A3 válido. Verifique o formato (.pfx) e a senha.'
        : 'Sem certificado vinculado ao Empregador. Nenhum evento pode ser transmitido.'

  return (
    <div className="nymos-reveal opacity-0 rounded-2xl border border-rose-300/70 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 px-4 py-3.5 flex items-start gap-3">
      <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
        <ShieldAlert className="w-4.5 h-4.5" strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">{titulo}</p>
        <p className="text-[12px] text-rose-800/90 dark:text-rose-300/90 mt-0.5">{descricao}</p>
      </div>
      <button
        type="button"
        onClick={onConfigurarCertificado}
        className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-[12px] font-semibold bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 text-white transition shadow-[0_2px_8px_-2px_rgba(225,29,72,0.5)]"
      >
        Configurar agora
        <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </div>
  )
}
