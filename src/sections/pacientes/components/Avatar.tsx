import { useState } from 'react'

interface AvatarProps {
  name: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, { box: string; text: string; rounded: string }> = {
  sm: { box: 'h-9 w-9', text: 'text-xs', rounded: 'rounded-full' },
  md: { box: 'h-10 w-10', text: 'text-sm', rounded: 'rounded-full' },
  lg: { box: 'h-14 w-14', text: 'text-base', rounded: 'rounded-full' },
  xl: { box: 'h-16 w-16', text: 'text-xl', rounded: 'rounded-2xl' },
}

export function Avatar({ name, imageUrl, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const sizeClass = SIZE_CLASSES[size]

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')

  const showImage = imageUrl && !imgError

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-500 via-emerald-500 to-emerald-600 font-semibold text-white shadow-sm shadow-teal-500/10 ${sizeClass.box} ${sizeClass.rounded} ${className}`}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className={sizeClass.text}>{initials}</span>
      )}
    </div>
  )
}
