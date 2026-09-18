import { useEffect, useRef, useState } from 'react';

/**
 * Composant réutilisable pour animer l'apparition des éléments au défilement (Scroll Reveal).
 * 
 * @param {'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'fade'} animation Type d'animation
 * @param {number} delay Délai en ms avant le démarrage de l'animation
 * @param {number} duration Durée en ms de la transition (défaut: 700ms)
 * @param {number} threshold Seuil de visibilité (0 à 1) pour déclencher l'animation
 * @param {string} rootMargin Marge de l'IntersectionObserver
 * @param {boolean} once Déclenche l'animation une seule fois (défaut: true)
 * @param {string} as Élément HTML à utiliser (div, span, h2, p, a, etc.)
 */
export default function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  className = '',
  as: Component = 'div',
  style = {},
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Détection immédiate si l'élément est déjà visible dans l'écran lors du chargement
    const rect = el.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInitiallyVisible) {
      const initialTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      if (once) return () => clearTimeout(initialTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold, rootMargin, once]);

  // Calcule la transformation selon le type d'animation choisi
  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';

    switch (animation) {
      case 'fade-up':
      case 'slide-up':
        return 'translate3d(0, 36px, 0)';
      case 'fade-down':
      case 'slide-down':
        return 'translate3d(0, -36px, 0)';
      case 'fade-left':
      case 'slide-left':
        // Vient de la droite et se déplace vers la gauche
        return 'translate3d(40px, 0, 0)';
      case 'fade-right':
      case 'slide-right':
        // Vient de la gauche et se déplace vers la droite
        return 'translate3d(-40px, 0, 0)';
      case 'zoom-in':
        return 'scale(0.88)';
      case 'zoom-out':
        return 'scale(1.1)';
      case 'fade':
      default:
        return 'none';
    }
  };

  const combinedStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
    ...style,
  };

  return (
    <Component
      ref={ref}
      style={combinedStyle}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
