import { useState } from 'react';
import Reveal from './Reveal';
import { useModal } from '../context/ModalContext';

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const { navigate } = useModal();

  return (
    <header id="accueil" className="relative w-full h-screen overflow-hidden">
      {/* 1. Arrière-plan Vidéo */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/header.mp4" type="video/mp4" />
          Votre navigateur ne peut pas lire cette vidéo.
        </video>
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      {/* 2. Contenu global */}
      <div className="relative z-20 flex flex-col justify-between h-full p-6 md:p-10">
        
        {/* --- Navbar (Haut) --- */}
        <nav className="flex items-center justify-between w-full text-white">
          <a href="#accueil" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Grand<span className="text-orange-500">H</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <Reveal animation="fade-down" delay={200}>
              <ul className="flex items-center gap-8 text-sm font-medium text-slate-200">
                <li><a href="#a-propos" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#chambres" className="hover:text-white transition-colors">Hôtels</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </Reveal>

            <Reveal animation="fade-down" delay={300}>
              <button
                onClick={() => navigate('/connexion')}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all cursor-pointer backdrop-blur-md"
              >
                Se connecter
              </button>
            </Reveal>
          </div>

          {/* Bouton Burger (Mobile) */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="md:hidden text-white focus:outline-none p-2 z-30 ml-auto"
            aria-label="Ouvrir le menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* --- Menu Mobile Plein Écran --- */}
        <div className={`fixed inset-0 z-50 flex flex-col p-8 text-white md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        } bg-black/90 backdrop-blur-md`}>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white p-2 focus:outline-none hover:rotate-90 transition-transform duration-300"
              aria-label="Fermer le menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col text-left text-xl font-medium w-full gap-2">
            <a href="#a-propos" onClick={() => setIsOpen(false)} className="py-3 border-b border-white/10 hover:text-green-400 transition-colors">À propos</a>
            <a href="#services" onClick={() => setIsOpen(false)} className="py-3 border-b border-white/10 hover:text-green-400 transition-colors">Services</a>
            <a href="#chambres" onClick={() => setIsOpen(false)} className="py-3 border-b border-white/10 hover:text-green-400 transition-colors">Hôtels & Chambres</a>
            <a href="#tarifs" onClick={() => setIsOpen(false)} className="py-3 border-b border-white/10 hover:text-green-400 transition-colors">Tarifs</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="py-3 border-b border-white/10 hover:text-green-400 transition-colors">Contact</a>
            
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/connexion');
              }}
              className="mt-6 w-full py-3.5 bg-green-600 text-white font-bold rounded-xl text-center cursor-pointer shadow-lg"
            >
              Se connecter
            </button>
          </div>
        </div>

        {/* --- Centre --- */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-12">
          
          <Reveal animation="fade-up" delay={300}>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
              Grand<span className="text-orange-500">H</span>
            </div>
          </Reveal>

          <Reveal animation="fade-up" delay={400}>
            <h1 className="text-3xl sm:text-5xl md:text-5xl text-white font-extrabold tracking-tight max-w-4xl m-0! mb-4! leading-tight">
              Trouvez la chambre parfaite<br />À Abidjan
            </h1>
          </Reveal>

          <Reveal animation="fade-up" delay={550}>
            <p className="text-base md:text-lg text-slate-200 font-medium tracking-wide mb-8 max-w-xl">
              Des chambres d'hôtel confortables et vérifiées, adaptées à votre budget avec acompte sécurisé.
            </p>
          </Reveal>

          {/* Bouton qui envoie directement vers la zone Hôtels et Chambres par Commune */}
          <Reveal animation="zoom-in" delay={700}>
            <a 
              href="#chambres"
              className="group inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-2xl hover:scale-105 cursor-pointer"
            >
              <span>Réserver une chambre</span>
              <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </Reveal>
        </div>

        {/* Espace bas */}
        <div className="hidden md:block"></div>
      </div>
    </header>
  );
}
