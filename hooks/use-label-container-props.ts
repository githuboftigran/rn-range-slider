import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import styles from '../styles';

/**
 * @param floating
 * @returns {{onLayout: ((function({nativeEvent: *}): void)|undefined), style: [*, {top}]}}
 */
export const useLabelContainerProps = (floating: boolean) => {
  const [labelContainerHeight, setLabelContainerHeight] = useState(0);
  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    const {
      layout: { height },
    } = nativeEvent;
    setLabelContainerHeight(height);
  }, []);

  const top = floating ? -labelContainerHeight : 0;
  const style = [
    floating ? styles.labelFloatingContainer : styles.labelFixedContainer,
    { top },
  ];
  return { style, onLayout: onLayout };
};
