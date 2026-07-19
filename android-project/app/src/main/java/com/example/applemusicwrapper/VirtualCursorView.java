package com.example.applemusicwrapper;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebView;

public class VirtualCursorView extends View {
    private static final String TAG = "VirtualCursor";
    
    private float cursorX;
    private float cursorY;
    private Paint cursorPaint;
    private Paint cursorOuterPaint;
    private Paint crossPaint;
    private int cursorRadius = 25;
    private int cursorSpeed = 20;
    private boolean isVisible = true;
    private WebView mWebView;

    // ✅ Poprawne konstruktory
    public VirtualCursorView(Context context, WebView webView) {
        super(context);
        this.mWebView = webView;
        init();
    }

    public VirtualCursorView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public VirtualCursorView(Context context) {
        super(context);
        init();
    }

    private void init() {
        setFocusable(true);
        setFocusableInTouchMode(true);

        // Pomarańczowy kursor
        cursorPaint = new Paint();
        cursorPaint.setColor(Color.argb(255, 255, 165, 0));
        cursorPaint.setAntiAlias(true);

        // Zewnętrzne kółko
        cursorOuterPaint = new Paint();
        cursorOuterPaint.setColor(Color.argb(200, 255, 165, 0));
        cursorOuterPaint.setAntiAlias(true);
        cursorOuterPaint.setStyle(Paint.Style.STROKE);
        cursorOuterPaint.setStrokeWidth(4);

        // Krzyżyk
        crossPaint = new Paint();
        crossPaint.setColor(Color.WHITE);
        crossPaint.setStrokeWidth(2);

        // Startowa pozycja - środek ekranu
        cursorX = 960;
        cursorY = 540;
        
        Log.d(TAG, "✅ VirtualCursorView initialized");
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        if (!isVisible) return;

        // Rysuj kursor
        canvas.drawCircle(cursorX, cursorY, cursorRadius + 6, cursorOuterPaint);
        canvas.drawCircle(cursorX, cursorY, cursorRadius, cursorPaint);
        
        // Krzyżyk w środku
        canvas.drawLine(cursorX - 12, cursorY, cursorX + 12, cursorY, crossPaint);
        canvas.drawLine(cursorX, cursorY - 12, cursorX, cursorY + 12, crossPaint);
    }

    // ⭐ GŁÓWNA OBSŁUGA D-PAD
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.d(TAG, "🎮 D-Pad Key: " + KeyEvent.keyCodeToString(keyCode));
        
        switch (keyCode) {
            case KeyEvent.KEYCODE_DPAD_UP:
                moveCursor(0);
                return true;
                
            case KeyEvent.KEYCODE_DPAD_DOWN:
                moveCursor(1);
                return true;
                
            case KeyEvent.KEYCODE_DPAD_LEFT:
                moveCursor(2);
                return true;
                
            case KeyEvent.KEYCODE_DPAD_RIGHT:
                moveCursor(3);
                return true;
                
            case KeyEvent.KEYCODE_DPAD_CENTER:
            case KeyEvent.KEYCODE_ENTER:
                clickAtCursor();
                return true;
                
            case KeyEvent.KEYCODE_MENU:
            case KeyEvent.KEYCODE_0:
                toggleVisibility();
                return true;
        }
        
        return super.onKeyDown(keyCode, event);
    }

    public void moveCursor(int direction) {
        float oldX = cursorX;
        float oldY = cursorY;
        
        switch (direction) {
            case 0: // UP
                cursorY = Math.max(cursorRadius, cursorY - cursorSpeed);
                Log.d(TAG, "⬆️ UP: " + oldY + " → " + cursorY);
                break;
            case 1: // DOWN
                cursorY = Math.min(getHeight() - cursorRadius, cursorY + cursorSpeed);
                Log.d(TAG, "⬇️ DOWN: " + oldY + " → " + cursorY);
                break;
            case 2: // LEFT
                cursorX = Math.max(cursorRadius, cursorX - cursorSpeed);
                Log.d(TAG, "⬅️ LEFT: " + oldX + " → " + cursorX);
                break;
            case 3: // RIGHT
                cursorX = Math.min(getWidth() - cursorRadius, cursorX + cursorSpeed);
                Log.d(TAG, "➡️ RIGHT: " + oldX + " → " + cursorX);
                break;
        }
        
        invalidate();
    }

    private void clickAtCursor() {
        Log.d(TAG, "🖱️ CLICK at (" + cursorX + ", " + cursorY + ")");
        
        if (mWebView != null) {
            long eventTime = System.currentTimeMillis();
            
            MotionEvent downEvent = MotionEvent.obtain(
                    eventTime,
                    eventTime,
                    MotionEvent.ACTION_DOWN,
                    cursorX,
                    cursorY,
                    0
            );
            
            MotionEvent upEvent = MotionEvent.obtain(
                    eventTime,
                    eventTime + 100,
                    MotionEvent.ACTION_UP,
                    cursorX,
                    cursorY,
                    0
            );

            mWebView.onTouchEvent(downEvent);
            mWebView.onTouchEvent(upEvent);

            downEvent.recycle();
            upEvent.recycle();
            
            Log.d(TAG, "✅ Click sent to WebView");
        } else {
            Log.d(TAG, "⚠️ WebView is null!");
        }
    }

    public void toggleVisibility() {
        isVisible = !isVisible;
        Log.d(TAG, isVisible ? "👁️ Cursor SHOWN" : "👁️‍🗨️ Cursor HIDDEN");
        invalidate();
    }

    public float getCursorX() {
        return cursorX;
    }

    public float getCursorY() {
        return cursorY;
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        Log.d(TAG, "Touch at (" + event.getX() + ", " + event.getY() + ")");
        return super.onTouchEvent(event);
    }
}
