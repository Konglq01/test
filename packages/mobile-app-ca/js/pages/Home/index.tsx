import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'navigation';
import * as React from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import useLogOut from 'hooks/useLogOut';
import { useTokenContract } from 'contexts/useInterface/hooks';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { CrashTest } from 'Test/CrashTest';
import Loading from 'components/Loading';
import { queryFailAlert } from 'utils/login';
import { contractQueries } from '@portkey/graphql/index';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useIntervalQueryCAInfoByAddress } from '@portkey/hooks/hooks-ca/graphql';
export default function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const onLogOut = useLogOut();
  const tokenContract = useTokenContract();
  const dispatch = useAppDispatch();
  const wallet = useCurrentWalletInfo();
  const { currentNetwork } = useCurrentWallet();
  const caInfo = useIntervalQueryCAInfoByAddress(currentNetwork, wallet.address);
  console.log(caInfo, '======caInfo');

  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>Home Screen</Text>
        <Button onPress={onLogOut}>reSetWallet</Button>
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
          title="loading show"
          onPress={() => {
            Loading.show();
            setTimeout(() => {
              Loading.hide();
            }, 5000);
          }}
        />
        <Button title="Account Settings" onPress={() => navigationService.navigate('AccountSettings')} />
        <Button title="queryFailAlert" onPress={() => queryFailAlert(dispatch, true)} />
        <Button
          title="reset"
          onPress={() => navigationService.reset([{ name: 'LoginPortkey' }, { name: 'SignupPortkey' }])}
        />
        <Button
          title="getCAHolderByManager"
          onPress={async () => {
            try {
              const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager('TESTNET', {
                chainId: DefaultChainId,
                manager: wallet.address,
              });
              console.log(caHolderManagerInfo, '=====caHolderManagerInfo');
            } catch (error) {
              console.log(error, '=====error');
            }
          }}
        />
        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
