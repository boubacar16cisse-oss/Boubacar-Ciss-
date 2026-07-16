import React, { useState } from 'react';
import { useStore } from '../store';
import { Menu, X, Sun, Moon, User as UserIcon, LayoutDashboard, LogOut, Briefcase, Calendar, Ticket, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  setShowProfileModal: (show: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  setShowAuthModal,
  setAuthMode,
  setShowProfileModal,
}) => {
  const { currentUser, logout, theme, toggleTheme } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canAccessDashboard = currentUser && ['super_admin', 'admin', 'employee'].includes(currentUser.role);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Compass },
    { id: 'design', label: 'OZzo Design', icon: Briefcase },
    { id: 'events', label: 'OZzo Events', icon: Calendar },
    { id: 'tickets', label: "N'KA TICKET", icon: Ticket },
    { id: 'contact', label: 'Contact', icon: Menu },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <button 
              id="logo-button"
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-650 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-orange-500/25 transition-all group-hover:scale-105">
                O
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-lg text-white font-display tracking-wide group-hover:text-orange-400 transition-colors">
                  OZzo Group
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5 font-mono">
                  Design • Events • Tickets
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-white bg-slate-900/85 border border-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Changer de thème"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Console Admin button (always visible or highlighted for testing) */}
            <button
              id="dashboard-shortcut"
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                canAccessDashboard
                  ? 'bg-gradient-to-r from-orange-500 to-orange-650 text-white shadow-md shadow-orange-500/15'
                  : 'border border-orange-500/30 text-orange-400 hover:bg-slate-900/40 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Console Admin {canAccessDashboard ? '(Super Admin)' : '(Démo)'}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  id="profile-button"
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-2 border border-slate-800 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                >
                  <UserIcon size={16} />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>

                <button
                  id="logout-button"
                  onClick={logout}
                  className="p-2.5 rounded-xl border border-rose-950/30 text-rose-500 hover:bg-rose-950/20 transition-all cursor-pointer"
                  title="Se déconnecter"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="login-button"
                  onClick={() => handleAuthClick('login')}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Se connecter
                </button>
                <button
                  id="register-button"
                  onClick={() => handleAuthClick('register')}
                  className="px-4 py-2.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Créer un compte
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              id="theme-toggle-mobile"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-900 transition-all"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-900 transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-900 bg-slate-950"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-orange-500 border border-slate-800'
                        : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                id="mobile-dashboard-shortcut"
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  canAccessDashboard
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'border border-orange-500/30 text-orange-400 hover:bg-slate-900/40'
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Console Admin {canAccessDashboard ? '(Super Admin)' : '(Démo)'}</span>
              </button>

              <div className="pt-4 border-t border-slate-900">
                {currentUser ? (
                  <div className="space-y-2">
                    <button
                      id="mobile-profile-button"
                      onClick={() => {
                        setShowProfileModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold border border-slate-800 text-slate-300"
                    >
                      <UserIcon size={18} />
                      <span>Mon Profil ({currentUser.name})</span>
                    </button>
                    <button
                      id="mobile-logout-button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-rose-500 hover:bg-rose-950/10"
                    >
                      <LogOut size={18} />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="mobile-login-button"
                      onClick={() => handleAuthClick('login')}
                      className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold border border-slate-800 text-slate-300"
                    >
                      Se connecter
                    </button>
                    <button
                      id="mobile-register-button"
                      onClick={() => handleAuthClick('register')}
                      className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-orange-500 text-white"
                    >
                      S'inscrire
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
