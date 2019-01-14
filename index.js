import React, {PureComponent} from 'react';
import {requireNativeComponent} from 'react-native';

const NativeRangeSlider = requireNativeComponent('RangeSlider');

export default class RangeSlider extends PureComponent {
    constructor(props) {
        super(props);
        this._unboxEvent = this._unboxEvent.bind(this);
    }

    _unboxEvent(event: Event) {
        if (!this.props.onValueChanged) {
            return;
        }
        const ne = event.nativeEvent;
        this.props.onValueChanged(ne.lowValue, ne.highValue, ne.fromUser);
    }

    render() {
        return <NativeRangeSlider {...this.props} onValueChanged={this._unboxEvent}/>
    }
}