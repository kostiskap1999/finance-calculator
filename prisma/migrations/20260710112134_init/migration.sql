-- CreateTable
CREATE TABLE "Finance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "startAt" DATETIME NOT NULL,
    "recurring" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "RecurrenceRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "financeId" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "weekdays" JSONB,
    "endsAt" DATETIME,
    CONSTRAINT "RecurrenceRule_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "Finance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RecurrenceRule_financeId_key" ON "RecurrenceRule"("financeId");
