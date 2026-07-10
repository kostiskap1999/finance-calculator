import { FinanceType } from "@prisma/client";

export function parseFinanceType(value: string | null) {
  if (!value)
    return undefined

  if (Object.values(FinanceType).includes(value as FinanceType))
    return value as FinanceType

  return undefined
}