package com.ashideas.rnrangeslider;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import javax.annotation.Nullable;

public class RangeSliderViewManager extends SimpleViewManager<RangeSlider> {

    private static final String ON_VALUE_CHANGED_EVENT_NAME = "onValueChanged";
    private static final String REACT_CLASS = "RangeSlider";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name = "rangeEnabled")
    public void setRangeEnabled(RangeSlider view, boolean enabled) {
        view.setRangeEnabled(enabled);
    }

    @ReactProp(name = "gravity")
    public void setGravity(RangeSlider view, String gravity) {
        view.setGravity(gravity);
    }

    @ReactProp(name = "min")
    public void setMin(RangeSlider view, int min) {
        view.setMinValue(min);
    }

    @ReactProp(name = "max")
    public void setMax(RangeSlider view, int max) {
        view.setMaxValue(max);
    }

    @ReactProp(name = "step")
    public void setStep(RangeSlider view, int step) {
        view.setStep(step);
    }

    @ReactProp(name = "highValue")
    public void setHighValue(RangeSlider view, int value) {
        view.setHighValue(value);
    }

    @ReactProp(name = "lowValue")
    public void setLowValue(RangeSlider view, int value) {
        view.setLowValue(value);
    }

    @ReactProp(name = "lineWidth")
    public void setLineWidth(RangeSlider view, float width) {
        view.setLineWidth(width);
    }

    @ReactProp(name = "thumbRadius")
    public void setThumbRadius(RangeSlider view, float radius) {
        view.setThumbRadius(radius);
    }

    @ReactProp(name = "thumbBorderWidth")
    public void setThumbBorderWidth(RangeSlider view, float width) {
        view.setThumbBorderWidth(width);
    }

    @ReactProp(name = "labelStyle")
    public void setLabelStyle(RangeSlider view, String style) {
        view.setLabelStyle(style);
    }

    @ReactProp(name = "labelGapHeight")
    public void setLabelGapHeight(RangeSlider view, float gapHeight) {
        view.setLabelGapHeight(gapHeight);
    }

    @ReactProp(name = "labelTailHeight")
    public void setLabelTailHeigh(RangeSlider view, float tailHeight) {
        view.setLabelTailHeight(tailHeight);
    }

    @ReactProp(name = "labelFontSize")
    public void setLabelFontSize(RangeSlider view, float size) {
        view.setTextSize(size);
    }

    @ReactProp(name = "labelBorderWidth")
    public void setLabelBorderWidth(RangeSlider view, float width) {
        view.setLabelBorderWidth(width);
    }

    @ReactProp(name = "labelPadding")
    public void setLabelPadding(RangeSlider view, float padding) {
        view.setLabelPadding(padding);
    }

    @ReactProp(name = "labelBorderRadius")
    public void setLabelBorderRadius(RangeSlider view, float radius) {
        view.setLabelBorderRadius(radius);
    }

    @ReactProp(name = "textFormat")
    public void setLabelTextFormat(RangeSlider view, String format) {
        view.setTextFormat(format);
    }

    @ReactProp(name = "blankColor")
    public void setBlankColor(RangeSlider view, String hexColor) {
        view.setBlankColor(hexColor);
    }

    @ReactProp(name = "selectionColor")
    public void setSelectionColor(RangeSlider view, String hexColor) {
        view.setSelectionColor(hexColor);
    }

    @ReactProp(name = "thumbColor")
    public void setThumbColor(RangeSlider view, String hexColor) {
        view.setThumbColor(hexColor);
    }

    @ReactProp(name = "thumbBorderColor")
    public void setThumbBorderColor(RangeSlider view, String hexColor) {
        view.setThumbBorderColor(hexColor);
    }

    @ReactProp(name = "labelTextColor")
    public void setLabelTextColor(RangeSlider view, String hexColor) {
        view.setLabelTextColor(hexColor);
    }

    @ReactProp(name = "labelBackgroundColor")
    public void setLabelBackgroundColor(RangeSlider view, String hexColor) {
        view.setLabelBackgroundColor(hexColor);
    }

    @ReactProp(name = "labelBorderColor")
    public void setLabelBorderColor(RangeSlider view, String hexColor) {
        view.setLabelBorderColor(hexColor);
    }

    @Override
    protected RangeSlider createViewInstance(final ThemedReactContext reactContext) {
        final RangeSlider slider = new RangeSlider(reactContext);

        slider.setOnValueChangeListener(new RangeSlider.OnValueChangeListener() {
            @Override
            public void onValueChanged(int lowValue, int highValue, boolean fromUser) {
                WritableMap event = Arguments.createMap();
                event.putInt("lowValue", lowValue);
                event.putInt("highValue", highValue);
                event.putBoolean("fromUser", fromUser);

                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(slider.getId(), ON_VALUE_CHANGED_EVENT_NAME, event);
            }
        });

        return slider;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder().put(ON_VALUE_CHANGED_EVENT_NAME, MapBuilder.of("registrationName", ON_VALUE_CHANGED_EVENT_NAME)).build();
    }
}
