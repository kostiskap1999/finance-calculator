"use client"

import { useState, type FormEvent } from 'react'
import { deleteFinance, updateFinance } from '@/lib/api/finance'
import { FinanceType, Prisma } from '@prisma/client'
import NewFinance from './NewFinance'
import { NewFinanceProps } from '../page'

interface FinanceButtonProps {
  finance: any
  onFinanceChange: () => void
}

export default function FinanceButton({ financeModal, finance, onFinanceChange }: FinanceButtonProps & { financeModal: NewFinanceProps }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const defaultFinance: Prisma.FinanceCreateInput = {
    title: '',
    description: '',
    type: FinanceType.INCOME,
    amount: 0,
    startAt: new Date().toISOString(),
  }
  const [newFinance, setNewFinance] = useState<Prisma.FinanceCreateInput>(defaultFinance)

  const openEditor = () => {
    setFeedback(null)
    setNewFinance({
      title: finance.title ?? '',
      description: finance.description ?? '',
      type: finance.type ?? FinanceType.INCOME,
      amount: Number(finance.amount) || 0,
      startAt: finance.startAt ? new Date(finance.startAt).toISOString().slice(0, 10) : '',
    })
    setIsEditing(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await updateFinance(finance.id, {
        title: newFinance.title,
        description: newFinance.description || null,
        type: newFinance.type,
        amount: Number(newFinance.amount),
        startAt: new Date(newFinance.startAt).toISOString(),
      })

      onFinanceChange?.()
      setIsEditing(false)
    } catch {
      setFeedback('Unable to update this finance right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this finance entry?'))
      return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      await deleteFinance(finance.id)
      onFinanceChange?.()
    } catch {
      setFeedback('Unable to delete this finance right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="rounded-xl border border-(--border) bg-(--surface-elevated) p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium text-foreground">{finance.title}</div>
            <div className="text-sm text-(--muted)">{finance.description || 'No description'}</div>
            <div className="mt-1 text-sm text-(--muted)">
              Amount: {Number(finance.amount).toFixed(2)}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={openEditor}
              className="rounded bg-(--accent) px-2 py-1 text-xs font-semibold text-white transition hover:bg-(--accent-strong)"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="rounded bg-(--accent-strong) px-2 py-1 text-xs font-semibold text-white transition hover:bg-(--accent-glow) disabled:cursor-not-allowed disabled:opacity-70"
            >
              Delete
            </button>
          </div>
        </div>

        {feedback ? <p className="mt-2 text-sm text-(--accent-glow)">{feedback}</p> : null}
      </div>

      {isEditing ? <NewFinance financeModal={financeModal} handleRefresh={onFinanceChange} newFinanceProp={newFinance} /> : null}
    </>
  )
}
