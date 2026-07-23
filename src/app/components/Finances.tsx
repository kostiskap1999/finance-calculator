"use client"

import { useState, useEffect } from 'react'
import { getFinancesByType } from '@/lib/api/finance'
import { FinanceType, Prisma } from '@prisma/client'
import FinanceButton from './FinanceButton'
import { NewFinanceProps } from '../page'

export default function Finances({ financeType, handleNewFinanceOpen, handleEditedFinance, refresh, handleRefresh }: { financeType: FinanceType; financeModal: NewFinanceProps; handleNewFinanceOpen: any; handleEditedFinance: (finance: Prisma.FinanceCreateInput) => void; refresh: number; handleRefresh: () => void }) {
  const [finances, setFinances] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fin = await getFinancesByType(financeType)
        setFinances(Array.isArray(fin) ? fin : [])
      } catch (error) {
        console.error(`Failed to load ${financeType.toLowerCase()}`, error)
        setFinances([])
      }
    }

    fetchData()
  }, [refresh])

  return (
    <div className="h-full w-full overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">{financeType === FinanceType.INCOME ? 'Incomes' : 'Outcomes'}</h2>

      {finances.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm text-[var(--muted)]">
          No {financeType && financeType.toLowerCase()}s yet.
        </div>
      ) : (
        <div className="space-y-3">
          {finances.map((finance) => (
            <div key={finance.id}>
              <FinanceButton handleNewFinanceOpen={handleNewFinanceOpen} handleEditedFinance={handleEditedFinance} finance={finance} handleRefresh={handleRefresh} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
