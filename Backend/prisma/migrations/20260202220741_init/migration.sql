-- CreateTable
CREATE TABLE "TipoTarea" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoTarea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoTarea_nombre_key" ON "TipoTarea"("nombre");
