"use client"

import { useEffect, useState, type FormEvent } from 'react'
import { FinanceType, Prisma } from '@prisma/client'
import { createFinance } from '@/lib/api/finance'
import { NewFinanceProps } from '../page';

type FinanceForm = Omit<Prisma.FinanceCreateInput, "type" | "amount"> & {
  type: FinanceType | undefined;
  amount: number | undefined;
};



export default function NewFinanceModal({financeModal, handleRefresh, newFinanceProp }: { financeModal: NewFinanceProps; handleRefresh: () => void; newFinanceProp?: FinanceForm }) {
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  
  const defaultFinance: FinanceForm = {
    title: '',
    description: '',
    type: undefined,
    amount: undefined,
    startAt: new Date().toISOString()
  }

  const [newFinance, setNewFinance] = useState<FinanceForm>(defaultFinance)
  
  useEffect(() => {
    if (newFinanceProp)
      setNewFinance(newFinanceProp);
    else
      setNewFinance(defaultFinance);
  })

  if (!financeModal.isOpen)
    return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    if (!newFinance.type || newFinance.amount === undefined) {
      setFeedback('Please select a type and enter an amount.')
      setSubmitting(false)
      return
    }

    const financeToSubmit: Prisma.FinanceCreateInput = {
      title: newFinance.title,
      description: newFinance.description || null, 
      type: newFinance.type,
      amount: newFinance.amount,
      startAt: new Date(newFinance.startAt).toISOString(),
    }

    try {
      await createFinance(financeToSubmit)
      setNewFinance({ ...defaultFinance })
      handleRefresh()
      financeModal.onClose()
    } catch {
      setFeedback('Unable to save this finance right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setNewFinance({ ...defaultFinance })
    financeModal.onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Add finance</h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-2xl text-(--muted) transition hover:text-foreground"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-(--muted)">
            Title
            <input
              value={newFinance.title}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, title: event.target.value })}}
              required
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground placeholder:text-(--muted-strong)"
              placeholder="Salary"
            />
          </label>

          <label className="block text-sm font-medium text-(--muted)">
            Description
            <textarea
              value={newFinance.description ?? ''}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, description: event.target.value })}}
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground placeholder:text-(--muted-strong)"
              rows={3}
              placeholder="Optional details"
            />
          </label>

          <label className="block text-sm font-medium text-(--muted)">
            Type
            <select
              value={newFinance.type ?? undefined}
              required
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, type: event.target.value as FinanceType })}}
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground"
            >
              <option value={undefined}></option>
              <option value={FinanceType.INCOME}>Income</option>
              <option value={FinanceType.OUTCOME}>Outcome</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-(--muted)">
            Amount
            <input
              type="number"
              inputMode="decimal"
              value={newFinance.amount ?? undefined}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, amount: parseFloat(event.target.value) || 0 })}}
              required
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground placeholder:text-(--muted-strong) [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>

          <label className="block text-sm font-medium text-(--muted)">
            Start date
            <input
              type="date"
              value={newFinance.startAt ? new Date(newFinance.startAt).toISOString().slice(0, 10) : ''}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, startAt: new Date(event.target.value).toISOString() })}}
              required
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground"
            />
          </label>

          {feedback ? <p className="text-sm text-(--accent-glow)">{feedback}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--accent-strong) disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Save finance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
