package com.example.applemusicwrapper;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

public class VirtualCursorView extends View {
    private float cursorX = 0;
    private float cursorY = 0;
    private Paint cursorPaint;
    private Paint cursorOuterPaint;
    private int cursorRadius = 20;
    private int cursorSpeed = 15;
    private boolean isVisible = true;

    public VirtualCursorView(Context context) {
        super(context);
        init();
    }

    public VirtualCursorView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        cursorPaint = new Paint();
        cursorPaint.setColor(Color.argb(200, 255, 100, 0)); // Pomarańczowy kursor
        cursorPaint.setAntiAlias(true);

        cursorOuterPaint = new Paint();
        cursorOuterPaint.setColor(Color.argb(100, 255, 100, 0));
        cursorOuterPaint.setAntiAlias(true);
        cursorOuterPaint.setStyle(Paint.Style.STROKE);
        cursorOuterPaint.setStrokeWidth(3);

        // Startowa pozycja - środek ekranu
        cursorX = getWidth() / 2f;
        cursorY = getHeight() / 2f;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (isVisible) {
            // Zewnętrzne kółko
            canvas.drawCircle(cursorX, cursorY, cursorRadius + 5, cursorOuterPaint);
            // Wewnętrzne kółko
            canvas.drawCircle(cursorX, cursorY, cursorRadius, cursorPaint);
        }
    }

    public void moveCursor(int direction) {
        // direction: 0=up, 1=down, 2=left, 3=right
        switch (direction) {
            case 0: // UP
                cursorY = Math.max(cursorRadius, cursorY - cursorSpeed);
                break;
            case 1: // DOWN
                cursorY = Math.min(getHeight() - cursorRadius, cursorY + cursorSpeed);
                break;
            case 2: // LEFT
                cursorX = Math.max(cursorRadius, cursorX - cursorSpeed);
                break;
            case 3: // RIGHT
                cursorX = Math.min(getWidth() - cursorRadius, cursorX + cursorSpeed);
                break;
        }
        invalidate();
    }

    public void click() {
        // Animacja kliknięcia
        ValueAnimator animator = ValueAnimator.ofInt(cursorRadius, cursorRadius - 5, cursorRadius);
        animator.setDuration(150);
        animator.addUpdateListener(animation -> {
            cursorRadius = (int) animation.getAnimatedValue();
            invalidate();
        });
        animator.start();
    }

    public float getCursorX() {
        return cursorX;
    }

    public float getCursorY() {
        return cursorY;
    }

    public void toggleVisibility() {
        isVisible = !isVisible;
        invalidate();
    }

    public void setVisibility(boolean visible) {
        isVisible = visible;
        invalidate();
    }
}
