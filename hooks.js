import React, { useCallback, useState, useRef, useMemo } from 'react';
import { Animated } from 'react-native';
import { clamp } from './helpers';
import styles from './styles';
import FollowerContainer from './LabelContainer';

/**
 * low and high state variables are fallbacks for props (props are not required).
 * This hook ensures that current low and high are not out of [min, max] range.
 * It returns an object which contains:
 * - ref containing correct low, high, min, max and step to work with.
 * - setLow and setHigh setters
 * @param lowProp
 * @param highProp
 * @param min
 * @param max
 * @param step
 * @returns {{inPropsRef: React.MutableRefObject<{high: (*|number), low: (*|number)}>, setLow: (function(number): undefined), setHigh: (function(number): undefined)}}
 */
export const useLowHigh = (lowProp, highProp, min, max, step) => {

  const validLowProp = lowProp === undefined ? min : clamp(lowProp, min, max);
  const validHighProp = highProp === undefined ? max : clamp(highProp, min, max);
  const inPropsRef = useRef({ low: validLowProp, high: validHighProp });
  const { low: lowState, high: highState } = inPropsRef.current;

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = clamp(lowProp === undefined ? lowState : lowProp, min, max);
  const high = clamp(highProp === undefined ? highState : highProp, min, max);

  // Always update values of refs so pan responder will have updated values
  Object.assign(inPropsRef.current, { low, high, min, max, step });

  const setLow = value => inPropsRef.current.low = value;
  const setHigh = value => inPropsRef.current.high = value;
  return { inPropsRef, setLow, setHigh };
};

/**
 * Sets the current value of widthRef and calls the callback with new width parameter.
 * @param widthRef
 * @param callback
 * @returns {function({nativeEvent: *}): void}
 */
export const useWidthLayout = (widthRef, callback) => {
  return useCallback(({ nativeEvent }) => {
    const { layout: {width}} = nativeEvent;
    const { current: w } = widthRef;
    if (w !== width) {
      widthRef.current = width;
      if (callback) {
        callback(width);
      }
    }
  }, [callback, widthRef]);
};

/**
 * This hook creates a component which follows the thumb.
 * Content renderer is passed to FollowerContainer which re-renders only it's content with setValue method.
 * This allows to re-render only follower, instead of the whole slider with all children (thumb, rail, etc.).
 * Returned update function should be called every time follower should be updated.
 * @param containerWidthRef
 * @param gestureStateRef
 * @param renderContent
 * @param isPressed
 * @param allowOverflow
 * @returns {[JSX.Element, function(*, *=): void]|*[]}
 */
export const useThumbFollower = (containerWidthRef, gestureStateRef, renderContent, isPressed, allowOverflow) => {
  const xRef = useRef(new Animated.Value(0));
  const widthRef = useRef(0);
  const contentContainerRef = useRef(null);

  const { current: x } = xRef;

  const update = useCallback((thumbPositionInView, value) => {
    const { current: width } = widthRef;
    const { current: containerWidth } = containerWidthRef;
    const position = thumbPositionInView - width / 2;
    xRef.current.setValue(allowOverflow ? position : clamp(position, 0, containerWidth - width));
    contentContainerRef.current.setValue(value);
  }, [widthRef, containerWidthRef, allowOverflow]);

  const handleLayout = useWidthLayout(widthRef, () => {
    update(gestureStateRef.current.lastPosition, gestureStateRef.current.lastValue);
  });

  if (!renderContent) {
    return [];
  }

  const transform = { transform: [{ translateX: x }]};
  const follower = (
    <Animated.View style={[transform, { opacity: isPressed ? 1 : 0 }]}>
      <FollowerContainer
        onLayout={handleLayout}
        ref={contentContainerRef}
        renderContent={renderContent}
      />
    </Animated.View>
  );
  return [follower, update];
};

export const useSelectedRail = (inPropsRef, containerWidthRef, thumbWidth, disableRange) => {
  const { current: left } = useRef(new Animated.Value(0));
  const { current: right } = useRef(new Animated.Value(0));
  const update = useCallback(() => {
    const { low, high, min, max } = inPropsRef.current;
    const { current: containerWidth } = containerWidthRef;
    const fullScale = (max - min) / (containerWidth - thumbWidth);
    const leftValue = (low - min) / fullScale;
    const rightValue = (max - high) / fullScale;
    left.setValue(disableRange ? 0 : leftValue);
    right.setValue(disableRange ? (containerWidth - thumbWidth) - leftValue : rightValue);
  }, [inPropsRef, containerWidthRef, disableRange, thumbWidth, left, right]);
  const styles = useMemo(() => ({
    position: 'absolute',
    left,
    right,
  }), [left, right]);
  return [styles, update];
};

/**
 * @param floating
 * @returns {{onLayout: ((function({nativeEvent: *}): void)|undefined), style: [*, {top}]}}
 */
export const useLabelContainerProps = floating => {
  const [labelContainerHeight, setLabelContainerHeight] = useState(0);
  const onLayout = useCallback(({ nativeEvent }) => {
    const { layout: {height}} = nativeEvent;
    setLabelContainerHeight(height);
  }, []);

  const top = floating ? -labelContainerHeight : 0;
  const style = [floating ? styles.labelFloatingContainer : styles.labelFixedContainer, { top }];
  return { style, onLayout: onLayout };
};
