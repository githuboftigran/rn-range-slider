//
// Created by Tigran Sahakyan on 2019-01-14.
// Copyright (c) 2019 ___FULLUSERNAME___. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@class RangeSlider;

@protocol RangeSliderDelegate <NSObject>

- (void)rangeSliderValueWasChanged:(RangeSlider *)slider fromUser:(BOOL)fromUser;
- (void)rangeSliderTouchStarted:(RangeSlider *)slider;
- (void)rangeSliderTouchEnded:(RangeSlider *)slider;

@end

NS_ASSUME_NONNULL_BEGIN

@interface RangeSlider : UIControl

@property(nonatomic, copy) RCTDirectEventBlock onValueChanged;
@property(nonatomic, copy) RCTDirectEventBlock onSliderTouchStart;
@property(nonatomic, copy) RCTDirectEventBlock onSliderTouchEnd;
@property(nonatomic, weak) id <RangeSliderDelegate> delegate;

@property int activeThumb;
@property BOOL initialLowValueSet;
@property BOOL initialHighValueSet;

@property float lineWidth;
@property float thumbRadius;
@property float thumbBorderWidth;
@property float textSize;
@property float labelBorderWidth;
@property float labelPadding;
@property float labelBorderRadius;
@property float labelTailHeight;
@property float labelGapHeight;
@property NSString *textFormat;
@property NSString *labelStyle;
@property NSString *gravity;
@property BOOL rangeEnabled;
@property NSString *selectionColor;
@property NSString *blankColor;
@property NSString *thumbColor;
@property NSString *thumbBorderColor;
@property NSString *labelBackgroundColor;
@property NSString *labelTextColor;
@property NSString *labelBorderColor;
@property int min;
@property int max;
@property int initialLowValue;
@property int initialHighValue;
@property int step;
@property int lowValue;
@property int highValue;

@end


NS_ASSUME_NONNULL_END
