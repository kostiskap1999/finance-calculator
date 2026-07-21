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
  const [confirmDelete, setConfirmDelete] = useState(false)
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
    setConfirmDelete(true)
  }


  const handleConfirmDelete = async () => {

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
              onClick={handleDelete}
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
        </div>

        {feedback ? <p className="mt-2 text-sm text-(--accent-glow)">{feedback}</p> : null}
      </div>

      {isEditing ? <NewFinance financeModal={financeModal} handleRefresh={onFinanceChange} newFinanceProp={newFinance} /> : null}
    </>
  )
}
