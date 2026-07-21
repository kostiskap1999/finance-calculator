"use client"

import { useState, type FormEvent } from 'react'
import { FinanceType, Prisma } from '@prisma/client'
import { createFinance } from '@/lib/api/finance'
import { NewFinanceProps } from '../page';



export default function NewFinance({financeModal, handleRefresh, newFinanceProp }: { financeModal: NewFinanceProps; handleRefresh: () => void; newFinanceProp?: Prisma.FinanceCreateInput }) {
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const defaultFinance: Prisma.FinanceCreateInput = {
    title: '',
    description: '',
    type: FinanceType.INCOME,
    amount: 0,
    startAt: new Date().toISOString()
  }
  const [newFinance, setNewFinance] = useState<Prisma.FinanceCreateInput>(newFinanceProp || defaultFinance)

  if (!financeModal.isOpen)
    return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      await createFinance(newFinance)
      setNewFinance({ ...defaultFinance })
      handleRefresh()
      financeModal.onClose()
    } catch {
      setFeedback('Unable to save this finance right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={financeModal.onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Add finance</h2>
          <button
            type="button"
            onClick={financeModal.onClose}
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
              value={newFinance.description ? newFinance.description : ''}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, description: event.target.value })}}
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground placeholder:text-(--muted-strong)"
              rows={3}
              placeholder="Optional details"
            />
          </label>

          <label className="block text-sm font-medium text-(--muted)">
            Type
            <select
              value={newFinance.type ? newFinance.type : FinanceType.INCOME}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, type: event.target.value as FinanceType })}}
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground"
            >
              <option value={FinanceType.INCOME}>Income</option>
              <option value={FinanceType.OUTCOME}>Outcome</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-(--muted)">
            Amount
            <input
              type="number"
              step="0.01"
              value={newFinance.amount}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, amount: parseFloat(event.target.value) || 0 })}}
              required
              className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground placeholder:text-(--muted-strong)"
              placeholder="0.00"
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
              type="button"
              onClick={financeModal.onClose}
              className="rounded border border-(--border) px-4 py-2 text-sm font-medium text-(--muted) transition hover:bg-(--surface-elevated)"
            >
              Cancel
            </button>
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
