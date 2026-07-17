"use client"

import { useState, useEffect } from 'react'
import PageWrapper from './components/PageWrapper'
import Incomes from './components/Incomes'
import Outcomes from './components/Outcomes'
import NewFinance from './components/NewFinance'
import TotalFinances from './components/TotalFinances'

export interface NewFinanceProps {
  isOpen: boolean
  onClose: () => void
}


export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNewFinanceOpen, setIsNewFinanceOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)


  const financeModal = {
  isOpen: isNewFinanceOpen,
  onClose: () => setIsNewFinanceOpen(false),
};


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
  
  const handleRefresh = () => {
    setRefresh((prev) => prev + 1)
  }


  return (
    <PageWrapper loading={loading} error={error} className="flex flex-col h-screen">
      <div className="h-1/4 bg-red-200 flex items-center justify-between px-6">
        <TotalFinances financeModal={financeModal} refresh={refresh} onRefresh={handleRefresh} />
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
          <Incomes financeModal={financeModal} refresh={refresh} onRefresh={handleRefresh} />
        </div>
        <div className="w-2/4 h-full flex items-center justify-center">
          <Outcomes financeModal={financeModal} refresh={refresh} onRefresh={handleRefresh} />
        </div>
      </div>

      <NewFinance financeModal={financeModal} handleRefresh={handleRefresh} />
    </PageWrapper>
  )
}
