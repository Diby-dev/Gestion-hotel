import Reveal from './Reveal';
import { useModal } from '../context/ModalContext';

export default function Footer() {
  const { navigate } = useModal();
  return (
    <footer id="contact" className="w-full bg-neutral-950 text-slate-300 border-t border-white/10 pt-16 pb-12 scroll-mt-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Grille principale du footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Colonne 1 : Logo & Description - vient de la gauche */}
          <Reveal animation="fade-right" duration={700} className="lg:col-span-2 space-y-4">
            <div className="text-2xl font-bold tracking-tight text-white">
              Grand<span className="text-orange-500">H</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Le 1er réseau hôtelier et de résidences meublées en Côte d'Ivoire. Simplifiez vos réservations et gérez vos séjours en toute sérénité à Abidjan.
            </p>
            <div className="text-sm text-slate-400">
              <p>Yopougon, Abidjan, Côte d'Ivoire</p>
              <p>Contact : +225 XX XX XX XX XX</p>
            </div>
          </Reveal>

          {/* Colonne 2 : Navigation rapide - vient du bas */}
          <Reveal animation="fade-up" delay={100} duration={700} className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#accueil" className="hover:text-orange-500 transition-colors">Accueil</a></li>
              <li><a href="/#services" className="hover:text-orange-500 transition-colors">Services</a></li>
              <li><a href="/#tarifs" className="hover:text-orange-500 transition-colors">Tarifs</a></li>
              <li><a href="/#a-propos" className="hover:text-orange-500 transition-colors">À propos</a></li>
            </ul>
          </Reveal>

          {/* Colonne 3 : Espace Partenaires - vient du bas */}
          <Reveal animation="fade-up" delay={200} duration={700} className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Espace Pro</h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => navigate('/connexion')} className="hover:text-orange-500 transition-colors">Devenir partenaire</button></li>
              <li><a href="/#chambres" className="hover:text-orange-500 transition-colors">Voir la démo</a></li>
              <li><button onClick={() => navigate('/connexion')} className="hover:text-orange-500 transition-colors">Espace propriétaire</button></li>
              <li><a href="/#contact" className="hover:text-orange-500 transition-colors">Support technique</a></li>
            </ul>
          </Reveal>

          {/* Colonne 4 : Légal & Confidentialité - vient de la droite */}
          <Reveal animation="fade-left" delay={300} duration={700} className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Légal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#mentions" className="hover:text-orange-500 transition-colors">Mentions légales</a></li>
              <li><a href="#confidentialite" className="hover:text-orange-500 transition-colors">Politique de confidentialité</a></li>
              <li><a href="#cgu" className="hover:text-orange-500 transition-colors">Conditions Générales (CGU)</a></li>
            </ul>
          </Reveal>

        </div>

        {/* Bas de page : Copyright et Réseaux sociaux */}
        <Reveal animation="fade" delay={400} duration={700} className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Grand H. Tous droits réservés.</p>
          
          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#facebook" aria-label="Facebook" className="hover:text-orange-500 transition-colors">
              Facebook
            </a>
            <a href="#instagram" aria-label="Instagram" className="hover:text-orange-500 transition-colors">
              Instagram
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="hover:text-orange-500 transition-colors">
              LinkedIn
            </a>
            <a href="#twitter" aria-label="Twitter" className="hover:text-orange-500 transition-colors">
              Twitter
            </a>
          </div>
        </Reveal>

      </div>
    </footer>
  );
}
