//
// Created by Tigran Sahakyan on 2019-01-14.
// Copyright (c) 2019 ___FULLUSERNAME___. All rights reserved.
//

#import "RangeSlider.h"

#define NONE @"none"
#define BUBBLE @"bubble"
#define TOP @"top"
#define BOTTOM @"bottom"
#define CENTER @"center"
#define SQRT_3 (float) sqrt(3)
#define SQRT_3_2 SQRT_3 / 2
#define CLAMP(x, min, max) (x < min ? min : x > max ? max : x)

const NSString *DEFAULT_SELECTION_COLOR = @"#4286f4";
const NSString *DEFAULT_BLANK_COLOR = @"#7fffffff";
const NSString *DEFAULT_THUMB_COLOR = @"#ffffff";
const NSString *DEFAULT_THUMB_BORDER_COLOR = @"#cccccc";

const NSString *DEFAULT_LABEL_BACKGROUND_COLOR = @"#ff60ad";
const NSString *DEFAULT_LABEL_TEXT_COLOR = @"#ffffff";
const NSString *DEFAULT_LABEL_BORDER_COLOR = @"#d13e85";

const int DEFAULT_MIN = 0;
const int DEFAULT_MAX = 100;
const int DEFAULT_STEP = 1;

const float DEFAULT_LINE_WIDTH = 4;
const float DEFAULT_THUMB_RADIUS = 10;
const float DEFAULT_THUMB_BORDER_WIDTH = 2;

const NSString *DEFAULT_LABEL_TEXT_FORMAT = @"%d";
const NSString *DEFAULT_LABEL_STYLE = @"bubble";
const NSString *DEFAULT_GRAVITY = @"top";

const float DEFAULT_TEXT_SIZE = 16;
const float DEFAULT_LABEL_GAP = 4;
const float DEFAULT_LABEL_TAIL_HEIGHT = 8;
const float DEFAULT_LABEL_PADDING = 4;
const float DEFAULT_LABEL_BORDER_WIDTH = 2;
const float DEFAULT_LABEL_BORDER_RADIUS = 4;

const int THUMB_LOW = 0;
const int THUMB_HIGH = 1;
const int THUMB_NONE = -1;

@implementation RangeSlider

+ (UIColor *)colorWithHexString:(const NSString *)hexString {
    NSString *colorString = [[hexString stringByReplacingOccurrencesOfString:@"#" withString:@""] uppercaseString];
    CGFloat alpha, red, blue, green;
    switch ([colorString length]) {
        case 3: // #RGB
            alpha = 1.0f;
            red = [self colorComponentFrom:colorString start:0 length:1];
            green = [self colorComponentFrom:colorString start:1 length:1];
            blue = [self colorComponentFrom:colorString start:2 length:1];
            break;
        case 4: // #ARGB
            alpha = [self colorComponentFrom:colorString start:0 length:1];
            red = [self colorComponentFrom:colorString start:1 length:1];
            green = [self colorComponentFrom:colorString start:2 length:1];
            blue = [self colorComponentFrom:colorString start:3 length:1];
            break;
        case 6: // #RRGGBB
            alpha = 1.0f;
            red = [self colorComponentFrom:colorString start:0 length:2];
            green = [self colorComponentFrom:colorString start:2 length:2];
            blue = [self colorComponentFrom:colorString start:4 length:2];
            break;
        case 8: // #AARRGGBB
            alpha = [self colorComponentFrom:colorString start:0 length:2];
            red = [self colorComponentFrom:colorString start:2 length:2];
            green = [self colorComponentFrom:colorString start:4 length:2];
            blue = [self colorComponentFrom:colorString start:6 length:2];
            break;
        default:
            [NSException raise:@"Invalid color value" format:@"Color value %@ is invalid.  It should be a hex value of the form #RBG, #ARGB, #RRGGBB, or #AARRGGBB", hexString];
            break;
    }
    return [UIColor colorWithRed:red green:green blue:blue alpha:alpha];
}

+ (CGFloat)colorComponentFrom:(const NSString *)string start:(NSUInteger)start length:(NSUInteger)length {
    NSString *substring = [string substringWithRange:NSMakeRange(start, length)];
    NSString *fullHex = length == 2 ? substring : [NSString stringWithFormat:@"%@%@", substring, substring];
    unsigned hexComponent;
    [[NSScanner scannerWithString:fullHex] scanHexInt:&hexComponent];
    return hexComponent / 255.0;
}

int activeThumb;
UITouch *activeTouch;
UIFont *labelFont;

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self setBackgroundColor:[UIColor clearColor]];
        activeThumb = THUMB_NONE;
        _minValue = DEFAULT_MIN;
        _maxValue = DEFAULT_MAX;
        _lowValue = DEFAULT_MIN;
        _highValue = DEFAULT_MAX;
        _step = DEFAULT_STEP;
        _rangeEnabled = true;
        _lineWidth = DEFAULT_LINE_WIDTH;
        _thumbRadius = DEFAULT_THUMB_RADIUS;
        _thumbBorderWidth = DEFAULT_THUMB_BORDER_WIDTH;
        [self setTextSize:DEFAULT_TEXT_SIZE];
        _labelBorderWidth = DEFAULT_LABEL_BORDER_WIDTH;
        _labelPadding = DEFAULT_LABEL_PADDING;
        _labelStyle = DEFAULT_LABEL_STYLE;
        _gravity = DEFAULT_GRAVITY;
        _textFormat = DEFAULT_LABEL_TEXT_FORMAT;
        [self setSelectionColor:DEFAULT_SELECTION_COLOR];
        [self setBlankColor:DEFAULT_BLANK_COLOR];
        [self setThumbColor:DEFAULT_THUMB_COLOR];
        [self setThumbBorderColor:DEFAULT_LABEL_BORDER_COLOR];
        [self setLabelBackgroundColor:DEFAULT_LABEL_BACKGROUND_COLOR];
        [self setLabelTextColor:DEFAULT_LABEL_TEXT_COLOR];
        [self setLabelBorderColor:DEFAULT_LABEL_BORDER_COLOR];

        _labelGapHeight = DEFAULT_LABEL_GAP;
        _labelBorderRadius = DEFAULT_LABEL_BORDER_RADIUS;
        _labelTailHeight = DEFAULT_LABEL_TAIL_HEIGHT;
    }
    return self;
}

- (void)setLineWidth:(float)lineWidth {
    _lineWidth = lineWidth;
    [self setNeedsDisplay];
}

- (void)setThumbRadius:(float)thumbRadius {
    _thumbRadius = thumbRadius;
    [self setNeedsDisplay];
}

- (void)setThumbBorderWidth:(float)thumbBorderWidth {
    _thumbBorderWidth = thumbBorderWidth;
    [self setNeedsDisplay];
}

- (void)setTextSize:(float)textSize {
    _textSize = textSize;
    labelFont = [UIFont systemFontOfSize:textSize];
    [self setNeedsDisplay];
}

- (void)setLabelBorderWidth:(float)labelBorderWidth {
    _labelBorderWidth = labelBorderWidth;
    [self setNeedsDisplay];
}

- (void)setLabelPadding:(float)labelPadding {
    _labelPadding = labelPadding;
    [self setNeedsDisplay];
}

- (void)setLabelBorderRadius:(float)labelBorderRadius {
    if (labelBorderRadius < 0) {
        labelBorderRadius = 0;
    }
    _labelBorderRadius = labelBorderRadius;
    [self setNeedsDisplay];
}

- (void)setLabelTailHeight:(float)labelTailHeight {
    _labelTailHeight = labelTailHeight;
    [self setNeedsDisplay];
}

- (void)setLabelGapHeight:(float)labelGapHeight {
    _labelGapHeight = labelGapHeight;
    [self setNeedsDisplay];
}

- (void)setTextFormat:(NSString *)textFormat {
    _textFormat = textFormat;
    [self setNeedsDisplay];
}

- (void)setLabelStyle:(NSString *)labelStyle {
    _labelStyle = labelStyle;
    [self setNeedsDisplay];
}

- (void)setGravity:(NSString *)gravity {
    _gravity = gravity;
    [self setNeedsDisplay];
}

- (void)setRangeEnabled:(BOOL)rangeEnabled {
    _rangeEnabled = rangeEnabled;
    if (rangeEnabled) {
        if (_highValue <= _lowValue) {
            _highValue = _lowValue + 1;
        }
        if (_highValue > _maxValue) {
            _highValue = _maxValue;
        }
        if (_lowValue >= _highValue) {
            _lowValue = _highValue - 1;
        }
    }
    [self setNeedsDisplay];
}

- (void)setSelectionColor:(NSString *)selectionColor {
    _selectionColor = selectionColor;
    [self setNeedsDisplay];
}

- (void)setBlankColor:(NSString *)blankColor {
    _blankColor = blankColor;
    [self setNeedsDisplay];
}

- (void)setThumbColor:(NSString *)thumbColor {
    _thumbColor = thumbColor;
    [self setNeedsDisplay];
}

- (void)setThumbBorderColor:(NSString *)thumbBorderColor {
    _thumbBorderColor = thumbBorderColor;
    [self setNeedsDisplay];
}

- (void)setLabelBackgroundColor:(NSString *)labelBackgroundColor {
    _labelBackgroundColor = labelBackgroundColor;
    [self setNeedsDisplay];
}

- (void)setLabelTextColor:(NSString *)labelTextColor {
    _labelTextColor = labelTextColor;
    [self setNeedsDisplay];
}

- (void)setLabelBorderColor:(NSString *)labelBorderColor {
    _labelBorderColor = labelBorderColor;
    [self setNeedsDisplay];
}

- (void)setMinValue:(int)minValue {
    _minValue = minValue > _maxValue ? _maxValue - 1 : minValue;
}

- (void)setMaxValue:(int)maxValue {
    _maxValue = maxValue < _minValue ? _minValue + 1 : maxValue;
}

- (void)setLowValue:(int)lowValue {
    int oldLow = _lowValue;
    _lowValue = CLAMP(lowValue, _minValue, _highValue - 1);
    [self checkAndFireValueChangeEvent:oldLow oldHigh:_highValue fromUser:false];
    [self setNeedsDisplay];
}

- (void)setHighValue:(int)highValue {
    int oldHigh = _highValue;
    _highValue = CLAMP(highValue, _lowValue + 1, _maxValue);
    [self checkAndFireValueChangeEvent:_lowValue oldHigh:oldHigh fromUser:false];
    [self setNeedsDisplay];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    if (activeTouch != nil) {
        return;
    }

    activeTouch = touches.anyObject;

    int oldLow = _lowValue;
    int oldHigh = _highValue;

    int pointerValue = [self getValueForPosition];
    if (!_rangeEnabled || ABS(pointerValue - _lowValue) < ABS(pointerValue - _highValue)) {
        activeThumb = THUMB_LOW;
        _lowValue = pointerValue;
    } else {
        activeThumb = THUMB_HIGH;
        _highValue = pointerValue;
    }
    [self checkAndFireValueChangeEvent:oldLow oldHigh:oldHigh fromUser:true];
    [self setNeedsDisplay];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    int oldLow = _lowValue;
    int oldHigh = _highValue;
    int pointerValue = [self getValueForPosition];
    if (!_rangeEnabled) {
        _lowValue = pointerValue;
    } else if (activeThumb == THUMB_LOW) {
        _lowValue = CLAMP(pointerValue, _minValue, _highValue - 1);
    } else if (activeThumb == THUMB_HIGH) {
        _highValue = CLAMP(pointerValue, _lowValue + 1, _maxValue);
    }
    [self checkAndFireValueChangeEvent:oldLow oldHigh:oldHigh fromUser:true];
    [self setNeedsDisplay];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    activeTouch = nil;
    activeThumb = THUMB_NONE;
    [self setNeedsDisplay];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    activeTouch = nil;
    activeThumb = THUMB_NONE;
    [self setNeedsDisplay];
}

- (int)getValueForPosition {
    CGFloat position = [activeTouch locationInView:self].x;
    if (position <= _thumbRadius) {
        return _minValue;
    } else if (position >= [self bounds].size.width - _thumbRadius) {
        return _maxValue;
    } else {
        CGFloat availableWidth = [self bounds].size.width - 2 * _thumbRadius;
        position -= _thumbRadius;
        int value = _minValue + (int) ((_maxValue - _minValue) * position / availableWidth);
        value -= value % _step;
        return value;
    }
}

- (void)checkAndFireValueChangeEvent:(int)oldLow oldHigh:(int)oldHigh fromUser:(BOOL)fromUser {
    if(!_delegate || (oldLow == _lowValue && oldHigh == _highValue)) {
        return;
    }

    [_delegate rangeSliderValueWasChanged:self fromUser:fromUser];
}

- (void)drawRect:(CGRect)rect {

    UIColor *blankColor = [RangeSlider colorWithHexString:DEFAULT_BLANK_COLOR];
    UIColor *selectionColor = [RangeSlider colorWithHexString:DEFAULT_SELECTION_COLOR];
    UIColor *thumbColor = [RangeSlider colorWithHexString:DEFAULT_THUMB_COLOR];
    UIColor *thumbBorderColor = [RangeSlider colorWithHexString:DEFAULT_THUMB_BORDER_COLOR];
    UIColor *labelBackgroundColor = [RangeSlider colorWithHexString:DEFAULT_LABEL_BACKGROUND_COLOR];
    UIColor *labelTextColor = [RangeSlider colorWithHexString:DEFAULT_LABEL_TEXT_COLOR];
    UIColor *labelBorderColor = [RangeSlider colorWithHexString:DEFAULT_LABEL_BORDER_COLOR];

    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetLineCap(context, kCGLineCapRound);
    CGContextSetFontSize(context, _textSize);

    NSDictionary<NSAttributedStringKey, id> *labelTextAttributes = @{NSForegroundColorAttributeName: labelTextColor, NSFontAttributeName: labelFont};
    CGRect textRect = [@"0" boundingRectWithSize:CGSizeMake(500, 500) options:NSStringDrawingUsesLineFragmentOrigin attributes:labelTextAttributes context:nil];
    CGFloat labelTextHeight = textRect.size.height;
    BOOL isNoneStyle = [_labelStyle isEqualToString: NONE];
    CGFloat labelHeight = isNoneStyle ? 0 : 2 * _labelBorderWidth + _labelTailHeight + labelTextHeight + 2 * _labelPadding;

    CGFloat labelAndGapHeight = isNoneStyle ? 0 : labelHeight + _labelGapHeight;

    CGFloat drawingHeight = labelAndGapHeight + 2 * _thumbRadius;

    if (rect.size.height > drawingHeight) {
        if ([_gravity isEqualToString: BOTTOM]) {
            CGContextTranslateCTM(context, 0, rect.size.height - drawingHeight);
        } else if([_gravity isEqualToString: CENTER]) {
            CGContextTranslateCTM(context, 0, (rect.size.height - drawingHeight) / 2);
        }
    }

    CGFloat cy = labelAndGapHeight + _thumbRadius;

    CGFloat width = rect.size.width;
    CGFloat availableWidth = width - 2 * _thumbRadius;

    // Draw the blank line
    CGContextSetLineWidth(context, _lineWidth);
    CGContextMoveToPoint(context, _thumbRadius, cy);
    CGContextAddLineToPoint(context, width - _thumbRadius, cy);
    [blankColor setStroke];
    CGContextStrokePath(context);

    CGFloat lowX = _thumbRadius + availableWidth * (_lowValue - _minValue) / (_maxValue - _minValue);
    CGFloat highX = _thumbRadius + availableWidth * (_highValue - _minValue) / (_maxValue - _minValue);

    // Draw the selected line
    [selectionColor setStroke];
    if (_rangeEnabled) {
        CGContextMoveToPoint(context, lowX, cy);
        CGContextAddLineToPoint(context, highX, cy);
    } else {
        CGContextMoveToPoint(context, _thumbRadius, cy);
        CGContextAddLineToPoint(context, lowX, cy);
    }
    CGContextStrokePath(context);

    if (_thumbRadius > 0) {
        [thumbBorderColor setFill];
        CGContextAddArc(context, lowX, cy, _thumbRadius, 0, M_PI * 2, true);
        CGContextFillPath(context);
        [thumbColor setFill];
        CGContextAddArc(context, lowX, cy, _thumbRadius - _thumbBorderWidth, 0, M_PI * 2, true);
        CGContextFillPath(context);
        if (_rangeEnabled) {
            [thumbBorderColor setFill];
            CGContextAddArc(context, highX, cy, _thumbRadius, 0, M_PI * 2, true);
            CGContextFillPath(context);
            [thumbColor setFill];
            CGContextAddArc(context, highX, cy, _thumbRadius - _thumbBorderWidth, 0, M_PI * 2, true);
            CGContextFillPath(context);
        }
    }

    if ([_labelStyle isEqualToString:NONE] || activeThumb == THUMB_NONE) {
        return;
    }

    NSString *text = [self formatLabelText:activeThumb == THUMB_LOW ? _lowValue : _highValue];
    textRect = [text boundingRectWithSize:CGSizeMake(500, 500) options:NSStringDrawingUsesLineFragmentOrigin attributes:labelTextAttributes context:nil];
    CGFloat labelTextWidth = textRect.size.width;
    CGFloat labelWidth = labelTextWidth + 2 * _labelPadding + 2 * _labelBorderWidth;
    CGFloat cx = activeThumb == THUMB_LOW ? lowX : highX;

    if (labelWidth < _labelTailHeight / SQRT_3_2) {
        labelWidth = _labelTailHeight / SQRT_3_2;
    }

    CGFloat y = labelHeight;

    // Bounds of outer rectangular part
    CGFloat top = 0;
    CGFloat left = cx - labelWidth / 2;
    CGFloat right = left + labelWidth;
    CGFloat bottom = top + labelHeight - _labelTailHeight;
    CGFloat overflowOffset = 0;

    if (left < 0) {
        overflowOffset = -left;
    } else if (right > width) {
        overflowOffset = width - right;
    }

    left += overflowOffset;
    right += overflowOffset;
    [self preparePath:context x:cx y:y left:left top:top right:right bottom:bottom tailHeight:_labelTailHeight];
    [labelBorderColor setFill];
    CGContextFillPath(context);

    y = 2 * _labelPadding + labelTextHeight + _labelTailHeight;

    // Bounds of inner rectangular part
    top = _labelBorderWidth;
    left = cx - labelTextWidth / 2 - _labelPadding + overflowOffset;
    right = left + labelTextWidth + 2 * _labelPadding;
    bottom = _labelBorderWidth + 2 * _labelPadding + labelTextHeight;

    [self preparePath:context x:cx y:y left:left top:top right:right bottom:bottom tailHeight:_labelTailHeight - _labelBorderWidth];
    [labelBackgroundColor setFill];
    CGContextFillPath(context);

    CGContextSetFontSize(context, _textSize);
    [text drawAtPoint:CGPointMake(cx - labelTextWidth / 2 + overflowOffset, _labelBorderWidth + _labelPadding)
       withAttributes:labelTextAttributes];
    //CGContextShowTextAtPoint(context, cx - labelTextWidth / 2 + overflowOffset, _labelBorderWidth + _labelPadding, [text UTF8String], text.length);
}

- (void)preparePath:(CGContextRef)context x:(CGFloat)x y:(CGFloat)y left:(CGFloat)left top:(CGFloat)top right:(CGFloat)right bottom:(CGFloat)bottom tailHeight:(CGFloat)tailHeight {
    CGFloat cx = x;
    CGContextMoveToPoint(context, x, y);

    x = cx + tailHeight / SQRT_3;
    y = bottom;
    CGContextAddLineToPoint(context, x, y);
    x = right;
    CGContextAddLineToPoint(context, x, y);
    y = top;
    CGContextAddLineToPoint(context, x, y);
    x = left;
    CGContextAddLineToPoint(context, x, y);
    y = bottom;
    CGContextAddLineToPoint(context, x, y);
    x = cx - tailHeight / SQRT_3;
    CGContextAddLineToPoint(context, x, y);
    CGContextClosePath(context);
}

- (NSString *)formatLabelText:(int)value {
    return [NSString stringWithFormat:_textFormat, value];
}

@end