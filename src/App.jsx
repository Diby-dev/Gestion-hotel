import Hero from './components/Hero';
import CommuneSearch from './components/CommuneSearch';
import SidebarreZonne from './components/SidebarreZonne';
import PourquoiNous from './components/PourquoiNous';
import Stat from './components/Stat';
import Avis from './components/Avis';
import Partennaire from './components/Patennaire';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Modals et Notifications
import { ModalProvider } from './context/ModalContext';
import ToastContainer from './components/ToastContainer';
import LoginPage from './components/LoginPage';
import BookingPage from './components/BookingPage';
import SignUpPage from './components/SignUpPage';
import { useEffect, useState } from 'react';

function AppContent() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  if (path === '/connexion' || path === '/inscription' || path.startsWith('/reservation/')) {
    const page = path === '/connexion' ? <LoginPage /> : path === '/inscription' ? <SignUpPage /> : <BookingPage hotelId={path.split('/').pop()} />;
    return <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col"><Navbar alwaysVisible /><div className="grow">{page}</div><Footer /><ToastContainer /></div>;
  }
  return <>
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="grow"><Hero /><Stat /><CommuneSearch /><SidebarreZonne /><PourquoiNous /><Avis /><Partennaire /></main>
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
