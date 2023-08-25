import { MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { Animated, I18nManager, ViewStyle } from 'react-native';

import { InProps } from './types';

type UseSelectedRail = (
  inPropsRef: MutableRefObject<InProps>,
  containerWidthRef: MutableRefObject<number>,
  thumbWidth: number,
  disableRange: boolean,
) => [ViewStyle, () => void] | [];

export const useSelectedRail: UseSelectedRail = (
  inPropsRef,
  containerWidthRef,
  thumbWidth,
  disableRange,
) => {
  const { current: left } = useRef(new Animated.Value(0));
  const { current: right } = useRef(new Animated.Value(0));
  const update = useCallback(() => {
    const { low, high, min, max } = inPropsRef.current;
    const { current: containerWidth } = containerWidthRef;
    const fullScale = (max - min) / (containerWidth - thumbWidth);
    const leftValue = (low - min) / fullScale;
    const rightValue = (max - high) / fullScale;
    left.setValue(disableRange ? 0 : leftValue);
    right.setValue(
      disableRange ? containerWidth - thumbWidth - leftValue : rightValue,
    );
  }, [inPropsRef, containerWidthRef, disableRange, thumbWidth, left, right]);
  const styles = useMemo(
    () =>
    ({
      position: 'absolute',
      left: I18nManager.isRTL ? right : left,
      right: I18nManager.isRTL ? left : right,
    } as any),
    [left, right],
  );
  return [styles, update];
};
