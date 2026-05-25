import { useMemo } from 'react'
import data from '@/../product/sections/exames-paciente/data.json'
import type {
  Exam,
  ExamCategory,
  ExamCategoryId,
  ExamResultInput,
  ExamStats,
  ExamStatus,
  ExamTypeInfo,
  StatusOption,
} from '@/../product/sections/exames-paciente/types'
import { ExamesPaciente as ExamesPacienteView } from './components/ExamesPaciente'

interface ExamResultsEntry {
  examId: string
  results: ExamResultInput[]
}

export default function ExamesPacientePreview() {
  const resultsByExamId = useMemo(() => {
    const map: Record<string, ExamResultInput[]> = {}
    for (const entry of (data.examResults ?? []) as ExamResultsEntry[]) {
      map[entry.examId] = entry.results
    }
    return map
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-exames-paciente],
        [data-nymos-exames-paciente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-exames-paciente] .font-mono,
        [data-nymos-exames-paciente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <ExamesPacienteView
        stats={data.stats as ExamStats}
        examTypes={data.examTypes as ExamTypeInfo[]}
        categories={data.categories as ExamCategory[]}
        statusOptions={data.statusOptions as StatusOption[]}
        exams={data.exams as Exam[]}
        processingIds={data.processingIds as string[]}
        activeCategory={data.activeCategory as ExamCategoryId}
        activeStatus={data.activeStatus as ExamStatus | 'all'}
        resultsByExamId={resultsByExamId}
        onCategoryChange={(c) => console.log('[Exames] category:', c)}
        onStatusChange={(s) => console.log('[Exames] status:', s)}
        onOpenExam={(id) => console.log('[Exames] open:', id)}
        onCreateExam={(p) =>
          console.log('[Exames] create:', p.examTypeId, p.file.name, p.examDate)
        }
        onUpdateExam={(p) => console.log('[Exames] update:', p.id)}
        onDeleteExam={(id) => console.log('[Exames] delete:', id)}
        onConfirmResults={(id, p) =>
          console.log('[Exames] confirm:', id, p.results.length, 'results')
        }
        onOpenAIChat={(t) => console.log('[Exames] open ai-chat:', t)}
        onShareWithProfessional={(id) => console.log('[Exames] share:', id)}
        onDownloadFile={(examId) => console.log('[Exames] download:', examId)}
        onOpenAnalysis={(code) =>
          console.log('[Exames] open analysis:', code ?? 'all')
        }
        onOpenCompare={(ids) => console.log('[Exames] compare:', ids)}
      />
    </>
  )
}
