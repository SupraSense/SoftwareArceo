#!/bin/bash

# 1. Autenticación como admin
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user $KEYCLOAK_ADMIN --password $KEYCLOAK_ADMIN_PASSWORD

# 2. Creación del Realm
/opt/keycloak/bin/kcadm.sh create realms -s realm=SoftwareArceo -s enabled=true

# 3. Creación de Roles según SGO
/opt/keycloak/bin/kcadm.sh create roles -r SoftwareArceo -s name=admin
/opt/keycloak/bin/kcadm.sh create roles -r SoftwareArceo -s name=coordinador
/opt/keycloak/bin/kcadm.sh create roles -r SoftwareArceo -s name=chofer
/opt/keycloak/bin/kcadm.sh create roles -r SoftwareArceo -s name=taller_movil