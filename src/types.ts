export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  genre: string;
  lyrics?: string[]; // Synced/line-by-line lyrics
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export type ActiveTab = 'code' | 'guide' | 'simulator_info';

