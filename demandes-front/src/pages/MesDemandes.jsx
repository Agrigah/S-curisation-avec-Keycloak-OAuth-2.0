import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listerMesDemandes } from '../api.js';
import Icon from '../components/Icon.jsx';
import { DemandeTable, LoadState, PageHeader, statutLabel, useLoad } from '../components/ui.jsx';

export default function MesDemandes() {
  const state = useLoad(listerMesDemandes, []);
  const [recherche, setRecherche] = useState('');
  const [statut, setStatut] = useState('');
  const items = (state.data || [])
    .filter((d) => d.objet.toLowerCase().includes(recherche.toLowerCase()) && (!statut || d.statut === statut))
    .sort((a, b) => b.id - a.id);

  return (
    <>
      <PageHeader title="Mes demandes" description="Retrouvez vos demandes et suivez leur traitement.">
        <Link className="button" to="/demandes/new"><Icon name="plus" />Nouvelle demande</Link>
      </PageHeader>
      <section className="card">
        <div className="filters">
          <label className="search">
            <span className="sr-only">Rechercher</span><Icon name="search" size={18} />
            <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher une demande…" />
          </label>
          <label>
            <span className="sr-only">Statut</span>
            <select value={statut} onChange={(e) => setStatut(e.target.value)}>
              <option value="">Tous les statuts</option>
              {Object.entries(statutLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
        <LoadState {...state} />
        {!state.loading && !state.error && <DemandeTable demandes={items} />}
        {!state.loading && !state.error && <div className="table-footer">{items.length} demande(s) affichée(s)</div>}
      </section>
    </>
  );
}
