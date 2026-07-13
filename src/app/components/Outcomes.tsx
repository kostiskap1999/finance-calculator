"use client"

import { useState, useEffect } from 'react'
import { getFinancesByType } from '@/lib/api/finance'
import { FinanceType } from '@prisma/client'

export default function Outcomes({refresh, handleRefresh}: {refresh: number; handleRefresh: () => void}) {
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
    <div className="bg-green-200 w-full h-full p-6 overflow-auto">
      <h2 className="mb-4 text-xl font-semibold">Outcomes</h2>

      {incomes.length === 0 ? (
        <div className="rounded-lg bg-white/80 p-4 text-sm text-gray-700">No outcomes yet.</div>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <div key={income.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="font-medium text-gray-800">{income.title}</div>
              <div className="text-sm text-gray-600">{income.description || 'No description'}</div>
              <div className="mt-1 text-sm text-gray-600">
                Amount: {Number(income.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
