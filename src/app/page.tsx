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
  }

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
    <PageWrapper loading={loading} error={error} className="flex h-screen flex-col">
      <div className="flex h-1/4 items-center justify-between border-b border-[var(--border)] bg-[linear-gradient(135deg,var(--accent-soft),var(--surface))] px-6 py-6">
        <TotalFinances financeModal={financeModal} refresh={refresh} onRefresh={handleRefresh} />
        <button
          type="button"
          onClick={() => setIsNewFinanceOpen(true)}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-2xl font-semibold text-white shadow-lg shadow-[rgba(161,15,31,0.35)] transition hover:bg-[var(--accent-strong)]"
          aria-label="Add finance"
        >
          +
        </button>
      </div>
      <div className="flex h-3/4 flex-row items-center justify-center gap-4 bg-[var(--background)] p-4">
        <div className="flex h-full w-2/4 items-center justify-center">
          <Incomes financeModal={financeModal} refresh={refresh} onRefresh={handleRefresh} />
        </div>
        <div className="flex h-full w-2/4 items-center justify-center">
          <Outcomes financeModal={financeModal} refresh={refresh} onRefresh={handleRefresh} />
        </div>
      </div>

      <NewFinance financeModal={financeModal} handleRefresh={handleRefresh} />
    </PageWrapper>
  )
}
