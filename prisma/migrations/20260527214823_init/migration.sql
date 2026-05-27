-- CreateTable
CREATE TABLE "JachnunOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pickupSlot" DATETIME NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "CateringInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "eventDate" DATETIME,
    "guestCount" INTEGER,
    "message" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JachnunOrder_reference_key" ON "JachnunOrder"("reference");

-- CreateIndex
CREATE INDEX "JachnunOrder_pickupSlot_idx" ON "JachnunOrder"("pickupSlot");

-- CreateIndex
CREATE UNIQUE INDEX "CateringInquiry_reference_key" ON "CateringInquiry"("reference");
