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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
