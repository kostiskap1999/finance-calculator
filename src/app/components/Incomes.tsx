"use client"

import { useState, useEffect } from 'react'
import { getFinancesByType } from '@/lib/api/finance'
import { FinanceType } from '@prisma/client'
import FinanceButton from './FinanceButton'
import { NewFinanceProps } from '../page'

export default function Incomes({financeModal, refresh, onRefresh}: {financeModal: NewFinanceProps; refresh: number; onRefresh: () => void}) {
  const [incomes, setIncomes] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inc = await getFinancesByType(FinanceType.INCOME)
        setIncomes(Array.isArray(inc) ? inc : [])
      } catch (error) {
        console.error('Failed to load incomes', error)
        setIncomes([])
      }
    }

    fetchData()
  }, [refresh])

  return (
    <div className="bg-green-200 w-full h-full p-6 overflow-auto">
      <h2 className="mb-4 text-xl font-semibold">Incomes</h2>

      {incomes.length === 0 ? (
        <div className="rounded-lg bg-white/80 p-4 text-sm text-gray-700">No incomes yet.</div>
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
