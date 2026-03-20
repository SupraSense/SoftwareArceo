-- CreateEnum
CREATE TYPE "EstadoDia" AS ENUM ('TRABAJO', 'FRANCO', 'VACACIONES');

-- CreateTable
CREATE TABLE "PlanillaMensual" (
    "id" TEXT NOT NULL,
    "choferId" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,

    CONSTRAINT "PlanillaMensual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaPlanilla" (
    "id" TEXT NOT NULL,
    "planillaId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoDia" NOT NULL DEFAULT 'TRABAJO',
    "observacion" VARCHAR(300),

    CONSTRAINT "DiaPlanilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pernocta" (
    "id" TEXT NOT NULL,
    "diaPlanillaId" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "patente" TEXT NOT NULL,

    CONSTRAINT "Pernocta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conexion" (
    "id" TEXT NOT NULL,
    "diaPlanillaId" TEXT NOT NULL,
    "patente" TEXT NOT NULL,

    CONSTRAINT "Conexion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desconexion" (
    "id" TEXT NOT NULL,
    "diaPlanillaId" TEXT NOT NULL,
    "patente" TEXT NOT NULL,

    CONSTRAINT "Desconexion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanillaMensual_choferId_mes_anio_key" ON "PlanillaMensual"("choferId", "mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "DiaPlanilla_planillaId_fecha_key" ON "DiaPlanilla"("planillaId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Pernocta_diaPlanillaId_key" ON "Pernocta"("diaPlanillaId");

-- AddForeignKey
ALTER TABLE "PlanillaMensual" ADD CONSTRAINT "PlanillaMensual_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaPlanilla" ADD CONSTRAINT "DiaPlanilla_planillaId_fkey" FOREIGN KEY ("planillaId") REFERENCES "PlanillaMensual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pernocta" ADD CONSTRAINT "Pernocta_diaPlanillaId_fkey" FOREIGN KEY ("diaPlanillaId") REFERENCES "DiaPlanilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conexion" ADD CONSTRAINT "Conexion_diaPlanillaId_fkey" FOREIGN KEY ("diaPlanillaId") REFERENCES "DiaPlanilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Desconexion" ADD CONSTRAINT "Desconexion_diaPlanillaId_fkey" FOREIGN KEY ("diaPlanillaId") REFERENCES "DiaPlanilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;
