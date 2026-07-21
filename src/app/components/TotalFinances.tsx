"use client"

import { useState, useEffect } from 'react'
import { getTotalFinances } from '@/lib/api/finance'
import { NewFinanceProps } from '../page'

export default function TotalFinances({ financeModal, refresh, onRefresh }: { financeModal: NewFinanceProps; refresh: number; onRefresh: () => void }) {
  const [totalFinances, setTotalFinances] = useState<number | null>(null)
  const [tempRefresh, setTempRefresh] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finances = await getTotalFinances()
        setTotalFinances(finances)
      } catch (error) {
        console.error('Failed to load total finances', error)
        setTotalFinances(null)
      }
    }

    fetchData()
  }, [tempRefresh, refresh])

  return (
    <div className="h-full w-full rounded-2xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">Total Finances</h2>
      {totalFinances !== null ? (
        <p className="text-2xl font-bold text-[var(--accent-glow)]">${totalFinances.toFixed(2)}</p>
      ) : (
        <p className="text-[var(--muted)]">Failed to load total finances</p>
      )}
      <button
        type="button"
        onClick={() => setTempRefresh((prev) => prev + 1)}
        className="mt-4 rounded border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-elevated)]"
      >
        Refresh
      </button>
    </div>
  )
}
