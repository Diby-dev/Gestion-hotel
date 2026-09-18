import { useState } from 'react';
import Reveal from './Reveal';
import { useModal } from '../context/ModalContext';

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const { openRdv } = useModal();

  return (
    <header className="relative w-full h-screen overflow-hidden">
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
          Votre navigateur ne peux pas supporte pas la lecture de vidéos.
        </video>
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>
      </div>

      {/* 2. Contenu global */}
      <div className="relative z-20 flex flex-col justify-between h-full p-6 md:p-10">
        
        {/* --- Navbar (Haut) --- */}
        <nav className="flex items-center justify-end w-full text-white">
          <div className="hidden md:flex items-center">
            <Reveal animation="fade-down" delay={200}>
              <ul className="flex items-center gap-8 text-sm font-medium text-slate-200">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#a-propos" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
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
          isOpen ? 'opacity-150 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        } bg-black/80 backdrop-blur-md`}>
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

          <div className="flex flex-col text-left text-xl font-medium w-full">
            <a href="#services" onClick={() => setIsOpen(false)} className="py-4 border-b border-white/10 hover:text-purple-400 transition-colors">Services</a>
            <a href="#tarifs" onClick={() => setIsOpen(false)} className="py-4 border-b border-white/10 hover:text-purple-400 transition-colors">Tarifs</a>
            <a href="#a-propos" onClick={() => setIsOpen(false)} className="py-4 border-b border-white/10 hover:text-purple-400 transition-colors">À propos</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="py-4 border-b border-white/10 hover:text-purple-400 transition-colors">Contact</a>
          </div>
        </div>

        {/* --- Centre (Modifie le -mt-[...] pour le faire monter ou descendre à ta guise) --- */}
        <div className="flex flex-col items-center text-center mb-50 md:mb-5">
          
          <Reveal animation="fade-up" delay={300}>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
              Hôtel<span className="text-orange-500">Soft</span>
            </div>
          </Reveal>

          <Reveal animation="fade-up" delay={400}>
            <h1 className="text-3xl sm:text-4xl md:text-4xl text-white font-bold tracking-tight max-w-4xl !m-0 !mb-4">
              Trouvez la chambre parfaite<br />À Abidjan
            </h1>
          </Reveal>

          <Reveal animation="fade-up" delay={550}>
            <p className="text-base md:text-sm text-slate-200 font-medium tracking-wide mb-8 max-w-xl">
              Des chambres d'hôtel confortables, qui conviennent à vos besoins, à des prix réduits
            </p>
          </Reveal>

          <Reveal animation="zoom-in" delay={700}>
            <button 
              onClick={() => openRdv()}
              className="group inline-flex items-center gap-3 bg-black text-white hover:bg-neutral-900 font-bold px-8 py-4 rounded-lg text-base transition-all shadow-2xl border border-white/20 hover:scale-105 cursor-pointer"
            >
              <span>Réserver une chambre</span>
            </button>
          </Reveal>
        </div>

        {/* Espace vide invisible pour équilibrer le flex justify-between et garder le centre propre */}
        <div className="hidden md:block"></div>
      </div>
    </header>
  );
}