import { MutableRefObject, useCallback } from 'react';
import { LayoutChangeEvent } from 'react-native';

/**
 * Sets the current value of widthRef and calls the callback with new width parameter.
 * @param widthRef
 * @param callback
 * @returns {function({nativeEvent: *}): void}
 */
export const useWidthLayout = (
  widthRef: MutableRefObject<number>,
  callback?: (width: number) => void,
) => {
  return useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const {
        layout: { width },
      } = nativeEvent;
      const { current: w } = widthRef;
      if (w !== width) {
        widthRef.current = width;
        if (callback) {
          callback(width);
        }
      }
    },
    [callback, widthRef],
  );
};
