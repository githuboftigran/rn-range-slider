package com.ashideas.rnrangeslider;

import android.content.Context;
import android.graphics.Color;
import android.util.TypedValue;

public class Utils {
    /**
     * Parses #RRGGBBAA color to integer value
     * In android integer color value has AARRGGBB format.
     * So Color::parseColor method returns wrong value for #RRGGBBAA or #RGBA strings.
     * @param color
     * @return
     */
    public static int parseRgba(String color) {
        color = normalizeColor(color);
        int intColor = Color.parseColor(color);
        return  color.length() == 7 ? // Don't change anything if color was in #RRGGBB format
                intColor : rgbaToArgb(intColor);
    }

    public static int rgbaToArgb(int color) {
        return (color >>> 8) | (color << 24);
    }

    public static String normalizeColor(String color) {
        if (color.length() == 7 || color.length() == 9) { // #RRGGBB or #RRGGBBAA
            return color;
        }

        char[] components = color.substring(1).toCharArray();
        StringBuilder builder = new StringBuilder('#');
        for (char component : components) {
            builder.append(component).append(component);
        }
        return builder.toString();
    }

    public static float dpToPx(Context context, float value) {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, value, context.getResources().getDisplayMetrics());
    }

    public static float spToPx(Context context, float value) {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, value, context.getResources().getDisplayMetrics());
    }
}
