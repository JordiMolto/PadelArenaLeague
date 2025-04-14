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
import NotFound from './pages/NotFound/NotFound';
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
            <Route path="reglamento" element={<Reglamento />} />
            <Route path="galeria" element={<Galeria />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 