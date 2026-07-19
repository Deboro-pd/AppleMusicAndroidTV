package com.example.applemusicwrapper;

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
}
