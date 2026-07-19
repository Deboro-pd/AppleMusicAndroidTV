package com.example.applemusicwrapper;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {

    private static final String TAG = "AppleMusicTV";
    private WebView mWebView;
    private VirtualCursorView mCursorView;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);

        // ❌ Wyłącz focus na WebView - nie chcemy aby WebView obsługiwał D-Pad
        mWebView.setFocusable(false);
        mWebView.setFocusableInTouchMode(false);

        // Konfiguracja ustawień WebView dla odtwarzacza TV
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // Włączenie obsługi ciasteczek
        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(mWebView, true);

        // ✅ NAJNOWSZY CHROME USER-AGENT
        String tvUserAgent = "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
        webSettings.setUserAgentString(tvUserAgent);

        mWebView.setKeepScreenOn(true);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        mWebView.loadUrl("https://music.apple.com");

        // 🎮 Dodaj wirtualny kursor - ON BĘDZIE GŁÓWNYM STEROWANIEM
        FrameLayout rootView = findViewById(R.id.container);
        mCursorView = new VirtualCursorView(this, mWebView);
        rootView.addView(mCursorView);
        
        // ⭐ Ustaw fokus na VirtualCursorView!
        mCursorView.setFocusable(true);
        mCursorView.setFocusableInTouchMode(true);
        mCursorView.requestFocus();
        
        Log.d(TAG, "✅ VirtualCursorView ma FOCUS - D-Pad będzie sterować kursorem!");
    }

    // Obsługa D-Pad - WSZYSTKO idzie do VirtualCursorView
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.d(TAG, "🎮 KeyEvent: " + KeyEvent.keyCodeToString(keyCode));
        
        // Jeśli VirtualCursorView ma focus, przekaż mu wszystkie klawisze
        if (mCursorView != null && mCursorView.hasFocus()) {
            return mCursorView.onKeyDown(keyCode, event);
        }

        // Dla BACK zawsze obsługuj
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (mWebView.canGoBack()) {
                mWebView.goBack();
            } else {
                finish();
            }
            return true;
        }

        return super.onKeyDown(keyCode, event);
    }
}
