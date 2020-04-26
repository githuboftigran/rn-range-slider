import React from "react";

declare module "rn-range-slider" {
  export interface RangeSliderProps {
    style: object;
    rangeEnabled?: boolean;
    disabled?: boolean;
    valueType?: "number" | "time";
    gravity?: "top" | "bottom" | "center";
    min?: number | Date;
    max?: number | Date;
    step?: number | Date;
    initialLowValue?: number | Date;
    initialHighValue?: number | Date;
    lineWidth?: number;
    thumbRadius?: number;
    thumbBorderWidth?: number;
    labelStyle?: "none" | "bubble";
    labelGapHeight?: number;
    labelTailHeight?: number;
    labelFontSize?: number;
    labelBorderWidth?: number;
    labelPadding?: number;
    labelBorderRadius?: number;
    textFormat?: string;
    blankColor?: string;
    selectionColor?: string;
    thumbColor?: string;
    thumbBorderColor?: string;
    labelTextColor?: string;
    labelBackgroundColor?: string;
    labelBorderColor?: string;
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
    onValueChanged?:
      | ((lowValue: number, highValue: number, fromUser: boolean) => void)
      | ((lowValue: Date, highValue: Date, fromUser: boolean) => void);
  }

  export default class RangeSlider extends React.PureComponent<
    RangeSliderProps
  > {}
}
