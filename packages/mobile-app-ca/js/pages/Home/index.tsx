import * as React from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { CrashTest } from 'Test/CrashTest';
import Loading from 'components/Loading';
import { queryFailAlert } from 'utils/login';
import { contractQueries } from '@portkey/graphql/index';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getWallet } from 'utils/redux';
import { useCredentials } from 'hooks/store';
import { getAelfInstance } from '@portkey/utils/aelf';
import { useGetHolderInfo } from 'hooks/guardian';
export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const wallet = useCurrentWalletInfo();
  const getHolderInfo = useGetHolderInfo();
  const { pin } = useCredentials() || {};
  const chainInfo = useCurrentChain('AELF');
  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>Test Screen</Text>
        <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
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
        <Button
          title="getCAContract"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            console.log(chainInfo, '==chainInfo.caContractAddress');
            getHolderInfo({ caHash: wallet.AELF?.caHash as any });
            const account = getWallet(pin);
            // const contract = await getELFContract({
            //   contractAddress: chainInfo.caContractAddress,
            //   rpcUrl: chainInfo.endPoint,
            //   account: account,
            // });
            const instance = getAelfInstance('http://192.168.67.35:8000');
            const aelfContract = await instance.chain.contractAt(
              '2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS',
              account,
            );

            const req = await aelfContract.AddGuardian({
              caHash: '2045f9b4859d0b9eb6015ec90cabdfb31939ae19500ef0b9970aade32f310650',
              guardianToAdd: {
                guardianType: {
                  // type: 0,
                  // guardianType: 'hong.lin@aelf.io',
                },
                verifier: {
                  name: 'Verifier-002',
                  signature:
                    '4cafb0a1f39260fc4778f06d79a7894dc841d8627d463e4d65c84fadb5a011180265b69037c6863a9f2d387677edeaa6cc72ed0eb10e55bf3d26e2f3746357f000',
                  verificationDoc:
                    '0,hong.lin@aelf.io,01/05/2023 07:45:55,2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3',
                },
              },
              guardiansApproved: [
                {
                  guardianType: {
                    // type: 0,
                    // guardianType: 'hong.lin@hoopox.com',
                  },
                  verifier: {
                    name: 'Verifier-002',
                    signature:
                      '3ede00fb1865e01b48f7165d3e7e6b5ad0ce1e0ea0562ff39b3779bbadb43bd3150356144a6410659dffe87a636257d663b6e72fdc691c5407571b4d3f01dc6900',
                    verificationDoc:
                      '0,hong.lin@hoopox.com,01/05/2023 07:46:11,2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3',
                  },
                },
              ],
            });
            console.log(req, '====req');
          }}
        />

        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
