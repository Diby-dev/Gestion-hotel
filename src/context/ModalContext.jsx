import { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [rdvModal, setRdvModal] = useState({ isOpen: false, service: '' });
  const [devisModal, setDevisModal] = useState({ isOpen: false });
  const [loginModal, setLoginModal] = useState({ isOpen: false });
  const [projectModal, setProjectModal] = useState({ isOpen: false, project: null });
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: '' });
  const [toasts, setToasts] = useState([]);

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

  // Login / Suivi
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
        toasts,
        showToast,
        removeToast,
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
