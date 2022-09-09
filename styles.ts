import { I18nManager, StyleSheet } from 'react-native';

export default StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    alignItems: 'center',
  },
  highThumbContainer: {
    position: 'absolute',
  },
  railsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelFixedContainer: {
    alignItems: I18nManager.isRTL ? 'flex-end' : "flex-start",
  },
  labelFloatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: I18nManager.isRTL ? 'flex-end' : "flex-start",
  },
  touchableArea: {
    ...StyleSheet.absoluteFillObject,
  },
});
