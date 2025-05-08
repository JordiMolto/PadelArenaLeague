import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/Dashboard/Dashboard';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import Reglamento from './pages/Reglamento/Reglamento';
import Galeria from './pages/Galeria/Galeria';
import Noticias from './pages/Noticias/Noticias';
import FAQ from './pages/FAQ/FAQ';
import Contacto from './pages/Contacto/Contacto.tsx';
import Privacidad from './pages/Privacidad/Privacidad.jsx';
import Terminos from './pages/Terminos/Terminos.jsx';
import Cookies from './pages/Cookies/Cookies.jsx';
import NotFound from './pages/NotFound/NotFound';

// Nuevas importaciones para Ligas y Placeholder
import LigaInscripcion from './pages/Ligas/LigaInscripcion.jsx';
import LigaDetail from './pages/Ligas/LigaDetail.jsx';
import LigasClasificacion from './pages/Ligas/LigasClasificacion.jsx';
import LigasEquipos from './pages/Ligas/LigasEquipos.jsx';
import LigasEncuentros from './pages/Ligas/LigasEncuentros.jsx';
import LigasResultados from './pages/Ligas/LigasResultados.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import TorneosCuadros from './pages/Torneos/TorneosCuadros.jsx';
import TorneosResultados from './pages/Torneos/TorneosResultados.jsx';

import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Rutas de Ligas */}
            <Route path="ligas/inscripcion" element={<LigaInscripcion />} />
            <Route path="ligas/clasificacion" element={<LigasClasificacion />} />
            <Route path="ligas/resultados" element={<LigasResultados />} />
            <Route path="ligas/equipos" element={<LigasEquipos />} />
            <Route path="ligas/encuentros" element={<LigasEncuentros />} />
            <Route path="ligas/:ligaId" element={<LigaDetail />} />

            {/* Rutas de Torneos */}
            {/* <Route path="torneos" element={<PlaceholderPage title="Torneos" />} /> */}
            {/* La línea anterior para /torneos la comento porque "Inscripción Torneo" es ahora el principal. 
                Si quieres una página general de torneos, puedes descomentarla y crear su componente. 
                O podrías hacer que /torneos redirija a /torneos/inscripcion si lo prefieres. */}
            <Route path="torneos/inscripcion" element={<PlaceholderPage title="Inscripción a Torneos" />} />
            <Route path="torneos/cuadros" element={<TorneosCuadros />} />
            <Route path="torneos/resultados" element={<TorneosResultados />} />
            {/* Considera una ruta para /torneos/:torneoId si vas a tener detalles de torneo */}

            {/* Otras rutas existentes */}
            <Route path="reglamento" element={<Reglamento />} />
            <Route path="galeria" element={<Galeria />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="privacidad" element={<Privacidad />} />
            <Route path="terminos" element={<Terminos />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 