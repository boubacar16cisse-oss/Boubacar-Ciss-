import React, { useState } from 'react';
import { useStore } from '../store';
import { Service } from '../types';
import { Sparkles, FileText, Send, HelpCircle, Info, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OzzoDesignView: React.FC = () => {
  const { services, requestQuote } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Quote form states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '50 000 CFA - 150 000 CFA',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const publishedServices = services.filter(s => s.isPublished);

  const categories = [
    { id: 'all', label: 'Tous les services' },
    { id: 'Design Graphique', label: 'Design Graphique' },
    { id: 'Branding', label: 'Branding & Identité' },
    { id: 'Développement Web', label: 'Web & App' },
    { id: 'Production Vidéo', label: 'Vidéo & Motion' },
    { id: 'Impression', label: 'Impression Physique' }
  ];

  const filteredServices = activeCategory === 'all'
    ? publishedServices
    : publishedServices.filter(s => s.category === activeCategory);

  const handleQuoteClick = (srv: Service) => {
    setSelectedService(srv);
    setShowQuoteModal(true);
    setSuccessMsg('');
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !quoteForm.name || !quoteForm.email || !quoteForm.description) return;

    setIsSubmitting(true);
    try {
      await requestQuote(
        quoteForm.name,
        quoteForm.email,
        quoteForm.phone,
        selectedService.title,
        quoteForm.budget,
        quoteForm.description
      );
      setSuccessMsg('Votre demande de devis a été soumise avec succès au studio OZzo Design. Elle apparaît désormais sur le Tableau de bord de l\'administrateur.');
      setQuoteForm({ name: '', email: '', phone: '', budget: '50 000 CFA - 150 000 CFA', description: '' });
      setTimeout(() => {
        setShowQuoteModal(false);
        setSelectedService(null);
      }, 3500);
    } catch {
      setSuccessMsg('Une erreur est survenue lors du dépôt de votre demande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Intro section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl font-display uppercase">
          STUDIO OZzo DESIGN
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Propulsez votre marque grâce à nos chartes graphiques de haute précision, nos logos haut de gamme et nos développements web sur mesure.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex bg-slate-900/60 p-1 rounded-2xl overflow-x-auto scrollbar-none max-w-3xl mx-auto gap-1 border border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-orange-500 to-orange-650 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-850 rounded-3xl max-w-lg mx-auto bg-slate-900/40">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-white font-bold font-display">Aucun service publié</p>
            <p className="text-xs text-slate-500 mt-1">
              Connectez-vous avec l'e-mail administrateur <strong>boubacar16cisse@gmail.com</strong> pour en ajouter de nouveaux.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-300 shadow-lg"
              >
                <div className="space-y-2">
                  <span className="text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-1 rounded font-bold font-mono uppercase tracking-wider text-orange-400">
                    {srv.category}
                  </span>
                  <h3 className="font-bold text-base text-white font-display tracking-tight leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center mt-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Tarif: {srv.priceRange || 'Sur devis'}
                  </span>
                  <button
                    id={`request-quote-button-${srv.id}`}
                    onClick={() => handleQuoteClick(srv)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    Demander devis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote request Modal overlay */}
      <AnimatePresence>
        {showQuoteModal && selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 relative shadow-2xl"
            >
              <button
                id="close-quote-modal"
                onClick={() => { setShowQuoteModal(false); setSelectedService(null); }}
                className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <XCircle size={20} />
              </button>

              <div className="space-y-1.5">
                <span className="text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-1 rounded font-bold font-mono uppercase tracking-wider text-orange-400">
                  {selectedService.category}
                </span>
                <h3 className="font-bold text-lg text-white font-display">
                  Demande de devis : {selectedService.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Remplissez ce court formulaire pour recevoir une estimation financière de notre agence.
                </p>
              </div>

              {successMsg ? (
                <div className="p-4 bg-slate-950 border border-slate-800 text-orange-400 rounded-xl text-xs font-semibold text-center space-y-2">
                  <p>{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="quote-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre nom complet</label>
                      <input
                        id="quote-name"
                        type="text"
                        required
                        placeholder="Ex: Mohamed Coulibaly"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="quote-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre adresse e-mail</label>
                      <input
                        id="quote-email"
                        type="email"
                        required
                        placeholder="mohamed@gmail.com"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="quote-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Numéro de téléphone</label>
                      <input
                        id="quote-phone"
                        type="text"
                        placeholder="71156304"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="quote-budget" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Budget indicatif</label>
                      <select
                        id="quote-budget"
                        value={quoteForm.budget}
                        onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                      >
                        <option value="50 000 CFA - 150 000 CFA">50 000 CFA - 150 000 CFA</option>
                        <option value="150 000 CFA - 500 000 CFA">150 000 CFA - 500 000 CFA</option>
                        <option value="500 000 CFA - 1 500 000 CFA">500 000 CFA - 1 500 000 CFA</option>
                        <option value="Plus de 1 500 000 CFA">Plus de 1 500 000 CFA</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="quote-desc" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Cahier des charges & Détails</label>
                    <textarea
                      id="quote-desc"
                      rows={4}
                      required
                      placeholder="Décrivez votre besoin : objectifs, supports, formats attendus..."
                      value={quoteForm.description}
                      onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      id="submit-quote-request"
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-orange-500/10"
                    >
                      <span>{isSubmitting ? 'Envoi...' : 'Transmettre la demande'}</span>
                      <Send size={12} />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple helper inside
const XCircle = ({ size, ...props }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
