import {View} from 'react-native';
import {PureComponent} from 'react';

class LabelContainer extends PureComponent {
  state = {
    value: Number.NaN,
  };

  setValue = (value: number) => {
    this.setState({value});
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {renderContent, ...restProps} = this.props;
    const {value} = this.state;
    return (
      <View {...restProps}>
        {renderContent(value)}
      </View>
    );
  }
}

export default LabelContainer;
