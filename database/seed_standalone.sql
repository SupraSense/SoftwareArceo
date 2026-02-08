\c software_arceo_db

CREATE TABLE IF NOT EXISTS "TipoTarea" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    CONSTRAINT "TipoTarea_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "TipoTarea_nombre_key" ON "TipoTarea"("nombre");

INSERT INTO "TipoTarea" ("nombre") VALUES
('Entrega'),
('Devolución'),
('DTM'),
('Cambio'),
('Taller móvil'),
('Mantenimiento preventivo')
ON CONFLICT ("nombre") DO NOTHING;
