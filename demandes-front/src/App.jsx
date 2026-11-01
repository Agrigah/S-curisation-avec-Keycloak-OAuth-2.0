import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MesDemandes from './pages/MesDemandes.jsx';
import NouvelleDemande from './pages/NouvelleDemande.jsx';
import Administration from './pages/Administration.jsx';
import Profil from './pages/Profil.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/demandes" element={<MesDemandes />} />
        <Route path="/demandes/new" element={<NouvelleDemande />} />
        <Route path="/admin" element={<Administration />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
