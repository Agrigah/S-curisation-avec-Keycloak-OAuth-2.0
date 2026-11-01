import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

export const roleLabel = { USER: 'Utilisateur', ADMIN: 'Administrateur' };
export const statutLabel = { EN_ATTENTE: 'En attente', VALIDEE: 'Validée', REFUSEE: 'Refusée' };
export const reference = (id) => `DEM-${String(id).padStart(4, '0')}`;
export const dateFr = (sec) =>
  sec ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(sec * 1000)) : '-';

export function Badge({ value }) {
  return <span className={`badge ${value}`}><span />{statutLabel[value] || value}</span>;
}

export function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div className="notice error" role="alert">
      <Icon name="alert" />{typeof error === 'string' ? error : error.message}
    </div>
  );
}

export function PageHeader({ eyebrow = 'ESPACE DE TRAVAIL', title, description, children }) {
  return (
    <div className="page-heading">
      <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
      {children}
    </div>
  );
}

export function Empty({ title = 'Aucune demande', description = 'Les nouvelles demandes apparaîtront ici.' }) {
  return <div className="empty"><Icon name="ticket" size={34} /><h3>{title}</h3><p>{description}</p></div>;
}

export function useLoad(loader, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let live = true;
    setLoading(true); setError(null);
    loader().then((d) => { if (live) setData(d); })
      .catch((e) => { if (live) setError(e); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [...deps, revision]);
  return { data, error, loading, reload: () => setRevision((r) => r + 1) };
}

export function LoadState({ loading, error, reload }) {
  if (loading) return <div className="loading"><span className="spinner" />Chargement…</div>;
  if (error) return <><ErrorBox error={error} /><button className="button secondary" onClick={reload}>Réessayer</button></>;
  return null;
}

/** Tableau des demandes. Si `onStatut` est fourni (espace admin), affiche Valider / Refuser. */
export function DemandeTable({ demandes, onStatut, busyId }) {
  if (!demandes.length) return <Empty />;
  const admin = !!onStatut;
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Demande</th>
            {admin && <th>Propriétaire</th>}
            <th>Statut</th>
            {admin && <th><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {demandes.map((d) => (
            <tr key={d.id}>
              <td>
                <div className="incident-title">
                  <span className="incident-id">{reference(d.id)}</span>{d.objet}
                </div>
              </td>
              {admin && <td className="owner" title={d.owner}>{d.owner.slice(0, 8)}…</td>}
              <td><Badge value={d.statut} /></td>
              {admin && (
                <td>
                  <div className="row-actions">
                    {d.statut !== 'VALIDEE' && (
                      <button className="button small" disabled={busyId === d.id}
                              onClick={() => onStatut(d.id, 'VALIDEE')}>
                        <Icon name="check" size={14} />Valider
                      </button>
                    )}
                    {d.statut !== 'REFUSEE' && (
                      <button className="button small danger" disabled={busyId === d.id}
                              onClick={() => onStatut(d.id, 'REFUSEE')}>
                        <Icon name="x" size={14} />Refuser
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
