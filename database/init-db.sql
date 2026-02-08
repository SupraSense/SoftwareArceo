-- Base de datos para la Autenticación (Keycloak)
CREATE DATABASE keycloak_db;

-- Base de datos para el Negocio (SoftwareArceo - SGO)
CREATE DATABASE software_arceo_db;

-- Si el usuario no es 'postgres', asegúrate de darle permisos
GRANT ALL PRIVILEGES ON DATABASE software_arceo_db TO ${POSTGRES_USER};