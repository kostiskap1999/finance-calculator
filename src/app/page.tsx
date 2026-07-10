"use client"

import { useState, useEffect } from 'react'
import PageWrapper from './components/PageWrapper'
import Incomes from './components/Incomes'
import Outcomes from './components/Outcomes'
import NewFinance from './components/NewFinance'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNewFinanceOpen, setIsNewFinanceOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
      } catch (err) {
        setError('Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  
  return (
    <PageWrapper loading={loading} error={error} className="flex flex-col h-screen">
      <div className="h-1/4 bg-red-200 flex items-center justify-between px-6">
        <div className="text-xl font-semibold">Total Finances</div>
        <button
          type="button"
          onClick={() => setIsNewFinanceOpen(true)}
          className="rounded-full bg-white px-4 py-2 text-2xl font-semibold text-red-600 shadow hover:bg-red-50"
          aria-label="Add finance"
        >
          +
        </button>
      </div>
      <div className="h-3/4 flex flex-row items-center justify-center">
        <div className="w-2/4 h-full flex items-center justify-center">
          <Incomes />
        </div>
        <div className="w-2/4 h-full flex items-center justify-center">
          <Outcomes />
        </div>
      </div>

      <NewFinance isOpen={isNewFinanceOpen} onClose={() => setIsNewFinanceOpen(false)} />
    </PageWrapper>
  )
}
