import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Modals et Notifications
import { ModalProvider } from './context/ModalContext';
import ToastContainer from './components/ToastContainer';

// Pages
import HomePage from './pages/home/page';
import LoginPage from './pages/login/page';
import SignUpPage from './pages/signup/page';
import BookingPage from './pages/booking/page';
import OwnerDashboard from './pages/dashboard/page';
import SuperAdminAuthPage from './pages/super-admin-auth/page';
import SuperAdminDashboard from './pages/super-admin-dashboard/page';

import { useEffect, useState } from 'react';

function AppContent() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  if (path === '/connexion' || path === '/inscription' || path === '/proprietaire/tableau-de-bord' || path === '/secret-administration' || path === '/super-admin/tableau-de-bord' || path.startsWith('/reservation/')) {
    const page = path === '/connexion' ? <LoginPage /> : path === '/inscription' ? <SignUpPage /> : path === '/proprietaire/tableau-de-bord' ? <OwnerDashboard /> : path === '/secret-administration' ? <SuperAdminAuthPage /> : path === '/super-admin/tableau-de-bord' ? <SuperAdminDashboard /> : <BookingPage hotelId={path.split('/').pop()} />;
    return <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col"><Navbar alwaysVisible /><div className="grow">{page}</div><Footer /><ToastContainer /></div>;
  }
  return <>
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
    <ToastContainer />
  </>;
}

function App() {
  return (
    <ModalProvider>
      <AppContent />
    </ModalProvider>
  );
}

export default App;
