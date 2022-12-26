import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'navigation';
import * as React from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import useLogOut from 'hooks/useLogOut';
import { useTokenContract } from 'contexts/useInterface/hooks';
import { createWallet, resetWallet, setCAInfo, setSessionId } from '@portkey/store/store-ca/wallet/actions';
import AElf from 'aelf-sdk';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useUser } from 'hooks/store';
export default function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const onLogOut = useLogOut();
  const tokenContract = useTokenContract();
  const dispatch = useAppDispatch();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useCurrentWallet();
  const stateWallet = useAppSelector(state => state.wallet);
  const user = useUser();
  console.log(user, currentNetwork, wallet, stateWallet, '====wallet-HomeScreen');

  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>Home Screen</Text>
        <Button title="Go to DashBoard" onPress={() => navigation.navigate('DashBoard')} />

        <Button onPress={onLogOut}>reSetWallet</Button>
        <Button title="sider" onPress={() => navigationService.navigate('DashBoard')} />
        {/* <Button title="Go to Element" onPress={() => navigation.navigate('Element')} /> */}
        {/* <Button title="Go to I18n" onPress={() => navigation.navigate('I18n')} /> */}
        {/* <Button title="Go to Webview" onPress={() => navigation.navigate('WebView')} /> */}
        <Button title="Go to Echarts" onPress={() => navigation.navigate('Echarts')} />
        <Button title="Go to ContactsHome" onPress={() => navigation.navigate('ContactsHome')} />
        <Button title="Go to Token" onPress={() => navigation.navigate('ManageTokenList')} />
        <Button title="Go to ManageNetwork" onPress={() => navigation.navigate('ManageNetwork')} />
        <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
        <Button
          title="getBalance"
          onPress={async () => {
            const balance = await tokenContract?.callViewMethod('GetBalance', {
              symbol: 'ELF',
              owner: '2BC7WWMNBp4LjmJ48VAfDocEU2Rjg5yhELxT2HewfYxPPrdxA9',
            });
            console.log(balance, '=====balance');
          }}
        />
        <Button
          title="Create Wallet"
          onPress={async () => {
            try {
              const walletInfo = AElf.wallet.createNewWallet();
              await dispatch(createWallet({ walletInfo, pin: '123456', sessionId: '123' }));
              console.log('createWallet');
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        />
        <Button
          title="Reset Wallet"
          onPress={async () => {
            try {
              await dispatch(resetWallet());
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        />
        <Button title="Account Settings" onPress={() => navigationService.navigate('AccountSettings')} />
        <Button
          title="setSessionId"
          onPress={async () => {
            try {
              await dispatch(setSessionId({ sessionId: '111', pin: '123456', networkType: 'MAIN' }));
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        />
        <Button
          title="setCAInfo"
          onPress={async () => {
            try {
              await dispatch(
                setCAInfo({ caInfo: { caAddress: 'aaaa', caHash: 'xxx' }, pin: '123456', chainId: 'tDVV' }),
              );
              console.log('setCAInfo');
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        />
      </ScrollView>
    </SafeAreaBox>
  );
}
