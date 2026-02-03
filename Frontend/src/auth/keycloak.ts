import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'SoftwareArceo',
    clientId: 'sgo-frontend',
});

export default keycloak;
