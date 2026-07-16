import React, { useState } from 'react';
import { useStore } from '../store';
import { QrCode, Search, CheckCircle, AlertTriangle, XCircle, History, Camera, Info, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QRCodeScanner: React.FC = () => {
  const { scanTicket, scanLogs, tickets, currentUser } = useStore();
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'valid' | 'already_used' | 'not_found' | 'cancelled' | 'expired';
    message: string;
    ticketNum?: string;
    buyerName?: string;
    eventTitle?: string;
    categoryName?: string;
  } | null>(null);

  const [activeScanMode, setActiveScanMode] = useState<'manual' | 'camera'>('manual');
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);
  const [simulatedTicketId, setSimulatedTicketId] = useState('');

  const currentScannerEmail = currentUser ? currentUser.email : 'Contrôleur Anonyme';

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    const res = scanTicket(ticketInput.trim(), currentScannerEmail, 'manual');
    setScanResult({
      status: res.status,
      message: res.message,
      ticketNum: res.ticket?.ticketNumber || ticketInput.trim(),
      buyerName: res.ticket?.buyerName,
      eventTitle: res.ticket?.eventTitle,
      categoryName: res.ticket?.categoryName
    });
    setTicketInput('');
  };

  const triggerSimulatedCameraScan = (tktNum: string) => {
    if (!tktNum) return;
    setIsSimulatingCamera(true);
    
    // Simulate camera auto-focus, laser sweep and scan delay
    setTimeout(() => {
      const res = scanTicket(tktNum, currentScannerEmail, 'qr');
      setScanResult({
        status: res.status,
        message: res.message,
        ticketNum: res.ticket?.ticketNumber || tktNum,
        buyerName: res.ticket?.buyerName,
        eventTitle: res.ticket?.eventTitle,
        categoryName: res.ticket?.categoryName
      });
      setIsSimulatingCamera(false);
    }, 1500);
  };

  const getResultColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400';
      case 'already_used': return 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 text-amber-800 dark:text-amber-400';
      case 'cancelled':
      case 'expired': return 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-800 dark:text-rose-400';
      default: return 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 text-zinc-800 dark:text-zinc-400';
    }
  };

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-10 h-10 text-emerald-500" />;
      case 'already_used': return <AlertTriangle className="w-10 h-10 text-amber-500" />;
      case 'cancelled':
      case 'expired': return <XCircle className="w-10 h-10 text-rose-500" />;
      default: return <Info className="w-10 h-10 text-zinc-500" />;
    }
  };

  const validUnusedTickets = tickets.filter(t => t.status === 'valid');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 mb-4">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          N'KA SCANNER SÉCURISÉ
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
          Validation cryptographique des billets en temps réel. Système anti-duplication et anti-faux billets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Validation Console */}
        <div className="md:col-span-7 space-y-6">
          {/* Controls toggle */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <button
              id="scan-mode-manual"
              onClick={() => { setActiveScanMode('manual'); setScanResult(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center space-x-2 ${
                activeScanMode === 'manual'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Search size={14} />
              <span>Saisie Manuelle</span>
            </button>
            <button
              id="scan-mode-camera"
              onClick={() => { setActiveScanMode('camera'); setScanResult(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center space-x-2 ${
                activeScanMode === 'camera'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Camera size={14} />
              <span>Caméra Scanner</span>
            </button>
          </div>

          {/* Validation Result overlay */}
          <AnimatePresence mode="wait">
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`p-6 rounded-2xl border ${getResultColor(scanResult.status)} flex flex-col items-center text-center space-y-4`}
              >
                {getResultIcon(scanResult.status)}
                
                <div>
                  <h3 className="text-xl font-bold tracking-tight uppercase">
                    {scanResult.status === 'valid' ? 'Accès Autorisé' : 'Accès Refusé'}
                  </h3>
                  <p className="text-xs font-semibold opacity-85 mt-1">
                    {scanResult.message}
                  </p>
                </div>

                {scanResult.eventTitle && (
                  <div className="w-full border-t border-black/5 dark:border-white/5 pt-4 text-left grid grid-cols-2 gap-y-2 text-xs font-semibold opacity-90">
                    <span className="text-zinc-500">Numéro:</span>
                    <span className="text-right font-mono font-bold">{scanResult.ticketNum}</span>
                    <span className="text-zinc-500">Acheteur:</span>
                    <span className="text-right truncate">{scanResult.buyerName}</span>
                    <span className="text-zinc-500">Événement:</span>
                    <span className="text-right truncate">{scanResult.eventTitle}</span>
                    <span className="text-zinc-500">Catégorie:</span>
                    <span className="text-right">{scanResult.categoryName}</span>
                  </div>
                )}

                <button
                  id="dismiss-result"
                  onClick={() => setScanResult(null)}
                  className="mt-2 text-xs font-bold underline cursor-pointer"
                >
                  Scanner un autre billet
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanner Interfaces */}
          {!scanResult && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-900 shadow-sm">
              {activeScanMode === 'manual' ? (
                <form onSubmit={handleManualScan} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ticket-number" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Numéro ou code du billet
                    </label>
                    <div className="relative">
                      <input
                        id="ticket-number"
                        type="text"
                        placeholder="Ex: OZ-4012-G8F9H"
                        value={ticketInput}
                        onChange={(e) => setTicketInput(e.target.value)}
                        className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold tracking-wider font-mono placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white"
                      />
                      <button
                        id="submit-manual-scan"
                        type="submit"
                        className="absolute right-2 top-2 p-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 flex items-center space-x-1">
                    <Info size={12} />
                    <span>L'identifiant est insensible à la casse.</span>
                  </p>
                </form>
              ) : (
                <div className="flex flex-col items-center space-y-6">
                  {/* Camera Simulator */}
                  <div className="relative w-full aspect-video max-w-sm rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center border-4 border-zinc-900 dark:border-zinc-800">
                    {/* Corner Reticles */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-md"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-md"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-md"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-md"></div>

                    {isSimulatingCamera ? (
                      <div className="text-center space-y-3 z-10">
                        <div className="w-12 h-12 rounded-full border-4 border-t-emerald-500 border-zinc-700 animate-spin mx-auto"></div>
                        <p className="text-xs font-mono font-bold text-emerald-400 tracking-widest animate-pulse">
                          ANALYSE CRYPTO...
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 z-10 px-6">
                        <Camera className="w-10 h-10 text-zinc-500 mx-auto animate-bounce" />
                        <p className="text-xs font-semibold text-zinc-300">
                          Viseur optique virtuel actif
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Sélectionnez un billet ci-dessous pour simuler le scan caméra
                        </p>
                      </div>
                    )}

                    {/* Red Scanning Laser Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-rose-500 opacity-60 animate-bounce" style={{ top: '50%' }}></div>
                  </div>

                  {/* Sandbox helpers to make testing delightful */}
                  <div className="w-full space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center">
                      Outils de test rapide (Sandbox)
                    </span>
                    {validUnusedTickets.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        <label htmlFor="test-ticket-select" className="sr-only">Sélectionner un billet de test</label>
                        <select
                          id="test-ticket-select"
                          value={simulatedTicketId}
                          onChange={(e) => setSimulatedTicketId(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none"
                        >
                          <option value="">-- Choisir un billet actif à scanner --</option>
                          {validUnusedTickets.map(t => (
                            <option key={t.id} value={t.ticketNumber}>
                              {t.ticketNumber} - {t.buyerName} ({t.eventTitle})
                            </option>
                          ))}
                        </select>
                        <button
                          id="trigger-simulated-scan"
                          disabled={!simulatedTicketId || isSimulatingCamera}
                          onClick={() => triggerSimulatedCameraScan(simulatedTicketId)}
                          className="w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs rounded-lg transition-all disabled:opacity-40"
                        >
                          Déclencher le scan optique
                        </button>
                      </div>
                    ) : (
                      <p className="text-center text-[11px] text-zinc-400 italic">
                        Aucun billet actif vendu disponible pour test de scan. Achetez-en un sur OZzo Events !
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scan Log History */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <History size={16} />
              <span>Historique Récent</span>
            </h2>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full font-bold">
              {scanLogs.length} scans
            </span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {scanLogs.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p className="text-xs text-zinc-400 italic">Aucun scan réalisé pour le moment.</p>
              </div>
            ) : (
              scanLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex flex-col space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold tracking-wide text-zinc-950 dark:text-white">
                      {log.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      log.status === 'valid'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : log.status === 'already_used'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {log.status === 'valid'
                        ? 'Valide'
                        : log.status === 'already_used'
                        ? 'Déjà Utilisé'
                        : log.status === 'not_found'
                        ? 'Introuvable'
                        : log.status === 'cancelled'
                        ? 'Annulé'
                        : 'Expiré'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-normal">
                    {log.details || 'Sans détails'}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 pt-1 border-t border-zinc-100/40 dark:border-zinc-900/40">
                    <span>Par: {log.scannedBy}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
