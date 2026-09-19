import { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";

export default function Navbar({ alwaysVisible = false }) {
  const [showNavbar, setShowNavbar] = useState(alwaysVisible);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useModal();

  useEffect(() => {
    const handleScroll = () => {
      if (alwaysVisible || window.scrollY > 400) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        (showNavbar || alwaysVisible)
          ? "translate-y-0 opacity-100 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Logo / Nom de la marque */}
        <a href="/#accueil" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600 animate-pulse"></span>
          Grand<span className="text-orange-500">H</span>
        </a>

        {/* Liens de navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-800">
          <a href="/#accueil" className="hover:text-green-600 transition-colors">Accueil</a>
          <a href="/#a-propos" className="hover:text-green-600 transition-colors">À propos</a>
          <a href="/#services" className="hover:text-green-600 transition-colors">Services</a>
          <a href="/#chambres" className="hover:text-green-600 transition-colors">Hôtels & Chambres</a>
          <a href="/#tarifs" className="hover:text-green-600 transition-colors">Tarifs</a>
          <a href="/#contact" className="hover:text-green-600 transition-colors">Contact</a>
        </nav>

        {/* Bouton d'action / Se connecter (Desktop) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => navigate('/connexion')}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer rounded-full"
          >
            Se connecter
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
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 py-6 px-6 flex flex-col gap-3 shadow-2xl animate-fadeIn">
          <a
            href="#accueil"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Accueil
          </a>
          <a
            href="#a-propos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            À propos
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Services
          </a>
          <a
            href="#chambres"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Hôtels & Chambres
          </a>
          <a
            href="#tarifs"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Tarifs
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Contact
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/connexion');
            }}
            className="mt-2 w-full text-center py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Se connecter
          </button>
        </div>
      )}
    </header>
  );
}
