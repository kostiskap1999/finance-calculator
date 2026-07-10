import { FinanceType, Prisma } from '@prisma/client'

export async function getFinancesByType(type: FinanceType) {
  const query = `?type=${type}`

  const response = await fetch(`/api/finance${query}`)
  if (!response.ok)
    throw new Error('Failed to fetch finances')
  return response.json();
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