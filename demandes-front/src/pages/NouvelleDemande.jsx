import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { creerDemande } from '../api.js';
import Icon from '../components/Icon.jsx';
import { ErrorBox, PageHeader } from '../components/ui.jsx';

export default function NouvelleDemande() {
  const navigate = useNavigate();
  const [objet, setObjet] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      await creerDemande(objet);
      navigate('/demandes');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="NOUVELLE DEMANDE" title="Créer une demande"
                  description="Décrivez simplement l’objet de votre demande." />
      <div className="form-layout">
        <section className="card form-card">
          <ErrorBox error={error} />
          <form onSubmit={submit}>
            <label>Objet de la demande
              <textarea required rows={5} maxLength={160} value={objet} onChange={(e) => setObjet(e.target.value)}
                        placeholder="Ex. Demande d’un ordinateur portable" />
              <small>{objet.length} / 160 caractères</small>
            </label>
            <div className="form-actions">
              <Link className="button secondary" to="/demandes">Annuler</Link>
              <button className="button" disabled={busy || !objet.trim()}>
                {busy ? 'Envoi…' : 'Envoyer la demande'}<Icon name="arrow" />
              </button>
            </div>
          </form>
        </section>
        <aside className="card advice">
          <span className="stat-icon tone-3"><Icon name="shield" /></span>
          <h3>Comment ça marche ?</h3>
          <p>Votre demande est créée avec le statut « En attente ».</p>
          <hr />
          <strong>Propriété sécurisée</strong>
          <p>Le propriétaire est déterminé par le serveur à partir de votre jeton, jamais par l’application React.</p>
          <small>Un administrateur peut ensuite la valider ou la refuser.</small>
        </aside>
      </div>
    </>
  );
}
