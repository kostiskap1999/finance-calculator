import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { parseFinanceType } from "./helpers"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = parseFinanceType(searchParams.get('type'))

  const finance = await prisma.finance.findMany({
    where: { type },
    include: { recurrence: true },
  })

  if (finance.length === 0)
    return Response.json({ error: 'Finance not found' }, { status: 404 })

  return Response.json(finance)
}

export async function POST(req: NextRequest) {
  const data: Prisma.FinanceCreateInput = await req.json()

  const newFinance = await prisma.finance.create({ data })

  return Response.json(newFinance)
}
