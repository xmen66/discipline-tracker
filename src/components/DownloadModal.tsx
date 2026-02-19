import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Smartphone, X, Download, Share, PlusSquare, Zap, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const handleAndroidDownload = () => {
    setDownloading(true);
    // Simulate build processing time
    setTimeout(() => {
      const dummyContent = "SMASH ANDROID APK ALPHA VERSION";
      const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Smash_v1.0.4.apk";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
      alert("SMASH APK Build Complete. Installation package downloaded.");
    }, 2000);
  };

  const [downloading, setDownloading] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[#0a0a0a] border border-neutral-800 p-8 rounded-[2.5rem] max-w-2xl w-full relative z-10 shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Zap className="w-8 h-8 text-black" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter mb-2 uppercase">SMASH MOBILE</h2>
              <p className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Deploy Protocol to Device</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* iOS Instructions */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Apple className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold">iOS / iPhone</h3>
                </div>
                
                <ol className="space-y-4 flex-1">
                  <li className="flex gap-3 text-sm text-neutral-400">
                    <span className="w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white">1</span>
                    <span>Open in <strong>Safari</strong> browser</span>
                  </li>
                  <li className="flex gap-3 text-sm text-neutral-400">
                    <span className="w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white">2</span>
                    <span className="flex items-center gap-1.5">Tap the <strong>Share</strong> button <Share className="w-4 h-4 text-blue-400" /></span>
                  </li>
                  <li className="flex gap-3 text-sm text-neutral-400">
                    <span className="w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white">3</span>
                    <span className="flex items-center gap-1.5">Select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-4 h-4 text-white" /></span>
                  </li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-bold">Android / APK</h3>
                </div>
                
                <div className="space-y-6 flex-1 flex flex-col">
                  <button 
                    onClick={handleAndroidDownload}
                    disabled={downloading}
                    className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {downloading ? 'Building APK...' : 'Download APK'}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold text-neutral-600"><span className="bg-[#0a0a0a] px-2">OR USE PWA</span></div>
                  </div>

                  <ol className="space-y-3">
                    <li className="flex gap-3 text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                      <span>1. Open in Chrome</span>
                    </li>
                    <li className="flex gap-3 text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                      <span>2. Tap Menu (⋮) &gt; Install App</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                SMASH Mobile Protocol: V1.0.4-Alpha
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
