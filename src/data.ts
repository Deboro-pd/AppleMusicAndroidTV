import { Track, MenuItem, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
    duration: '3:50',
    genre: 'Pop / R&B',
    lyrics: [
      "[0:00] (Instrumental Intro - Spacey Synths)",
      "[0:05] I'm tryna put you in the worst mood, ah",
      "[0:10] P1 cleaner than your church shoes, ah",
      "[0:15] Milli point two just to hurt you, ah",
      "[0:20] House so empty, need a centerpiece",
      "[0:25] Twenty racks a table cut from ebony",
      "[0:30] Cut that trophy girls, your trophy wife",
      "[0:35] So I let her lick the plate for my appetite",
      "[0:40] She say she love my baby talk, her baby talk",
      "[0:45] We don't pray for love, we just pray for cars",
      "[0:50] Look what you've done...",
      "[0:55] I'm a motherf**king starboy!"
    ]
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop',
    duration: '3:20',
    genre: 'Synth-pop',
    lyrics: [
      "[0:00] (Fast retro 80s drum beat begins)",
      "[0:06] (Famous high-pitch synth hook plays)",
      "[0:15] Yeah...",
      "[0:17] I've been tryna call",
      "[0:21] I've been on my own for long enough",
      "[0:25] Maybe you can show me how to love, maybe",
      "[0:31] I'm going through withdrawals",
      "[0:35] You don't even have to do too much",
      "[0:39] You can turn me on with just a touch, baby",
      "[0:45] I look around and Sin City's cold and empty",
      "[0:51] No one's around to judge me",
      "[0:54] I can't see clearly when you're gone",
      "[0:59] I said, ooh, I'm blinded by the lights!"
    ]
  },
  {
    id: '3',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop',
    duration: '2:47',
    genre: 'Indie Pop',
    lyrics: [
      "[0:00] (Child's voice: 'Come on, Harry, we wanna say goodnight to you!')",
      "[0:03] (Upbeat indie synthesizer melody)",
      "[0:08] Holdin' me back",
      "[0:10] Gravity's holdin' me back",
      "[0:13] I want you to hold out the palm of your hand",
      "[0:17] Why don't we leave it at that?",
      "[0:21] Nothin' to say",
      "[0:23] When everything gets in the way",
      "[0:26] Seems you cannot be replaced",
      "[0:29] And I'm the one who will stay, oh",
      "[0:33] In this world, it's just us",
      "[0:37] You know it's not the same as it was",
      "[0:41] In this world, it's just us",
      "[0:44] You know it's not the same as it was..."
    ]
  },
  {
    id: '4',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop',
    duration: '3:20',
    genre: 'Disco Pop',
    lyrics: [
      "[0:00] (Soft guitar chords)",
      "[0:04] We were good, we were gold",
      "[0:09] Kinda dream that can't be sold",
      "[0:13] We were right 'til we weren't",
      "[0:17] Built a home and watched it burn",
      "[0:21] Mm, I didn't wanna leave you, I didn't wanna lie",
      "[0:26] Started to cry but then remembered I...",
      "[0:30] I can buy myself flowers",
      "[0:34] Write my name in the sand",
      "[0:38] Talk to myself for hours",
      "[0:42] Say things you don't understand",
      "[0:47] I can take myself dancing",
      "[0:51] And I can hold my own hand",
      "[0:55] Yeah, I can love me better than you can!"
    ]
  },
  {
    id: '5',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
    duration: '2:58',
    genre: 'Synth-pop',
    lyrics: [
      "[0:00] (Dreamy vocal chops and snare)",
      "[0:04] Fever dream high in the quiet of the night",
      "[0:07] You know that I caught it",
      "[0:11] Bad, bad boy, shiny toy with a price",
      "[0:14] You know that I bought it",
      "[0:17] Killing me slow, out the window",
      "[0:21] I'm always waiting for you to be waiting below",
      "[0:25] Devils roll the dice, angels roll their eyes",
      "[0:29] What's it gonna be? What's it gonna be?",
      "[0:33] It's a cruel, cruel summer",
      "[0:37] With you..."
    ]
  },
  {
    id: '6',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop',
    duration: '3:23',
    genre: 'Dance-pop',
    lyrics: [
      "[0:00] (Funky bassline intro)",
      "[0:04] If you wanna run away with me, I know a galaxy",
      "[0:08] And I can take you for a ride",
      "[0:11] I had a premonition that we fell into a rhythm",
      "[0:15] Where the music don't stop for life",
      "[0:19] Glitter in the sky, glitter in my eyes",
      "[0:22] Shining just the way I like",
      "[0:25] If you're feeling like you need a little bit of company",
      "[0:29] You met me at the perfect time",
      "[0:33] You want me, I want you, baby",
      "[0:36] My sugarboo, I'm levitating!"
    ]
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Polski Rap & Hip-Hop',
    description: 'Największe polskie hity rapowe do głośnego słuchania.',
    coverUrl: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=300&auto=format&fit=crop',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[4]]
  },
  {
    id: 'p2',
    name: 'Top 100: Global',
    description: 'Najchętniej słuchane utwory na świecie w tym tygodniu.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[2], MOCK_TRACKS[5]]
  },
  {
    id: 'p3',
    name: 'Letni Chillout',
    description: 'Spokojne, ciepłe melodie do relaksu na kanapie przed telewizorem.',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop',
    tracks: [MOCK_TRACKS[3], MOCK_TRACKS[2], MOCK_TRACKS[4]]
  }
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 'listen-now', label: 'Listen Now', icon: 'PlayCircle' },
  { id: 'browse', label: 'Browse', icon: 'Compass' },
  { id: 'radio', label: 'Radio', icon: 'Radio' },
  { id: 'library', label: 'Library', icon: 'Music' },
  { id: 'search', label: 'Search', icon: 'Search' }
];

export const MANIFEST_CODE = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.applemusicwrapper">

    <!-- Uprawnienie do korzystania z internetu -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Wymóg interfejsu Leanback dla Android TV -->
    <uses-feature android:name="android.software.leanback" android:required="true" />
    <!-- Ekran dotykowy NIE jest wymagany (sterowanie pilotem) -->
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Apple Music TV"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:hardwareAccelerated="true"
            android:screenOrientation="landscape"> <!-- Wymuszenie orientacji poziomej dla TV -->
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <!-- Kategoria uruchamiania dla Android TV (Leanback Launcher) -->
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>

</manifest>`;

export const LAYOUT_CODE = `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</FrameLayout>`;

export const JAVA_CODE = `package com.example.applemusicwrapper;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView mWebView;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);

        // Konfiguracja ustawień WebView dla odtwarzacza TV
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false); // Autoplay muzyki i wideo

        // Włączenie obsługi i zapisu ciasteczek (Cookies) - kluczowe dla trwałego zalogowania do Apple ID
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(mWebView, true);

        // Emulacja User-Agent TV (bardzo ważne, aby Apple Music załadował interfejs TV)
        String tvUserAgent = "Mozilla/5.0 (Large Screen; SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        webSettings.setUserAgentString(tvUserAgent);

        // Aktywacja przyspieszenia sprzętowego (Hardware Acceleration)
        mWebView.setKeepScreenOn(true); // Zapobieganie wygaszaniu ekranu TV podczas muzyki

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        // Ładowanie oficjalnej strony Apple Music Web Player
        mWebView.loadUrl("https://music.apple.com");
    }

    // Obsługa fizycznego przycisku BACK na pilocie Android TV
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
            mWebView.goBack(); // Cofnij na stronie zamiast zamykać aplikację
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}`;
