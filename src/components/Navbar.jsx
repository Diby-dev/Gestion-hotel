import { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";

export default function Navbar({ alwaysVisible = false }) {
  const [showNavbar, setShowNavbar] = useState(alwaysVisible);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { navigate, showToast } = useModal();

  useEffect(() => {
    const checkUser = () => {
      try {
        const raw = localStorage.getItem('user');
        setCurrentUser(raw ? JSON.parse(raw) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    checkUser();

    const handleScroll = () => {
      if (alwaysVisible || window.scrollY > 400) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", checkUser);
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, [alwaysVisible]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    showToast('Vous avez été déconnecté avec succès.', 'info');
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        (showNavbar || alwaysVisible)
          ? "translate-y-0 opacity-100 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Nom de la marque */}
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 text-left"
        >
          <span className="w-3 h-3 rounded-full bg-green-600 animate-pulse"></span>
          Grand<span className="text-orange-500">H</span>
        </button>

        {/* Liens de navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-800">
          <a href="/#accueil" className="hover:text-green-600 transition-colors">Accueil</a>
          <a href="/#chambres" className="hover:text-green-600 transition-colors">Hôtels & Chambres</a>
          <a href="/#services" className="hover:text-green-600 transition-colors">Services</a>
          
          {/* Liens rapides vers les tableaux de bord */}
          <button
            onClick={() => navigate('/client/tableau-de-bord')}
            className="flex items-center gap-1.5 text-green-700 hover:text-green-800 font-semibold px-2.5 py-1 rounded-lg hover:bg-green-50 transition"
          >
            <span>👤</span>
            <span>Espace Client</span>
          </button>
          <button
            onClick={() => navigate('/proprietaire/tableau-de-bord')}
            className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-orange-50 transition"
          >
            <span>🏨</span>
            <span>Espace Pro</span>
          </button>
        </nav>

        {/* Bouton d'action / Profil connecté (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'admin' || currentUser.role === 'gerant') {
                    navigate('/proprietaire/tableau-de-bord');
                  } else if (currentUser.role === 'super_admin') {
                    navigate('/super-admin/tableau-de-bord');
                  } else {
                    navigate('/client/tableau-de-bord');
                  }
                }}
                className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-full transition shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span>{currentUser.prenom || currentUser.nom || 'Mon Espace'}</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  {currentUser.role === 'admin' ? 'Pro' : 'Client'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                title="Se déconnecter"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/connexion')}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer rounded-full"
              >
                Se connecter
              </button>
            </div>
          )}
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
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 py-6 px-6 flex flex-col gap-3 shadow-2xl animate-fadeIn text-white">
          <a
            href="/#accueil"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Accueil
          </a>
          <a
            href="/#chambres"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-200 hover:text-green-400 text-base font-medium py-2 border-b border-slate-800"
          >
            Hôtels & Chambres
          </a>

          {/* Raccourcis Tableaux de bord */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/client/tableau-de-bord');
            }}
            className="flex items-center gap-2 text-left py-2 text-green-400 font-semibold border-b border-slate-800"
          >
            <span>👤</span>
            <span>Mon Espace Client (Tableau de bord)</span>
          </button>
          
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/proprietaire/tableau-de-bord');
            }}
            className="flex items-center gap-2 text-left py-2 text-orange-400 font-semibold border-b border-slate-800"
          >
            <span>🏨</span>
            <span>Espace Propriétaire (Tape Chart & Prix)</span>
          </button>

          {currentUser ? (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Connecté : <strong>{currentUser.prenom || currentUser.nom}</strong>
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs text-red-400 font-bold hover:underline"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/connexion');
              }}
              className="mt-2 w-full text-center py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              Se connecter
            </button>
          )}
        </div>
      )}
    </header>
  );
}
