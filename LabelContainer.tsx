import React, { useState, ReactNode } from 'react';
import { StyleProp, View, ViewProps } from 'react-native';

export interface Props<T> {
  renderContent: (value: T) => ReactNode;
}

const LabelContainer = <T extends unknown>({
  renderContent,
  ...restProps
}: Props<T> & StyleProp<ViewProps>) => {
  const [value, setValue] = useState<T | typeof Number.NaN>(Number.NaN);

  return <View {...restProps}>{renderContent(value)}</View>;
};

export default LabelContainer;
