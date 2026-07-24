import { FinanceType } from "@prisma/client";

export type FinanceForm = {
  id?: string | number;
  title: string;
  description: string | null;
  type: FinanceType | undefined;
  amount: number | undefined;
  startAt: string;
}
