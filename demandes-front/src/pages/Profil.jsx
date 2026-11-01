import keycloak from '../keycloak.js';
import { profil, utilisateur } from '../api.js';
import { ErrorBox, LoadState, PageHeader, dateFr, roleLabel, useLoad } from '../components/ui.jsx';

export default function Profil() {
  const user = utilisateur();
  const state = useLoad(profil, []);

  return (
    <>
      <PageHeader eyebrow="PARAMÈTRES DU COMPTE" title="Mon profil"
                  description="Informations issues de votre jeton et de GET /api/profil." />
      <div className="profile-grid">
        <section className="card form-card">
          <h3>Compte Keycloak</h3>
          <p className="muted">Données renvoyées par le serveur à partir du JWT.</p>
          <LoadState loading={state.loading} error={null} reload={state.reload} />
          <ErrorBox error={state.error} />
          {state.data && (
            <div className="detail-summary"><dl>
              <dt>Identifiant (sub)</dt><dd className="owner">{state.data.id}</dd>
              <dt>Nom d’utilisateur</dt><dd>{state.data.username}</dd>
              <dt>Nom complet</dt><dd>{user.nom}</dd>
              <dt>Email</dt><dd>{user.email || '-'}</dd>
            </dl></div>
          )}
        </section>
        <section className="card form-card">
          <h3>Rôles et session</h3>
          <p className="muted">Les rôles sont lus dans realm_access.roles.</p>
          <div className="roles">
            {user.roles.map((r) => <span key={r} className="role-badge">{roleLabel[r]} ({r})</span>)}
          </div>
          <div className="detail-summary"><dl>
            <dt>Émetteur (iss)</dt><dd>{user.iss}</dd>
            <dt>Émis le (iat)</dt><dd>{dateFr(user.iat)}</dd>
            <dt>Expire le (exp)</dt><dd>{dateFr(user.exp)}</dd>
          </dl></div>
          <p className="muted" style={{ marginTop: 20 }}>Le jeton reste en mémoire : ne le copiez jamais dans localStorage.</p>
          <button className="button secondary"
                  onClick={() => keycloak.logout({ redirectUri: 'http://localhost:5173/' })}>
            Se déconnecter
          </button>
        </section>
      </div>
    </>
  );
}
