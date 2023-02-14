import React from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { CrashTest } from 'Test/CrashTest';
import Loading from 'components/Loading';
import { contractQueries } from '@portkey/graphql/index';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { usePin } from 'hooks/store';
import { getContractBasic } from '@portkey/contracts/utils';
import AElf from 'aelf-sdk';
import { customFetch } from '@portkey/utils/fetch';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
import { request } from '@portkey/api/api-did';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { DEVICE_TYPE } from 'constants/common';
import { useGetHolderInfo } from 'hooks/guardian';
export default function HomeScreen() {
  const wallet = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();

  const pin = usePin();
  const chainInfo = useCurrentChain('AELF');
  const { connectUrl } = useCurrentNetworkInfo();
  const getHolderInfo = useGetHolderInfo();
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
          title="ManagerForwardCall Transfer"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            const account = getManagerAccount(pin);
            if (!account) return;
            const contract = await getContractBasic({
              contractAddress: chainInfo.caContractAddress,
              rpcUrl: chainInfo.endPoint,
              account,
            });
            const req = await contract?.callSendMethod('ManagerForwardCall', '', {
              caHash: wallet.AELF?.caHash,
              contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
              methodName: 'Transfer',
              args: {
                symbol: 'ELF',
                // to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
                to: '6NLtKG7mW426EhQSVKm3SuFCsSaUhkyKjdw1QEMnswod7XAfK',
                amount: 1 * 10 ** 8,
                memo: 'transfer address1 to address2',
              },
            });
            console.log(req, '======req');
          }}
        />
        <Button
          title="ManagerForwardCall Transfer transactionHash"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            const account = getManagerAccount(pin);
            if (!account) return;
            const contract = await getContractBasic({
              contractAddress: chainInfo.caContractAddress,
              rpcUrl: chainInfo.endPoint,
              account,
            });
            const req = await contract?.callSendMethod(
              'ManagerForwardCall',
              '',
              {
                caHash: wallet.AELF?.caHash,
                contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
                methodName: 'Transfer',
                args: {
                  symbol: 'ELF',
                  to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
                  amount: 1 * 10 ** 8,
                  memo: 'transfer address1 to address2',
                },
              },
              { onMethod: 'transactionHash' },
            );
            console.log(req, '======req');
          }}
        />
        <Button
          title="addManager"
          onPress={async () => {
            if (!chainInfo || !pin || !wallet.caHash) return;
            // const aa = await getVerifierServers();
            // console.log(JSON.stringify(aa), '=====aa');

            try {
              const tmpWalletInfo = AElf.wallet.createNewWallet();
              const contract = await getCurrentCAContract();
              const req = await addManager({
                contract,
                caHash: wallet.caHash,
                address: wallet.address,
                managerAddress: tmpWalletInfo.address,
                deviceType: DEVICE_TYPE,
              });
              console.log(req, '===req');
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        />
        <Button
          title="add contact"
          onPress={async () => {
            try {
              console.log(wallet, '====wallet');
              const holderInfo = await getHolderInfo({
                caHash: 'f8e66f2ba4a17dce896b444b1ce0ac83c063481cceef81fc5460a7a0674852f4',
              });
              console.log(holderInfo, '===holderInfo');

              if (!chainInfo || !pin || !wallet.AELF?.caHash) return;
              const req = await request.contact.addContact({
                params: {
                  name: 'xxx',
                  addresses: [
                    {
                      chainId: 'string',
                      address: 'string',
                    },
                  ],
                },
              });
              console.log(req, '====req');
            } catch (error) {
              console.log(error, '====error-1');
            }
          }}
        />
        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
