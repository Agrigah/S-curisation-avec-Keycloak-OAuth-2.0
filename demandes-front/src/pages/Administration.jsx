import { useState } from 'react';
import { changerStatut, listerToutes, utilisateur } from '../api.js';
import Icon from '../components/Icon.jsx';
import { DemandeTable, ErrorBox, LoadState, PageHeader, statutLabel, useLoad } from '../components/ui.jsx';

export default function Administration() {
  const user = utilisateur();
  const state = useLoad(() => (user.isAdmin ? listerToutes() : Promise.resolve([])), []);
  const [statut, setStatut] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Affichage seulement : la vraie protection est assuree par Spring Security (403).
  if (!user.isAdmin) {
    return (
      <>
        <PageHeader eyebrow="ACCÈS RESTREINT" title="Administration" description="Cet espace est réservé au rôle ADMIN." />
        <div className="notice error"><Icon name="lock" />Vous n’avez pas les droits nécessaires.</div>
      </>
    );
  }

  async function onStatut(id, nouveau) {
    setBusyId(id); setError(null); setMessage(null);
    try {
      await changerStatut(id, nouveau);
      setMessage(`Demande ${nouveau === 'VALIDEE' ? 'validée' : 'refusée'}.`);
      state.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusyId(null);
    }
  }

  const items = (state.data || []).filter((d) => !statut || d.statut === statut).sort((a, b) => b.id - a.id);

  return (
    <>
      <PageHeader eyebrow="ESPACE ADMINISTRATEUR" title="Toutes les demandes"
                  description="Consultez toutes les demandes et modifiez leur statut." />
      <ErrorBox error={error} />
      {message && <div className="notice success" role="status"><Icon name="check" />{message}</div>}
      <section className="card">
        <div className="filters">
          <label>
            <span className="sr-only">Statut</span>
            <select value={statut} onChange={(e) => setStatut(e.target.value)}>
              <option value="">Tous les statuts</option>
              {Object.entries(statutLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
        <LoadState {...state} />
        {!state.loading && !state.error && <DemandeTable demandes={items} onStatut={onStatut} busyId={busyId} />}
        {!state.loading && !state.error && <div className="table-footer">{items.length} demande(s) affichée(s)</div>}
      </section>
    </>
  );
}
