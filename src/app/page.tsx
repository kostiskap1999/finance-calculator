"use client"

import { useState, useEffect } from 'react'
import PageWrapper from './components/PageWrapper'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="h-1/4 bg-red-200 flex items-center justify-center">
        Total Finances
      </div>
      <div className="h-3/4 flex flex-row items-center justify-center">
        <div className="w-2/4 h-full bg-green-200 flex items-center justify-center">
          Incomes
        </div>
        <div className="w-2/4 h-full bg-blue-200 flex items-center justify-center">
          Outcomes
        </div>
      </div>
    </PageWrapper>
  )
}
