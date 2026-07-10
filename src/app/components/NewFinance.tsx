"use client"

import { useState, type FormEvent } from 'react'
import { FinanceType, Prisma } from '@prisma/client'
import { createFinance } from '@/lib/api/finance'

interface NewFinanceProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewFinance({ isOpen, onClose }: NewFinanceProps) {
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const defaultFinance: Prisma.FinanceCreateInput = {
    title: '',
    description: '',
    type: FinanceType.INCOME,
    amount: 0,
    startAt: new Date().toISOString().slice(0, 10)
  }
  const [newFinance, setNewFinance] = useState<Prisma.FinanceCreateInput>(defaultFinance)

  if (!isOpen)
    return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      await createFinance(newFinance)
      setNewFinance({ ...defaultFinance })
      onClose()
    } catch {
      setFeedback('Unable to save this finance right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Add finance</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Title
            <input
              value={newFinance.title}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, title: event.target.value })}}
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Salary"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              value={newFinance.description ? newFinance.description : ''}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, description: event.target.value })}}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Optional details"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Type
            <select
              value={newFinance.type ? newFinance.type : FinanceType.INCOME}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, type: event.target.value as FinanceType })}}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value={FinanceType.INCOME}>Income</option>
              <option value={FinanceType.OUTCOME}>Outcome</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Amount
            <input
              type="number"
              step="0.01"
              value={newFinance.amount}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, amount: parseFloat(event.target.value) || 0 })}}
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="0.00"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Start date
            <input
              type="date"
              value={newFinance.startAt ? new Date(newFinance.startAt).toISOString().slice(0, 10) : ''}
              onChange={(event) => {newFinance && setNewFinance({ ...newFinance, startAt: new Date(event.target.value).toISOString() })}}
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>

          {feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Save finance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
