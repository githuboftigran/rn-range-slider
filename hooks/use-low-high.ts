import { useRef } from 'react';

import { clamp } from '../helpers';

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
export const useLowHigh = (
  lowProp: number | undefined,
  highProp: number | undefined,
  min: number,
  max: number,
  step: number,
) => {
  const validLowProp = lowProp === undefined ? min : clamp(lowProp, min, max);
  const validHighProp =
    highProp === undefined ? max : clamp(highProp, min, max);
  const inPropsRef = useRef({
    low: validLowProp,
    high: validHighProp,
    step,
    // These 2 fields will be overwritten below.
    min: validLowProp,
    max: validHighProp,
  });
  const { low: lowState, high: highState } = inPropsRef.current;
  const inPropsRefPrev = { lowPrev: lowState, highPrev: highState };

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = clamp(lowProp === undefined ? lowState : lowProp, min, max);
  const high = clamp(highProp === undefined ? highState : highProp, min, max);

  // Always update values of refs so pan responder will have updated values
  Object.assign(inPropsRef.current, { low, high, min, max });

  const setLow = (value: number) => (inPropsRef.current.low = value);
  const setHigh = (value: number) => (inPropsRef.current.high = value);
  return { inPropsRef, inPropsRefPrev, setLow, setHigh };
};
