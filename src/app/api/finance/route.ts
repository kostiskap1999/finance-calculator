export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  onst { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const finance = await prisma.finance.findUnique({
    where: { type: type },
    include: { recurrence: true },
  })

  if (finance)
    return Response.json(finance)
  else
    return Response.json({ error: 'Finance not found' }, { status: 404 })
  
}

export async function POST(req: NextRequest) {
  const data: Prisma.FinanceCreateInput = await req.json()

  const newFinance = await prisma.finance.create({ data })

  return Response.json(newFinance)
}
