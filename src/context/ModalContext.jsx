import { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [rdvModal, setRdvModal] = useState({ isOpen: false, service: '' });
  const [devisModal, setDevisModal] = useState({ isOpen: false });
  const [loginModal, setLoginModal] = useState({ isOpen: false });
  const [projectModal, setProjectModal] = useState({ isOpen: false, project: null });
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: '' });
  const [hotelModal, setHotelModal] = useState({ isOpen: false, hotel: null });
  const [toasts, setToasts] = useState([]);

  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  // Toasts
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // RDV
  const openRdv = useCallback((service = '') => {
    setRdvModal({ isOpen: true, service });
  }, []);
  const closeRdv = useCallback(() => {
    setRdvModal({ isOpen: false, service: '' });
  }, []);

  // Devis
  const openDevis = useCallback(() => {
    setDevisModal({ isOpen: true });
  }, []);
  const closeDevis = useCallback(() => {
    setDevisModal({ isOpen: false });
  }, []);

  // Login
  const openLogin = useCallback(() => {
    setLoginModal({ isOpen: true });
  }, []);
  const closeLogin = useCallback(() => {
    setLoginModal({ isOpen: false });
  }, []);

  // Project details
  const openProject = useCallback((project) => {
    setProjectModal({ isOpen: true, project });
  }, []);
  const closeProject = useCallback(() => {
    setProjectModal({ isOpen: false, project: null });
  }, []);

  // Mentions Légales
  const openLegal = useCallback((type) => {
    setLegalModal({ isOpen: true, type });
  }, []);
  const closeLegal = useCallback(() => {
    setLegalModal({ isOpen: false, type: '' });
  }, []);

  // Hotel details / Réservation
  const openHotel = useCallback((hotel) => {
    setHotelModal({ isOpen: true, hotel });
  }, []);
  const closeHotel = useCallback(() => {
    setHotelModal({ isOpen: false, hotel: null });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        rdvModal,
        openRdv,
        closeRdv,
        devisModal,
        openDevis,
        closeDevis,
        loginModal,
        openLogin,
        closeLogin,
        projectModal,
        openProject,
        closeProject,
        legalModal,
        openLegal,
        closeLegal,
        hotelModal,
        openHotel,
        closeHotel,
        toasts,
        showToast,
        removeToast,
        navigate,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal doit être utilisé à l\'intérieur de ModalProvider');
  }
  return context;
}
