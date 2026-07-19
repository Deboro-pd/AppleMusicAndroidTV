import { useState } from 'react';
import { 
  Copy, Check, FileCode, Layers, ArrowRight, Download, Laptop, HardDrive, Tv, ExternalLink, HelpCircle
} from 'lucide-react';
import { MANIFEST_CODE, LAYOUT_CODE, JAVA_CODE } from '../data';

export default function ApkGuide() {
  const [activeCodeTab, setActiveCodeTab] = useState<'manifest' | 'layout' | 'java'>('java');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(tabName);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const getCodeString = () => {
    switch (activeCodeTab) {
      case 'manifest': return MANIFEST_CODE;
      case 'layout': return LAYOUT_CODE;
      case 'java': return JAVA_CODE;
    }
  };

  return (
    <div id="apk-guide-container" className="space-y-8">
      {/* Code Exporter Block */}
      <div className="bg-[#111115] border border-[#222] rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#222] bg-[#14141a] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#FA243C]" />
              Zestaw Kodów Źródłowych dla Android Studio
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Poniżej znajdziesz kompletne pliki XML oraz brakujący kod klasy Java. Skopiuj je bezpośrednio do swojego projektu.
            </p>
          </div>

          {/* Copy Trigger */}
          <button
            onClick={() => handleCopy(getCodeString(), activeCodeTab)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FA243C] hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-950/30 active:scale-95 transition-all"
          >
            {copiedText === activeCodeTab ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Skopiowano!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kopiuj ten plik</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#222] bg-[#0c0c10] px-4">
          <button
            onClick={() => setActiveCodeTab('java')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeCodeTab === 'java' 
                ? 'border-[#FA243C] text-[#FA243C]' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            MainActivity.java (Kod Główny)
          </button>

          <button
            onClick={() => setActiveCodeTab('manifest')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeCodeTab === 'manifest' 
                ? 'border-[#FA243C] text-[#FA243C]' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            AndroidManifest.xml
          </button>

          <button
            onClick={() => setActiveCodeTab('layout')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeCodeTab === 'layout' 
                ? 'border-[#FA243C] text-[#FA243C]' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            activity_main.xml (Layout)
          </button>
        </div>

        {/* Code Viewer Area */}
        <div className="relative">
          <pre className="p-6 overflow-x-auto text-[11px] font-mono text-gray-300 bg-[#07070a] leading-relaxed max-h-96">
            <code>{getCodeString()}</code>
          </pre>
          <div className="absolute right-4 bottom-4 text-[10px] text-gray-500 font-mono bg-black/50 px-2 py-1 rounded">
            {activeCodeTab === 'java' ? 'Java' : 'XML'}
          </div>
        </div>
      </div>

      {/* APK Compilation & USB Pendrive Deployment Guide */}
      <div className="bg-[#111115] border border-[#222] rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-[#FA243C]" />
            Przewodnik Krok Po Kroku: Budowa APK i Instalacja na TV
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Ze względu na politykę bezpieczeństwa Androida oraz zasoby wymagane do budowy aplikacji mobilnych, ostateczną paczkę `.apk` kompilujemy za pomocą darmowego programu **Android Studio**. Poniżej znajdziesz super przejrzysty proces.
          </p>
        </div>

        {/* The Pipeline Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#16161c] border border-[#252530] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-blue-900/40 text-blue-400 flex items-center justify-center font-bold text-xs mb-3">1</div>
              <h4 className="text-xs font-bold text-white">Stwórz Projekt</h4>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                Uruchom Android Studio, wybierz szablon <strong>"No Activity"</strong> lub <strong>"Empty Views Activity"</strong>. Nazwij paczkę <code>com.example.applemusicwrapper</code>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16161c] border border-[#252530] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-orange-900/40 text-orange-400 flex items-center justify-center font-bold text-xs mb-3">2</div>
              <h4 className="text-xs font-bold text-white">Wklej 3 Kody</h4>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                Skopiuj i podmień zawartość <code>MainActivity.java</code>, <code>AndroidManifest.xml</code> oraz <code>activity_main.xml</code> w odpowiednich katalogach projektu.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16161c] border border-[#252530] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center font-bold text-xs mb-3">3</div>
              <h4 className="text-xs font-bold text-white">Kompiluj do APK</h4>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                W menu górnym wybierz: <strong>Build</strong> &rarr; <strong>Build Bundle(s) / APK(s)</strong> &rarr; <strong>Build APK(s)</strong>. Gotowy plik znajdziesz w folderze <code>outputs/apk/debug/</code>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16161c] border border-[#252530] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-emerald-900/40 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">4</div>
              <h4 className="text-xs font-bold text-white">Przenieś na Pendrive</h4>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                Zgraj plik <code>app-debug.apk</code> na pamięć USB, podłącz ją do telewizora Android TV i zainstaluj aplikację za pomocą menedżera plików (np. File Commander).
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Instructions details */}
        <div className="bg-[#16161c] rounded-2xl p-6 border border-[#252530] space-y-4">
          <h4 className="text-xs font-mono text-[#FA243C] uppercase tracking-wider font-bold">Wskazówki dla idealnego działania na telewizorze:</h4>
          
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#2a2a35] text-white mt-0.5"><Laptop className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white">Optymalizacja pod TV:</strong> Nasz kod wstrzykuje specjalny nagłówek <code>User-Agent</code> emulujący duży Smart TV. Dzięki temu strona Apple Music automatycznie dostosuje interfejs do obsługi pilotem, rezygnując z przycisków typowo smartfonowych.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#2a2a35] text-white mt-0.5"><Tv className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white">Przyspieszenie Sprzętowe (Hardware Acceleration):</strong> W manifeście włączyliśmy tag <code>android:hardwareAccelerated="true"</code>. Apple Music opiera się na nowoczesnych przejściach CSS i JS, dlatego ten parametr zapewnia idealne 60 klatek na sekundę podczas przewijania.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#2a2a35] text-white mt-0.5"><HardDrive className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white">Jak wgrać na TV za pomocą pendrive'a bez komputera?</strong> Jeżeli nie chcesz bawić się z pendrive'ami, możesz pobrać na telewizor darmową aplikację <strong className="text-white">"Downloader"</strong> z Google Play Store na TV, wrzucić swoje APK na dowolny dysk Google Drive i wpisać skrócony link pobierania bezpośrednio w przeglądarce telewizora!
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-indigo-950/60 text-indigo-400 mt-0.5"><FileCode className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white">Bezpieczeństwo i Gotowość do Publikacji na GitHubie:</strong> Kod jest w 100% ogólny (stateless). Nie zawiera żadnych zakodowanych na stałe haseł ani kont. Na telewizorze aplikacja ładuje oficjalny system logowania Apple, co oznacza, że każdy użytkownik loguje się bezpośrednio i bezpiecznie przez infrastrukturę Apple. Możesz bez obaw opublikować ten kod publicznie na GitHubie!
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
