import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Search, Compass, Radio, Music, PlayCircle,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft, Undo, Check, LogIn, LogOut, QrCode, User, Lock, Mail,
  VolumeX, FileText, ListMusic, Layers
} from 'lucide-react';
import { MOCK_TRACKS, MOCK_PLAYLISTS, MENU_ITEMS } from '../data';
import { Track, Playlist } from '../types';

interface UserAccount {
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
}

export default function TvSimulator() {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [focusedSection, setFocusedSection] = useState<'menu' | 'tracks' | 'player' | 'loginBtn' | 'modal' | 'playlistDetail' | 'searchInput'>('tracks');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACKS[0]);
  const [elapsedSeconds, setElapsedSeconds] = useState(45); // start at 45s for instant progress demo
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Sync / Lyric Screen Toggle
  const [showLyrics, setShowLyrics] = useState(true); // default true to show off the lyrics right away!

  // Search logic
  const [searchQuery, setSearchQuery] = useState('');

  // Playlist browsing logic
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [activePlaylistTrackIdx, setActivePlaylistTrackIdx] = useState(0);

  // Apple Music login state
  const [user, setUser] = useState<UserAccount | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTab, setLoginTab] = useState<'qr' | 'credentials'>('qr');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [modalFocusIndex, setModalFocusIndex] = useState(0); // 0: QR tab, 1: Form tab, 2: Action button

  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Helper: parse "MM:SS" into total seconds
  const getTrackTotalSeconds = (track: Track) => {
    const parts = track.duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 200;
  };

  const totalSeconds = getTrackTotalSeconds(currentTrack);
  const playbackProgress = (elapsedSeconds / totalSeconds) * 100;

  // Helper: format seconds to "MM:SS"
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Helper: parse timestamp lyrics "[M:SS] Text"
  const parsedLyrics = (() => {
    if (!currentTrack.lyrics) return [];
    return currentTrack.lyrics.map((line, index) => {
      const match = line.match(/^\[(\d+):(\d+)\]\s*(.*)/);
      if (match) {
        const time = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        const text = match[3];
        return { id: index, time, text };
      }
      return { id: index, time: index * 15, text: line };
    });
  })();

  // Find the active lyric line index based on elapsed seconds
  const activeLyricIndex = parsedLyrics.reduce((acc, curr, index) => {
    if (elapsedSeconds >= curr.time) {
      return index;
    }
    return acc;
  }, 0);

  // Smooth scroll lyrics to keep active line centered
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeElement = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement;
      if (activeElement) {
        lyricsContainerRef.current.scrollTo({
          top: activeElement.offsetTop - lyricsContainerRef.current.clientHeight / 2 + activeElement.clientHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [activeLyricIndex, showLyrics, currentTrack]);

  // Audio Progress Tick
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          if (prev >= totalSeconds) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, totalSeconds]);

  const handleNextTrack = () => {
    if (selectedPlaylist) {
      const nextIdx = (activePlaylistTrackIdx + 1) % selectedPlaylist.tracks.length;
      setActivePlaylistTrackIdx(nextIdx);
      setCurrentTrack(selectedPlaylist.tracks[nextIdx]);
    } else {
      const nextIdx = (activeTrackIndex + 1) % MOCK_TRACKS.length;
      setActiveTrackIndex(nextIdx);
      setCurrentTrack(MOCK_TRACKS[nextIdx]);
    }
    setElapsedSeconds(0);
    triggerNotification(`Następny utwór`);
  };

  const handlePrevTrack = () => {
    if (selectedPlaylist) {
      const prevIdx = (activePlaylistTrackIdx - 1 + selectedPlaylist.tracks.length) % selectedPlaylist.tracks.length;
      setActivePlaylistTrackIdx(prevIdx);
      setCurrentTrack(selectedPlaylist.tracks[prevIdx]);
    } else {
      const prevIdx = (activeTrackIndex - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length;
      setActiveTrackIndex(prevIdx);
      setCurrentTrack(MOCK_TRACKS[prevIdx]);
    }
    setElapsedSeconds(0);
    triggerNotification(`Poprzedni utwór`);
  };

  const handleScrub = (percent: number) => {
    const targetSecs = Math.floor((percent / 100) * totalSeconds);
    setElapsedSeconds(targetSecs);
  };

  const filteredTracks = MOCK_TRACKS.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (showLoginModal) {
      if (direction === 'left') {
        setLoginTab('qr');
        setModalFocusIndex(0);
      } else if (direction === 'right') {
        setLoginTab('credentials');
        setModalFocusIndex(1);
      } else if (direction === 'down') {
        setModalFocusIndex(2);
      } else if (direction === 'up') {
        setModalFocusIndex(0);
      }
      return;
    }

    if (focusedSection === 'loginBtn') {
      if (direction === 'down') {
        setFocusedSection('tracks');
      } else if (direction === 'left') {
        setFocusedSection('menu');
      }
    } else if (focusedSection === 'menu') {
      if (direction === 'up') {
        setActiveMenuIndex(prev => {
          const nextIdx = Math.max(0, prev - 1);
          if (nextIdx === 1) setSelectedPlaylist(null);
          return nextIdx;
        });
      } else if (direction === 'down') {
        setActiveMenuIndex(prev => {
          const nextIdx = Math.min(MENU_ITEMS.length - 1, prev + 1);
          if (nextIdx === 1) setSelectedPlaylist(null);
          return nextIdx;
        });
      } else if (direction === 'right') {
        if (activeMenuIndex === 4) {
          setFocusedSection('searchInput');
        } else if (selectedPlaylist) {
          setFocusedSection('playlistDetail');
        } else {
          setFocusedSection('tracks');
        }
      }
    } else if (focusedSection === 'searchInput') {
      if (direction === 'left') {
        setFocusedSection('menu');
      } else if (direction === 'down') {
        setFocusedSection('tracks');
      }
    } else if (focusedSection === 'playlistDetail') {
      if (direction === 'left') {
        setSelectedPlaylist(null);
        setFocusedSection('tracks');
      } else if (direction === 'up') {
        setActivePlaylistTrackIdx(prev => Math.max(0, prev - 1));
      } else if (direction === 'down') {
        if (selectedPlaylist && activePlaylistTrackIdx === selectedPlaylist.tracks.length - 1) {
          setFocusedSection('player');
        } else {
          setActivePlaylistTrackIdx(prev => prev + 1);
        }
      }
    } else if (focusedSection === 'tracks') {
      if (direction === 'left') {
        setFocusedSection('menu');
      } else if (direction === 'right') {
        if (activeMenuIndex === 1) {
          setActiveTrackIndex(prev => Math.min(MOCK_PLAYLISTS.length - 1, prev + 1));
        } else {
          setActiveTrackIndex(prev => Math.min(filteredTracks.length - 1, prev + 1));
        }
      } else if (direction === 'up') {
        if (activeTrackIndex >= 3) {
          setActiveTrackIndex(prev => prev - 3);
        } else {
          setFocusedSection('loginBtn');
        }
      } else if (direction === 'down') {
        const listLen = activeMenuIndex === 1 ? MOCK_PLAYLISTS.length : filteredTracks.length;
        if (activeTrackIndex + 3 < listLen) {
          setActiveTrackIndex(prev => prev + 3);
        } else {
          setFocusedSection('player');
        }
      }
    } else if (focusedSection === 'player') {
      if (direction === 'up') {
        if (selectedPlaylist) {
          setFocusedSection('playlistDetail');
        } else {
          setFocusedSection('tracks');
        }
      } else if (direction === 'right') {
        setElapsedSeconds(prev => Math.min(totalSeconds, prev + 10));
        triggerNotification("Przewinięto +10s");
      } else if (direction === 'left') {
        setElapsedSeconds(prev => Math.max(0, prev - 10));
        triggerNotification("Przewinięto -10s");
      }
    }
  };

  const handleSelect = () => {
    if (showLoginModal) {
      if (modalFocusIndex === 0) {
        handleDemoLogin("Konto Apple TV", "apple-tv@icloud.com");
      } else if (modalFocusIndex === 1) {
        const enteredName = usernameInput ? usernameInput.split('@')[0] : "Konto Apple ID";
        handleDemoLogin(enteredName, usernameInput || "apple-id@icloud.com");
      } else {
        const enteredName = usernameInput ? usernameInput.split('@')[0] : "Konto Apple ID";
        handleDemoLogin(enteredName, usernameInput || "apple-id@icloud.com");
      }
      return;
    }

    if (focusedSection === 'loginBtn') {
      if (user) {
        setUser(null);
        triggerNotification("Wylogowano z Apple ID");
      } else {
        setShowLoginModal(true);
        setFocusedSection('modal');
      }
    } else if (focusedSection === 'tracks') {
      if (activeMenuIndex === 1) {
        const selected = MOCK_PLAYLISTS[activeTrackIndex];
        setSelectedPlaylist(selected);
        setActivePlaylistTrackIdx(0);
        setFocusedSection('playlistDetail');
        triggerNotification(`Otwarto: ${selected.name}`);
      } else {
        const selected = filteredTracks[activeTrackIndex];
        if (selected) {
          setSelectedPlaylist(null);
          setCurrentTrack(selected);
          setIsPlaying(true);
          setElapsedSeconds(0);
          triggerNotification(`Odtwarzanie: ${selected.title}`);
        }
      }
    } else if (focusedSection === 'playlistDetail') {
      if (selectedPlaylist) {
        const selected = selectedPlaylist.tracks[activePlaylistTrackIdx];
        setCurrentTrack(selected);
        setIsPlaying(true);
        setElapsedSeconds(0);
        triggerNotification(`Odtwarzanie: ${selected.title}`);
      }
    } else if (focusedSection === 'menu') {
      setSelectedPlaylist(null);
      setFocusedSection('tracks');
    } else if (focusedSection === 'player') {
      setIsPlaying(prev => !prev);
    }
  };

  const handleBack = () => {
    if (showLoginModal) {
      setShowLoginModal(false);
      setFocusedSection('tracks');
    } else if (selectedPlaylist) {
      setSelectedPlaylist(null);
      setFocusedSection('tracks');
    } else if (focusedSection !== 'tracks') {
      setFocusedSection('tracks');
    } else {
      triggerNotification("BACK");
    }
  };

  const handleDemoLogin = (name: string, email: string) => {
    setUser({
      name,
      email,
      avatar: name.substring(0, 2).toUpperCase(),
      isPremium: true
    });
    setShowLoginModal(false);
    setFocusedSection('tracks');
    triggerNotification(`Zalogowano: ${name}`);
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Backspace'].includes(e.key)) {
        if (focusedSection !== 'searchInput' || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) {
          e.preventDefault();
        }
      }

      switch (e.key) {
        case 'ArrowUp':
          handleNavigate('up');
          break;
        case 'ArrowDown':
          handleNavigate('down');
          break;
        case 'ArrowLeft':
          handleNavigate('left');
          break;
        case 'ArrowRight':
          handleNavigate('right');
          break;
        case 'Enter':
          handleSelect();
          break;
        case 'Backspace':
          handleBack();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedSection, activeMenuIndex, activeTrackIndex, showLoginModal, modalFocusIndex, usernameInput, passwordInput, user, selectedPlaylist, activePlaylistTrackIdx, totalSeconds]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'PlayCircle': return <PlayCircle className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      case 'Search': return <Search className="w-5 h-5" />;
      default: return <Music className="w-5 h-5" />;
    }
  };

  return (
    <div id="tv-simulator-container" className="flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Interactive Simulated TV Screen */}
      <div className="flex-1 bg-black rounded-3xl p-4 border border-[#222] shadow-[0_0_50px_rgba(250,36,60,0.15)] relative overflow-hidden flex flex-col">
        {/* TV Frame Bezel Header */}
        <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono px-3 pb-2 border-b border-[#111] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>SIMULATOR ANDROID TV OS</span>
          </div>
          <div className="flex items-center gap-3">
            <span>RES: 1920x1080 (HD)</span>
            <span>USER-AGENT: APPLE TV / SMART TV EMULATOR</span>
          </div>
        </div>

        {/* The Screen Canvas */}
        <div className="relative aspect-video w-full bg-[#0a0a0c] rounded-xl overflow-hidden flex flex-row select-none">
          
          {/* Glowing Animated Backdrop in Lyrics Mode */}
          {showLyrics && (
            <div className="absolute inset-0 z-0 transition-all duration-1000 overflow-hidden pointer-events-none">
              <div 
                className="absolute inset-0 bg-cover bg-center scale-155 blur-[50px] opacity-35"
                style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
              ></div>
              <div className="absolute inset-0 bg-black/70"></div>
            </div>
          )}

          {/* Left Navigation Bar */}
          <div className="w-48 bg-[#020202]/90 border-r border-[#15151a] p-4 flex flex-col justify-between z-10">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-2 px-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FA243C] to-[#ff5e72] flex items-center justify-center shadow-lg shadow-red-950">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-white text-sm tracking-wide">Music TV</span>
              </div>

              {/* Menu List */}
              <nav className="space-y-1">
                {MENU_ITEMS.map((item, idx) => {
                  const isFocused = focusedSection === 'menu' && activeMenuIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenuIndex(idx);
                        setSelectedPlaylist(null);
                        setFocusedSection('menu');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                        isFocused 
                          ? 'bg-[#FA243C] text-white shadow-lg shadow-red-950 scale-105 translate-x-1 border border-red-400' 
                          : 'text-gray-400 hover:bg-[#121216] hover:text-white'
                      }`}
                    >
                      {renderIcon(item.icon)}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Profile / TV Indicator */}
            <div className="px-2 py-1.5 bg-[#121216] rounded-lg border border-[#222] flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FA243C] flex items-center justify-center text-[10px] text-white font-bold font-mono">
                {user ? user.avatar : "P"}
              </div>
              <div className="text-[9px]">
                <p className="text-gray-300 font-medium truncate max-w-[90px]">{user ? user.name : "Salon TV"}</p>
                <p className="text-gray-500 font-mono">{user ? "Użytkownik" : "Konto Demo"}</p>
              </div>
            </div>
          </div>

          {/* Right Main Grid Workspace */}
          <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto z-10">
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[10px] font-mono text-[#FA243C] tracking-widest uppercase font-bold">
                    {activeMenuIndex === 0 && (user ? `Witaj ponownie, ${user.name}!` : "Dla Ciebie")}
                    {activeMenuIndex === 1 && "Przeglądaj Playlisty"}
                    {activeMenuIndex === 2 && "Słuchaj na Żywo"}
                    {activeMenuIndex === 3 && "Twoja Biblioteka"}
                    {activeMenuIndex === 4 && "Wyszukaj Ulubione Hity"}
                  </h3>
                  <h2 className="text-lg font-display font-bold text-white">
                    {activeMenuIndex === 0 && (user ? "Rekomendowane dla Ciebie" : "Słuchaj teraz")}
                    {activeMenuIndex === 1 && "Oficjalne Playlisty Apple Music"}
                    {activeMenuIndex === 2 && "Najlepsze stacje radiowe"}
                    {activeMenuIndex === 3 && "Twoja zapisana kolekcja"}
                    {activeMenuIndex === 4 && "Znajdź wykonawców i utwory"}
                  </h2>
                </div>
                
                {/* Account Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (user) {
                        setUser(null);
                        triggerNotification("Wylogowano pomyślnie");
                      } else {
                        setShowLoginModal(true);
                        setFocusedSection('modal');
                      }
                    }}
                    className={`text-[9px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
                      focusedSection === 'loginBtn'
                        ? 'bg-[#FA243C] text-white border-red-500 scale-105 shadow-lg shadow-red-950/40'
                        : 'bg-[#121216] text-gray-300 border-[#222] hover:text-white'
                    }`}
                  >
                    {user ? (
                      <>
                        <LogOut className="w-3 h-3 text-red-400" />
                        <span>Wyloguj ({user.name})</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3 h-3 text-[#FA243C]" />
                        <span>Zaloguj się</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* TAB 0: LISTEN NOW */}
              {activeMenuIndex === 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_TRACKS.map((track, idx) => {
                    const isFocused = focusedSection === 'tracks' && activeTrackIndex === idx;
                    const isCurrent = currentTrack.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          setActiveTrackIndex(idx);
                          setSelectedPlaylist(null);
                          setCurrentTrack(track);
                          setIsPlaying(true);
                          setElapsedSeconds(0);
                          setFocusedSection('tracks');
                        }}
                        className={`relative rounded-xl p-2.5 bg-[#111115]/80 border transition-all duration-300 cursor-pointer ${
                          isFocused 
                            ? 'border-[#FA243C] bg-[#1a1a24] scale-105 shadow-[0_4px_20px_rgba(250,36,60,0.25)] ring-2 ring-red-500/30' 
                            : 'border-[#1a1a24] hover:bg-[#15151c]'
                        }`}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-[#222]">
                          <img 
                            src={track.coverUrl} 
                            alt={track.title} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          {isCurrent && isPlaying && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="flex items-end gap-1 h-6">
                                <span className="w-1 bg-[#FA243C] rounded-full animate-[bounce_0.8s_infinite_100ms] h-4"></span>
                                <span className="w-1 bg-[#FA243C] rounded-full animate-[bounce_0.8s_infinite_300ms] h-6"></span>
                                <span className="w-1 bg-[#FA243C] rounded-full animate-[bounce_0.8s_infinite_200ms] h-3"></span>
                              </div>
                            </div>
                          )}
                        </div>
                        <h4 className="text-[10px] font-bold text-white truncate">{track.title}</h4>
                        <p className="text-[8px] text-gray-400 truncate">{track.artist}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 1: BROWSE (PLAYLISTS) */}
              {activeMenuIndex === 1 && !selectedPlaylist && (
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_PLAYLISTS.map((playlist, idx) => {
                    const isFocused = focusedSection === 'tracks' && activeTrackIndex === idx;
                    return (
                      <div
                        key={playlist.id}
                        onClick={() => {
                          setActiveTrackIndex(idx);
                          setSelectedPlaylist(playlist);
                          setActivePlaylistTrackIdx(0);
                          setFocusedSection('playlistDetail');
                        }}
                        className={`relative rounded-xl p-2.5 bg-[#111115]/80 border transition-all duration-300 cursor-pointer ${
                          isFocused 
                            ? 'border-[#FA243C] bg-[#1a1a24] scale-105 shadow-[0_4px_20px_rgba(250,36,60,0.25)] ring-2 ring-red-500/30' 
                            : 'border-[#1a1a24] hover:bg-[#15151c]'
                        }`}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-[#222]">
                          <img 
                            src={playlist.coverUrl} 
                            alt={playlist.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/70 border border-white/10 text-white">
                            <ListMusic className="w-3.5 h-3.5 text-[#FA243C]" />
                          </div>
                        </div>
                        <h4 className="text-[10px] font-bold text-white truncate">{playlist.name}</h4>
                        <p className="text-[8px] text-gray-400 truncate">{playlist.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PLAYLIST DETAIL SUB-VIEW */}
              {activeMenuIndex === 1 && selectedPlaylist && (
                <div className="bg-[#121216]/60 rounded-xl p-4 border border-[#222]/80 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-24 md:w-32 aspect-square rounded-lg overflow-hidden shrink-0 border border-[#333]">
                    <img src={selectedPlaylist.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-xs text-[#FA243C] font-bold">Playlista</h3>
                        <h2 className="text-base font-bold text-white">{selectedPlaylist.name}</h2>
                        <p className="text-[9px] text-gray-400">{selectedPlaylist.description}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedPlaylist(null)}
                        className="text-[9px] bg-[#1d1d24] text-gray-300 px-2 py-1 rounded border border-[#333] hover:text-white"
                      >
                        Wróć do list
                      </button>
                    </div>

                    <div className="space-y-1 mt-2">
                      {selectedPlaylist.tracks.map((track, sIdx) => {
                        const isFocused = focusedSection === 'playlistDetail' && activePlaylistTrackIdx === sIdx;
                        const isPlayingNow = currentTrack.id === track.id && isPlaying;
                        return (
                          <div
                            key={track.id}
                            onClick={() => {
                              setActivePlaylistTrackIdx(sIdx);
                              setCurrentTrack(track);
                              setIsPlaying(true);
                              setElapsedSeconds(0);
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg text-[10px] transition-all cursor-pointer ${
                              isFocused 
                                ? 'bg-[#FA243C] text-white font-bold' 
                                : 'bg-[#1a1a22]/35 text-gray-300 hover:bg-[#1a1a22]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{sIdx + 1}.</span>
                              <span>{track.title} - {track.artist}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[9px]">
                              {isPlayingNow ? <span className="text-[8px] uppercase tracking-widest text-emerald-400">GRA</span> : null}
                              <span>{track.duration}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RADIO */}
              {activeMenuIndex === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-[#251015] to-[#0d0709] rounded-2xl border border-red-950/40 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] bg-[#FA243C] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">LIVE</span>
                      <h3 className="text-sm font-bold text-white mt-1">Apple Music 1</h3>
                      <p className="text-[9px] text-gray-400 mt-0.5">Zane Lowe & goście z całego świata</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FA243C]/20 flex items-center justify-center border border-[#FA243C]/30">
                      <Radio className="w-5 h-5 text-[#FA243C] animate-pulse" />
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#101c25] to-[#070d11] rounded-2xl border border-blue-950/40 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono font-mono">STACJA</span>
                      <h3 className="text-sm font-bold text-white mt-1">Rap Life Radio</h3>
                      <p className="text-[9px] text-gray-400 mt-0.5">Hip-hop, trap i uliczne brzmienia</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <Music className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIBRARY */}
              {activeMenuIndex === 3 && (
                <div className="p-8 text-center bg-[#111115]/50 rounded-2xl border border-[#222] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#FA243C]/10 flex items-center justify-center mb-3">
                    <Layers className="w-6 h-6 text-[#FA243C]" />
                  </div>
                  <h3 className="text-xs font-bold text-white">Twoja Biblioteka jest pusta</h3>
                  <p className="text-[9px] text-gray-400 max-w-sm mt-1">
                    Połącz się z oficjalnym kontem Apple ID, aby zsynchronizować swoje własne utwory, ulubionych wykonawców i prywatne playlisty.
                  </p>
                </div>
              )}

              {/* TAB 4: SEARCH */}
              {activeMenuIndex === 4 && (
                <div className="space-y-3">
                  {/* Search Input Bar inside TV Screen */}
                  <div className={`relative rounded-xl border transition-all duration-200 ${
                    focusedSection === 'searchInput'
                      ? 'border-[#FA243C] bg-[#1a1012] ring-2 ring-red-500/30'
                      : 'border-[#222] bg-[#111115]'
                  }`}>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Wpisz nazwę piosenki, wykonawcy, gatunku..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setFocusedSection('searchInput')}
                      className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  {/* Filtered Tracks Results Grid */}
                  {filteredTracks.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {filteredTracks.map((track, idx) => {
                        const isFocused = focusedSection === 'tracks' && activeTrackIndex === idx;
                        const isCurrent = currentTrack.id === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => {
                              setActiveTrackIndex(idx);
                              setCurrentTrack(track);
                              setIsPlaying(true);
                              setElapsedSeconds(0);
                            }}
                            className={`relative rounded-xl p-2 bg-[#111115]/80 border transition-all duration-300 cursor-pointer ${
                              isFocused 
                                ? 'border-[#FA243C] bg-[#1a1a24] scale-105 shadow-[0_4px_20px_rgba(250,36,60,0.25)] ring-2 ring-red-500/30' 
                                : 'border-[#1a1a24] hover:bg-[#15151c]'
                            }`}
                          >
                            <h4 className="text-[10px] font-bold text-white truncate">{track.title}</h4>
                            <p className="text-[8px] text-gray-400 truncate">{track.artist}</p>
                            <span className="text-[7px] font-mono mt-1 block text-[#FA243C]">{track.genre}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[10px] text-gray-500">
                      Brak wyników wyszukiwania dla "{searchQuery}". Spróbuj wpisać "Weeknd" lub "Summer".
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* SPLIT SCREEN LYRICS INTERFACE (GLOWING APPLE TV STYLE) */}
            {showLyrics && currentTrack.lyrics && (
              <div className="absolute top-4 right-4 bottom-20 w-72 bg-black/65 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-2xl z-20 transition-all duration-300">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 shrink-0">
                  <FileText className="w-3.5 h-3.5 text-[#FA243C]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tekst utworu (Live)</span>
                </div>
                
                {/* Scrollable lyrics container */}
                <div 
                  ref={lyricsContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 py-8 pr-1 scrollbar-none scroll-smooth"
                  style={{ maskImage: 'linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)' }}
                >
                  {parsedLyrics.map((lyric, index) => {
                    const isActive = index === activeLyricIndex;
                    return (
                      <p 
                        key={lyric.id}
                        className={`transition-all duration-300 origin-left text-left leading-relaxed ${
                          isActive 
                            ? 'text-white text-xs font-bold scale-105 shadow-sm filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                            : 'text-gray-500 text-[10px] opacity-50 hover:opacity-80'
                        }`}
                      >
                        {lyric.text}
                      </p>
                    );
                  })}
                </div>

                <div className="text-center pt-2 border-t border-white/5 shrink-0">
                  <span className="text-[8px] text-gray-400 font-mono">Przewijaj oś czasu, aby przewijać tekst</span>
                </div>
              </div>
            )}

            {/* Simulated TV Music Player bar */}
            <div 
              onClick={() => {
                setFocusedSection('player');
              }}
              className={`mt-3 p-2.5 rounded-xl bg-[#030303]/90 border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                focusedSection === 'player'
                  ? 'border-[#FA243C] bg-[#100b0d] shadow-[0_0_15px_rgba(250,36,60,0.15)] ring-1 ring-red-500/50'
                  : 'border-[#15151a]'
              }`}
            >
              <div className="flex items-center gap-3 shrink-0">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title} 
                  className="w-10 h-10 rounded-lg object-cover bg-[#222] border border-[#333]" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {currentTrack.title}
                    <span className="text-[7px] font-mono px-1 py-0.5 bg-[#FA243C]/20 text-[#FA243C] rounded">
                      {currentTrack.genre}
                    </span>
                  </h4>
                  <p className="text-[9px] text-gray-400">{currentTrack.artist} — {currentTrack.album}</p>
                </div>
              </div>

              {/* Progress, Controls & Interactive Scrubbing */}
              <div className="flex items-center gap-4 flex-1 justify-end">
                {/* Time Indicators */}
                <span className="text-[9px] font-mono text-gray-500">{formatTime(elapsedSeconds)}</span>
                
                {/* Clickable range slider for scrubbing/scrolling */}
                <div className="relative flex-1 max-w-[200px] h-4 flex items-center group">
                  <input 
                    type="range"
                    min="0"
                    max={totalSeconds}
                    value={elapsedSeconds}
                    onChange={(e) => handleScrub(parseInt(e.target.value, 10))}
                    className="w-full accent-[#FA243C] h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer transition-all focus:outline-none"
                  />
                </div>

                <span className="text-[9px] font-mono text-gray-400">-{formatTime(totalSeconds - elapsedSeconds)}</span>

                {/* Player button mimics */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Lyrics Toggle Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLyrics(prev => !prev);
                      triggerNotification(showLyrics ? "Ukryto tekst utworu" : "Pokazano tekst utworu");
                    }}
                    title="Tekst utworu"
                    className={`p-1.5 rounded-lg transition-all ${showLyrics ? 'bg-[#FA243C]/20 text-[#FA243C]' : 'text-gray-400 hover:text-white'}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevTrack();
                    }}
                    className="p-1.5 rounded-full hover:bg-neutral-800 text-gray-400 hover:text-white"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-2 rounded-full bg-[#FA243C] text-white hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextTrack();
                    }}
                    className="p-1.5 rounded-full hover:bg-neutral-800 text-gray-400 hover:text-white"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Authentic TV Apple ID Auth Overlay */}
          {showLoginModal && (
            <div className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-center items-center p-6">
              <div className="w-full max-w-xl bg-[#0e0e12] border border-[#252535] rounded-2xl p-6 relative flex flex-col justify-between h-[90%]">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#222] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#FA243C] flex items-center justify-center">
                      <Music className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-display font-extrabold text-white tracking-wide">Zaloguj się za pomocą swojego Apple ID</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowLoginModal(false);
                      setFocusedSection('tracks');
                    }}
                    className="text-[9px] text-gray-400 hover:text-white font-mono bg-[#16161c] px-2 py-0.5 rounded border border-[#222]"
                  >
                    [BACK] Zamknij
                  </button>
                </div>

                {/* Main Auth Panels */}
                <div className="flex-1 grid grid-cols-2 gap-4 py-4 items-stretch">
                  
                  {/* Left panel: QR / TV Activation */}
                  <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    loginTab === 'qr' 
                      ? 'border-[#FA243C] bg-[#161113]' 
                      : 'border-[#1b1b22] bg-[#0c0c0e]/40'
                  }`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                        <QrCode className="w-3.5 h-3.5 text-[#FA243C]" />
                        <span>Skanuj kod QR</span>
                      </div>
                      <p className="text-[9px] text-gray-400 leading-relaxed">
                        Skieruj aparat telefonu na kod QR lub przejdź do activate.apple.com i podaj kod aktywacyjny.
                      </p>
                    </div>

                    {/* Styled Mock QR Code */}
                    <div className="flex items-center justify-center my-1">
                      <div className="bg-white p-2 rounded-lg relative shadow-lg">
                        <div className="w-16 h-16 bg-neutral-900 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono font-bold uppercase leading-tight text-center p-1">
                          <Music className="w-4 h-4 text-[#FA243C] mb-1 animate-pulse" />
                          Apple Auth
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-[8px] font-mono text-gray-500 uppercase">Kod aktywacyjny TV:</div>
                      <div className="text-xs font-mono font-extrabold text-white tracking-widest bg-black px-2.5 py-1 rounded border border-[#222] inline-block">
                        AMTV - 9482
                      </div>
                    </div>
                  </div>

                  {/* Right panel: Credentials Form */}
                  <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    loginTab === 'credentials' 
                      ? 'border-[#FA243C] bg-[#111316]' 
                      : 'border-[#1b1b22] bg-[#0c0c0e]/40'
                  }`}>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>Wpisz Apple ID</span>
                      </div>
                      
                      {/* Email Input */}
                      <div className="space-y-1">
                        <label className="text-[8px] text-gray-400 block font-mono">EMAIL / APPLE ID</label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                          <input 
                            type="text" 
                            placeholder="twoj-email@icloud.com"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="w-full bg-black border border-[#222] rounded-lg pl-8 pr-2 py-1 text-[9px] text-white focus:outline-none focus:border-[#FA243C]"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="space-y-1">
                        <label className="text-[8px] text-gray-400 block font-mono">HASŁO</label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                          <input 
                            type="password" 
                            placeholder="••••••••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-black border border-[#222] rounded-lg pl-8 pr-2 py-1 text-[9px] text-white focus:outline-none focus:border-[#FA243C]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[8px] text-gray-500 leading-tight">
                      Możesz zatwierdzić puste pola, aby automatycznie użyć konta testowego premium.
                    </div>
                  </div>

                </div>

                {/* Confirm Action Button */}
                <div className="border-t border-[#222] pt-3 flex justify-between items-center">
                  <span className="text-[8px] text-gray-500 font-mono">Użyj strzałki LEWO/PRAWO, aby przełączać metody, a potem [OK]</span>
                  <button
                    onClick={() => {
                      if (loginTab === 'qr') {
                        handleDemoLogin("Konto Apple TV", "apple-tv@icloud.com");
                      } else {
                        const enteredName = usernameInput ? usernameInput.split('@')[0] : "Konto Apple ID";
                        handleDemoLogin(enteredName, usernameInput || "apple-id@icloud.com");
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                      modalFocusIndex === 2 
                        ? 'bg-white text-black scale-105' 
                        : 'bg-[#FA243C] text-white hover:bg-red-500'
                    }`}
                  >
                    POTWIERDŹ I ZALOGUJ SIĘ [ENTER]
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Active Toast / Notification */}
        {showNotification && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium z-50 animate-bounce">
            <Check className="w-4 h-4 text-green-500" />
            <span>{showNotification}</span>
          </div>
        )}
      </div>

      {/* Interactive Simulated Remote Control Widget */}
      <div className="w-full lg:w-64 bg-[#121216] border border-[#222] rounded-3xl p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Akcesoria TV</span>
            <h4 className="text-sm font-display font-bold text-white mt-1">Pilot Sterowania (D-PAD)</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
              Klikaj przyciski poniżej lub używaj strzałek na swojej klawiaturze.
            </p>
          </div>

          {/* D-PAD design */}
          <div className="my-6 flex justify-center">
            <div className="relative w-40 h-40 bg-[#1e1e24] rounded-full p-4 shadow-inner border border-neutral-800 flex items-center justify-center">
              {/* Up Button */}
              <button 
                onClick={() => handleNavigate('up')}
                className="absolute top-2 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-[#25252c] hover:bg-[#32323b] text-gray-300 hover:text-white transition-all duration-150 active:scale-90"
                title="W górę"
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              {/* Left Button */}
              <button 
                onClick={() => handleNavigate('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#25252c] hover:bg-[#32323b] text-gray-300 hover:text-white transition-all duration-150 active:scale-90"
                title="W lewo"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Center OK Button */}
              <button 
                onClick={handleSelect}
                className="w-14 h-14 rounded-full bg-[#FA243C] text-white hover:bg-red-500 flex flex-col items-center justify-center font-bold text-xs shadow-md shadow-red-950/40 hover:scale-105 active:scale-95 transition-all duration-150"
                title="Zatwierdź / OK"
              >
                <span className="text-[9px] uppercase tracking-wide">OK</span>
                <CornerDownLeft className="w-3.5 h-3.5 mt-0.5" />
              </button>

              {/* Right Button */}
              <button 
                onClick={() => handleNavigate('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#25252c] hover:bg-[#32323b] text-gray-300 hover:text-white transition-all duration-150 active:scale-90"
                title="W prawo"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Down Button */}
              <button 
                onClick={() => handleNavigate('down')}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-[#25252c] hover:bg-[#32323b] text-gray-300 hover:text-white transition-all duration-150 active:scale-90"
                title="W dół"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={handleBack}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#222] hover:bg-[#2c2c35] text-gray-300 hover:text-white text-xs font-semibold active:scale-95 transition-all"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
            <button 
              onClick={() => {
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FA243C]/10 border border-[#FA243C]/20 hover:bg-[#FA243C]/20 text-[#FA243C] hover:text-white text-xs font-semibold active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#222]">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono">Połączono z ekranem TV</span>
          </div>
        </div>
      </div>
    </div>
  );
}
