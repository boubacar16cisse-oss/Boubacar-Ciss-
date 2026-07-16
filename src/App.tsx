import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { OzzoDesignView } from './components/OzzoDesignView';
import { OzzoEventsView } from './components/OzzoEventsView';
import { Dashboard } from './components/Dashboard';
import { QRCodeScanner } from './components/QRCodeScanner';
import { AuthModals } from './components/AuthModals';
import { ShieldCheck, Calendar, Info, Search, Ticket, Mail, Phone, ExternalLink, CheckCircle, Plus, Sparkles, Code, QrCode, Clipboard, UserCheck, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponent: standalone Contact page view
const ContactView: React.FC = () => {
  const { sendContactMessage } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSending(true);
    try {
      await sendContactMessage(formData.name, formData.email, formData.phone, formData.subject || 'Demande Contact', formData.message);
      setStatus('Message envoyé avec succès ! Il apparaîtra sur le tableau de bord de l\'administrateur.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('Échec de l\'envoi du message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-md">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-white sm:text-5xl font-display tracking-tight">Nous Contacter</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Pour vos projets graphiques exceptionnels, l'organisation de vos galas ou l'intégration de la billetterie sécurisée N'KA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-semibold text-slate-400">
        <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all shadow-md">
          <Phone className="w-5 h-5 text-orange-500" />
          <h4 className="font-bold text-sm text-white font-display">Téléphone & WhatsApp</h4>
          <a href="tel:71156304" className="block text-slate-400 hover:text-white transition-colors">71156304</a>
          <a href="https://wa.me/22671156304" target="_blank" rel="noopener noreferrer" className="block text-emerald-400 hover:underline">Discuter sur WhatsApp</a>
        </div>

        <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all shadow-md">
          <Mail className="w-5 h-5 text-orange-500" />
          <h4 className="font-bold text-sm text-white font-display">E-mail Officiel</h4>
          <a href="mailto:boubacar16cisse@gmail.com" className="block text-slate-400 hover:text-white transition-colors">boubacar16cisse@gmail.com</a>
        </div>

        <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all shadow-md">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h4 className="font-bold text-sm text-white font-display">Administrateur Principal</h4>
          <p className="text-slate-400">boubacar16cisse@gmail.com</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="contact-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre Nom</label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Ex: Boubacar Cissé"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contact-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre E-mail</label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="Ex: boubacar16cisse@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="contact-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Téléphone</label>
            <input
              id="contact-phone"
              type="text"
              placeholder="71156304"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contact-subject" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sujet</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Ex: Devis événementiel"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-msg" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre message</label>
          <textarea
            id="contact-msg"
            rows={4}
            required
            placeholder="Écrivez votre demande en détail..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
          />
        </div>

        {status && (
          <div className="p-3 bg-slate-950 border border-slate-800 text-orange-400 rounded-xl text-xs font-semibold">
            {status}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            id="send-contact-standalone"
            type="submit"
            disabled={isSending}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSending ? 'Transmission...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Subcomponent: N'KA Ticket custom view
const TicketsPortalView: React.FC = () => {
  const { tickets, currentUser, events, addEvent, purchaseTicket } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'verify' | 'register' | 'generator' | 'my-tickets'>('verify');
  
  // Verify states
  const [searchNum, setSearchNum] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Register event states
  const [eventSuccessMsg, setEventSuccessMsg] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    categoryName: 'Standard',
    price: 5000,
    capacity: 200,
    imageUrl: ''
  });

  // Code generator states
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [generatorQty, setGeneratorQty] = useState(1);
  const [genBuyer, setGenBuyer] = useState({
    name: 'Invité Spécial',
    email: 'invit@ozzo.design',
    phone: '71156304'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState<any[]>([]);

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const availableCategories = selectedEvent ? selectedEvent.ticketCategories : [];

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
      if (events[0].ticketCategories.length > 0) {
        setSelectedCategoryId(events[0].ticketCategories[0].id);
      }
    }
  }, [events, selectedEventId]);

  useEffect(() => {
    if (selectedEvent && selectedEvent.ticketCategories.length > 0) {
      const exists = selectedEvent.ticketCategories.some(c => c.id === selectedCategoryId);
      if (!exists) {
        setSelectedCategoryId(selectedEvent.ticketCategories[0].id);
      }
    }
  }, [selectedEventId, selectedEvent, selectedCategoryId]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNum.trim()) return;
    const found = tickets.find(t => t.ticketNumber.toUpperCase() === searchNum.trim().toUpperCase());
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time || !newEvent.location) return;

    addEvent({
      title: newEvent.title,
      description: newEvent.description || "Événement sécurisé enregistré via le portail N'KA TICKET.",
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      organizers: ['Organisateur N\'KA'],
      partners: [],
      isPrivate: false,
      isPublished: true,
      isArchived: false,
      imageUrl: newEvent.imageUrl || undefined,
      ticketCategories: [{
        id: `cat_std_${Date.now()}`,
        name: newEvent.categoryName,
        price: Number(newEvent.price) || 0,
        capacity: Number(newEvent.capacity) || 100,
        sold: 0
      }]
    });

    setEventSuccessMsg(`L'événement "${newEvent.title}" a été enregistré avec succès et est désormais disponible pour la billetterie !`);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      categoryName: 'Standard',
      price: 5000,
      capacity: 200,
      imageUrl: ''
    });
    setTimeout(() => setEventSuccessMsg(''), 5000);
  };

  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !selectedCategoryId || generatorQty < 1) return;

    setIsGenerating(true);
    try {
      const result = await purchaseTicket(
        selectedEventId,
        selectedCategoryId,
        generatorQty,
        genBuyer.name || 'Invité d\'Honneur',
        genBuyer.email || 'invit@ozzo.design',
        genBuyer.phone || '71156304'
      );
      setGeneratedBatch(result);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter user's own tickets
  const myTickets = currentUser 
    ? tickets.filter(t => t.buyerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const isStaff = currentUser && ['super_admin', 'admin', 'employee'].includes(currentUser.role);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-md">
          <Ticket className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black text-white sm:text-5xl font-display tracking-tight uppercase">Portail N'KA TICKET</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Générez instantanément des codes de billets sécurisés, enregistrez vos événements en un clic, ou validez et vérifiez vos accès en toute sécurité.
        </p>
      </div>

      {/* Portal subtabs */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-2xl overflow-x-auto scrollbar-none max-w-2xl mx-auto gap-1 border border-slate-800">
        {[
          { id: 'verify', label: 'Vérifier un Billet', icon: ShieldCheck },
          { id: 'register', label: 'Enregistrer Événement', icon: Plus },
          { id: 'generator', label: 'Générateur de Codes', icon: Code },
          { id: 'my-tickets', label: 'Mes Billets', icon: Ticket }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setSearchResult(null);
                setHasSearched(false);
              }}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-650 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Icon size={12} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* TAB 1: VERIFY */}
          {activeSubTab === 'verify' && (
            <div className="space-y-6">
              {/* Staff shortcut to QR scanner */}
              {isStaff && (
                <div className="p-6 bg-slate-900/90 text-white rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="font-bold text-sm tracking-tight font-display">Accès Agent de Contrôle Autorisé ({currentUser.role})</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Vous faites partie de l'équipe de contrôle. Vous pouvez activer le scanner vidéo intégré pour scanner et invalider les billets N'KA.
                  </p>
                  <button
                    id="toggle-staff-scanner"
                    onClick={() => setShowScanner(!showScanner)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <span>{showScanner ? 'Fermer le Scanner' : 'Ouvrir le Scanner de Billets'}</span>
                  </button>

                  {showScanner && (
                    <div className="pt-4 border-t border-slate-800">
                      <QRCodeScanner />
                    </div>
                  )}
                </div>
              )}

              {/* Anti-fraud Search bar verification */}
              <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white font-display flex items-center space-x-2">
                    <ShieldCheck className="text-emerald-500" size={16} />
                    <span>Vérifier un billet (Lutte anti-fraude)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Saisissez le numéro unique inscrit sur le billet (ex: <code>OZ-XXXX-XXXX</code>) pour interroger le registre cryptographique.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="verify-ticket-number"
                      type="text"
                      required
                      placeholder="Entrez le numéro du billet..."
                      value={searchNum}
                      onChange={(e) => setSearchNum(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white font-mono uppercase tracking-widest font-bold animate-none"
                    />
                    <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  </div>
                  <button
                    id="submit-ticket-verification"
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-500/10"
                  >
                    Vérifier
                  </button>
                </form>

                {/* Verification result display */}
                {hasSearched && (
                  <div className="pt-4 border-t border-slate-800/60">
                    {searchResult ? (
                      <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                          <CheckCircle size={16} />
                          <span>BILLET AUTHENTIQUE & VALIDE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 text-xs font-medium text-slate-400 pt-1 border-t border-slate-800/40">
                          <span>Numéro unique:</span>
                          <strong className="text-right text-white font-mono">{searchResult.ticketNumber}</strong>
                          <span>Événement:</span>
                          <span className="text-right text-white">{searchResult.eventTitle}</span>
                          <span>Catégorie:</span>
                          <span className="text-right text-white">{searchResult.categoryName}</span>
                          <span>Titulaire:</span>
                          <span className="text-right text-white">{searchResult.buyerName}</span>
                          <span>Statut:</span>
                          <span className="text-right font-bold">
                            {searchResult.status === 'valid' ? (
                              <span className="text-emerald-400">Actif / Jamais scanné</span>
                            ) : (
                              <span className="text-rose-500">DÉJÀ SCANNÉ / UTILISÉ (Invalide)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-950 border border-rose-500/30 rounded-xl space-y-1">
                        <h4 className="text-rose-400 font-bold text-xs">⚠️ BILLET INTROUVABLE OU CONTREFAIT</h4>
                        <p className="text-[11px] text-slate-400">
                          Ce billet n'existe pas dans le registre cryptographique de N'KA TICKET. Refusez immédiatement l'accès au détenteur.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER EVENT */}
          {activeSubTab === 'register' && (
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white font-display flex items-center space-x-2">
                  <Plus className="text-orange-500" size={16} />
                  <span>Enregistrer / Créer un événement</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ajoutez un nouvel événement au registre N'KA TICKET pour pouvoir y associer et générer des billets sécurisés.
                </p>
              </div>

              {eventSuccessMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{eventSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="reg-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Titre de l'événement</label>
                    <input
                      id="reg-title"
                      type="text"
                      required
                      placeholder="Ex: Concert de la Solidarité, Gala VIP"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="reg-location" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lieu / Adresse</label>
                    <input
                      id="reg-location"
                      type="text"
                      required
                      placeholder="Ex: Palais des Sports, Bamako"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="reg-date" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Date</label>
                    <input
                      id="reg-date"
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="reg-time" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Heure de début</label>
                    <input
                      id="reg-time"
                      type="time"
                      required
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="reg-cat" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Catégorie</label>
                    <input
                      id="reg-cat"
                      type="text"
                      required
                      placeholder="Ex: Standard, VIP"
                      value={newEvent.categoryName}
                      onChange={(e) => setNewEvent({ ...newEvent, categoryName: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="reg-price" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tarif (CFA)</label>
                    <input
                      id="reg-price"
                      type="number"
                      required
                      min="0"
                      placeholder="Ex: 5000"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="reg-cap" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Places dispo</label>
                    <input
                      id="reg-cap"
                      type="number"
                      required
                      min="1"
                      placeholder="Ex: 200"
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-img" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lien d'image (Optionnel)</label>
                  <input
                    id="reg-img"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newEvent.imageUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-desc" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Description / Notes de l'événement</label>
                  <textarea
                    id="reg-desc"
                    rows={3}
                    placeholder="Écrivez quelques mots sur l'événement..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="submit-register-event"
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-orange-500/10"
                  >
                    <Plus size={14} />
                    <span>Enregistrer l'événement</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: CODE GENERATOR */}
          {activeSubTab === 'generator' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white font-display flex items-center space-x-2">
                    <Code className="text-orange-500" size={16} />
                    <span>Générateur de Codes de Billets N'KA TICKET</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Générez instantanément des codes de billets cryptographiques pour vos événements. Utile pour les invitations, les ventes physiques et les billets pré-imprimés.
                  </p>
                </div>

                {events.length === 0 ? (
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs space-y-3">
                    <p className="text-slate-400">Aucun événement n'est enregistré pour le moment.</p>
                    <button
                      onClick={() => setActiveSubTab('register')}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
                    >
                      Enregistrer un événement d'abord
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGenerateCodes} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="gen-event" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sélectionner l'événement</label>
                        <select
                          id="gen-event"
                          value={selectedEventId}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                        >
                          {events.map((e) => (
                            <option key={e.id} value={e.id}>{e.title} ({e.date})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="gen-cat" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Catégorie de Billet</label>
                        <select
                          id="gen-cat"
                          value={selectedCategoryId}
                          onChange={(e) => setSelectedCategoryId(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                        >
                          {availableCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.price.toLocaleString()} CFA) — {c.capacity - c.sold} restants
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="gen-buyer-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Nom du Bénéficiaire</label>
                        <input
                          id="gen-buyer-name"
                          type="text"
                          required
                          value={genBuyer.name}
                          onChange={(e) => setGenBuyer({ ...genBuyer, name: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="gen-buyer-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">E-mail</label>
                        <input
                          id="gen-buyer-email"
                          type="email"
                          required
                          value={genBuyer.email}
                          onChange={(e) => setGenBuyer({ ...genBuyer, email: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="gen-qty" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Nombre de billets</label>
                        <input
                          id="gen-qty"
                          type="number"
                          required
                          min="1"
                          max="20"
                          value={generatorQty}
                          onChange={(e) => setGeneratorQty(Number(e.target.value))}
                          className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        id="submit-generate-codes"
                        type="submit"
                        disabled={isGenerating}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-orange-500/10 disabled:opacity-50"
                      >
                        <span>{isGenerating ? 'Génération...' : 'Générer les codes'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Generated batch layout */}
              {generatedBatch.length > 0 && (
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                        <CheckCircle className="text-emerald-500" size={16} />
                        <span>{generatedBatch.length} Billet(s) Généré(s) avec Succès !</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Voici vos laissez-passer cryptographiques sécurisés N'KA TICKET uniques.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const codes = generatedBatch.map(t => `${t.buyerName}: ${t.ticketNumber}`).join('\n');
                          navigator.clipboard.writeText(codes);
                          alert('Tous les codes ont été copiés dans le presse-papiers !');
                        }}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Clipboard size={12} />
                        <span>Copier tous les codes</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Imprimer tout</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedBatch.map((t) => (
                      <div key={t.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="space-y-1.5 text-xs flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold text-orange-400 font-mono truncate max-w-[120px]">
                              {t.ticketNumber}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(t.ticketNumber);
                                alert(`Code ${t.ticketNumber} copié !`);
                              }}
                              className="text-slate-500 hover:text-white cursor-pointer"
                              title="Copier le code"
                            >
                              <Clipboard size={10} />
                            </button>
                          </div>
                          <h5 className="font-bold text-xs text-white leading-tight truncate">{t.eventTitle}</h5>
                          <p className="text-slate-400 text-[10px] truncate">Pour: {t.buyerName} ({t.categoryName})</p>
                        </div>

                        <div className="bg-white p-1 rounded-xl shrink-0">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(t.qrCodeData)}`}
                            alt="QR"
                            className="w-12 h-12 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY TICKETS */}
          {activeSubTab === 'my-tickets' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white font-display">Vos Billets Commandés</h3>
              {!currentUser ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/40 space-y-3">
                  <p className="text-xs text-slate-500 italic">Vous n'êtes pas connecté.</p>
                  <p className="text-xs text-slate-400">Veuillez vous connecter avec votre adresse e-mail pour voir les billets associés à votre compte.</p>
                </div>
              ) : myTickets.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/40">
                  <p className="text-xs text-slate-500 italic">Vous n'avez aucun billet acheté sous votre adresse e-mail ({currentUser.email}).</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myTickets.map((t) => (
                    <div key={t.id} className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 flex justify-between items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded font-bold text-orange-400 font-mono">{t.ticketNumber}</span>
                        <h4 className="font-bold text-sm text-white leading-tight font-display">{t.eventTitle}</h4>
                        <p className="text-slate-400">{t.categoryName} • {t.price.toLocaleString()} CFA</p>
                        <p className="text-[10px] font-bold">
                          Statut:{' '}
                          {t.status === 'valid' ? (
                            <span className="text-emerald-400">Actif (Non validé)</span>
                          ) : (
                            <span className="text-slate-500">Scanné (Invalide)</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-1.5 rounded-2xl border border-slate-800 shrink-0 shadow-md">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(t.qrCodeData)}`}
                          alt="QR"
                          className="w-16 h-16 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Main Application Component with App Hooks
const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset' | 'verify'>('login');
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { theme, currentUser, login } = useStore();

  // Force body colors for standard look
  useEffect(() => {
    const root = window.document.documentElement;
    // Always force dark-like parameters for bento theme elegance
    root.classList.add('dark');
  }, [theme]);

  const canAccessDashboard = currentUser && ['super_admin', 'admin', 'employee'].includes(currentUser.role);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <div>
        {/* Responsive Brand Header Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setShowAuthModal={setShowAuthModal}
          setAuthMode={(mode) => setAuthMode(mode as any)}
          setShowProfileModal={setShowProfileModal}
        />

        {/* Pages render routes */}
        <main className="py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'home' && (
                <Home 
                  setActiveTab={setActiveTab} 
                  setShowAuthModal={setShowAuthModal} 
                />
              )}
              {activeTab === 'design' && <OzzoDesignView />}
              {activeTab === 'events' && <OzzoEventsView />}
              {activeTab === 'tickets' && <TicketsPortalView />}
              {activeTab === 'contact' && <ContactView />}
              {activeTab === 'dashboard' && (
                canAccessDashboard ? <Dashboard /> : (
                  <div className="max-w-lg mx-auto py-16 px-6 text-center space-y-6 bg-slate-900/40 border border-slate-800 rounded-3xl shadow-2xl">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white font-display tracking-tight">Console d'Administration Réservée</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Cette interface sécurisée permet de gérer les services, les événements, les ventes de billets N'KA, ainsi que la sécurité globale.
                      </p>
                    </div>

                    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 max-w-sm mx-auto">
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider font-mono">Mode Démonstration & Test</p>
                      <p className="text-[11px] text-slate-400">
                        Connectez-vous instantanément en un clic avec le profil <strong>Super Administrateur</strong> pour explorer l'ensemble des fonctionnalités.
                      </p>
                      <button
                        id="quick-admin-login-direct"
                        onClick={async () => {
                          await login('boubacar16cisse@gmail.com', 'admin');
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-orange-500/15 transition-all flex items-center justify-center space-x-2"
                      >
                        <ShieldCheck size={14} />
                        <span>Connexion Rapide Super Admin</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs">
                      <span>Ou connectez-vous avec vos identifiants :</span>
                      <button
                        id="dashboard-gate-login"
                        onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                        className="text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                      >
                        S'authentifier
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Global verification / profile mutation Modals */}
      <AuthModals 
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
