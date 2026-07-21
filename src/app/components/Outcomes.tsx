"use client"

import { useState, useEffect } from 'react'
import { getFinancesByType } from '@/lib/api/finance'
import { FinanceType } from '@prisma/client'
import FinanceButton from './FinanceButton'
import { NewFinanceProps } from '../page'

export default function Outcomes({ financeModal, refresh, onRefresh }: { financeModal: NewFinanceProps; refresh: number; onRefresh: () => void }) {
  const [incomes, setIncomes] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inc = await getFinancesByType(FinanceType.OUTCOME)
        setIncomes(Array.isArray(inc) ? inc : [])
      } catch (error) {
        console.error('Failed to load outcomes', error)
        setIncomes([])
      }
    }

    fetchData()
  }, [refresh])

  return (
    <div className="h-full w-full overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">Outcomes</h2>

      {incomes.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm text-[var(--muted)]">
          No outcomes yet.
        </div>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <div key={income.id}>
              <FinanceButton financeModal={financeModal} finance={income} onFinanceChange={onRefresh} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
