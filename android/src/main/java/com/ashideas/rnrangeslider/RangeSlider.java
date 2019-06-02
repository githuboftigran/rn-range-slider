package com.ashideas.rnrangeslider;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.CornerPathEffect;
import android.graphics.Paint;
import android.graphics.Path;
import android.support.annotation.Nullable;
import android.support.v4.math.MathUtils;
import android.support.v4.view.ViewCompat;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.View;


public class RangeSlider extends View {

    public enum LabelStyle {
        BUBBLE,
        NONE
    }

    public enum Gravity {
        TOP,
        BOTTOM,
        CENTER
    }

    private static final float SQRT_3 = (float) Math.sqrt(3);
    private static final float SQRT_3_2 = SQRT_3 / 2;

    private static final int THUMB_LOW = 0;
    private static final int THUMB_HIGH = 1;
    private static final int THUMB_NONE = -1;

    private OnValueChangeListener onValueChangeListener;

    private Paint selectionPaint;
    private Paint blankPaint;
    private Paint thumbPaint;
    private Paint thumbBorderPaint;
    private Paint labelPaint;
    private Paint labelBorderPaint;
    private Paint labelTextPaint;

    private float thumbRadius;
    private float thumbBorderWidth;

    private LabelStyle labelStyle;
    private Path labelPath;
    private String textFormat;
    private float labelPadding;
    private float labelBorderWidth;

    private boolean rangeEnabled;
    private Gravity gravity;

    private int minValue;
    private int maxValue;
    private int step;

    private boolean initialLowValueSet;
    private boolean initialHighValueSet;
    private int lowValue;
    private int highValue;

    private float labelTailHeight;
    private float labelGapHeight;

    private int activePointerId;
    private int activeThumb;

    public RangeSlider(Context context) {
        super(context);
        init();
    }

    public RangeSlider(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public RangeSlider(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {

        activePointerId = -1;
        activeThumb = THUMB_NONE;

        minValue = Integer.MIN_VALUE;
        maxValue = Integer.MAX_VALUE;
        lowValue = minValue;
        highValue = maxValue;

        step = 1;

        labelPath = new Path();

        selectionPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        selectionPaint.setStrokeCap(Paint.Cap.ROUND);

        blankPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        blankPaint.setStrokeCap(Paint.Cap.ROUND);

        labelPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        labelPaint.setStyle(Paint.Style.FILL);
        labelBorderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        labelBorderPaint.setStyle(Paint.Style.FILL);

        labelTextPaint = new Paint();

        thumbPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        thumbBorderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    }

    public void setOnValueChangeListener(OnValueChangeListener onValueChangeListener) {
        this.onValueChangeListener = onValueChangeListener;
    }

    public void setLineWidth(float lineWidth) {
        lineWidth = dpToPx(lineWidth);
        selectionPaint.setStrokeWidth(lineWidth);
        blankPaint.setStrokeWidth(lineWidth);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setThumbRadius(float thumbRadius) {
        this.thumbRadius = dpToPx(thumbRadius);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setThumbBorderWidth(float thumbBorderWidth) {
        this.thumbBorderWidth = dpToPx(thumbBorderWidth);
        thumbPaint.setStrokeWidth(dpToPx(this.thumbBorderWidth));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setTextSize(float textSize) {
        labelTextPaint.setTextSize(dpToPx(textSize));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelBorderWidth(float labelBorderWidth) {
        this.labelBorderWidth = dpToPx(labelBorderWidth);
        labelPaint.setStrokeWidth(this.labelBorderWidth);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelPadding(float labelPadding) {
        this.labelPadding = dpToPx(labelPadding);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelBorderRadius(float labelBorderRadius) {
        labelBorderRadius = dpToPx(labelBorderRadius);
        if (labelBorderRadius < 0) {
            labelBorderRadius = 0;
        }
        labelBorderPaint.setPathEffect(new CornerPathEffect(labelBorderRadius));
        labelPaint.setPathEffect(new CornerPathEffect(labelBorderRadius));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelTailHeight(float labelTailHeight) {
        this.labelTailHeight = dpToPx(labelTailHeight);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelGapHeight(float labelGapHeight) {
        this.labelGapHeight = dpToPx(labelGapHeight);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setTextFormat(String textFormat) {
        this.textFormat = textFormat;
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelStyle(String labelStyle) {
        this.labelStyle = labelStyle == null ? LabelStyle.BUBBLE : LabelStyle.valueOf(labelStyle.toUpperCase());
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setRangeEnabled(boolean rangeEnabled) {
        this.rangeEnabled = rangeEnabled;
        if (rangeEnabled) {
            if (highValue <= lowValue) {
                highValue = lowValue + step;
            }
            if (highValue > maxValue) {
                highValue = maxValue;
            }
            if (lowValue >= highValue) {
                lowValue = highValue - step;
            }
        }
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setGravity(String gravity) {
        this.gravity = gravity == null ? Gravity.TOP : Gravity.valueOf(gravity.toUpperCase());
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setSelectionColor(String color) {
        selectionPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setBlankColor(String color) {
        blankPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setThumbColor(String color) {
        thumbPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setThumbBorderColor(String color) {
        thumbBorderPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelBackgroundColor(String color) {
        labelPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelTextColor(String color) {
        labelTextPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setLabelBorderColor(String color) {
        labelBorderPaint.setColor(Utils.parseRgba(color));
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setMinValue(int minValue) {
        if (minValue < maxValue) {
            this.minValue = minValue;
            fitToMinMax();
        }
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setMaxValue(int maxValue) {
        if (maxValue > minValue) {
            this.maxValue = maxValue;
            fitToMinMax();
        }
        ViewCompat.postInvalidateOnAnimation(this);
    }

    private void fitToMinMax() {
        int oldLow = lowValue;
        int oldHigh = highValue;
        lowValue = MathUtils.clamp(lowValue, minValue, maxValue - step);
        highValue = MathUtils.clamp(highValue, minValue + step, maxValue);
        checkAndFireValueChangeEvent(oldLow, oldHigh, false);
    }

    public void setStep(int step) {
        this.step = MathUtils.clamp(step, 1, maxValue);
    }

    public void setInitialLowValue(int lowValue) {
        if (!initialLowValueSet) {
            initialLowValueSet = true;
            this.setLowValue(lowValue);
        }
    }

    /**
     * This method should never be called because of user's touch.
     * @param lowValue
     */
    public void setLowValue(int lowValue) {
        int oldLow = this.lowValue;
        this.lowValue = MathUtils.clamp(lowValue, minValue, highValue - step);
        checkAndFireValueChangeEvent(oldLow, highValue, false);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    public void setInitialHighValue(int highValue) {
        if (!initialHighValueSet) {
            initialHighValueSet = true;
            this.setHighValue(highValue);
        }
    }

    /**
     * This method should never be called because of user's touch.
     * @param highValue
     */
    public void setHighValue(int highValue) {
        int oldHigh = this.highValue;
        this.highValue = MathUtils.clamp(highValue, lowValue + step, maxValue);
        checkAndFireValueChangeEvent(lowValue, oldHigh, false);
        ViewCompat.postInvalidateOnAnimation(this);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int actionIndex = event.getActionIndex();

        int oldLow = this.lowValue;
        int oldHigh = this.highValue;

        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                activePointerId = event.getPointerId(actionIndex);
                handleTouchDown(getValueForPosition(event.getX()));
                break;
            case MotionEvent.ACTION_MOVE:
                int pointerValue = getValueForPosition(event.getX(event.findPointerIndex(activePointerId)));
                handleTouchMove(pointerValue);
                break;
            case MotionEvent.ACTION_UP:
                activePointerId = -1;
                activeThumb = THUMB_NONE;
                break;
        }
        ViewCompat.postInvalidateOnAnimation(this);
        checkAndFireValueChangeEvent(oldLow, oldHigh, true);
        return true;
    }

    private void checkAndFireValueChangeEvent(int oldLow, int oldHigh, boolean fromUser) {
        if (onValueChangeListener == null ||
            (oldLow == lowValue && oldHigh == highValue) ||
            minValue == Integer.MIN_VALUE ||
            maxValue == Integer.MAX_VALUE) {

            return;
        }

        onValueChangeListener.onValueChanged(lowValue, highValue, fromUser);
    }

    private void handleTouchDown(int pointerValue) {
        if (!rangeEnabled || Math.abs(pointerValue - lowValue) < Math.abs(pointerValue - highValue)) {
            activeThumb = THUMB_LOW;
            lowValue = pointerValue;
        } else {
            activeThumb = THUMB_HIGH;
            highValue = pointerValue;
        }
    }

    private void handleTouchMove(int pointerValue) {
        if (!rangeEnabled) {
            lowValue = pointerValue;
        } else if (activeThumb == THUMB_LOW) {
            lowValue = MathUtils.clamp(pointerValue, minValue, highValue - step);
        } else if (activeThumb == THUMB_HIGH) {
            highValue = MathUtils.clamp(pointerValue, lowValue + step, maxValue);
        }
    }

    private int getValueForPosition(float position) {
        if (position <= thumbRadius) {
            return minValue;
        } else if (position >= getWidth() - thumbRadius) {
            return maxValue;
        } else {
            float availableWidth = getWidth() - 2 * thumbRadius;
            position -= thumbRadius;
            int value = minValue + (int) ((maxValue - minValue) * position / availableWidth);
            value -= value % step;
            return value;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (minValue == Integer.MIN_VALUE || maxValue == Integer.MAX_VALUE) { //Values are not set yet, don't draw anything
            return;
        }
        float labelTextHeight = getLabelTextHeight();
        float labelHeight = labelStyle == LabelStyle.NONE ? 0 : 2 * labelBorderWidth + labelTailHeight + labelTextHeight + 2 * labelPadding;
        float labelAndGapHeight = labelStyle == LabelStyle.NONE ? 0 : labelHeight + labelGapHeight;

        float drawingHeight = labelAndGapHeight + 2 * thumbRadius;
        float height = getHeight();
        if (height > drawingHeight) {
            if (gravity == Gravity.BOTTOM) {
                canvas.translate(0, height - drawingHeight);
            } else if(gravity == Gravity.CENTER) {
                canvas.translate(0, (height - drawingHeight) / 2);
            }
        }

        float cy = labelAndGapHeight + thumbRadius;
        float width = getWidth();
        float availableWidth = width - 2 * thumbRadius;

        // Draw the blank line
        canvas.drawLine(thumbRadius, cy, width - thumbRadius, cy, blankPaint);
        float lowX = thumbRadius + availableWidth * (lowValue - minValue) / (maxValue - minValue);
        float highX = thumbRadius + availableWidth * (highValue - minValue) / (maxValue - minValue);

        // Draw the selected line
        if (rangeEnabled) {
            canvas.drawLine(lowX, cy, highX, cy, selectionPaint);
        } else {
            canvas.drawLine(thumbRadius, cy, lowX, cy, selectionPaint);
        }

        if (thumbRadius > 0) {
            drawThumb(canvas, lowX, cy);
            if (rangeEnabled) {
                drawThumb(canvas, highX, cy);
            }
        }

        if (labelStyle == LabelStyle.NONE || activeThumb == THUMB_NONE) {
            return;
        }

        String text = formatLabelText(activeThumb == THUMB_LOW ? lowValue : highValue);
        float labelTextWidth = labelTextPaint.measureText(text);
        float labelWidth = labelTextWidth + 2 * labelPadding + 2 * labelBorderWidth;
        float cx = activeThumb == THUMB_LOW ? lowX : highX;

        if (labelWidth < labelTailHeight / SQRT_3_2) {
            labelWidth = labelTailHeight / SQRT_3_2;
        }

        float y = labelHeight;

        // Bounds of outer rectangular part
        float top = 0;
        float left = cx - labelWidth / 2;
        float right = left + labelWidth;
        float bottom = top + labelHeight - labelTailHeight;
        float overflowOffset = 0;

        if (left < 0) {
            overflowOffset = -left;
        } else if (right > width) {
            overflowOffset = width - right;
        }

        left += overflowOffset;
        right += overflowOffset;
        preparePath(cx, y, left, top, right, bottom, labelTailHeight);

        canvas.drawPath(labelPath, labelBorderPaint);

        labelPath.reset();
        y = 2 * labelPadding + labelTextHeight + labelTailHeight;

        // Bounds of inner rectangular part
        top = labelBorderWidth;
        left = cx - labelTextWidth / 2 - labelPadding + overflowOffset;
        right = left + labelTextWidth + 2 * labelPadding;
        bottom = labelBorderWidth + 2 * labelPadding + labelTextHeight;

        preparePath(cx, y, left, top, right, bottom, labelTailHeight - labelBorderWidth);
        canvas.drawPath(labelPath, labelPaint);

        canvas.drawText(text, cx - labelTextWidth / 2 + overflowOffset, labelBorderWidth + labelPadding - labelTextPaint.ascent(), labelTextPaint);
    }

    private void drawThumb(Canvas canvas, float x, float y) {
        canvas.drawCircle(x, y, thumbRadius, thumbBorderPaint);
        canvas.drawCircle(x, y, thumbRadius - thumbBorderWidth, thumbPaint);
    }

    private void preparePath(float x, float y, float left, float top, float right, float bottom, float tailHeight) {
        float cx = x;
        labelPath.reset();
        labelPath.moveTo(x, y);
        x = cx + tailHeight / SQRT_3;
        y = bottom;
        labelPath.lineTo(x, y);
        x = right;
        labelPath.lineTo(x, y);
        y = top;
        labelPath.lineTo(x, y);
        x = left;
        labelPath.lineTo(x, y);
        y = bottom;
        labelPath.lineTo(x, y);
        x = cx - tailHeight / SQRT_3;
        labelPath.lineTo(x, y);
        labelPath.close();
    }

    private float dpToPx(float dp) {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, getResources().getDisplayMetrics());
    }

    private float getLabelTextHeight() {
        return labelTextPaint.descent() - labelTextPaint.ascent();
    }

    /**
     * This method formats label text for selected value.
     * Change this method if you need more complex formatting.
     * @param value
     * @return formatted text
     */
    private String formatLabelText(int value) {
        return String.format(textFormat, value);
    }

    public interface OnValueChangeListener {
        void onValueChanged(int lowValue, int highValue, boolean fromUser);
    }
}
