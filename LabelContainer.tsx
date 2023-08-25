import React, {PureComponent, ReactNode} from 'react';
import {View, ViewProps} from 'react-native';

type Props = ViewProps & {renderContent: (value: number) => ReactNode};

type State = {
  value: number;
};
class LabelContainer extends PureComponent<Props, State> {
  state = {
    value: Number.NaN,
  };

  setValue = (value: number) => {
    this.setState({value});
  };

  render() {
    const {renderContent, ...restProps} = this.props;
    const {value} = this.state;
    return <View {...restProps}>{renderContent(value)}</View>;
  }
}

export default LabelContainer;
