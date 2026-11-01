import { NavLink, Outlet } from 'react-router-dom';
import keycloak from '../keycloak.js';
import { utilisateur } from '../api.js';
import Icon from './Icon.jsx';
import { roleLabel } from './ui.jsx';

export default function Layout() {
  const user = utilisateur();
  const principal = user.isAdmin ? 'ADMIN' : 'USER';
  const initiales = user.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand-mark"><Icon name="shield" size={27} /></span>
          <span>demandes<span className="brand-dot">.</span></span>
        </NavLink>
        <div className="workspace-label">ESPACE DE TRAVAIL</div>
        <nav aria-label="Navigation principale">
          <NavLink to="/" end><Icon name="grid" />Vue d'ensemble</NavLink>
          <NavLink to="/demandes" end><Icon name="ticket" />Mes demandes</NavLink>
          <NavLink to="/demandes/new"><Icon name="plus" />Nouvelle demande</NavLink>
          {user.isAdmin && <NavLink to="/admin"><Icon name="users" />Administration</NavLink>}
          <NavLink to="/profil"><Icon name="user" />Mon profil</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="security-note">
            <Icon name="shield" />
            <div><strong>Un espace sécurisé</strong><p>Authentification OpenID Connect.</p></div>
          </div>
          <div className="sidebar-user">
            <div className="avatar">{initiales}</div>
            <div><strong>{user.nom}</strong><small>{roleLabel[principal]}</small></div>
            <button className="icon-button" aria-label="Se déconnecter" title="Se déconnecter"
                    onClick={() => keycloak.logout({ redirectUri: 'http://localhost:5173/' })}>
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <span>Centre de gestion des demandes</span>
          <div><span className="live-dot" /> Espace {roleLabel[principal].toLowerCase()}
            <span className="top-avatar">{initiales[0]}</span></div>
        </header>
        <main id="main-content"><Outlet /></main>
        <footer>Gestion des demandes · Keycloak + Spring Boot + React<span>OAuth 2.0 · OpenID Connect · PKCE</span></footer>
      </div>
    </div>
  );
}
