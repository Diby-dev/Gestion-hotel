import Hero from './components/Hero';

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
          
        </main>

       
      </div>
    </ModalProvider>
  );
}

export default App;