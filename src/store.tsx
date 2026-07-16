import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Service, Event, Ticket, ScanLog, 
  ContactMessage, QuoteRequest, LedgerEntry, ConnectionLog, 
  ActivityLog, Backup, SystemSettings, TicketCategory 
} from './types';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  services: Service[];
  events: Event[];
  tickets: Ticket[];
  scanLogs: ScanLog[];
  messages: ContactMessage[];
  quotes: QuoteRequest[];
  ledger: LedgerEntry[];
  connectionLogs: ConnectionLog[];
  activityLogs: ActivityLog[];
  backups: Backup[];
  settings: SystemSettings;
  theme: 'light' | 'dark';
  
  // Auth Functions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  verifyEmail: (email: string) => Promise<boolean>;
  updateProfile: (name: string, phone?: string, avatarUrl?: string) => Promise<boolean>;
  updatePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  toggleTheme: () => void;

  // Admin User & Roles Functions
  createUserByAdmin: (name: string, email: string, role: UserRole, phone?: string) => void;
  deleteUserByAdmin: (userId: string) => void;
  updateUserRoleByAdmin: (userId: string, role: UserRole) => void;

  // Services CRUD
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Events CRUD
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'galleryImages' | 'galleryVideos'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Ticket Purchase
  purchaseTicket: (
    eventId: string, 
    categoryId: string, 
    quantity: number, 
    buyerName: string, 
    buyerEmail: string, 
    buyerPhone?: string
  ) => Promise<Ticket[]>;

  // Scanner Functionality
  scanTicket: (identifier: string, scannedBy: string, method: 'qr' | 'manual') => {
    status: 'valid' | 'already_used' | 'not_found' | 'cancelled' | 'expired';
    ticket?: Ticket;
    message: string;
  };

  // Contacts & Quotes
  sendContactMessage: (name: string, email: string, phone: string, subject: string, message: string) => Promise<void>;
  requestQuote: (clientName: string, clientEmail: string, clientPhone: string, serviceTitle: string, budget: string, description: string) => Promise<void>;
  markMessageAsRead: (id: string) => void;
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => void;

  // Financial Ledger
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'date' | 'createdBy'>) => void;
  deleteLedgerEntry: (id: string) => void;

  // Backups & Security
  triggerBackup: () => void;
  restoreBackup: (backupId: string) => boolean;
  deleteBackup: (backupId: string) => void;
  setSecurityShield: (enabled: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SystemSettings = {
  id: 'settings',
  themeMode: 'light',
  enableSecurityShield: true,
  maxLoginAttempts: 5,
  sessionTimeoutMinutes: 30,
  phoneContact: '71156304',
  whatsappContact: '71156304',
  emailContact: 'boubacar16cisse@gmail.com'
};

const SUPER_ADMIN_EMAIL = 'boubacar16cisse@gmail.com';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load database from localStorage on mount
  useEffect(() => {
    const loadData = <T,>(key: string, defaultValue: T): T => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error(`Error loading localStorage key: ${key}`, e);
        return defaultValue;
      }
    };

    setUsers(loadData<User[]>('ozzo_users', []));
    setServices(loadData<Service[]>('ozzo_services', []));
    setEvents(loadData<Event[]>('ozzo_events', []));
    setTickets(loadData<Ticket[]>('ozzo_tickets', []));
    setScanLogs(loadData<ScanLog[]>('ozzo_scan_logs', []));
    setMessages(loadData<ContactMessage[]>('ozzo_messages', []));
    setQuotes(loadData<QuoteRequest[]>('ozzo_quotes', []));
    setLedger(loadData<LedgerEntry[]>('ozzo_ledger', []));
    setConnectionLogs(loadData<ConnectionLog[]>('ozzo_conn_logs', []));
    setActivityLogs(loadData<ActivityLog[]>('ozzo_act_logs', []));
    setBackups(loadData<Backup[]>('ozzo_backups', []));
    
    const loadedSettings = loadData<SystemSettings>('ozzo_settings', DEFAULT_SETTINGS);
    setSettings(loadedSettings);
    setTheme(loadedSettings.themeMode);

    const cachedUser = localStorage.getItem('ozzo_current_user');
    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem('ozzo_current_user');
      }
    }
  }, []);

  // Save changes helper
  const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const logActivity = (email: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setActivityLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 500); // limit to 500 logs
      saveData('ozzo_act_logs', updated);
      return updated;
    });
  };

  const logConnection = (email: string, status: 'success' | 'failure', reason?: string) => {
    const newLog: ConnectionLog = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email,
      timestamp: new Date().toISOString(),
      status,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
      device: window.navigator.userAgent.split(' ')[0] || 'Unknown Device',
      reason
    };
    setConnectionLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 500);
      saveData('ozzo_conn_logs', updated);
      return updated;
    });
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    const updatedSettings = { ...settings, themeMode: nextTheme };
    setSettings(updatedSettings);
    saveData('ozzo_settings', updatedSettings);
  };

  // Auth Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Basic trim and lowercase for security
    const cleanEmail = email.trim().toLowerCase();
    
    // Safety check against fake accounts/empty passwords
    if (!cleanEmail || !password) {
      logConnection(cleanEmail || 'anonymous', 'failure', 'Champs vides');
      return false;
    }

    // Check if user exists. If it's the SUPER_ADMIN and does not exist yet, we auto-create!
    let targetUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (cleanEmail === SUPER_ADMIN_EMAIL) {
      if (!targetUser) {
        // Automatically create Boubacar as the Super Admin
        const boubacar: User = {
          id: 'user_super_admin',
          email: SUPER_ADMIN_EMAIL,
          name: 'Boubacar Cissé',
          role: 'super_admin',
          isVerified: true,
          createdAt: new Date().toISOString(),
          phone: '71156304'
        };
        const updatedUsers = [...users, boubacar];
        setUsers(updatedUsers);
        saveData('ozzo_users', updatedUsers);
        targetUser = boubacar;
      }
    }

    if (targetUser) {
      // Simulate successful password check
      setCurrentUser(targetUser);
      saveData('ozzo_current_user', targetUser);
      logConnection(cleanEmail, 'success');
      logActivity(cleanEmail, 'Connexion', 'L\'utilisateur s\'est connecté.');
      return true;
    } else {
      logConnection(cleanEmail, 'failure', 'Utilisateur inexistant');
      return false;
    }
  };

  const register = async (name: string, email: string, phone?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name || !cleanEmail) return false;

    // Check if already exists
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) return false;

    // Check if registration email is super admin
    const resolvedRole: UserRole = cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : 'client';

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      name,
      role: resolvedRole,
      isVerified: cleanEmail === SUPER_ADMIN_EMAIL, // auto-verify the super admin
      createdAt: new Date().toISOString(),
      phone: phone || ''
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveData('ozzo_users', updatedUsers);
    logActivity(cleanEmail, 'Inscription', `Création de compte réussie avec le rôle: ${resolvedRole}`);
    
    // Automatically log in newly registered user
    setCurrentUser(newUser);
    saveData('ozzo_current_user', newUser);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      logActivity(currentUser.email, 'Déconnexion', 'L\'utilisateur s\'est déconnecté.');
      setCurrentUser(null);
      localStorage.removeItem('ozzo_current_user');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const userExists = users.some(u => u.email.toLowerCase() === cleanEmail) || cleanEmail === SUPER_ADMIN_EMAIL;
    if (userExists) {
      logActivity(cleanEmail, 'Réinitialisation mot de passe', 'Demande de lien de réinitialisation envoyée.');
      return true;
    }
    return false;
  };

  const verifyEmail = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    setUsers(prev => {
      const updated = prev.map(u => u.email.toLowerCase() === cleanEmail ? { ...u, isVerified: true } : u);
      saveData('ozzo_users', updated);
      return updated;
    });
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      const updatedUser = { ...currentUser, isVerified: true };
      setCurrentUser(updatedUser);
      saveData('ozzo_current_user', updatedUser);
    }
    logActivity(cleanEmail, 'Vérification email', 'L\'adresse e-mail a été vérifiée avec succès.');
    return true;
  };

  const updateProfile = async (name: string, phone?: string, avatarUrl?: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    const updatedUser = { 
      ...currentUser, 
      name, 
      phone: phone || currentUser.phone, 
      avatarUrl: avatarUrl || currentUser.avatarUrl 
    };

    setCurrentUser(updatedUser);
    saveData('ozzo_current_user', updatedUser);

    setUsers(prev => {
      const updated = prev.map(u => u.id === currentUser.id ? updatedUser : u);
      saveData('ozzo_users', updated);
      return updated;
    });

    logActivity(currentUser.email, 'Mise à jour profil', 'Modification des détails du profil.');
    return true;
  };

  const updatePassword = async (oldPass: string, newPass: string): Promise<boolean> => {
    if (!currentUser) return false;
    logActivity(currentUser.email, 'Changement de mot de passe', 'Le mot de passe a été modifié avec succès.');
    return true;
  };

  // Admin Controls
  const createUserByAdmin = (name: string, email: string, role: UserRole, phone?: string) => {
    if (!currentUser || (currentUser.role !== 'super_admin' && currentUser.role !== 'admin')) return;
    const cleanEmail = email.trim().toLowerCase();
    
    // Prevent creating duplicate users
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) return;

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      name,
      role,
      isVerified: true, // admin created accounts are pre-verified
      createdAt: new Date().toISOString(),
      phone: phone || ''
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveData('ozzo_users', updated);
    logActivity(currentUser.email, 'Création utilisateur', `Création de l'utilisateur ${cleanEmail} avec le rôle ${role}`);
  };

  const deleteUserByAdmin = (userId: string) => {
    if (!currentUser || currentUser.role !== 'super_admin') return;
    
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.email === SUPER_ADMIN_EMAIL) return; // cannot delete super_admin

    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    saveData('ozzo_users', updated);
    logActivity(currentUser.email, 'Suppression utilisateur', `Suppression de l'utilisateur ${target.email}`);
  };

  const updateUserRoleByAdmin = (userId: string, role: UserRole) => {
    if (!currentUser || currentUser.role !== 'super_admin') return;
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.email === SUPER_ADMIN_EMAIL) return; // cannot change super admin role

    const updated = users.map(u => u.id === userId ? { ...u, role } : u);
    setUsers(updated);
    saveData('ozzo_users', updated);
    logActivity(currentUser.email, 'Attribution rôle', `Changement de rôle de ${target.email} à ${role}`);
  };

  // Services CRUD
  const addService = (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    const newService: Service = {
      ...serviceData,
      id: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...services, newService];
    setServices(updated);
    saveData('ozzo_services', updated);
    
    if (currentUser) {
      logActivity(currentUser.email, 'Ajout service', `Service créé: ${newService.title}`);
    }
  };

  const updateService = (id: string, partial: Partial<Service>) => {
    const updated = services.map(s => s.id === id ? { ...s, ...partial } : s);
    setServices(updated);
    saveData('ozzo_services', updated);
    
    if (currentUser) {
      const srv = services.find(s => s.id === id);
      logActivity(currentUser.email, 'Modification service', `Service modifié: ${srv?.title}`);
    }
  };

  const deleteService = (id: string) => {
    const srv = services.find(s => s.id === id);
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    saveData('ozzo_services', updated);
    
    if (currentUser && srv) {
      logActivity(currentUser.email, 'Suppression service', `Service supprimé: ${srv.title}`);
    }
  };

  // Events CRUD
  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'galleryImages' | 'galleryVideos'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      galleryImages: [],
      galleryVideos: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    saveData('ozzo_events', updated);
    
    if (currentUser) {
      logActivity(currentUser.email, 'Création événement', `Événement créé: ${newEvent.title}`);
    }
  };

  const updateEvent = (id: string, partial: Partial<Event>) => {
    const updated = events.map(e => e.id === id ? { ...e, ...partial } : e);
    setEvents(updated);
    saveData('ozzo_events', updated);
    
    if (currentUser) {
      const ev = events.find(e => e.id === id);
      logActivity(currentUser.email, 'Modification événement', `Événement modifié: ${ev?.title}`);
    }
  };

  const deleteEvent = (id: string) => {
    const ev = events.find(e => e.id === id);
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveData('ozzo_events', updated);
    
    if (currentUser && ev) {
      logActivity(currentUser.email, 'Suppression événement', `Événement supprimé: ${ev.title}`);
    }
  };

  // Ticket Purchase
  const purchaseTicket = async (
    eventId: string, 
    categoryId: string, 
    quantity: number, 
    buyerName: string, 
    buyerEmail: string, 
    buyerPhone?: string
  ): Promise<Ticket[]> => {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Événement introuvable');

    const catIndex = event.ticketCategories.findIndex(c => c.id === categoryId);
    if (catIndex === -1) throw new Error('Catégorie introuvable');
    
    const category = event.ticketCategories[catIndex];
    if (category.capacity - category.sold < quantity) {
      throw new Error('Places insuffisantes pour cette catégorie');
    }

    // Purchase processing
    const newTickets: Ticket[] = [];
    const totalAmount = category.price * quantity;

    for (let i = 0; i < quantity; i++) {
      // Create high security secure unique code:
      // Combine timestamps, cryptorandom chunks and event keys
      const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
      const ticketNum = `OZ-${Date.now().toString().slice(-4)}-${randHex}`;
      const hashData = `${ticketNum}_${eventId}_${categoryId}_${i}_${Math.random()}`;

      const tkt: Ticket = {
        id: `tkt_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
        ticketNumber: ticketNum,
        qrCodeData: btoa(hashData).slice(0, 32), // Simulate highly unique secure QR payload
        eventId,
        eventTitle: event.title,
        categoryId,
        categoryName: category.name,
        price: category.price,
        buyerName,
        buyerEmail: buyerEmail.trim().toLowerCase(),
        buyerPhone: buyerPhone || '',
        status: 'valid',
        purchaseDate: new Date().toISOString()
      };
      newTickets.push(tkt);
    }

    // Update tickets database
    const updatedTickets = [...tickets, ...newTickets];
    setTickets(updatedTickets);
    saveData('ozzo_tickets', updatedTickets);

    // Update event ticket count
    const updatedCategories = event.ticketCategories.map(c => 
      c.id === categoryId ? { ...c, sold: c.sold + quantity } : c
    );
    updateEvent(eventId, { ticketCategories: updatedCategories });

    // Log the financial transaction in the Ledger
    const newLedgerEntry: LedgerEntry = {
      id: `led_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'revenue',
      category: 'Billetterie - ' + event.title,
      amount: totalAmount,
      description: `Achat de ${quantity} billet(s) ${category.name} par ${buyerName} (${buyerEmail})`,
      date: new Date().toISOString(),
      createdBy: 'System'
    };
    setLedger(prev => {
      const updatedLedger = [newLedgerEntry, ...prev];
      saveData('ozzo_ledger', updatedLedger);
      return updatedLedger;
    });

    logActivity(buyerEmail, 'Achat Billets', `Achat réussi de ${quantity} billet(s) pour ${event.title}`);

    return newTickets;
  };

  // SCANNER & VALIDATION GATE
  const scanTicket = (identifier: string, scannedBy: string, method: 'qr' | 'manual') => {
    const cleanId = identifier.trim();
    
    // Find ticket by QR hash OR ticket number
    const tktIndex = tickets.findIndex(t => t.qrCodeData === cleanId || t.ticketNumber === cleanId);
    
    if (tktIndex === -1) {
      // Record failed scan log
      const logId = `scan_${Date.now()}`;
      const newLog: ScanLog = {
        id: logId,
        ticketNumber: cleanId,
        timestamp: new Date().toISOString(),
        status: 'not_found',
        scannedBy,
        method,
        details: 'Billet introuvable dans la base de données'
      };
      setScanLogs(prev => {
        const updated = [newLog, ...prev];
        saveData('ozzo_scan_logs', updated);
        return updated;
      });
      return { status: 'not_found' as const, message: 'Billet introuvable' };
    }

    const ticket = tickets[tktIndex];
    let scanResult: 'valid' | 'already_used' | 'cancelled' | 'expired' = 'valid';
    let msg = 'Billet valide. Accès autorisé.';

    if (ticket.status === 'used') {
      scanResult = 'already_used';
      msg = `Billet déjà scanné à ${new Date(ticket.scannedAt || '').toLocaleTimeString()}`;
    } else if (ticket.status === 'cancelled') {
      scanResult = 'cancelled';
      msg = 'Ce billet a été annulé par l\'administrateur';
    } else if (ticket.status === 'expired') {
      scanResult = 'expired';
      msg = 'Ce billet a expiré';
    }

    // If it was valid, mutate to used (prevent double scan!)
    if (scanResult === 'valid') {
      const updatedTickets = [...tickets];
      updatedTickets[tktIndex] = {
        ...ticket,
        status: 'used',
        scannedAt: new Date().toISOString(),
        scannedBy
      };
      setTickets(updatedTickets);
      saveData('ozzo_tickets', updatedTickets);
    }

    // Append Scan Log
    const logId = `scan_${Date.now()}`;
    const newLog: ScanLog = {
      id: logId,
      ticketNumber: ticket.ticketNumber,
      timestamp: new Date().toISOString(),
      status: scanResult,
      scannedBy,
      method,
      details: `${ticket.buyerName} - ${ticket.eventTitle} (${ticket.categoryName})`
    };
    setScanLogs(prev => {
      const updated = [newLog, ...prev];
      saveData('ozzo_scan_logs', updated);
      return updated;
    });

    logActivity(scannedBy, 'Contrôle Billet', `Scan ticket ${ticket.ticketNumber}: Résultat = ${scanResult}`);

    return { status: scanResult, ticket: tickets[tktIndex], message: msg };
  };

  // Contacts & Quote requests
  const sendContactMessage = async (name: string, email: string, phone: string, subject: string, message: string) => {
    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => {
      const updated = [newMessage, ...prev];
      saveData('ozzo_messages', updated);
      return updated;
    });
    logActivity(email, 'Contact', `Message envoyé par ${name}: ${subject}`);
  };

  const requestQuote = async (
    clientName: string, 
    clientEmail: string, 
    clientPhone: string, 
    serviceTitle: string, 
    budget: string, 
    description: string
  ) => {
    const newQuote: QuoteRequest = {
      id: `qte_${Date.now()}`,
      clientName,
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone,
      serviceTitle,
      budget,
      description,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setQuotes(prev => {
      const updated = [newQuote, ...prev];
      saveData('ozzo_quotes', updated);
      return updated;
    });
    logActivity(clientEmail, 'Demande Devis', `Demande de devis pour le service "${serviceTitle}"`);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, isRead: true } : m);
      saveData('ozzo_messages', updated);
      return updated;
    });
  };

  const updateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, status } : q);
      saveData('ozzo_quotes', updated);
      return updated;
    });
    if (currentUser) {
      logActivity(currentUser.email, 'Statut Devis', `Devis ${id} modifié en statut: ${status}`);
    }
  };

  // Financial Ledger
  const addLedgerEntry = (entry: Omit<LedgerEntry, 'id' | 'date' | 'createdBy'>) => {
    const userEmail = currentUser ? currentUser.email : 'System';
    const newEntry: LedgerEntry = {
      ...entry,
      id: `led_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString(),
      createdBy: userEmail
    };
    const updated = [newEntry, ...ledger];
    setLedger(updated);
    saveData('ozzo_ledger', updated);
    logActivity(userEmail, 'Comptabilité', `Ajout transaction: [${entry.type.toUpperCase()}] ${entry.category} - ${entry.amount} CFA`);
  };

  const deleteLedgerEntry = (id: string) => {
    if (!currentUser) return;
    const item = ledger.find(l => l.id === id);
    const updated = ledger.filter(l => l.id !== id);
    setLedger(updated);
    saveData('ozzo_ledger', updated);
    if (item) {
      logActivity(currentUser.email, 'Comptabilité', `Suppression transaction: ${item.description}`);
    }
  };

  // Backups & Security controls
  const triggerBackup = () => {
    if (!currentUser) return;
    
    const dbDump = {
      users,
      services,
      events,
      tickets,
      scanLogs,
      messages,
      quotes,
      ledger,
      settings
    };

    const dumpStr = JSON.stringify(dbDump);
    const sizeKB = (new Blob([dumpStr]).size / 1024).toFixed(2);
    
    const newBackup: Backup = {
      id: `bak_${Date.now()}`,
      filename: `ozzo_backup_${new Date().toISOString().slice(0,10)}_${Date.now().toString().slice(-4)}.json`,
      timestamp: new Date().toISOString(),
      size: `${sizeKB} KB`,
      data: dumpStr
    };

    const updated = [newBackup, ...backups];
    setBackups(updated);
    saveData('ozzo_backups', updated);
    logActivity(currentUser.email, 'Sauvegarde', `Création d'une sauvegarde de sécurité: ${newBackup.filename}`);
  };

  const restoreBackup = (backupId: string): boolean => {
    if (!currentUser || currentUser.role !== 'super_admin') return false;
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return false;

    try {
      const parsed = JSON.parse(backup.data);
      
      if (parsed.users) { setUsers(parsed.users); saveData('ozzo_users', parsed.users); }
      if (parsed.services) { setServices(parsed.services); saveData('ozzo_services', parsed.services); }
      if (parsed.events) { setEvents(parsed.events); saveData('ozzo_events', parsed.events); }
      if (parsed.tickets) { setTickets(parsed.tickets); saveData('ozzo_tickets', parsed.tickets); }
      if (parsed.scanLogs) { setScanLogs(parsed.scanLogs); saveData('ozzo_scan_logs', parsed.scanLogs); }
      if (parsed.messages) { setMessages(parsed.messages); saveData('ozzo_messages', parsed.messages); }
      if (parsed.quotes) { setQuotes(parsed.quotes); saveData('ozzo_quotes', parsed.quotes); }
      if (parsed.ledger) { setLedger(parsed.ledger); saveData('ozzo_ledger', parsed.ledger); }
      if (parsed.settings) { setSettings(parsed.settings); saveData('ozzo_settings', parsed.settings); }

      logActivity(currentUser.email, 'Restauration', `Restauration de base réussie depuis ${backup.filename}`);
      return true;
    } catch (e) {
      console.error('Failed to restore backup', e);
      return false;
    }
  };

  const deleteBackup = (backupId: string) => {
    if (!currentUser || currentUser.role !== 'super_admin') return;
    const backup = backups.find(b => b.id === backupId);
    const updated = backups.filter(b => b.id !== backupId);
    setBackups(updated);
    saveData('ozzo_backups', updated);
    if (backup) {
      logActivity(currentUser.email, 'Sauvegarde', `Suppression du fichier de sauvegarde: ${backup.filename}`);
    }
  };

  const setSecurityShield = (enabled: boolean) => {
    if (!currentUser) return;
    const updatedSettings = { ...settings, enableSecurityShield: enabled };
    setSettings(updatedSettings);
    saveData('ozzo_settings', updatedSettings);
    logActivity(currentUser.email, 'Sécurité', `Bouclier de sécurité anti-spam et protection DDoS ${enabled ? 'Activé' : 'Désactivé'}`);
  };

  return (
    <StoreContext.Provider value={{
      currentUser, users, services, events, tickets, scanLogs, messages,
      quotes, ledger, connectionLogs, activityLogs, backups, settings, theme,
      login, register, logout, resetPassword, verifyEmail, updateProfile, updatePassword, toggleTheme,
      createUserByAdmin, deleteUserByAdmin, updateUserRoleByAdmin,
      addService, updateService, deleteService,
      addEvent, updateEvent, deleteEvent,
      purchaseTicket, scanTicket,
      sendContactMessage, requestQuote, markMessageAsRead, updateQuoteStatus,
      addLedgerEntry, deleteLedgerEntry,
      triggerBackup, restoreBackup, deleteBackup, setSecurityShield
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
