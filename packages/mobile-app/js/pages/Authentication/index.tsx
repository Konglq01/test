import { Button } from '@rneui/base';
import React from 'react';
import { Alert, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { touchAuth } from 'utils/authentication';
import secureStore from 'utils/secureStore';

export default function Authentication() {
  return (
    <View>
      <Button
        onPress={async () => {
          const results = await LocalAuthentication.hasHardwareAsync();
          console.log(results, '===results');
        }}>
        hasHardwareAsync
      </Button>
      <Button
        onPress={async () => {
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          console.log(enrolled, '===enrolled');
        }}>
        isEnrolledAsync
      </Button>
      <Button
        onPress={async () => {
          const enrolled = await touchAuth();
          if (enrolled.success) {
            Alert.alert(JSON.stringify(enrolled.success));
          } else {
            Alert.alert(enrolled.warning || enrolled.error);
          }
          console.log(enrolled, '===enrolled');
        }}>
        touchAuth
      </Button>
      <Button
        onPress={async () => {
          const password = await secureStore.setItemAsync('Password', '123456');
          console.log(password, '====password');
        }}>
        setItemAsync
      </Button>
      <Button
        onPress={async () => {
          const password = await secureStore.getItemAsync('Password');
          console.log(password, '====password');
        }}>
        getItemAsync
      </Button>
    </View>
  );
}
