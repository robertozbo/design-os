interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  const dimensions =
    size === 'sm'
      ? { track: 'h-5 w-9', thumb: 'h-3.5 w-3.5', translate: 'translate-x-4' }
      : { track: 'h-6 w-11', thumb: 'h-4 w-4', translate: 'translate-x-5' }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 ${dimensions.track} items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
        checked
          ? 'bg-teal-500'
          : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block ${dimensions.thumb} translate-x-1 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${
          checked ? dimensions.translate : ''
        }`}
      />
    </button>
  )
}
