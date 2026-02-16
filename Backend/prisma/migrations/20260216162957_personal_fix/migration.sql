/*
  Warnings:

  - You are about to drop the column `area` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Personal` table. All the data in the column will be lost.
  - Added the required column `areaId` to the `Personal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Personal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personal" DROP COLUMN "area",
DROP COLUMN "estado",
ADD COLUMN     "areaId" INTEGER NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PersonalStatus" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "PersonalStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaPersonal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "AreaPersonal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalStatus_nombre_key" ON "PersonalStatus"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "AreaPersonal_nombre_key" ON "AreaPersonal"("nombre");

-- AddForeignKey
ALTER TABLE "Personal" ADD CONSTRAINT "Personal_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaPersonal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personal" ADD CONSTRAINT "Personal_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PersonalStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
