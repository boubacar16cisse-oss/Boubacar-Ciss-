import React from 'react';
import { Phone, Mail, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-650 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-orange-500/25">
                O
              </div>
              <span className="font-bold text-xl text-white font-display tracking-wide">
                OZzo Group
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Une synergie créative unissant le design de marque de haut niveau, l'événementiel d'envergure, et une billetterie technologique ultra-sécurisée.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck size={16} />
              <span>Système Certifié & Sécurisé</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Plateformes
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  id="footer-link-design"
                  onClick={() => setActiveTab('design')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  OZzo Design
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-events"
                  onClick={() => setActiveTab('events')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  OZzo Events
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-tickets"
                  onClick={() => setActiveTab('tickets')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  N'KA TICKET
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-contact"
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Formulaire de contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Contacts Directs
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-zinc-500" />
                <a href="tel:71156304" className="hover:text-white transition-colors">
                  71156304
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare size={16} className="text-emerald-500" />
                <a 
                  href="https://wa.me/22671156304" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>71156304</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">WhatsApp</span>
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-zinc-500" />
                <a href="mailto:boubacar16cisse@gmail.com" className="hover:text-white transition-colors">
                  boubacar16cisse@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Core Values */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Engagement
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Nous concevons des solutions numériques et événementielles sur mesure avec une sécurité de bout en bout. Zéro faux billet, zéro compromis sur la qualité graphique.
            </p>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-600">
          <p>© {currentYear} OZzo Group. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <span>Développé pour Boubacar Cissé</span>
            <span>Sécurité Cryptographique N'KA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
