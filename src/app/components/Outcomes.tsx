"use client"

import { useState, useEffect } from 'react'
import PageWrapper from './PageWrapper'

export default function Outcomes() {
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
    <div className="bg-blue-200 w-full h-full flex items-center justify-center">
      Outcomes
    </div>
  )
}
