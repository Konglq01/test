import { Platform, Dimensions, StatusBar } from 'react-native';
import * as Device from 'expo-device';

const X_WIDTH = 375;
const X_HEIGHT = 812;

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;
export const windowWidth = Dimensions.get('window').width;

export const isIos = Platform.OS === 'ios';

export const statusBarHeight = isIos ? 20 : StatusBar.currentHeight ?? 20;

const isIphoneX = (function () {
  return (
    Platform.OS === 'ios' &&
    ((screenHeight >= X_HEIGHT && screenWidth >= X_WIDTH) || (screenHeight >= X_WIDTH && screenWidth >= X_HEIGHT))
  );
})();

export const isIphone12 = (function () {
  const model = Device.modelName || '';
  const models = ['iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max'];
  return models.includes(model);
})();

export const bottomBarHeight = (function () {
  let Height = 0;
  if (!isIos) {
    Height = screenHeight - Dimensions.get('window').height - statusBarHeight;
  } else if (isIos && isIphoneX) {
    Height = 34;
  }
  return Height;
})();

export const windowHeight = isIos ? screenHeight - statusBarHeight - bottomBarHeight : Dimensions.get('window').height;
