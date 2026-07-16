import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Compass, ArrowRight, Star, HelpCircle, Shield, Sparkles, 
  Phone, Mail, MapPin, Send, MessageSquare, ExternalLink, RefreshCw, Ticket, ShieldCheck, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setShowAuthModal: (show: boolean) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, setShowAuthModal }) => {
  const { services, events, sendContactMessage, currentUser } = useStore();
  
  // Contact Form States
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // FAQ interactive state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSending(true);
    try {
      await sendContactMessage(
        contactForm.name,
        contactForm.email,
        contactForm.phone,
        contactForm.subject || 'Demande générale',
        contactForm.message
      );
      setSuccessMsg('Votre message a été transmis avec succès au tableau de bord administratif. Nous vous recontacterons sous peu.');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSuccessMsg('Une erreur est survenue lors de l\'envoi du message.');
    } finally {
      setIsSending(false);
    }
  };

  const faqs = [
    { q: "Qu'est-ce que OZzo Design ?", a: "OZzo Design est un studio de création d'identités visuelles haut de gamme, incluant le branding, les logos, la création de sites web professionnels, d'applications mobiles et de supports publicitaires de haute qualité." },
    { q: "Comment fonctionne la billetterie sécurisée N'KA TICKET ?", a: "Chaque billet acheté génère un code cryptographique unique stocké de manière immuable. Les contrôleurs scannent le billet via leur mobile pour valider l'entrée et empêcher toute double utilisation ou falsification." },
    { q: "Puis-je gérer mes événements de bout en bout sur OZzo Events ?", a: "Oui. Depuis le tableau de bord, vous pouvez créer des événements publics ou privés, configurer des catégories de billets (VIP, Standard, etc.), suivre les finances et contrôler les scans d'accès." },
    { q: "Comment demander un devis de création de design ?", a: "Rendez-vous dans la section 'OZzo Design', sélectionnez le service de votre choix et remplissez le formulaire de demande de devis en spécifiant votre budget et votre cahier des charges." }
  ];

  return (
    <div className="space-y-24 pb-20 selection:bg-orange-500 selection:text-white">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-xs font-bold text-slate-300"
          >
            <Sparkles size={12} className="text-orange-500 animate-pulse" />
            <span className="font-mono tracking-wide">Synergie de Design, Événementiel & Billetterie</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-display">
            L'excellence créative unie par la <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 underline decoration-orange-500/40">sécurité</span> technologique.
          </h1>

          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            OZzo Group unifie vos besoins graphiques, l'organisation de vos plus grands événements et la vente de billets cryptographiques infalsifiables.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              id="hero-go-design"
              onClick={() => setActiveTab('design')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <span>Découvrir OZzo Design</span>
              <ArrowRight size={14} />
            </button>
            <button
              id="hero-go-tickets"
              onClick={() => setActiveTab('tickets')}
              className="w-full sm:w-auto px-6 py-3 border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <span>Accéder à N'KA TICKET</span>
            </button>
          </div>
        </div>
      </section>

      {/* Brand Platform Presentations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Box OZzo Design */}
          <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 hover:shadow-lg transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 flex items-center justify-center font-black text-orange-500 text-base font-display">
                OD
              </div>
              <h3 className="text-lg font-bold text-white font-display">OZzo Design</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Studio créatif de premier plan pour logos, chartes graphiques, maquettes d'applications, montages vidéo avancés et stratégies de branding global.
              </p>
            </div>
            <button
              id="card-go-design"
              onClick={() => setActiveTab('design')}
              className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center space-x-1 cursor-pointer group"
            >
              <span>Consulter l'agence</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Box OZzo Events */}
          <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 hover:shadow-lg transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 flex items-center justify-center font-black text-orange-500 text-base font-display">
                OE
              </div>
              <h3 className="text-lg font-bold text-white font-display">OZzo Events</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Planification et publication d'événements publics ou privés. Galeries d'images et vidéos administrables pour immortaliser vos plus grands moments.
              </p>
            </div>
            <button
              id="card-go-events"
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center space-x-1 cursor-pointer group"
            >
              <span>Explorer les événements</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Box N'KA TICKET */}
          <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 hover:shadow-lg transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 flex items-center justify-center font-black text-orange-500 text-base font-display">
                NK
              </div>
              <h3 className="text-lg font-bold text-white font-display">N'KA TICKET</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Système de billetterie électronique de confiance. Codes QR uniques de sécurité empêchant les doubles scans, les duplications et les fraudes de billets.
              </p>
            </div>
            <button
              id="card-go-tickets"
              onClick={() => setActiveTab('tickets')}
              className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center space-x-1 cursor-pointer group"
            >
              <span>Accéder à la billetterie</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid (Ozzo Design overview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Services à la Carte</h2>
          <p className="text-xs text-slate-400">Nos prestations graphiques disponibles sur demande de devis instantané</p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-850 rounded-3xl bg-slate-900/20">
            <p className="text-xs text-slate-500 italic">Aucun service n'est publié pour le moment. L'administrateur principal ajoutera prochainement nos offres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 6).map((srv) => (
              <div key={srv.id} className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-1 rounded font-bold font-mono uppercase tracking-wider text-orange-400">{srv.category}</span>
                  <h4 className="font-bold text-base text-white font-display leading-tight">{srv.title}</h4>
                  <p className="text-xs text-slate-400 leading-normal line-clamp-3">{srv.description}</p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-800/60 text-xs font-bold text-slate-400 flex justify-between items-center">
                  <span className="text-white font-mono text-xs">{srv.priceRange || 'Sur devis'}</span>
                  <button
                    id={`request-quote-srv-${srv.id}`}
                    onClick={() => setActiveTab('design')}
                    className="text-orange-500 hover:text-orange-400 text-xs font-bold hover:underline cursor-pointer"
                  >
                    Demander devis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Achieving Section */}
      <section className="bg-slate-950 text-white py-12 border-y border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight font-display text-white">Nos Réalisations</h2>
            <p className="text-xs text-slate-400">Aperçu géométrique et conceptuel de notre excellence créative</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between min-h-[220px] hover:border-slate-700 transition-all">
              <div>
                <span className="text-[10px] text-orange-500 font-bold font-mono uppercase tracking-wider">Projet Identité</span>
                <h4 className="text-xl font-bold tracking-tight mt-2 text-white font-display">OZzo Design Framework</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Conception de systèmes typographiques vectoriels et de chartes d'utilisation pour des institutions de microfinance et des entreprises logistiques en Afrique de l'Ouest.
                </p>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-600 mt-4">Client Confidential • 2026</span>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between min-h-[220px] hover:border-slate-700 transition-all">
              <div>
                <span className="text-[10px] text-orange-500 font-bold font-mono uppercase tracking-wider">Projet Tech</span>
                <h4 className="text-xl font-bold tracking-tight mt-2 text-white font-display font-display">N'KA Cryptographic Gateway</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Mise au point d'un système de génération séquentielle de hachages uniques pour billets électroniques, garantissant l'annulation et l'impossibilité de dupliquer les tickets.
                </p>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-600 mt-4">N'KA Core Module • 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Pourquoi Nous Choisir</h2>
          <p className="text-xs text-slate-400">Quatre piliers de confiance qui font de nous votre partenaire idéal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { t: "Esthétique Premium", d: "Une direction artistique pointue, moderne, conforme aux standards internationaux du luxe et du design de marque." },
            { t: "Sécurité Absolue", d: "La billetterie N'KA évite tout double scan de billet. Votre événement est imperméable à la fraude." },
            { t: "Zéro Perte de Données", d: "Système de sauvegardes redondantes pour restaurer toute votre base de données en cas d'incident." },
            { t: "Support Dédié", d: "Disponibilité continue par e-mail et WhatsApp officiel pour répondre à vos urgences d'accès." }
          ].map((item, idx) => (
            <div key={idx} className="space-y-3 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all">
              <h4 className="font-bold text-sm text-white font-display">{item.t}</h4>
              <p className="text-xs text-slate-400 leading-normal">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Témoignages Clients</h2>
          <p className="text-xs text-slate-400">Ce que nos partenaires disent de nos plateformes intégrées</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 hover:border-slate-700 transition-all">
            <div className="flex items-center space-x-1 text-orange-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "L'intégration de la billetterie N'KA TICKET pour nos festivals a complètement éradiqué les faux billets à l'entrée. Le scanner mobile réagit en moins d'une seconde, un vrai bonheur de sécurité."
            </p>
            <div className="text-xs pt-2 border-t border-slate-800/40">
              <strong className="text-white block font-display">Awa Konaté</strong>
              <span className="text-slate-400 font-semibold font-mono text-[10px]">Directrice de Production, Bamako</span>
            </div>
          </div>

          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 hover:border-slate-700 transition-all">
            <div className="flex items-center space-x-1 text-orange-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Nous avons commandé l'intégralité de l'identité visuelle de notre fintech à OZzo Design. Le résultat est d'une pureté impressionnante, nos investisseurs ont immédiatement adoré le professionnalisme de notre charte."
            </p>
            <div className="text-xs pt-2 border-t border-slate-800/40">
              <strong className="text-white block font-display">Drissa Keïta</strong>
              <span className="text-slate-400 font-semibold font-mono text-[10px]">Fondateur de Sika Express</span>
            </div>
          </div>
        </div>
      </section>

      {/* Actualities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Actualités & Innovation</h2>
          <p className="text-xs text-slate-400 font-medium">Les dernières avancées technologiques de OZzo Group</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3 hover:border-slate-700 transition-all">
            <span className="text-[9px] font-bold text-orange-400 font-mono uppercase tracking-widest block">Technologie • Juillet 2026</span>
            <h4 className="text-base font-bold text-white tracking-tight font-display">Lancement officiel du scanner N'KA cryptographique</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nous avons finalisé le module de vérification optique hors-ligne et en ligne. Le module scanne et annule le billet de manière asynchrone pour éviter la double entrée lors de coupures réseau.
            </p>
          </div>
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3 hover:border-slate-700 transition-all">
            <span className="text-[9px] font-bold text-orange-400 font-mono uppercase tracking-widest block">Design • Juin 2026</span>
            <h4 className="text-base font-bold text-white tracking-tight font-display">OZzo Design élu Studio Émergent de l'année</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Une distinction récompensant la propreté de nos intégrations digitales de marques et notre fidélité à l'esthétique minimaliste moderne.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Questions Fréquentes (FAQ)</h2>
          <p className="text-xs text-slate-400 font-medium">Des réponses claires pour lever tous vos doutes</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700"
              >
                <button
                  id={`faq-toggle-${idx}`}
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left text-sm font-bold text-white focus:outline-none cursor-pointer font-display"
                >
                  <span>{faq.q}</span>
                  <HelpCircle size={16} className={`text-slate-450 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-t border-slate-800/40"
                    >
                      <p className="p-6 text-xs text-slate-400 leading-relaxed bg-slate-950/40">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Formulaire Contact Form */}
      <section id="home-contact-section" className="max-w-3xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-md">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">Formulaire de Contact</h2>
          <p className="text-xs text-slate-400 font-medium">Envoyez-nous un message sécurisé. Nous répondons sous 24h.</p>
        </div>

        <form onSubmit={handleContactSubmit} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre nom complet</label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Ex: Amadou Coulibaly"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre e-mail</label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="amadou@gmail.com"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Téléphone (Optionnel)</label>
              <input
                id="contact-phone"
                type="text"
                placeholder="71156304"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-subject" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sujet</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Ex: Demande d'informations"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre Message</label>
            <textarea
              id="contact-message"
              rows={4}
              required
              placeholder="Rédigez votre message ici..."
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full px-3 py-2 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
            />
          </div>

          {successMsg && (
            <div className="p-3 bg-slate-950 border border-slate-800 text-orange-400 rounded-xl text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              id="submit-contact"
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all cursor-pointer disabled:opacity-55 flex items-center space-x-1.5"
            >
              <span>{isSending ? 'Transmission...' : 'Envoyer le message'}</span>
              <Send size={12} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
