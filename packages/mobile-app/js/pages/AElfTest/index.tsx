import { Button } from '@rneui/base';
import * as React from 'react';
import { Text, View } from 'react-native';
import { getTokenInfo, getBalance, sign, createNewWallet } from 'utils/aelfUtils';
export default function AElfTestScreen() {
  return (
    <View>
      <Text>AElfTest!</Text>
      <Button
        onPress={async () => {
          try {
            const tokenInfo = await getTokenInfo('ELF');
            console.log(tokenInfo, '====tokenInfo');
          } catch (error) {
            console.log(error, '====error');
          }
        }}>
        getTokenInfo
      </Button>
      <Button
        onPress={async () => {
          try {
            const balance = await getBalance({ symbol: 'ELF' });
            console.log(balance, '====tokenInfo');
          } catch (error) {
            console.log(error, '====error');
          }
        }}>
        getBalance
      </Button>
      <Button
        onPress={async () => {
          try {
            const info = await sign();
            console.log(info, '====info');
          } catch (error) {
            console.log(error, '====error');
          }
        }}>
        sign
      </Button>
      <Button
        onPress={async () => {
          try {
            const wallet = await createNewWallet();
            console.log(wallet, '====wallet');
          } catch (error) {
            console.log(error, '====error');
          }
        }}>
        createNewWallet
      </Button>
    </View>
  );
}
