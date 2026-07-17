import { prisma } from "@/lib/prisma";
import { parseFinanceType } from "../helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = parseFinanceType(searchParams.get('type'))
    
    const result = await prisma.finance.aggregate({
        where: { type: type },
        _sum: { amount: true },
    })

    return Response.json({
        total: result._sum.amount ?? 0
    })
}