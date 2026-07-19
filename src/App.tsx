/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Tv, FileCode, Layers, Info, HelpCircle, ArrowUpRight, Github, ExternalLink, Music, Laptop
} from 'lucide-react';
import TvSimulator from './components/TvSimulator';
import ApkGuide from './components/ApkGuide';
import { ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('code');

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-[#060608] text-gray-200 font-sans selection:bg-[#FA243C] selection:text-white pb-16">
      
      {/* Premium Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FA243C]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Elegant Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#060608]/80 border-b border-[#14141a]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FA243C] flex items-center justify-center shadow-lg shadow-red-950/40">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white tracking-tight text-sm md:text-base">
                Apple Music TV Wrapper
              </h1>
              <p className="text-[10px] text-gray-400 font-mono -mt-0.5">Android TV (.APK) Construction Suite</p>
            </div>
          </div>

          {/* Quick External Links or Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono bg-red-950/40 text-[#FA243C] border border-red-900/30 px-3 py-1 rounded-full font-bold">
              PLATFORMA: ANDROID TV (LEANBACK)
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8 relative">
        
        {/* Dynamic App Explanation Hero Header */}
        <div className="bg-gradient-to-r from-[#121216] to-[#0a0a0c] border border-[#1d1d25] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FA243C]/10 text-[#FA243C] text-[10px] font-bold font-mono uppercase tracking-wider">
              Brakujący kod skompletowany
            </div>
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-tight">
              Twój własny odtwarzacz Apple Music na telewizorze
            </h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Dostarczyłeś strukturę pliku manifestu oraz layoutu TV. Uzupełniłem brakujący, w pełni zoptymalizowany kod klasy <strong className="text-white">MainActivity.java</strong> oraz przygotowałem interaktywny symulator, abyś mógł przetestować działanie nawigacji pilotem przed właściwą kompilacją.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                const element = document.getElementById('tv-simulator-container');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#16161c] hover:bg-[#202029] text-white border border-[#222] text-xs font-semibold text-center transition-all cursor-pointer"
            >
              Uruchom Symulator
            </button>
            <button
              onClick={() => {
                setActiveTab('guide');
                const element = document.getElementById('apk-guide-container');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FA243C] hover:bg-red-500 text-white text-xs font-semibold text-center shadow-lg shadow-red-950/30 transition-all cursor-pointer"
            >
              Przejdź do Instrukcji
            </button>
          </div>
        </div>

        {/* Workspace Hub Switcher */}
        <div className="flex items-center gap-2 border-b border-[#181822] pb-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-5 py-3 text-xs font-bold tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-[#FA243C] text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Zestaw Kodów APK & Pliki
          </button>
          
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-5 py-3 text-xs font-bold tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-[#FA243C] text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Poradnik Kompilacji
          </button>
        </div>

        {/* Tab content display */}
        <div className="space-y-12">
          {activeTab === 'code' ? (
            <>
              {/* Simulator is always visible on the code screen for awesome live feedback! */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest font-bold">
                    Interaktywny Podgląd Działania (Wirtualna Telewizja)
                  </h3>
                </div>
                <TvSimulator />
              </div>

              {/* Source Codes */}
              <ApkGuide />
            </>
          ) : (
            <ApkGuide />
          )}
        </div>

        {/* Footnotes */}
        <footer className="pt-12 border-t border-[#14141a] text-center space-y-3">
          <p className="text-[11px] text-gray-500 leading-relaxed font-mono">
            Apple Music jest zarejestrowanym znakiem towarowym firmy Apple Inc. Ten projekt stanowi darmowe narzędzie deweloperskie typu Web-Wrapper.
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-gray-400">
            <span>Uruchomiono pomyślnie w bezpiecznym środowisku Cloud Run</span>
            <span>&bull;</span>
            <span>Czas lokalny: {new Date().toLocaleDateString('pl-PL')}</span>
          </div>
        </footer>

      </main>
    </div>
  );
}

