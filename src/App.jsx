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


function App() {
  return (
    <ModalProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <Navbar />

        <main className="grow">
          <Hero />
          <Stat />
          <CommuneSearch />
          <SidebarreZonne />
          <PourquoiNous />
          <Avis />
          <Partennaire />
        </main>
        <Footer />
        
      </div>
    </ModalProvider>
  );
}

export default App;