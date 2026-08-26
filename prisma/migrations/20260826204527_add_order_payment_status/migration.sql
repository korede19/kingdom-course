-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
