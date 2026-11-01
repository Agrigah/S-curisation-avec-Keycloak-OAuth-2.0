import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import keycloak from './keycloak.js';
import './styles.css';

const root = document.getElementById('root');

keycloak.init({
  onLoad: 'login-required',
  pkceMethod: 'S256',
  checkLoginIframe: false
}).then(() => {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Erreur de connexion Keycloak', error);
  root.textContent = 'Impossible de se connecter au serveur Keycloak.';
});
