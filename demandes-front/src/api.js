import keycloak from './keycloak.js';

const API = 'http://localhost:8081';

export async function appelerApi(path, options = {}) {
  try {
    await keycloak.updateToken(30);
  } catch {
    // Session Keycloak expiree : on redemande une connexion.
    keycloak.login();
    throw new Error('Session expirée');
  }
  const response = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keycloak.token}`,
      ...options.headers
    }
  });
  if (!response.ok) {
    const err = new Error(
      response.status === 403 ? 'Accès refusé (HTTP 403)'
      : response.status === 401 ? 'Non authentifié (HTTP 401)'
      : `HTTP ${response.status}`
    );
    err.status = response.status;
    throw err;
  }
  return response.json();
}

export const listerMesDemandes = () => appelerApi('/api/demandes');
export const listerToutes = () => appelerApi('/api/admin/demandes');
export const profil = () => appelerApi('/api/profil');
export const creerDemande = (objet) =>
  appelerApi('/api/demandes', { method: 'POST', body: JSON.stringify({ objet }) });
export const changerStatut = (id, statut) =>
  appelerApi(`/api/admin/demandes/${id}`, { method: 'PATCH', body: JSON.stringify({ statut }) });

/** Informations lues dans le token Keycloak (decodage cote client, lecture seule). */
export function utilisateur() {
  const t = keycloak.tokenParsed || {};
  const roles = (t.realm_access?.roles || []).filter((r) => r === 'USER' || r === 'ADMIN');
  return {
    sub: t.sub,
    username: t.preferred_username || 'utilisateur',
    nom: t.name || t.preferred_username || 'Utilisateur',
    email: t.email,
    roles,
    isAdmin: roles.includes('ADMIN'),
    iss: t.iss,
    iat: t.iat,
    exp: t.exp
  };
}
