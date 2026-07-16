export type UserRole = 'super_admin' | 'admin' | 'employee' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  priceRange?: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  ticketCategories: TicketCategory[];
  organizers: string[];
  partners: string[];
  isPrivate: boolean;
  isPublished: boolean;
  isArchived: boolean;
  imageUrl?: string;
  videoUrl?: string;
  galleryImages: string[];
  galleryVideos: string[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // Unique number: OZ-XXXX-XXXX
  qrCodeData: string;   // Unique QR hash
  eventId: string;
  eventTitle: string;
  categoryId: string;
  categoryName: string;
  price: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  status: 'valid' | 'used' | 'cancelled' | 'expired';
  purchaseDate: string;
  scannedAt?: string;
  scannedBy?: string;
}

export interface ScanLog {
  id: string;
  ticketNumber: string;
  timestamp: string;
  status: 'valid' | 'already_used' | 'not_found' | 'cancelled' | 'expired';
  scannedBy: string; // Email of scanner/controller
  method: 'qr' | 'manual';
  details?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceTitle: string;
  budget: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

export interface LedgerEntry {
  id: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string;
}

export interface ConnectionLog {
  id: string;
  email: string;
  timestamp: string;
  status: 'success' | 'failure';
  ipAddress: string;
  device: string;
  reason?: string;
}

export interface ActivityLog {
  id: string;
  email: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Backup {
  id: string;
  filename: string;
  timestamp: string;
  size: string;
  data: string; // stringified database dump
}

export interface SystemSettings {
  id: string;
  themeMode: 'light' | 'dark';
  enableSecurityShield: boolean;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  phoneContact: string;
  whatsappContact: string;
  emailContact: string;
}
