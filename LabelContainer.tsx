import React, { PureComponent } from 'react';
import { View } from 'react-native';

import type { ViewProps } from 'react-native';

class LabelContainer extends PureComponent<
  { renderContent: (value: number) => React.ReactNode } & ViewProps
> {

  state = {
    value: Number.NaN,
  };

  setValue = (value: number) => {
    this.setState({ value });
  }

  render() {
    const { renderContent, ...restProps } = this.props;
    const { value } = this.state;
    return (
      <View {...restProps}>
        {renderContent(value)}
      </View>
    );
  }
}

export default LabelContainer;
