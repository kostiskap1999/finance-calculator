"use client"

import { useState, useEffect } from 'react'
import PageWrapper from './PageWrapper'
import { getFinancesByType, createFinance } from '@/lib/api/finance'

export default function Incomes() {
  const [incomes, setIncomes] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
        const inc = await getFinancesByType('INCOME')
        setIncomes(inc)
        console.log(inc)
    }
    fetchData()
  }, [])
  

    const handleAddIncome = async (newIncome: Prisma.IncomeCreateInput) => {
        await createFinance(newIncome)
    }


  return (
    <div className="bg-green-200 w-full h-full flex items-center justify-center">
        Incomes
    </div>
  )
}
