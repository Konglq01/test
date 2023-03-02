import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'navigation';
import * as React from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import Config from 'react-native-config';
import { useAppSelector } from 'store/hooks';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import { TextM } from 'components/CommonText';
import AccountOverlay from 'components/AccountOverlay';
import useLogOut from 'hooks/useLogOut';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useTokenContract } from 'contexts/useInterface/hooks';
import { getCurrentAccount } from 'utils/redux';
import { useCredentials } from 'hooks/store';
import { getELFContract } from 'contexts/utils';
import { signMessage } from 'utils/wallet';
import Loading from 'components/Loading';
export default function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const onLogOut = useLogOut();
  const { currentAccount } = useAppSelector(state => state.wallet);
  const tokenContract = useTokenContract();
  const currentNetwork = useCurrentNetwork();
  const credentials = useCredentials();
  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>Home Screen</Text>
        {/* <Button style={GStyles.marginArg(10)} title="Go to Test" onPress={() => navigationService.navigate('Test')} /> */}
        {/* <Button style={GStyles.marginArg(10, 5)} title="Go to Test" onPress={() => navigation.navigate('Test')} /> */}
        {/* <Button
          style={GStyles.marginArg(10, 20, 30, 40)}
          title="Go to Counter"
          onPress={() => navigation.navigate('Counter')}
        /> */}
        {/* <Button
          style={GStyles.marginArg(10, 40, 30)}
          title="Go to AElfTest"
          onPress={() => navigation.navigate('AElfTest')}
        /> */}
        <Button title="Go to DashBoard" onPress={() => navigation.navigate('DashBoard')} />

        <Button onPress={onLogOut}>reSetWallet</Button>
        <Button title="sider" onPress={() => navigationService.navigate('DashBoard')} />
        {/* <Button title="Go to Element" onPress={() => navigation.navigate('Element')} /> */}
        {/* <Button title="Go to I18n" onPress={() => navigation.navigate('I18n')} /> */}
        {/* <Button title="Go to Authentication" onPress={() => navigation.navigate('Authentication')} /> */}
        {/* <Button title="Go to Webview" onPress={() => navigation.navigate('WebView')} /> */}
        <Button title="Go to Echarts" onPress={() => navigation.navigate('Echarts')} />
        <Button title="Go to ContactsHome" onPress={() => navigation.navigate('ContactsHome')} />
        <Button title="Go to Token" onPress={() => navigation.navigate('ManageTokenList')} />
        <Button title="Go to ManageNetwork" onPress={() => navigation.navigate('ManageNetwork')} />
        <TextM>{currentAccount?.accountName}</TextM>
        <TextM>{currentAccount?.address}</TextM>
        <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
        <Button
          title="showAccountInfo"
          onPress={() => {
            if (!currentAccount) return;
            AccountOverlay.showAccountInfo(currentAccount);
          }}
        />
        <Button title="showAccountList" onPress={() => AccountOverlay.showAccountList()} />
        <Button
          title="getBalance"
          onPress={async () => {
            const balance = await tokenContract?.callViewMethod('GetBalance', {
              symbol: 'ELF',
              owner: currentAccount?.address,
            });
            console.log(balance, '=====balance');
          }}
        />
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
          title="Test"
          onPress={async () => {
            if (!currentAccount) return;
            const tmpAccount = getCurrentAccount(credentials?.password || '', currentAccount);
            if (!tmpAccount) return;
            const getContractParams = {
              rpcUrl: currentNetwork?.rpcUrl,
              contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
              account: tmpAccount,
            };

            const elfContract = await getELFContract(getContractParams);
            const raw = await elfContract?.encodedTx('Transfer', {
              symbol: 'ELF',
              memo: '',
              to: '9tNHiRnoCmRvpbriFYjfjmij8Mzw9ugjpQ3bKmkmzVVEQrg1i',
              amount: '1',
            });
            console.log(raw, '====raw');
          }}
        />
        <Button
          title="Test API"
          onPress={() => {
            navigationService.navigate('Test');
          }}
        />
        <Button
          title="Test Loading"
          onPress={() => {
            Loading.show();
          }}
        />
        <Button
          title="Test signMessage"
          onPress={() => {
            if (!currentAccount || !credentials) return;
            const obj = signMessage(currentAccount.address, credentials.password, '1111');
            console.log(obj, '=====obj');
          }}
        />
      </ScrollView>
    </SafeAreaBox>
  );
}
