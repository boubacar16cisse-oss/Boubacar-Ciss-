import React, { useState } from 'react';
import { useStore } from '../store';
import { Event, Ticket } from '../types';
import { Calendar, MapPin, Ticket as TicketIcon, Clock, CheckCircle, Info, Printer, ShieldCheck, Download, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OzzoEventsView: React.FC = () => {
  const { events, purchaseTicket } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Purchase form states
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isBuying, setIsBuying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Purchased success state
  const [generatedTickets, setGeneratedTickets] = useState<Ticket[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const publishedEvents = events.filter(e => e.isPublished && !e.isArchived);

  const handleOpenPurchase = (ev: Event) => {
    setSelectedEvent(ev);
    setSelectedCategory(ev.ticketCategories[0]?.id || '');
    setPurchaseQuantity(1);
    setErrorMsg('');
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedCategory || !buyerForm.name || !buyerForm.email) return;

    setIsBuying(true);
    setErrorMsg('');
    try {
      const ticketsPurchased = await purchaseTicket(
        selectedEvent.id,
        selectedCategory,
        purchaseQuantity,
        buyerForm.name,
        buyerForm.email,
        buyerForm.phone
      );
      setGeneratedTickets(ticketsPurchased);
      setShowPurchaseModal(false);
      setShowSuccessModal(true);
      setBuyerForm({ name: '', email: '', phone: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'achat.');
    } finally {
      setIsBuying(false);
    }
  };

  const selectedCategoryObj = selectedEvent?.ticketCategories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Intro Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-md">
          <Calendar className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl font-display">
          OZzo EVENTS & TICKETS
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Réservez vos places en toute sécurité pour nos concerts, galas et séminaires. Billetterie cryptographique autonome N'KA TICKET anti-fraude.
        </p>
      </div>

      {/* Events display */}
      <div className="space-y-6">
        {publishedEvents.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-850 rounded-3xl max-w-lg mx-auto bg-slate-900/40">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-white font-bold font-display">Aucun événement à l'affiche</p>
            <p className="text-xs text-slate-500 mt-1">
              Les administrateurs n'ont pas encore publié d'événement actif. Connectez-vous avec <strong>boubacar16cisse@gmail.com</strong> pour programmer un événement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedEvents.map((ev) => (
              <div 
                key={ev.id}
                className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all duration-300"
              >
                {/* Simulated event image wrapper */}
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center border-b border-slate-900/80">
                  {ev.imageUrl ? (
                    <img 
                      src={ev.imageUrl} 
                      alt={ev.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <Calendar className="w-12 h-12 text-slate-750 mx-auto animate-pulse" />
                      <span className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">OZzo Events Visual Grid</span>
                    </div>
                  )}
                  {ev.isPrivate && (
                    <span className="absolute top-4 right-4 bg-orange-500 text-white font-black text-[9px] tracking-wider uppercase px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
                      Privé
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-400">
                      <span className="flex items-center space-x-1 font-mono text-[10px] text-orange-400">
                        <Clock size={12} />
                        <span>{ev.date} à {ev.time}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-white tracking-tight leading-tight font-display">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 leading-normal">
                      <MapPin size={12} className="text-slate-500 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {ev.description}
                  </p>

                  <div className="border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-550">Tarifs disponibles</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ev.ticketCategories.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold font-mono text-slate-300">
                            {c.name}: {c.price.toLocaleString()} CFA
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      id={`buy-tickets-button-${ev.id}`}
                      onClick={() => handleOpenPurchase(ev)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-orange-500/10 transition-all cursor-pointer"
                    >
                      <TicketIcon size={14} />
                      <span>Réserver Billets</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Booking Form Overlay */}
      <AnimatePresence>
        {showPurchaseModal && selectedEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 relative shadow-2xl"
            >
              <button
                id="close-purchase-modal"
                onClick={() => setShowPurchaseModal(false)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer transition-colors"
              >
                <span className="sr-only">Fermer</span>
                <XCircle size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400 flex items-center space-x-1 font-mono">
                  <ShieldCheck size={14} className="text-orange-500" />
                  <span>N'KA TICKET SÉCURISÉ</span>
                </span>
                <h3 className="font-bold text-lg text-white font-display">
                  Réservation : {selectedEvent.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedEvent.date} à {selectedEvent.time} • {selectedEvent.location}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-slate-950 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="purchase-category" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Catégorie de Billet</label>
                    <select
                      id="purchase-category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white transition-colors"
                    >
                      {selectedEvent.ticketCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.price.toLocaleString()} CFA) — {c.capacity - c.sold} restants
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="purchase-quantity" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Quantité</label>
                    <input
                      id="purchase-quantity"
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={purchaseQuantity}
                      onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="buyer-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre nom complet</label>
                    <input
                      id="buyer-name"
                      type="text"
                      required
                      placeholder="Ex: Fatoumata Sidibé"
                      value={buyerForm.name}
                      onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="buyer-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votre e-mail de réception</label>
                    <input
                      id="buyer-email"
                      type="email"
                      required
                      placeholder="fatoumata@gmail.com"
                      value={buyerForm.email}
                      onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="buyer-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Téléphone de contact</label>
                  <input
                    id="buyer-phone"
                    type="text"
                    placeholder="71156304"
                    value={buyerForm.phone}
                    onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 bg-slate-950 text-white placeholder-slate-600 transition-colors"
                  />
                </div>

                {selectedCategoryObj && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400">Montant total:</span>
                    <strong className="text-orange-400 font-mono text-base">
                      {(selectedCategoryObj.price * purchaseQuantity).toLocaleString()} CFA
                    </strong>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    id="submit-purchase"
                    type="submit"
                    disabled={isBuying}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-orange-500/15"
                  >
                    <span>{isBuying ? 'Sécurisation...' : 'Confirmer & Payer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS PURCHASE TICKETS PREVIEW */}
      <AnimatePresence>
        {showSuccessModal && generatedTickets.length > 0 && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-2xl w-full space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                id="close-success-modal"
                onClick={() => { setShowSuccessModal(false); setGeneratedTickets([]); }}
                className="absolute right-6 top-6 text-slate-500 hover:text-white cursor-pointer"
              >
                <XCircle size={24} />
              </button>

              <div className="text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-white font-display tracking-tight">
                  Achat Validé & Sécurisé !
                </h3>
                <p className="text-xs text-slate-400">
                  Vos laissez-passer cryptographiques N'KA TICKET uniques ont été générés. Présentez-les sur mobile au contrôle d'entrée.
                </p>
              </div>

              {/* Generated Tickets Layout */}
              <div className="space-y-6 pt-4 border-t border-slate-800/60">
                {generatedTickets.map((ticket, idx) => (
                  <div 
                    key={ticket.id} 
                    className="p-6 rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* QR Code generator integration */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-800 shrink-0 shadow-md">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrCodeData)}`} 
                        alt="QR Code" 
                        className="w-28 h-28 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 space-y-2 w-full text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-bold uppercase font-mono">N'KA Pass #{idx + 1}</span>
                          <h4 className="font-bold text-sm text-white mt-1 font-display">{ticket.eventTitle}</h4>
                        </div>
                        <span className="font-mono font-black text-sm text-orange-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                          {ticket.ticketNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-1.5 pt-2 text-[11px] font-semibold text-slate-400 border-t border-slate-800/40">
                        <span>Titulaire:</span>
                        <span className="text-right text-white">{ticket.buyerName}</span>
                        <span>Catégorie:</span>
                        <span className="text-right text-white">{ticket.categoryName}</span>
                        <span>Prix:</span>
                        <span className="text-right text-white font-mono">{ticket.price.toLocaleString()} CFA</span>
                        <span>Validation ID:</span>
                        <span className="text-right font-mono text-[9px] text-slate-500 truncate max-w-[120px] ml-auto">{ticket.qrCodeData}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
                <button
                  id="print-tickets"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Printer size={14} />
                  <span>Imprimer le(s) billet(s)</span>
                </button>
                <button
                  id="dismiss-tickets-success"
                  onClick={() => { setShowSuccessModal(false); setGeneratedTickets([]); }}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-650 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-orange-500/10 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SVG Icon replacement inside
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
