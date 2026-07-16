import React, { useState } from 'react';
import { useStore } from '../store';
import { UserRole, Service, Event, Ticket, LedgerEntry } from '../types';
import { 
  TrendingUp, Users, Calendar, Ticket as TicketIcon, Shield, Database, 
  Plus, Edit2, Trash2, Mail, FileText, Check, X, ShieldAlert, Key, 
  Download, Upload, Eye, EyeOff, DollarSign, ArrowUpRight, ArrowDownRight,
  UserPlus, CheckCircle, Smartphone, Activity, KeySquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Dashboard: React.FC = () => {
  const store = useStore();
  const { 
    currentUser, users, services, events, tickets, scanLogs, messages, 
    quotes, ledger, connectionLogs, activityLogs, backups, settings,
    createUserByAdmin, deleteUserByAdmin, updateUserRoleByAdmin,
    addService, updateService, deleteService,
    addEvent, updateEvent, deleteEvent,
    markMessageAsRead, updateQuoteStatus,
    addLedgerEntry, deleteLedgerEntry,
    triggerBackup, restoreBackup, deleteBackup, setSecurityShield
  } = store;

  // Tabs for the admin workspace
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'events' | 'tickets' | 'users' | 'messages' | 'security'>('overview');

  // Form states - Services
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Design Graphique',
    description: '',
    priceRange: '',
    isPublished: true
  });

  // Form states - Events
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizers: '',
    partners: '',
    isPrivate: false,
    isPublished: true,
    isArchived: false,
    imageUrl: '',
    // Custom sub-categories
    categories: [{ name: 'Standard', price: 5000, capacity: 100 }]
  });

  // Form states - Users
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole,
    phone: ''
  });

  // Form states - Ledger (Finance Manual Entry)
  const [showLedgerForm, setShowLedgerForm] = useState(false);
  const [ledgerForm, setLedgerForm] = useState({
    type: 'revenue' as 'revenue' | 'expense',
    category: 'Sponsor',
    amount: 0,
    description: ''
  });

  // Financial calculations
  const totalRevenues = ledger.filter(l => l.type === 'revenue').reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = ledger.filter(l => l.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const totalProfit = totalRevenues - totalExpenses;

  // Handle service submit
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) return;

    if (editingServiceId) {
      updateService(editingServiceId, serviceForm);
      setEditingServiceId(null);
    } else {
      addService(serviceForm);
    }
    setServiceForm({ title: '', category: 'Design Graphique', description: '', priceRange: '', isPublished: true });
    setShowServiceForm(false);
  };

  const handleEditService = (srv: Service) => {
    setEditingServiceId(srv.id);
    setServiceForm({
      title: srv.title,
      category: srv.category,
      description: srv.description,
      priceRange: srv.priceRange || '',
      isPublished: srv.isPublished
    });
    setShowServiceForm(true);
  };

  // Handle event submit
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const formattedCategories = eventForm.categories.map((c, idx) => ({
      id: `cat_${idx}_${Date.now()}`,
      name: c.name,
      price: Number(c.price),
      capacity: Number(c.capacity),
      sold: 0
    }));

    const eventPayload = {
      title: eventForm.title,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      organizers: eventForm.organizers.split(',').map(s => s.trim()).filter(Boolean),
      partners: eventForm.partners.split(',').map(s => s.trim()).filter(Boolean),
      isPrivate: eventForm.isPrivate,
      isPublished: eventForm.isPublished,
      isArchived: eventForm.isArchived,
      imageUrl: eventForm.imageUrl || undefined,
      ticketCategories: formattedCategories
    };

    if (editingEventId) {
      updateEvent(editingEventId, eventPayload);
      setEditingEventId(null);
    } else {
      addEvent(eventPayload);
    }

    setEventForm({
      title: '', description: '', date: '', time: '', location: '', organizers: '', partners: '', isPrivate: false, isPublished: true, isArchived: false, imageUrl: '',
      categories: [{ name: 'Standard', price: 5000, capacity: 100 }]
    });
    setShowEventForm(false);
  };

  const handleEditEvent = (ev: Event) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      description: ev.description,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      organizers: ev.organizers.join(', '),
      partners: ev.partners.join(', '),
      isPrivate: ev.isPrivate,
      isPublished: ev.isPublished,
      isArchived: ev.isArchived,
      imageUrl: ev.imageUrl || '',
      categories: ev.ticketCategories.map(c => ({ name: c.name, price: c.price, capacity: c.capacity }))
    });
    setShowEventForm(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;
    createUserByAdmin(userForm.name, userForm.email, userForm.role, userForm.phone);
    setUserForm({ name: '', email: '', role: 'employee', phone: '' });
    setShowUserForm(false);
  };

  const handleLedgerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ledgerForm.amount <= 0 || !ledgerForm.description) return;
    addLedgerEntry(ledgerForm);
    setLedgerForm({ type: 'revenue', category: 'Sponsor', amount: 0, description: '' });
    setShowLedgerForm(false);
  };

  // CSV Exporter Simulation
  const handleExportData = (type: string, dataArray: any[]) => {
    if (dataArray.length === 0) return;
    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => 
      Object.values(obj).map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ozzo_${type}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Only superadmin can perform certain destructive operations
  const isSuperAdmin = currentUser && currentUser.role === 'super_admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile Shield Indicator */}
      <div className="md:hidden flex items-center justify-between bg-zinc-900 text-white px-4 py-3 rounded-xl mb-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Smartphone size={18} className="text-zinc-400" />
          <span className="text-xs font-bold tracking-wider uppercase">Console Mobile Active</span>
        </div>
        <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SÉCURISÉ</span>
        </div>
      </div>

      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center space-x-3">
            <span className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 rounded-lg text-lg font-black">Admin</span>
            <span>Console de Gestion</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gérez toutes les plateformes OZzo Design, OZzo Events et N'KA TICKET depuis cet espace sécurisé.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-zinc-500 font-semibold uppercase tracking-wider">
            Rôle: {currentUser?.role}
          </span>
          <button
            id="backup-shortcut"
            onClick={triggerBackup}
            className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300"
          >
            <Database size={14} />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Responsive Dashboard Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3">Sections du panel</span>
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {[
              { id: 'overview', label: "Vue d'ensemble", icon: TrendingUp },
              { id: 'services', label: 'Services (Design)', icon: FileText },
              { id: 'events', label: 'Événements (Events)', icon: Calendar },
              { id: 'tickets', label: 'Billets & Scans', icon: TicketIcon },
              { id: 'users', label: 'Équipe & Utilisateurs', icon: Users },
              { id: 'messages', label: 'Messages & Devis', icon: Mail },
              { id: 'security', label: 'Sécurité & Logs', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`dashboard-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Panel Workspace */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {/* TAB OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Metrics cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Clients</span>
                    <p className="text-2xl font-black text-zinc-950 dark:text-white mt-1">
                      {users.filter(u => u.role === 'client').length}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Événements</span>
                    <p className="text-2xl font-black text-zinc-950 dark:text-white mt-1">
                      {events.length}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Billets Vendus</span>
                    <p className="text-2xl font-black text-zinc-950 dark:text-white mt-1">
                      {tickets.length}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Billets Scannés</span>
                    <p className="text-2xl font-black text-zinc-950 dark:text-white mt-1">
                      {scanLogs.filter(l => l.status === 'valid').length}
                    </p>
                  </div>
                </div>

                {/* Financial Ledger Widget */}
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="text-emerald-500" />
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white">Bilan Financier OZzo</h3>
                    </div>
                    <button
                      id="ledger-new-entry"
                      onClick={() => setShowLedgerForm(!showLedgerForm)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold rounded-lg flex items-center space-x-1.5"
                    >
                      <Plus size={14} />
                      <span>Ajouter écriture</span>
                    </button>
                  </div>

                  {/* Financial Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1">
                        <ArrowUpRight size={14} />
                        <span>Recettes totales</span>
                      </span>
                      <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                        {totalRevenues.toLocaleString()} CFA
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1">
                        <ArrowDownRight size={14} />
                        <span>Dépenses totales</span>
                      </span>
                      <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-2">
                        {totalExpenses.toLocaleString()} CFA
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Bénéfice net
                      </span>
                      <p className={`text-2xl font-black mt-2 ${totalProfit >= 0 ? 'text-zinc-900 dark:text-white' : 'text-rose-600'}`}>
                        {totalProfit.toLocaleString()} CFA
                      </p>
                    </div>
                  </div>

                  {/* Ledger Form */}
                  {showLedgerForm && (
                    <form onSubmit={handleLedgerSubmit} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label htmlFor="ledger-type" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Type</label>
                          <select
                            id="ledger-type"
                            value={ledgerForm.type}
                            onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value as any })}
                            className="w-full mt-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                          >
                            <option value="revenue">Recette</option>
                            <option value="expense">Dépense</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="ledger-category" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Catégorie</label>
                          <input
                            id="ledger-category"
                            type="text"
                            required
                            placeholder="Sponsor, Matériel, etc"
                            value={ledgerForm.category}
                            onChange={(e) => setLedgerForm({ ...ledgerForm, category: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                          />
                        </div>
                        <div>
                          <label htmlFor="ledger-amount" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Montant (CFA)</label>
                          <input
                            id="ledger-amount"
                            type="number"
                            required
                            min="0"
                            placeholder="Montant"
                            value={ledgerForm.amount}
                            onChange={(e) => setLedgerForm({ ...ledgerForm, amount: Number(e.target.value) })}
                            className="w-full mt-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                          />
                        </div>
                        <div>
                          <label htmlFor="ledger-desc" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                          <input
                            id="ledger-desc"
                            type="text"
                            required
                            placeholder="Détails..."
                            value={ledgerForm.description}
                            onChange={(e) => setLedgerForm({ ...ledgerForm, description: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          id="cancel-ledger"
                          type="button"
                          onClick={() => setShowLedgerForm(false)}
                          className="px-3 py-1.5 text-xs text-zinc-500 font-semibold cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          id="submit-ledger"
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg"
                        >
                          Valider la transaction
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Financial journal list */}
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Journal des transactions</span>
                    {ledger.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic py-4 text-center">Aucune transaction enregistrée. Les achats de billets alimentent automatiquement ce journal.</p>
                    ) : (
                      ledger.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-900 dark:text-white">{item.description}</span>
                            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                              <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase font-bold">{item.category}</span>
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`font-mono font-black ${item.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {item.type === 'revenue' ? '+' : '-'}{item.amount.toLocaleString()} CFA
                            </span>
                            <button
                              id={`delete-ledger-${item.id}`}
                              onClick={() => deleteLedgerEntry(item.id)}
                              className="text-zinc-400 hover:text-rose-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB SERVICES */}
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Services OZzo Design</h2>
                  <button
                    id="new-service"
                    onClick={() => {
                      setEditingServiceId(null);
                      setServiceForm({ title: '', category: 'Design Graphique', description: '', priceRange: '', isPublished: true });
                      setShowServiceForm(!showServiceForm);
                    }}
                    className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    <Plus size={14} />
                    <span>Nouveau Service</span>
                  </button>
                </div>

                {/* Service creation form */}
                {showServiceForm && (
                  <form onSubmit={handleServiceSubmit} className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                      {editingServiceId ? 'Modifier le service' : 'Ajouter un service'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="service-title" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Nom du service</label>
                        <input
                          id="service-title"
                          type="text"
                          required
                          placeholder="Ex: Identité Visuelle Premium"
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="service-category" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Catégorie</label>
                        <select
                          id="service-category"
                          value={serviceForm.category}
                          onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        >
                          <option value="Design Graphique">Design Graphique</option>
                          <option value="Branding">Branding</option>
                          <option value="Développement Web">Développement Web</option>
                          <option value="Marketing Digital">Marketing Digital</option>
                          <option value="Impression">Impression</option>
                          <option value="Production Vidéo">Production Vidéo</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="service-price" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Gamme de tarifs</label>
                        <input
                          id="service-price"
                          type="text"
                          placeholder="Ex: Sur devis ou 150 000 CFA"
                          value={serviceForm.priceRange}
                          onChange={(e) => setServiceForm({ ...serviceForm, priceRange: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                      <div className="flex items-center space-x-3 pt-6">
                        <input
                          id="service-publish"
                          type="checkbox"
                          checked={serviceForm.isPublished}
                          onChange={(e) => setServiceForm({ ...serviceForm, isPublished: e.target.checked })}
                          className="w-4 h-4 text-zinc-900 focus:ring-0 rounded border-zinc-300"
                        />
                        <label htmlFor="service-publish" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Publier immédiatement</label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="service-desc" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                      <textarea
                        id="service-desc"
                        rows={3}
                        required
                        placeholder="Détaillez le service..."
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        id="cancel-service-form"
                        type="button"
                        onClick={() => setShowServiceForm(false)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-500 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        id="submit-service"
                        type="submit"
                        className="px-5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-lg"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                )}

                {/* Services list table/cards */}
                <div className="space-y-2">
                  {services.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
                      <p className="text-sm text-zinc-400 italic">Aucun service disponible. Créez-en un avec le bouton ci-dessus !</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((srv) => (
                        <div key={srv.id} className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-zinc-500">
                                {srv.category}
                              </span>
                              <div className="flex items-center space-x-1.5">
                                <button
                                  id={`toggle-publish-service-${srv.id}`}
                                  onClick={() => updateService(srv.id, { isPublished: !srv.isPublished })}
                                  className={`p-1.5 rounded-lg border border-zinc-100 dark:border-zinc-900 ${srv.isPublished ? 'text-emerald-500' : 'text-zinc-400'}`}
                                  title={srv.isPublished ? 'Masquer' : 'Publier'}
                                >
                                  {srv.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                                </button>
                                <button
                                  id={`edit-service-${srv.id}`}
                                  onClick={() => handleEditService(srv)}
                                  className="p-1.5 rounded-lg border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:text-zinc-950"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  id={`delete-service-${srv.id}`}
                                  onClick={() => deleteService(srv.id)}
                                  className="p-1.5 rounded-lg border border-zinc-100 dark:border-zinc-900 text-rose-500 hover:bg-rose-50"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-bold text-base text-zinc-950 dark:text-white tracking-tight">{srv.title}</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">{srv.description}</p>
                          </div>
                          <div className="border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-3 flex justify-between items-center text-xs font-semibold text-zinc-400">
                            <span>Tarif: {srv.priceRange || 'Sur devis'}</span>
                            <span>{new Date(srv.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB EVENTS */}
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Événements (OZzo Events)</h2>
                  <button
                    id="new-event"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm({
                        title: '', description: '', date: '', time: '', location: '', organizers: '', partners: '', isPrivate: false, isPublished: true, isArchived: false, imageUrl: '',
                        categories: [{ name: 'Standard', price: 5000, capacity: 100 }]
                      });
                      setShowEventForm(!showEventForm);
                    }}
                    className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    <Plus size={14} />
                    <span>Créer un événement</span>
                  </button>
                </div>

                {/* Event Creation Form */}
                {showEventForm && (
                  <form onSubmit={handleEventSubmit} className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                      {editingEventId ? "Modifier l'événement" : 'Ajouter un événement'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="event-title" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Nom de l'événement</label>
                        <input
                          id="event-title"
                          type="text"
                          required
                          placeholder="Ex: Gala des Étoiles"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="event-date" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Date & Heure</label>
                        <div className="flex space-x-2">
                          <input
                            id="event-date"
                            type="date"
                            required
                            value={eventForm.date}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                          />
                          <input
                            id="event-time"
                            type="time"
                            required
                            value={eventForm.time}
                            onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                            className="w-24 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="event-location" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Lieu</label>
                        <input
                          id="event-location"
                          type="text"
                          required
                          placeholder="Ex: Palais de la Culture, Bamako"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="event-image-url" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Lien de l'image (Optionnel)</label>
                        <input
                          id="event-image-url"
                          type="url"
                          placeholder="Ex: https://images.unsplash.com/photo-..."
                          value={eventForm.imageUrl}
                          onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="event-organizers" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Organisateurs (Séparés par virgules)</label>
                        <input
                          id="event-organizers"
                          type="text"
                          placeholder="Ex: OZzo Events, Ministère de la Culture"
                          value={eventForm.organizers}
                          onChange={(e) => setEventForm({ ...eventForm, organizers: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="event-partners" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Partenaires / Sponsors (Séparés par virgules)</label>
                        <input
                          id="event-partners"
                          type="text"
                          placeholder="Ex: Orange, Canal+"
                          value={eventForm.partners}
                          onChange={(e) => setEventForm({ ...eventForm, partners: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          id="event-private"
                          type="checkbox"
                          checked={eventForm.isPrivate}
                          onChange={(e) => setEventForm({ ...eventForm, isPrivate: e.target.checked })}
                          className="w-4 h-4 rounded border-zinc-300"
                        />
                        <label htmlFor="event-private" className="text-xs font-bold text-zinc-500 uppercase">Événement Privé</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="event-publish"
                          type="checkbox"
                          checked={eventForm.isPublished}
                          onChange={(e) => setEventForm({ ...eventForm, isPublished: e.target.checked })}
                          className="w-4 h-4 rounded border-zinc-300"
                        />
                        <label htmlFor="event-publish" className="text-xs font-bold text-zinc-500 uppercase">Publier immédiatement</label>
                      </div>
                    </div>

                    {/* Ticket categories settings */}
                    <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                      <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Catégories de billets</span>
                      {eventForm.categories.map((cat, idx) => (
                        <div key={idx} className="flex space-x-2 items-center">
                          <input
                            aria-label={`Nom de la catégorie ${idx + 1}`}
                            type="text"
                            required
                            placeholder="Nom (Ex: VIP, Standard)"
                            value={cat.name}
                            onChange={(e) => {
                              const copy = [...eventForm.categories];
                              copy[idx].name = e.target.value;
                              setEventForm({ ...eventForm, categories: copy });
                            }}
                            className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs dark:bg-zinc-900"
                          />
                          <input
                            aria-label={`Prix de la catégorie ${idx + 1}`}
                            type="number"
                            required
                            placeholder="Prix (CFA)"
                            value={cat.price}
                            onChange={(e) => {
                              const copy = [...eventForm.categories];
                              copy[idx].price = Number(e.target.value);
                              setEventForm({ ...eventForm, categories: copy });
                            }}
                            className="w-24 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs dark:bg-zinc-900"
                          />
                          <input
                            aria-label={`Capacité de la catégorie ${idx + 1}`}
                            type="number"
                            required
                            placeholder="Places"
                            value={cat.capacity}
                            onChange={(e) => {
                              const copy = [...eventForm.categories];
                              copy[idx].capacity = Number(e.target.value);
                              setEventForm({ ...eventForm, categories: copy });
                            }}
                            className="w-20 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs dark:bg-zinc-900"
                          />
                          {eventForm.categories.length > 1 && (
                            <button
                              id={`remove-category-${idx}`}
                              type="button"
                              onClick={() => {
                                const copy = eventForm.categories.filter((_, i) => i !== idx);
                                setEventForm({ ...eventForm, categories: copy });
                              }}
                              className="p-2 text-rose-500"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        id="add-category"
                        type="button"
                        onClick={() => setEventForm({
                          ...eventForm,
                          categories: [...eventForm.categories, { name: '', price: 0, capacity: 50 }]
                        })}
                        className="text-[11px] font-bold text-zinc-500 hover:text-zinc-950 flex items-center space-x-1"
                      >
                        <Plus size={12} />
                        <span>Ajouter une catégorie</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="event-description" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Description de l'événement</label>
                      <textarea
                        id="event-description"
                        rows={3}
                        required
                        placeholder="Donnez les détails de l'événement..."
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        id="cancel-event-form"
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-500 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        id="submit-event"
                        type="submit"
                        className="px-5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-lg"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                )}

                {/* Events listing */}
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
                      <p className="text-sm text-zinc-400 italic">Aucun événement planifié. Ajoutez-en un avec le bouton ci-dessus !</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {events.map((ev) => (
                        <div key={ev.id} className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded">
                                {ev.date} à {ev.time}
                              </span>
                              {ev.isPrivate && (
                                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold uppercase">Privé</span>
                              )}
                              {ev.isArchived && (
                                <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold uppercase">Archivé</span>
                              )}
                            </div>
                            <h4 className="font-bold text-base text-zinc-950 dark:text-white tracking-tight">{ev.title}</h4>
                            <p className="text-xs text-zinc-400 leading-normal max-w-xl">{ev.location}</p>
                            
                            {/* Stats */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5">
                              {ev.ticketCategories.map((c, i) => (
                                <span key={i} className="text-[11px] font-semibold text-zinc-500">
                                  {c.name}: <strong className="text-zinc-900 dark:text-white">{c.sold}/{c.capacity}</strong> places vendues
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 self-end md:self-center">
                            <button
                              id={`toggle-publish-event-${ev.id}`}
                              onClick={() => updateEvent(ev.id, { isPublished: !ev.isPublished })}
                              className={`p-2 rounded-lg border border-zinc-100 dark:border-zinc-900 ${ev.isPublished ? 'text-emerald-500' : 'text-zinc-400'}`}
                              title={ev.isPublished ? 'Masquer' : 'Publier'}
                            >
                              {ev.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button
                              id={`edit-event-${ev.id}`}
                              onClick={() => handleEditEvent(ev)}
                              className="p-2 rounded-lg border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:text-zinc-950"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              id={`delete-event-${ev.id}`}
                              onClick={() => deleteEvent(ev.id)}
                              className="p-2 rounded-lg border border-zinc-100 dark:border-zinc-900 text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB TICKETS */}
            {activeTab === 'tickets' && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Base de Données des Billets</h2>
                  <button
                    id="export-tickets"
                    onClick={() => handleExportData('billets', tickets)}
                    className="flex items-center space-x-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300"
                  >
                    <Download size={14} />
                    <span>Exporter CSV</span>
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl">
                    <p className="text-sm text-zinc-400 italic">Aucun billet vendu pour le moment.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-4">N° Billet</th>
                          <th className="p-4">Événement</th>
                          <th className="p-4">Acheteur</th>
                          <th className="p-4">Catégorie</th>
                          <th className="p-4">Prix</th>
                          <th className="p-4">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                        {tickets.map((t) => (
                          <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-all">
                            <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">{t.ticketNumber}</td>
                            <td className="p-4 truncate max-w-[150px]">{t.eventTitle}</td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span>{t.buyerName}</span>
                                <span className="text-[10px] text-zinc-400">{t.buyerEmail}</span>
                              </div>
                            </td>
                            <td className="p-4">{t.categoryName}</td>
                            <td className="p-4 font-mono">{t.price.toLocaleString()} CFA</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                t.status === 'valid'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : t.status === 'used'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {t.status === 'valid' ? 'Actif' : t.status === 'used' ? 'Scanné' : 'Annulé'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB USERS */}
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Gestion de l'Équipe & Utilisateurs</h2>
                  <button
                    id="new-user"
                    onClick={() => setShowUserForm(!showUserForm)}
                    className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    <UserPlus size={14} />
                    <span>Créer un Membre</span>
                  </button>
                </div>

                {/* User creation form */}
                {showUserForm && (
                  <form onSubmit={handleUserSubmit} className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Recruter un collaborateur</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="user-name" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Nom complet</label>
                        <input
                          id="user-name"
                          type="text"
                          required
                          placeholder="Ex: Mohamed Touré"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="user-email" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Adresse e-mail</label>
                        <input
                          id="user-email"
                          type="email"
                          required
                          placeholder="mohamed@ozzo.design"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="user-role" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Rôle attribué</label>
                        <select
                          id="user-role"
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        >
                          <option value="admin">Administrateur Secondaire</option>
                          <option value="employee">Employé (Contrôleur / Designer)</option>
                          <option value="client">Client</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="user-phone" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Téléphone (Optionnel)</label>
                        <input
                          id="user-phone"
                          type="text"
                          placeholder="Ex: 71156304"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                          className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        id="cancel-user-form"
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-500"
                      >
                        Annuler
                      </button>
                      <button
                        id="submit-user"
                        type="submit"
                        className="px-5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-lg"
                      >
                        Créer le membre
                      </button>
                    </div>
                  </form>
                )}

                {/* Users list */}
                <div className="space-y-2">
                  {users.length === 0 ? (
                    <p className="text-sm text-zinc-400 italic">Aucun utilisateur enregistré.</p>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-900 flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-900 dark:text-white">{user.name}</span>
                          <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                            <span>{user.email}</span>
                            {user.phone && <span>• {user.phone}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {isSuperAdmin && user.email !== 'boubacar16cisse@gmail.com' ? (
                            <select
                              aria-label={`Rôle pour l'utilisateur ${user.email}`}
                              value={user.role}
                              onChange={(e) => updateUserRoleByAdmin(user.id, e.target.value as UserRole)}
                              className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded bg-transparent focus:outline-none text-[11px]"
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="admin">Admin</option>
                              <option value="employee">Employé</option>
                              <option value="client">Client</option>
                            </select>
                          ) : (
                            <span className="font-bold capitalize opacity-80">{user.role}</span>
                          )}

                          {isSuperAdmin && user.email !== 'boubacar16cisse@gmail.com' && (
                            <button
                              id={`delete-user-${user.id}`}
                              onClick={() => deleteUserByAdmin(user.id)}
                              className="text-zinc-400 hover:text-rose-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB MESSAGES & DEVIS */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Devis clients */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                    <FileText size={16} />
                    <span>Demandes de Devis Reçues ({quotes.length})</span>
                  </h3>

                  {quotes.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-4">Aucun devis demandé pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {quotes.map((qte) => (
                        <div key={qte.id} className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 space-y-3 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{qte.clientName}</h4>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{qte.clientEmail} • {qte.clientPhone || 'Pas de tél.'}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                              qte.status === 'pending'
                                ? 'bg-amber-100/50 text-amber-600 dark:bg-amber-950/20'
                                : qte.status === 'approved'
                                ? 'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-950/20'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                            }`}>
                              {qte.status === 'pending' ? 'En attente' : qte.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                            </span>
                          </div>
                          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-900 font-medium">
                            <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Service: {qte.serviceTitle}</p>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-normal">{qte.description}</p>
                          </div>
                          <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 pt-1">
                            <span>Budget estimé: <strong className="text-zinc-900 dark:text-white font-mono">{qte.budget}</strong></span>
                            <div className="flex space-x-2">
                              {qte.status === 'pending' && (
                                <>
                                  <button
                                    id={`approve-quote-${qte.id}`}
                                    onClick={() => updateQuoteStatus(qte.id, 'approved')}
                                    className="text-emerald-500 flex items-center space-x-0.5"
                                  >
                                    <Check size={12} />
                                    <span>Accepter</span>
                                  </button>
                                  <button
                                    id={`reject-quote-${qte.id}`}
                                    onClick={() => updateQuoteStatus(qte.id, 'rejected')}
                                    className="text-rose-500 flex items-center space-x-0.5"
                                  >
                                    <X size={12} />
                                    <span>Rejeter</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Formulaire contact messages */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                    <Mail size={16} />
                    <span>Messages de Contact Reçus ({messages.length})</span>
                  </h3>

                  {messages.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-4">Aucun message de contact reçu pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 space-y-3 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{msg.name}</h4>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{msg.email} • {msg.phone || 'Pas de tél.'}</p>
                            </div>
                            {!msg.isRead && (
                              <button
                                id={`read-message-${msg.id}`}
                                onClick={() => markMessageAsRead(msg.id)}
                                className="text-[9px] font-bold uppercase bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-2 py-1 rounded"
                              >
                                Marquer comme lu
                              </button>
                            )}
                          </div>
                          <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
                            <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-0.5">Sujet: {msg.subject}</p>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-normal">{msg.message}</p>
                          </div>
                          <div className="text-right text-[10px] text-zinc-400">
                            Reçu le: {new Date(msg.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB SECURITY & LOGS */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Backup / Restore System */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center space-x-2">
                    <Database size={18} className="text-zinc-400" />
                    <span>Sauvegardes de Sécurité</span>
                  </h3>
                  <p className="text-xs text-zinc-500 leading-normal">
                    Sauvegardez l'intégralité de la base de données (services, événements, ventes de billets, messages) localement. En cas de réinitialisation, vous pourrez restaurer instantanément votre configuration en un clic.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      id="security-new-backup"
                      onClick={triggerBackup}
                      className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs rounded-xl flex items-center space-x-1.5"
                    >
                      <Plus size={14} />
                      <span>Créer une Sauvegarde</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {backups.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">Aucune sauvegarde locale disponible.</p>
                    ) : (
                      backups.map((bak) => (
                        <div key={bak.id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 text-xs font-semibold">
                          <div className="space-y-0.5">
                            <span className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px] block truncate max-w-[200px] md:max-w-xs">{bak.filename}</span>
                            <span className="text-[10px] text-zinc-400">{new Date(bak.timestamp).toLocaleString()} ({bak.size})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isSuperAdmin && (
                              <button
                                id={`restore-backup-${bak.id}`}
                                onClick={() => restoreBackup(bak.id)}
                                className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded"
                              >
                                Restaurer
                              </button>
                            )}
                            <button
                              id={`delete-backup-${bak.id}`}
                              onClick={() => deleteBackup(bak.id)}
                              className="text-zinc-400 hover:text-rose-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Shield Security Config */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center space-x-2">
                      <ShieldAlert size={18} className="text-emerald-500" />
                      <span>Bouclier Anti-Spam & DDoS</span>
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-lg leading-normal">
                      Bloque automatiquement les comptes multiples et protège les formulaires d'achats de billets N'KA contre les robots.
                    </p>
                  </div>
                  <button
                    id="toggle-security-shield"
                    onClick={() => setSecurityShield(!settings.enableSecurityShield)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap uppercase tracking-wider ${
                      settings.enableSecurityShield 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
                    }`}
                  >
                    {settings.enableSecurityShield ? 'Bouclier Actif' : 'Bouclier Inactif'}
                  </button>
                </div>

                {/* Audit Connection Logs */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                    <KeySquare size={16} />
                    <span>Journal de Connexion & Sécurité</span>
                  </h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {connectionLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-between text-[11px] font-semibold">
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-900 dark:text-white">{log.email}</span>
                          <p className="text-[10px] text-zinc-400">IP: {log.ipAddress} • {log.device}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {log.status === 'success' ? 'Réussi' : 'Refusé'}
                          </span>
                          <span className="block text-[9px] text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Activity Logs */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                    <Activity size={16} />
                    <span>Journal d'Activité de l'Administration</span>
                  </h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-between text-[11px] font-semibold">
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-900 dark:text-white">[{log.action}] {log.details}</span>
                          <p className="text-[10px] text-zinc-400">Opérateur: {log.email}</p>
                        </div>
                        <span className="text-[9px] text-zinc-400">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
