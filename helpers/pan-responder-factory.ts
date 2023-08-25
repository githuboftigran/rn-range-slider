import { useRef } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderCallbacks,
  PanResponderGestureState,
} from 'react-native';

const trueFunc = () => true;
const falseFunc = () => false;

type Props = {
  onPanResponderMove: NonNullable<PanResponderCallbacks['onPanResponderMove']>;
  onPanResponderGrant: NonNullable<
    PanResponderCallbacks['onPanResponderGrant']
  >;
  onPanResponderRelease: NonNullable<
    PanResponderCallbacks['onPanResponderRelease']
  >;
};

export class PanResponderFactory {
  // external
  private onPanResponderMove!: Props['onPanResponderMove'];
  private onPanResponderGrant!: Props['onPanResponderGrant'];
  private onPanResponderRelease!: Props['onPanResponderRelease'];

  constructor(props: Props) {
    this.updateValues(props);
  }

  public updateValues(props: Props) {
    this.onPanResponderMove = props.onPanResponderMove;
    this.onPanResponderGrant = props.onPanResponderGrant;
    this.onPanResponderRelease = props.onPanResponderRelease;
  }

  public usePanResponder = () => {
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: falseFunc,
        onPanResponderTerminationRequest: falseFunc,
        onStartShouldSetPanResponderCapture: trueFunc,
        onPanResponderTerminate: trueFunc,
        onShouldBlockNativeResponder: trueFunc,
        onMoveShouldSetPanResponder: (
          evt: GestureResponderEvent,
          gestureState: PanResponderGestureState,
        ) => Math.abs(gestureState.dx) > 2 * Math.abs(gestureState.dy),
        onPanResponderGrant: (...args) => this.onPanResponderGrant(...args),
        onPanResponderMove: (...args) => this.onPanResponderMove(...args),
        onPanResponderRelease: (...args) => this.onPanResponderRelease(...args),
      }),
    );

    return panResponder.current;
  };
}
