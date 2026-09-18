import { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openRdv } = useModal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        showNavbar
          ? "translate-y-0 opacity-100 bg-slate-50 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Logo / Nom de la marque */}
        <a href="#" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-900 animate-pulse"></span>
          Ismo<span className="text-blue-700">Maintenance</span>
        </a>

        {/* Liens de navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-900">
          <a href="#" className="hover:text-blue-900 transition-colors">Accueil</a>
          <a href="#a-propos" className="hover:text-blue-900 transition-colors">À propos</a>
          <a href="#services" className="hover:text-blue-900 transition-colors">Services</a>
          <a href="#tarifs" className="hover:text-blue-900 transition-colors">Tarifs</a>
          <a href="#contact" className="hover:text-blue-900 transition-colors">Contact</a>
        </nav>

        {/* Bouton d'action / RDV (Desktop) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => openRdv()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md cursor-pointer rounded-full"
          >
            Prendre rendez-vous
          </button>
        </div>

        {/* Bouton Burger (Mobile) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-900 hover:text-slate-700 focus:outline-none p-2"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Mobile Déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 py-6 px-6 flex flex-col gap-4 shadow-2xl animate-fadeIn">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-purple-400 text-base font-medium py-2 border-b border-slate-900"
          >
            Accueil
          </a>
          <a
            href="#a-propos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-purple-400 text-base font-medium py-2 border-b border-slate-900"
          >
            À propos
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-purple-400 text-base font-medium py-2 border-b border-slate-900"
          >
            Services
          </a>
          <a
            href="#tarifs"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-purple-400 text-base font-medium py-2 border-b border-slate-900"
          >
            Tarifs
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-purple-400 text-base font-medium py-2 border-b border-slate-900"
          >
            Contact
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openRdv();
            }}
            className="mt-2 w-full text-center py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-md cursor-pointer"
          >
            Prendre rendez-vous
          </button>
        </div>
      )}
    </header>
  );
}