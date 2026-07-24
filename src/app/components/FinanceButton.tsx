"use client"

import { useState } from 'react'
import { deleteFinance } from '@/lib/api/finance'
import { FinanceForm } from '@/types/finance'

interface FinanceButtonProps {
  finance: any
  handleNewFinanceOpen: any
  handleEditedFinance: (finance: FinanceForm) => void
  handleRefresh: () => void
}

export default function FinanceButton({ handleNewFinanceOpen, finance, handleEditedFinance, handleRefresh }: FinanceButtonProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)


  const openEditor = () => {
    setFeedback(null)
    handleEditedFinance(finance)
    handleNewFinanceOpen()
  }

  const handleConfirmDelete = async () => {

    setIsSubmitting(true)
    setFeedback(null)

    try {
      await deleteFinance(finance.id)
      handleRefresh?.()
    } catch {
      setFeedback('Unable to delete this finance right now.')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <>
      <div 
        className="group relative rounded-xl border border-(--border) bg-(--surface-elevated) p-4 shadow-sm transition hover:border-(--accent)"
        onMouseLeave={() => setConfirmDelete(false)}
      >
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={openEditor}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent) text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
            aria-label="Edit finance"
          >
            ✎
          </button>
          {!confirmDelete &&
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={isSubmitting}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-strong) text-sm font-semibold text-white transition hover:bg-(--accent-glow) disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Delete finance"
            >
              ×
            </button>
          }
          {confirmDelete &&
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-strong) text-sm font-semibold text-white transition hover:bg-(--accent-glow) disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Delete finance"
            >
              🗑️
            </button>
          }
        </div>

        <div className="pr-12">
          <div className="font-medium text-foreground">{finance.title}</div>
          <div className="text-sm text-(--muted)">{finance.description || 'No description'}</div>
          <div className="mt-1 text-sm text-(--muted)">
            Amount: {Number(finance.amount).toFixed(2)}
          </div>
          {finance.recurring && finance.recurrence ? (
            <div className="mt-1 text-sm text-(--accent)">
              Recurs {finance.recurrence.interval}x every {finance.recurrence.frequency.toLowerCase()}
              {finance.recurrence.endsAt ? ` until ${new Date(finance.recurrence.endsAt).toISOString().slice(0, 10)}` : ''}
            </div>
          ) : finance.recurring ? (
            <div className="mt-1 text-sm text-(--accent)">Recurring</div>
          ) : null}
        </div>

        {feedback ? <p className="mt-2 text-sm text-(--accent-glow)">{feedback}</p> : null}
      </div>
    </>
  )
}
