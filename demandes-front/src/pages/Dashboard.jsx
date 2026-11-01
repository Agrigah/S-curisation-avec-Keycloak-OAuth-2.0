import { Link } from 'react-router-dom';
import { listerMesDemandes, listerToutes, utilisateur } from '../api.js';
import Icon from '../components/Icon.jsx';
import { DemandeTable, LoadState, PageHeader, statutLabel, useLoad } from '../components/ui.jsx';

export default function Dashboard() {
  const user = utilisateur();
  const state = useLoad(() => (user.isAdmin ? listerToutes() : listerMesDemandes()), []);
  const items = state.data || [];
  const count = (s) => items.filter((d) => d.statut === s).length;
  const metrics = [
    [user.isAdmin ? 'Toutes les demandes' : 'Mes demandes', items.length, 'ticket'],
    ['En attente', count('EN_ATTENTE'), 'clock'],
    ['Validées', count('VALIDEE'), 'check'],
    ['Refusées', count('REFUSEE'), 'alert']
  ];
  const recentes = [...items].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <>
      <PageHeader eyebrow="VOTRE CENTRE DE CONTRÔLE" title={`Bonjour, ${user.nom.split(' ')[0]}.`}
                  description="Une vue claire sur les demandes. Les bonnes actions, au bon moment.">
        <Link className="button" to="/demandes/new"><Icon name="plus" />Nouvelle demande</Link>
      </PageHeader>
      <LoadState {...state} />
      {!state.loading && !state.error && (
        <>
          <div className="overview-banner">
            <div>
              <span className="banner-tag"><span className="live-dot" /> LE POINT SUR VOTRE ACTIVITÉ</span>
              <h2>{user.isAdmin ? 'Gardez une longueur d’avance.' : 'Vos demandes, au même endroit.'}</h2>
              <p>{user.isAdmin
                ? `${count('EN_ATTENTE')} demande(s) en attente de décision. Validez ou refusez depuis l’espace d’administration.`
                : 'Créez une demande et suivez son avancement jusqu’à la décision de l’administrateur.'}</p>
              <Link to={user.isAdmin ? '/admin' : '/demandes'}>
                {user.isAdmin ? 'Ouvrir l’administration' : 'Consulter mes demandes'} <Icon name="arrow" size={17} />
              </Link>
            </div>
            <div className="banner-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="shield-art"><Icon name="shield" size={70} /></div>
              <span className="floating-check"><Icon name="check" size={18} /></span>
            </div>
          </div>

          <div className="stats-grid">
            {metrics.map(([label, value, icon], idx) => (
              <div className="stat-card" key={label}>
                <div className="stat-top"><span>{label}</span><span className={`stat-icon tone-${idx}`}><Icon name={icon} /></span></div>
                <strong>{value}<span>{idx === 0 ? 'au total' : 'demandes'}</span></strong>
              </div>
            ))}
          </div>

          <div className="dashboard-middle">
            <section className="card status-card">
              <div className="card-heading"><h3>Répartition des demandes</h3><span className="muted">{items.length} au total</span></div>
              <div className="segmented-bar">
                {Object.keys(statutLabel).map((s) => count(s) > 0 &&
                  <span key={s} className={s} style={{ flex: count(s) }} title={`${statutLabel[s]} : ${count(s)}`} />)}
              </div>
              <div className="status-legend">
                {Object.entries(statutLabel).map(([s, label]) =>
                  <div key={s}><i className={s} /><span>{label}</span><strong>{count(s)}</strong></div>)}
              </div>
            </section>
            <section className="card quick-card">
              <div className="eyebrow">{user.isAdmin ? 'VOS DROITS' : 'BON À SAVOIR'}</div>
              <h3>{user.isAdmin ? 'Rôles : USER et ADMIN' : 'Un suivi à chaque étape'}</h3>
              <p>{user.isAdmin
                ? 'Vous pouvez consulter toutes les demandes et modifier leur statut. Ces droits sont contrôlés par Spring Security.'
                : 'Une demande est « en attente » jusqu’à ce qu’un administrateur la valide ou la refuse.'}</p>
              <Link to={user.isAdmin ? '/admin' : '/demandes'}>
                {user.isAdmin ? 'Gérer les demandes' : 'Voir le suivi'}<Icon name="arrow" size={17} />
              </Link>
            </section>
          </div>

          <section className="card">
            <div className="card-heading">
              <div><h3>Dernières demandes</h3><p>Les demandes les plus récentes de votre espace.</p></div>
              <Link to={user.isAdmin ? '/admin' : '/demandes'} className="text-link">Tout voir <Icon name="arrow" size={16} /></Link>
            </div>
            <DemandeTable demandes={recentes} />
          </section>
        </>
      )}
    </>
  );
}
