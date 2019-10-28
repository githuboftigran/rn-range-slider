import React, {PureComponent} from 'react';
import {requireNativeComponent} from 'react-native';
import PropTypes from 'prop-types'

const noop = () => {}

const NativeRangeSlider = requireNativeComponent('RangeSlider');

const dateToTimeStamp = date => date instanceof Date ? date.getTime() : date;

class RangeSlider extends PureComponent {

    _handleValueChange = ({nativeEvent}) => {
        const { onValueChanged, valueType } = this.props
        let { lowValue, highValue, fromUser } = nativeEvent;
        if (valueType === 'time') {
            lowValue = new Date(lowValue);
            highValue = new Date(highValue);
        }
        onValueChanged && onValueChanged(lowValue, highValue, fromUser);
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
        let { valueType, initialHighValue, initialLowValue, min, max } = this.props;
        if (initialLowValue === undefined) {
            initialLowValue = min;
        }
        if (initialHighValue === undefined) {
            initialHighValue = max;
        }

        if (valueType === 'time') {
            initialHighValue = dateToTimeStamp(initialHighValue);
            initialLowValue = dateToTimeStamp(initialLowValue);
            min = dateToTimeStamp(min);
            max = dateToTimeStamp(max);
        }

        const sliderProps = {...this.props, initialLowValue, initialHighValue, min, max};
        return <NativeRangeSlider
        {...sliderProps}
        ref={component => this._slider = component}
        onValueChanged={this._handleValueChange}
        onSliderTouchStart={this._handleTouchStart}
        onSliderTouchEnd={this._handleTouchEnd}
        />
    }

    setHighValue = value => {
        const { valueType } = this.props;
        if (valueType === 'time') {
            value = dateToTimeStamp(value);
        }
        this._slider.setNativeProps({ highValue: value });
    }

    setLowValue = value => {
        const { valueType } = this.props;
        if (valueType === 'time') {
            value = dateToTimeStamp(value);
        }
        this._slider.setNativeProps({ lowValue: value });
    }
}

const numberOrDate = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
]);

RangeSlider.propTypes = {
    rangeEnabled: PropTypes.bool,
    disabled: PropTypes.bool,
    valueType: PropTypes.oneOf(['number', 'time']),
    gravity: PropTypes.oneOf(['top', 'bottom', 'center']),
    min: numberOrDate,
    max: numberOrDate,
    step: numberOrDate,
    initialLowValue: numberOrDate,
    initialHighValue: numberOrDate,
    lineWidth: PropTypes.number,
    thumbRadius: PropTypes.number,
    thumbBorderWidth: PropTypes.number,
    labelStyle: PropTypes.oneOf(['none', 'bubble']),
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
    disabled: false,
    valueType: 'number',
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
