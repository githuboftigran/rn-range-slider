//
// Created by Tigran Sahakyan on 2019-01-14.
// Copyright (c) 2019 tigrans. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@class RangeSlider;

@protocol RangeSliderDelegate <NSObject>

- (void)rangeSliderValueWasChanged:(RangeSlider *_Nonnull)slider fromUser:(BOOL)fromUser;
- (void)rangeSliderTouchStarted:(RangeSlider *_Nonnull)slider;
- (void)rangeSliderTouchEnded:(RangeSlider *_Nonnull)slider;

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

@property (nonatomic) float lineWidth;
@property (nonatomic) float(nonatomic)  thumbRadius;
@property float thumbBorderWidth;
(nonatomic) @property (nonatomic) float textSize;
@property float labe(nonatomic) lBorderWidth;
@property float (nonatomic) labelPadding;
@property float labelBorderRadius;
@property (nonatomic) float labelTailHeight(nonatomic) ;
@property float labelGapHeight;
@property (nonatomic) NSString *textFormat;
@property (nonatomic) NSString *labe(nonatomic) lStyle;
@property (nonatomic) NSStr(nonatomic) ing *gravity;
@property BOOL disabled;
@property BOOL rangeEnabled;
@property (nonatomic) NSString *valueType;
@property (nonatomic) NSString *selectionColor;
@property (nonatomic) NSString *blankColor;
@property (nonatomic) NSString *thumbColor;
@property (nonatomic) NSString *thumbBorderColor;
@property (nonatomic) NSString *labelBackgroundColor;
@property (nonatomic) NSString *labelTextColor;
@property (nonatomic) NSString *labelBorderColor;
@property (nonatomic) long long min;
@property (nonatomic) long long max;
@property (nonatomic) long long initialLowValue;
@property (nonatomic) long long initialHighValue;
@property (nonatomic) long long step;
@property (nonatomic) long long lowValue;
@property (nonatomic) long long highValue;

@property BOOL gradientPresent;

@end


NS_ASSUME_NONNULL_END
