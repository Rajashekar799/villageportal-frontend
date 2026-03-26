import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ContactsPage from './pages/ContactsPage';
import ShopsPage from './pages/ShopsPage';
import GalleryPage from './pages/GalleryPage';
import ComplaintPage from './pages/ComplaintPage';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
