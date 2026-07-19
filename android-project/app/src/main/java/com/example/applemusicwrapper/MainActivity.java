package com.example.applemusicwrapper;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {

    private WebView mWebView;
    private VirtualCursorView mCursorView;
    private boolean cursorEnabled = true;

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

        // ✅ NAJNOWSZY CHROME USER-AGENT - obchodzenie DRM Apple Music
        // Udaje pełną przeglądarkę Chrome 127+ na Linux aarch64 (Android TV)
        String tvUserAgent = "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
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

        // 🎮 Dodaj wirtualny kursor do głównego kontenera
        FrameLayout rootView = findViewById(R.id.container);
        mCursorView = new VirtualCursorView(this);
        rootView.addView(mCursorView);
    }

    // Obsługa fizycznego D-Pad i przycisków pilocie Android TV
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (!cursorEnabled) {
            // Jeśli kursor wyłączony - normalna nawigacja WebView
            if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
                mWebView.goBack();
                return true;
            }
            return super.onKeyDown(keyCode, event);
        }

        switch (keyCode) {
            case KeyEvent.KEYCODE_DPAD_UP:
                mCursorView.moveCursor(0); // UP
                return true;
            case KeyEvent.KEYCODE_DPAD_DOWN:
                mCursorView.moveCursor(1); // DOWN
                return true;
            case KeyEvent.KEYCODE_DPAD_LEFT:
                mCursorView.moveCursor(2); // LEFT
                return true;
            case KeyEvent.KEYCODE_DPAD_RIGHT:
                mCursorView.moveCursor(3); // RIGHT
                return true;
            case KeyEvent.KEYCODE_DPAD_CENTER:
            case KeyEvent.KEYCODE_ENTER:
                clickAtCursor();
                return true;
            case KeyEvent.KEYCODE_BACK:
                if (mWebView.canGoBack()) {
                    mWebView.goBack();
                } else {
                    finish();
                }
                return true;
            case KeyEvent.KEYCODE_MENU:
                // Przełącz widoczność kursora
                mCursorView.toggleVisibility();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    private void clickAtCursor() {
        mCursorView.click();
        
        // Symuluj klik w WebView na pozycji kursora
        float x = mCursorView.getCursorX();
        float y = mCursorView.getCursorY();

        // Przekształć współrzędne do współrzędnych WebView
        int[] webViewPos = new int[2];
        mWebView.getLocationOnScreen(webViewPos);

        float webViewX = x - webViewPos[0];
        float webViewY = y - webViewPos[1];

        // Symuluj MotionEvent
        long eventTime = System.currentTimeMillis();
        MotionEvent downEvent = MotionEvent.obtain(
                eventTime,
                eventTime,
                MotionEvent.ACTION_DOWN,
                webViewX,
                webViewY,
                0
        );
        MotionEvent upEvent = MotionEvent.obtain(
                eventTime,
                eventTime + 50,
                MotionEvent.ACTION_UP,
                webViewX,
                webViewY,
                0
        );

        mWebView.onTouchEvent(downEvent);
        mWebView.onTouchEvent(upEvent);

        downEvent.recycle();
        upEvent.recycle();
    }
}
