import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps, useColorScheme } from 'react-native';
import { ThemeProvider } from '@rneui/themed';
import NavigationRoot from './js/navigation';
import { useMemo } from 'react';
import { isIos } from 'utils/device';
import { Provider } from 'react-redux';
import { store } from 'store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { myTheme } from 'assets/theme';
import { initLanguage } from 'i18n';
import * as SplashScreen from 'expo-splash-screen';
import secureStore from 'utils/secureStore';
import Config from 'react-native-config';
import TopView from 'rn-teaset/components/Overlay/TopView';
import AppListener from 'components/AppListener/index';
import InterfaceProvider from 'contexts/useInterface';
import GlobalStyleHandler from 'components/GlobalStyleHandler';
import { lockScreenOrientation } from 'utils/screenOrientation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

initLanguage();
secureStore.init(Config.PORT_KEY_CODE || 'EXAMPLE_PORT_KEY_CODE');

const persistor = persistStore(store);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const statusBarProps = useMemo(() => {
    const barProps: StatusBarProps = { barStyle: isDarkMode ? 'light-content' : 'dark-content' };
    if (!isIos) {
      barProps.translucent = true;
      barProps.backgroundColor = 'transparent';
    }
    return barProps;
  }, [isDarkMode]);
  useEffect(() => {
    // Lock the screen orientation Right-side up portrait only.
    lockScreenOrientation();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppListener>
          <GlobalStyleHandler>
            <ThemeProvider theme={myTheme}>
              <InterfaceProvider>
                <TopView>
                  <SafeAreaProvider>
                    <StatusBar {...statusBarProps} />
                    <NavigationRoot />
                  </SafeAreaProvider>
                </TopView>
              </InterfaceProvider>
            </ThemeProvider>
          </GlobalStyleHandler>
        </AppListener>
      </PersistGate>
    </Provider>
  );
};

export default App;
