import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, KeyRound, CheckCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalsProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'login' | 'register' | 'reset' | 'verify';
  setAuthMode: (mode: 'login' | 'register' | 'reset' | 'verify') => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  showProfileModal,
  setShowProfileModal
}) => {
  const { 
    login, register, resetPassword, verifyEmail, 
    currentUser, updateProfile, updatePassword, settings
  } = useStore();

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    verificationCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password alteration state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const ok = await login(formData.email, formData.password);
        if (ok) {
          setShowAuthModal(false);
          setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '', verificationCode: '' });
        } else {
          setErrorMsg('Identifiants incorrects ou compte bloqué par le bouclier.');
        }
      } else if (authMode === 'register') {
        if (formData.password && formData.password !== formData.confirmPassword) {
          setErrorMsg('Les mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }
        const ok = await register(formData.name, formData.email, formData.phone);
        if (ok) {
          setSuccessMsg('Votre compte a été initialisé. Un lien de vérification a été simulé !');
          setTimeout(() => {
            setAuthMode('verify');
            setErrorMsg('');
            setSuccessMsg('');
          }, 1500);
        } else {
          setErrorMsg('Cet e-mail est déjà utilisé ou invalide.');
        }
      } else if (authMode === 'reset') {
        const ok = await resetPassword(formData.email);
        if (ok) {
          setSuccessMsg('Un lien de réinitialisation de mot de passe a été envoyé à votre e-mail.');
        } else {
          setErrorMsg('Aucun compte n\'est associé à cette adresse e-mail.');
        }
      } else if (authMode === 'verify') {
        const ok = await verifyEmail(formData.email || currentUser?.email || '');
        if (ok) {
          setSuccessMsg('Félicitations, votre adresse e-mail a été vérifiée avec succès ! Accès activé.');
          setTimeout(() => {
            setShowAuthModal(false);
          }, 1500);
        } else {
          setErrorMsg('Le code de validation est incorrect.');
        }
      }
    } catch {
      setErrorMsg('Une erreur technique de validation est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const ok = await updateProfile(formData.name, formData.phone);
      if (ok) {
        setSuccessMsg('Profil mis à jour avec succès.');
        setTimeout(() => setShowProfileModal(false), 1200);
      } else {
        setErrorMsg('Échec de la mise à jour.');
      }
    } catch {
      setErrorMsg('Erreur de traitement de modification.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setErrorMsg('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const ok = await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      if (ok) {
        setSuccessMsg('Votre mot de passe a été modifié avec succès.');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setErrorMsg('L\'ancien mot de passe est invalide.');
      }
    } catch {
      setErrorMsg('Erreur lors de la modification du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-populate profile fields if modal opens
  React.useEffect(() => {
    if (showProfileModal && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        phone: currentUser.phone || '',
        email: currentUser.email
      }));
    }
  }, [showProfileModal, currentUser]);

  return (
    <>
      {/* AUTHENTICATION DIALOG (LOGIN / REGISTER / FORGOT / VERIFY) */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full relative space-y-6 shadow-xl"
            >
              {/* Close Button */}
              <button
                id="close-auth-modal"
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-950"
              >
                <X size={20} />
              </button>

              {/* Title Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 mb-2">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-bold text-xl text-zinc-950 dark:text-white tracking-tight">
                  {authMode === 'login' && 'Se Connecter'}
                  {authMode === 'register' && 'Créer un Compte'}
                  {authMode === 'reset' && 'Réinitialiser Mot de passe'}
                  {authMode === 'verify' && 'Vérification de l\'E-mail'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {authMode === 'login' && 'Entrez vos identifiants sécurisés OZzo.'}
                  {authMode === 'register' && 'Accédez à nos plateformes intégrées.'}
                  {authMode === 'reset' && 'Entrez votre e-mail pour recevoir un lien.'}
                  {authMode === 'verify' && 'Vérification cryptographique obligatoire.'}
                </p>
              </div>

              {/* Error / Success Notices */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              {/* Form elements */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label htmlFor="auth-name" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nom complet</label>
                    <div className="relative">
                      <input
                        id="auth-name"
                        type="text"
                        required
                        placeholder="Ex: Boubacar Cissé"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                      <UserIcon size={14} className="absolute left-3 top-3 text-zinc-400" />
                    </div>
                  </div>
                )}

                {(authMode === 'login' || authMode === 'register' || authMode === 'reset') && (
                  <div className="space-y-1">
                    <label htmlFor="auth-email" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Adresse e-mail</label>
                    <div className="relative">
                      <input
                        id="auth-email"
                        type="email"
                        required
                        placeholder="Ex: boubacar16cisse@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                      <Mail size={14} className="absolute left-3 top-3 text-zinc-400" />
                    </div>
                  </div>
                )}

                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label htmlFor="auth-phone" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Téléphone (WhatsApp)</label>
                    <div className="relative">
                      <input
                        id="auth-phone"
                        type="text"
                        placeholder="71156304"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                      <Phone size={14} className="absolute left-3 top-3 text-zinc-400" />
                    </div>
                  </div>
                )}

                {(authMode === 'login' || authMode === 'register') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label htmlFor="auth-pass" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Mot de passe</label>
                      {authMode === 'login' && (
                        <button
                          id="go-reset-pass"
                          type="button"
                          onClick={() => setAuthMode('reset')}
                          className="text-[10px] text-zinc-400 hover:underline cursor-pointer"
                        >
                          Oublié ?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="auth-pass"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                      <Lock size={14} className="absolute left-3 top-3 text-zinc-400" />
                    </div>
                  </div>
                )}

                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label htmlFor="auth-confirm-pass" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Confirmer mot de passe</label>
                    <div className="relative">
                      <input
                        id="auth-confirm-pass"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                      <Lock size={14} className="absolute left-3 top-3 text-zinc-400" />
                    </div>
                  </div>
                )}

                {authMode === 'verify' && (
                  <div className="space-y-1">
                    <label htmlFor="auth-verification-code" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Code de vérification reçu (Simulé)</label>
                    <input
                      id="auth-verification-code"
                      type="text"
                      required
                      placeholder="Entrez n'importe quel code pour tester"
                      value={formData.verificationCode}
                      onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                      className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-center font-bold tracking-widest focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Submit button */}
                <button
                  id="submit-auth-form"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-50 text-white dark:text-zinc-950 font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2"
                >
                  {loading && <RefreshCw size={12} className="animate-spin" />}
                  <span>
                    {authMode === 'login' && 'Se connecter'}
                    {authMode === 'register' && 'Créer mon compte'}
                    {authMode === 'reset' && 'Envoyer le lien'}
                    {authMode === 'verify' && 'Vérifier mon adresse e-mail'}
                  </span>
                </button>
              </form>

              {/* Demo Admin login shortcut */}
              {authMode === 'login' && (
                <div className="pt-1 border-t border-zinc-100 dark:border-zinc-900/30 space-y-1.5">
                  <p className="text-[10px] font-bold text-center text-zinc-400 uppercase tracking-wider font-mono">Démo & Test</p>
                  <button
                    id="demo-admin-login-btn"
                    type="button"
                    onClick={async () => {
                      setFormData(prev => ({ ...prev, email: 'boubacar16cisse@gmail.com', password: 'admin' }));
                      const ok = await login('boubacar16cisse@gmail.com', 'admin');
                      if (ok) {
                        setShowAuthModal(false);
                      }
                    }}
                    className="w-full py-2 bg-gradient-to-r from-orange-500/10 to-orange-650/10 hover:from-orange-500/20 hover:to-orange-650/20 border border-orange-500/30 text-orange-500 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <ShieldCheck size={14} className="text-orange-500" />
                    <span>Connexion Rapide Super Admin</span>
                  </button>
                </div>
              )}

              {/* Toggle switch links */}
              <div className="text-center text-[11px] font-semibold text-zinc-400 border-t border-zinc-50 dark:border-zinc-900/50 pt-4">
                {authMode === 'login' && (
                  <p>
                    Pas encore de compte ?{' '}
                    <button id="auth-switch-register" onClick={() => setAuthMode('register')} className="text-zinc-800 dark:text-white underline cursor-pointer">
                      S'inscrire
                    </button>
                  </p>
                )}
                {authMode === 'register' && (
                  <p>
                    Déjà membre ?{' '}
                    <button id="auth-switch-login" onClick={() => setAuthMode('login')} className="text-zinc-800 dark:text-white underline cursor-pointer">
                      Se connecter
                    </button>
                  </p>
                )}
                {(authMode === 'reset' || authMode === 'verify') && (
                  <button id="auth-switch-login-back" onClick={() => setAuthMode('login')} className="text-zinc-800 dark:text-white underline cursor-pointer">
                    Retourner à la connexion
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROFILE MUTATION DIALOG (EDIT PROFILE & UPDATE PASSWORD) */}
      <AnimatePresence>
        {showProfileModal && currentUser && (
          <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 max-w-lg w-full relative space-y-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                id="close-profile-modal"
                onClick={() => setShowProfileModal(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-950"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <h3 className="font-bold text-xl text-zinc-950 dark:text-white tracking-tight">
                  Paramètres de Compte
                </h3>
                <p className="text-xs text-zinc-400">
                  Modifiez votre profil et sécurisez vos accès utilisateur.
                </p>
              </div>

              {/* Profile alerts */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              {/* Block 1: Profile Details */}
              <form onSubmit={handleProfileSubmit} className="space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-900">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Détails personnels</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="profile-name" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nom complet</label>
                    <input
                      id="profile-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="profile-phone" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Téléphone (WhatsApp)</label>
                    <input
                      id="profile-phone"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="profile-email-ro" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">E-mail (Non modifiable)</label>
                  <input
                    id="profile-email-ro"
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-3 py-2 border border-zinc-150 dark:border-zinc-900 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900/40 text-zinc-400 font-mono"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    id="submit-profile-update"
                    type="submit"
                    className="px-4 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Mettre à jour le profil
                  </button>
                </div>
              </form>

              {/* Block 2: Password Modif */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                  <KeyRound size={14} />
                  <span>Changement de mot de passe</span>
                </h4>

                <div className="space-y-1">
                  <label htmlFor="password-old" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ancien mot de passe</label>
                  <input
                    id="password-old"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="password-new" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nouveau mot de passe</label>
                    <input
                      id="password-new"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="password-confirm-new" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Confirmer le nouveau</label>
                    <input
                      id="password-confirm-new"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    id="submit-password-update"
                    type="submit"
                    className="px-4 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Modifier le mot de passe
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
