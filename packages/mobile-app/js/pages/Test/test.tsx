import * as React from 'react';
import { Text, View } from 'react-native';
import { useWallet } from 'hooks/store';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';

export default function Test() {
  const { currentAccount } = useWallet();

  console.log(currentAccount);

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>Test API</Text>
      <CommonButton title="back" onPress={() => navigationService.goBack()} />
    </View>
  );
}
