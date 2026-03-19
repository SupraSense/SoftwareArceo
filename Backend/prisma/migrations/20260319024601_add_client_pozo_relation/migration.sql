-- AlterTable
ALTER TABLE "ClientContact" ADD COLUMN     "isPrincipal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Pozo" ADD COLUMN     "clienteId" TEXT;

-- AddForeignKey
ALTER TABLE "Pozo" ADD CONSTRAINT "Pozo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
