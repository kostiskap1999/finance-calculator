"use client"

import { useEffect, useState, type FormEvent } from 'react'
import { FinanceType } from '@prisma/client'
import { createFinance, updateFinance } from '@/lib/api/finance'
import { NewFinanceProps } from '../page';
import { FinanceForm } from '@/types/finance';

type RecurrenceFrequency = 'DAY' | 'WEEK' | 'MONTH'

type ExtendedFinanceForm = FinanceForm & {
  recurring?: boolean
  frequency?: RecurrenceFrequency
  interval?: number
  weekdays?: number[]
  endsAt?: string
  recurrence?: {
    frequency: RecurrenceFrequency
    interval: number
    weekdays?: number[] | null
    endsAt?: string | null
  } | null
}

export default function NewFinanceModal({financeModal, handleRefresh, newFinanceProp }: { financeModal: NewFinanceProps; handleRefresh: () => void; newFinanceProp?: FinanceForm }) {
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  
  const defaultFinance: ExtendedFinanceForm = {
    title: '',
    description: '',
    type: undefined,
    amount: undefined,
    startAt: new Date().toISOString(),
    recurring: false,
    frequency: 'MONTH',
    interval: 1,
    weekdays: [],
    endsAt: '',
    recurrence: null,
  }

  const [newFinance, setNewFinance] = useState<ExtendedFinanceForm>(defaultFinance)
  
  useEffect(() => {
    if (newFinanceProp) {
      const existingRecurrence = (newFinanceProp as any).recurrence
      setNewFinance({
        ...defaultFinance,
        ...(newFinanceProp as any),
        recurring: Boolean((newFinanceProp as any).recurring || existingRecurrence),
        frequency: existingRecurrence?.frequency ?? defaultFinance.frequency,
        interval: existingRecurrence?.interval ?? defaultFinance.interval,
        weekdays: existingRecurrence?.weekdays ?? defaultFinance.weekdays,
        endsAt: existingRecurrence?.endsAt ? new Date(existingRecurrence.endsAt).toISOString().slice(0, 10) : defaultFinance.endsAt,
        recurrence: existingRecurrence ?? null,
      })
    } else {
      setNewFinance(defaultFinance)
    }
  }, [newFinanceProp, financeModal.isOpen])

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

    const recurrenceFields = {
      frequency: newFinance.frequency ?? 'MONTH',
      interval: newFinance.interval ?? 1,
      weekdays: newFinance.frequency === 'WEEK' ? newFinance.weekdays?.length ? newFinance.weekdays : null : null,
      endsAt: newFinance.endsAt ? new Date(newFinance.endsAt).toISOString() : undefined,
    }

    const recurrencePayload = newFinance.recurring ? {
      recurring: true,
      recurrence: newFinanceProp?.id ? {
        upsert: {
          create: recurrenceFields,
          update: recurrenceFields,
        },
      } : {
        create: recurrenceFields,
      },
    } : {
      recurring: false,
      ...(newFinanceProp?.id && newFinance.recurrence ? { recurrence: { delete: true } } : {}),
    }

    const financeToSubmit: any = {
      title: newFinance.title,
      description: newFinance.description || null,
      type: newFinance.type,
      amount: newFinance.amount,
      startAt: new Date(newFinance.startAt).toISOString(),
      ...recurrencePayload,
    }

    if (newFinanceProp?.id) {
      financeToSubmit.id = newFinanceProp.id
    }

    try {
      if(newFinanceProp && newFinanceProp.id) {
        await updateFinance(newFinanceProp.id, financeToSubmit as any)
      } else {
        await createFinance(financeToSubmit as any)
      }
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-black/70 p-4">
      <div
        className="w-full max-w-md h-full max-h-[calc(100vh-2rem)] min-h-0 flex flex-col rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-2xl shadow-black/50"
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

        <form className="flex-1 min-h-0 space-y-3 overflow-y-auto" onSubmit={handleSubmit}>
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

          <label className="flex items-center gap-2 text-sm font-medium text-(--muted)">
            <input
              type="checkbox"
              checked={newFinance.recurring ?? false}
              onChange={(event) => setNewFinance({ ...newFinance, recurring: event.target.checked })}
              className="h-4 w-4 rounded border border-(--border) bg-(--surface-elevated) text-(--accent)"
            />
            Recurring finance
          </label>

          {newFinance.recurring && (
            <div className="space-y-3 rounded border border-(--border) bg-(--surface-elevated) p-4">
              <label className="block text-sm font-medium text-(--muted)">
                Frequency
                <select
                  value={newFinance.frequency}
                  onChange={(event) => setNewFinance({ ...newFinance, frequency: event.target.value as RecurrenceFrequency })}
                  className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground"
                >
                  <option value="DAY">Daily</option>
                  <option value="WEEK">Weekly</option>
                  <option value="MONTH">Monthly</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-(--muted)">
                Interval
                <input
                  type="number"
                  min={1}
                  value={newFinance.interval ?? 1}
                  onChange={(event) => setNewFinance({ ...newFinance, interval: parseInt(event.target.value, 10) || 1 })}
                  className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground"
                />
              </label>

              {newFinance.frequency === 'WEEK' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-(--muted)">Weekdays</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, index) => {
                      const value = index + 1
                      const checked = newFinance.weekdays?.includes(value) ?? false
                      return (
                        <label key={label} className="flex items-center gap-2 text-sm text-(--muted)">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const weekdays = newFinance.weekdays ?? []
                              setNewFinance({
                                ...newFinance,
                                weekdays: checked
                                  ? weekdays.filter((day) => day !== value)
                                  : [...weekdays, value],
                              })
                            }}
                            className="h-4 w-4 rounded border border-(--border) bg-(--surface-elevated) text-(--accent)"
                          />
                          {label}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <label className="block text-sm font-medium text-(--muted)">
                Ends at
                <input
                  type="date"
                  value={newFinance.endsAt ?? ''}
                  onChange={(event) => setNewFinance({ ...newFinance, endsAt: event.target.value })}
                  className="mt-1 w-full rounded border border-(--border) bg-(--surface-elevated) px-3 py-2 text-foreground"
                />
              </label>
            </div>
          )}

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
