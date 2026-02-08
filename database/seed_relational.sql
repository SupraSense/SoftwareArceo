\c software_arceo_db

-- ClientStatus
CREATE TABLE IF NOT EXISTS "ClientStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "ClientStatus_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ClientStatus_name_key" ON "ClientStatus"("name");

INSERT INTO "ClientStatus" ("id", "name") VALUES
('status-activo-uuid', 'Activo'),
('status-inactivo-uuid', 'Inactivo')
ON CONFLICT ("name") DO NOTHING;

-- Client
CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Client_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ClientStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Client_cuit_key" ON "Client"("cuit");

-- ClientContact
CREATE TABLE IF NOT EXISTS "ClientContact" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Contract
CREATE TABLE IF NOT EXISTS "Contract" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert Clients and Relations
-- YPF
INSERT INTO "Client" ("id", "razonSocial", "cuit", "direccion", "statusId") VALUES
('client-ypf-uuid', 'YPF S.A.', '30-54668997-9', 'Macacha Güemes 515, CABA', 'status-activo-uuid')
ON CONFLICT ("cuit") DO NOTHING;

INSERT INTO "ClientContact" ("id", "clientId", "name", "phone", "email") VALUES
('contact-ypf-1', 'client-ypf-uuid', 'Juan Pérez', '+54 11 5466 8997', 'juan.perez@ypf.com')
ON CONFLICT DO NOTHING;

INSERT INTO "Contract" ("id", "clientId", "isActive") VALUES
('contract-ypf-1', 'client-ypf-uuid', true),
('contract-ypf-2', 'client-ypf-uuid', true),
('contract-ypf-3', 'client-ypf-uuid', true)
ON CONFLICT DO NOTHING;

-- Shell
INSERT INTO "Client" ("id", "razonSocial", "cuit", "direccion", "statusId") VALUES
('client-shell-uuid', 'Shell Argentina S.A.', '30-50003815-4', 'Av. Roque Sáenz Peña 788, CABA', 'status-activo-uuid')
ON CONFLICT ("cuit") DO NOTHING;

INSERT INTO "ClientContact" ("id", "clientId", "name", "phone", "email") VALUES
('contact-shell-1', 'client-shell-uuid', 'Maria González', '+54 11 5000 3815', 'maria.gonzalez@shell.com')
ON CONFLICT DO NOTHING;

INSERT INTO "Contract" ("id", "clientId", "isActive") VALUES
('contract-shell-1', 'client-shell-uuid', true),
('contract-shell-2', 'client-shell-uuid', true)
ON CONFLICT DO NOTHING;

-- Total
INSERT INTO "Client" ("id", "razonSocial", "cuit", "direccion", "statusId") VALUES
('client-total-uuid', 'Total Austral S.A.', '30-62605802-9', 'Moreno 877, CABA', 'status-activo-uuid')
ON CONFLICT ("cuit") DO NOTHING;

INSERT INTO "ClientContact" ("id", "clientId", "name", "phone", "email") VALUES
('contact-total-1', 'client-total-uuid', 'Carlos Rodríguez', '+54 11 6260 5802', 'carlos.rodriguez@total.com')
ON CONFLICT DO NOTHING;

INSERT INTO "Contract" ("id", "clientId", "isActive") VALUES
('contract-total-1', 'client-total-uuid', true)
ON CONFLICT DO NOTHING;
