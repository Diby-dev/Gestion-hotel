import { useState, useEffect, useRef } from 'react';
import Reveal from './Reveal';

// Composant pour animer un chiffre de 0 jusqu'à la valeur cible
function Counter({ end, duration = 4000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={nodeRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stat() {
  return (
    <section id="a-propos" className="relative py-20 px-4 md:px-8 overflow-hidden scroll-mt-12">
      
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/stat.jpg" 
          alt="Fond Statistiques GrandH" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <Reveal animation="fade-down" duration={600}>
          <div className="text-white text-2xl md:text-3xl pb-10 font-bold">Nos chiffres</div>
        </Reveal>
        
        {/* Grille des 3 blocs de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bloc 1 : vient de la gauche */}
          <Reveal animation="fade-right" delay={100} duration={700}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-2 text-center max-w-xs mx-auto w-full transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                <Counter end={120} suffix="+" />
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-200">
                Hôtels référencés à Abidjan
              </p>
            </div>
          </Reveal>

          {/* Bloc 2 : vient du bas */}
          <Reveal animation="fade-up" delay={250} duration={700}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-2 text-center max-w-xs mx-auto w-full transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                <Counter end={4500} suffix="+" />
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-200">
                Clients satisfaits
              </p>
            </div>
          </Reveal>

          {/* Bloc 3 : vient de la droite */}
          <Reveal animation="fade-left" delay={400} duration={700}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-2 text-center max-w-xs mx-auto w-full transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                <Counter end={6800} suffix="+" />
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-200">
                Réservations validées
              </p>
            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}