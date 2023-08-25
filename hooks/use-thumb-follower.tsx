import React, {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import {Animated} from 'react-native';

import FollowerContainer from '../LabelContainer';
import {clamp} from '../helpers';

import {useWidthLayout} from './use-width-layout';

type UseThumbFollower = (
  containerWidthRef: MutableRefObject<number>,
  gestureStateRef: MutableRefObject<{lastValue: number; lastPosition: number}>,
  renderContent: undefined | ((value: number) => ReactNode),
  isPressed: boolean,
  allowOverflow: boolean,
) => [ReactElement, (thumbPositionInView: number, value: number) => void] | [];

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
export const useThumbFollower: UseThumbFollower = (
  containerWidthRef,
  gestureStateRef,
  renderContent,
  isPressed,
  allowOverflow,
) => {
  const xRef = useRef(new Animated.Value(0));
  const widthRef = useRef(0);
  const contentContainerRef = useRef<FollowerContainer | null>(null);

  const {current: x} = xRef;

  const update = useCallback(
    (thumbPositionInView: number = 0, value: number = 0) => {
      const {current: width} = widthRef;
      const {current: containerWidth} = containerWidthRef;
      const position = thumbPositionInView - width / 2;
      xRef.current.setValue(
        allowOverflow ? position : clamp(position, 0, containerWidth - width),
      );
      contentContainerRef.current?.setValue(value);
    },
    [widthRef, containerWidthRef, allowOverflow],
  );

  const handleLayout = useWidthLayout(widthRef, () => {
    update(
      gestureStateRef.current.lastPosition,
      gestureStateRef.current.lastValue,
    );
  });

  if (!renderContent) {
    return [];
  }

  const transform = {transform: [{translateX: x}]};
  const follower = (
    <Animated.View style={[transform, {opacity: isPressed ? 1 : 0}]}>
      <FollowerContainer
        onLayout={handleLayout}
        ref={contentContainerRef}
        renderContent={renderContent}
      />
    </Animated.View>
  );
  return [follower, update];
};
