-- CreateTable
CREATE TABLE "Segmento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Segmento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Segmento_nombre_key" ON "Segmento"("nombre");
