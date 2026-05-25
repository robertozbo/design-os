import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FAQContent, FAQItem } from '@/../product/sections/landing-page/types'

function FAQRow({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`group rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 transition-all duration-300 ${
      isOpen ? 'ring-teal-400/30 bg-white/[0.04]' : 'ring-white/[0.08] hover:ring-white/15'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 lg:px-6 py-4 lg:py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-sm lg:text-base font-semibold tracking-tight ${isOpen ? 'text-teal-200' : 'text-slate-100'}`}>
          {item.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-all duration-300 ${
            isOpen ? 'rotate-180 text-teal-300' : 'text-slate-500 group-hover:text-slate-300'
          }`}
          strokeWidth={2.4}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 lg:px-6 pb-5 lg:pb-6">
          <p className="text-sm text-slate-400 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

interface Props {
  content: FAQContent
}

export function LandingFAQ({ content }: Props) {
  const [openId, setOpenId] = useState<string | null>(content.items[0]?.id ?? null)

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 0%, rgba(20,184,166,0.08) 0px, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-14">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/30 mb-6">
            {content.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50">
            {content.title}
          </h2>
        </div>

        <div className="space-y-3">
          {content.items.map((item) => (
            <FAQRow
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
