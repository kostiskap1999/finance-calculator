"use client"

import { useState, useEffect } from 'react'
import { getFinancesByType, getTotalFinances } from '@/lib/api/finance'
import { FinanceType } from '@prisma/client'
import FinanceButton from './FinanceButton'
import { NewFinanceProps } from '../page'

export default function TotalFinances({financeModal, refresh, onRefresh}: {financeModal: NewFinanceProps; refresh: number; onRefresh: () => void}) {
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
    <div className="bg-red-200 w-full h-full p-6 overflow-auto">
      <h2 className="mb-4 text-xl font-semibold">Total Finances</h2>
      {totalFinances !== null ? (
        <p className="text-2xl font-bold">${totalFinances.toFixed(2)}</p>
      ) : (
        <p className="text-gray-500">Failed to load total finances</p>
      )}
          <button onClick={() => setTempRefresh(prev => prev + 1)}>Refresh</button>
    </div>
  )
}
