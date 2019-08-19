import React, {PureComponent} from 'react';
import {requireNativeComponent} from 'react-native';
import PropTypes from 'prop-types'

const noop = () => {}

const NativeRangeSlider = requireNativeComponent('RangeSlider');

class RangeSlider extends PureComponent {

    _handleValueChange = ({nativeEvent}) => {
        const { onValueChanged } = this.props
        onValueChanged && onValueChanged(nativeEvent.lowValue, nativeEvent.highValue, nativeEvent.fromUser);
    }

    _handleTouchStart = ({nativeEvent}) => {
        const { onTouchStart } = this.props;
        onTouchStart && onTouchStart();
    }

    _handleTouchEnd = ({nativeEvent}) => {
        const { onTouchEnd } = this.props;
        onTouchEnd && onTouchEnd();
    }

    render() {
        let { initialHighValue, initialLowValue, min, max } = this.props;
        if (initialLowValue === undefined) {
            initialLowValue = min;
        }
        if (initialHighValue === undefined) {
            initialHighValue = max;
        }
        const sliderProps = {...this.props, initialLowValue, initialHighValue};
        return <NativeRangeSlider
        {...sliderProps}
        ref={component => this._slider = component}
        onValueChanged={this._handleValueChange}
        onSliderTouchStart={this._handleTouchStart}
        onSliderTouchEnd={this._handleTouchEnd}
        />
    }

    setHighValue = value => {
        this._slider.setNativeProps({ highValue: value });
    }

    setLowValue = value => {
        this._slider.setNativeProps({ lowValue: value });
    }
}

RangeSlider.propTypes = {
    rangeEnabled: PropTypes.bool,
    gravity: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    initialLowValue: PropTypes.number,
    initialHighValue: PropTypes.number,
    lineWidth: PropTypes.number,
    thumbRadius: PropTypes.number,
    thumbBorderWidth: PropTypes.number,
    labelStyle: PropTypes.string,
    labelGapHeight: PropTypes.number,
    labelTailHeight: PropTypes.number,
    labelFontSize: PropTypes.number,
    labelBorderWidth: PropTypes.number,
    labelPadding: PropTypes.number,
    labelBorderRadius: PropTypes.number,
    textFormat: PropTypes.string,
    blankColor: PropTypes.string,
    selectionColor: PropTypes.string,
    thumbColor: PropTypes.string,
    thumbBorderColor: PropTypes.string,
    labelTextColor: PropTypes.string,
    labelBackgroundColor: PropTypes.string,
    labelBorderColor: PropTypes.string,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onValueChanged: PropTypes.func,
}

RangeSlider.defaultProps = {
    rangeEnabled: true,
    gravity: 'top',
    min: 0,
    max: 100,
    step: 1,
    lineWidth: 4,
    thumbRadius: 10,
    thumbBorderWidth: 2,
    labelStyle: 'bubble',
    labelGapHeight: 4,
    labelTailHeight: 8,
    labelFontSize: 16,
    labelBorderWidth: 2,
    labelPadding: 4,
    labelBorderRadius: 4,
    textFormat: '%d',
    blankColor: '#ffffff7f',
    selectionColor: '#4286f4',
    thumbColor: '#ffffff',
    thumbBorderColor: '#cccccc',
    labelTextColor: '#ffffff',
    labelBackgroundColor: '#ff60ad',
    labelBorderColor: '#d13e85',
    onTouchStart: noop,
    onTouchEnd: noop,
    onValueChanged: noop,
}

export default RangeSlider
