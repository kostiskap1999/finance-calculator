import { FinanceType, Prisma } from '@prisma/client'
import { prisma } from '../prisma';

export async function getFinancesByType(type: FinanceType) {
  const query = `?type=${type}`

  const response = await fetch(`/api/finance${query}`)
  if (!response.ok)
    throw new Error('Failed to fetch finances')
  return response.json();
}

export async function getTotalFinances() {

  let response = await fetch(`/api/finance/totals?type=INCOME`)
  if (!response.ok)
    throw new Error('Failed to fetch incomes')
  const incomes = await response.json()

  response = await fetch(`/api/finance/totals?type=OUTCOME`)
  if (!response.ok)
    throw new Error('Failed to fetch outcomes')
  const outcomes = await response.json()

  const total = incomes.total - outcomes.total

  return total
}



export async function createFinance(finance: Prisma.FinanceCreateInput): Promise<Prisma.FinanceGetPayload<{ include: { recurrence: true } }>> {
  const response = await fetch('/api/finance', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(finance),
  })
  if (!response.ok)
    throw new Error('Failed to create finance')
  return response.json();
}

export async function updateFinance(id: number | string, finance: {
  title: string
  description: string | null
  type: FinanceType
  amount: number
  startAt: string
}) {
  const response = await fetch('/api/finance', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...finance }),
  })

  if (!response.ok)
    throw new Error('Failed to update finance')

  return response.json()
}

export async function deleteFinance(id: number | string) {
  const response = await fetch('/api/finance', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })

  if (!response.ok)
    throw new Error('Failed to delete finance')

  return response.json()
}