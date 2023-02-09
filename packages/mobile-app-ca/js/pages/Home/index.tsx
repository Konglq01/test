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
import { getManagerAccount, getWallet } from 'utils/redux';
import { useCredentials } from 'hooks/store';
import { getAelfInstance } from '@portkey/utils/aelf';
import { useGetGuardiansInfoWriteStore, useGetVerifierServers } from 'hooks/guardian';
import { getELFContract } from '@portkey/utils/contract/utils';
import { baseRequest } from 'api';
import AElf from 'aelf-sdk';
import { customFetch } from '@portkey/utils/fetch';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager, getDeviceType } from 'utils/wallet';
export default function HomeScreen() {
  const wallet = useCurrentWalletInfo();
  const getVerifierServers = useGetVerifierServers();
  const getCurrentCAContract = useGetCurrentCAContract();

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
            const contract = await getELFContract({
              contractAddress: chainInfo.caContractAddress,
              rpcUrl: chainInfo.endPoint,
              account,
            });
            const req = await contract?.callSendMethod('ManagerForwardCall', '', {
              caHash: wallet.AELF?.caHash,
              contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
              methodName: 'Transfer',
              params: {
                symbol: 'ELF',
                to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
                amount: 1 * 10 ** 8,
                memo: 'transfer address1 to address2',
              },
            });
            console.log(req, '======req');
          }}
        />
        <Button
          title="connect token"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            // const aa = await getVerifierServers();
            // console.log(JSON.stringify(aa), '=====aa');

            try {
              const account = getManagerAccount(pin);
              if (!account) return;
              console.log(account, '=====account');
              console.log(AElf.wallet, '====AElf.wallet');
              const timestamp = new Date().getTime();
              const message = Buffer.from(`${account.address}-${timestamp}`).toString('hex');

              const signature = AElf.wallet.sign(message, account.keyPair).toString('hex');
              const pubkey = account?.keyPair?.getPublic('hex');
              console.log(
                {
                  grant_type: 'signature',
                  client_id: 'CAServer_App',
                  scope: 'CAServer',
                  signature: signature,
                  pubkey,
                  timestamp,
                  cahash: wallet.AELF?.caHash,
                },
                '====',
              );

              const req = await customFetch('http://192.168.66.38:8080/connect/token', {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                // params: {
                //   grant_type: 'signature',
                //   client_id: 'CAServer_App',
                //   scope: 'CAServer',
                //   signature,
                //   pubkey,
                //   timestamp,
                //   cahash: wallet.AELF?.caHash,
                // },
                body: `grant_type=signature&client_id=CAServer_App&scope=CAServer&signature=${signature}&pubkey=${pubkey}&timestamp=${timestamp}&cahash=${wallet.AELF?.caHash}`,
              });
              console.log(req, '======req');
            } catch (error) {
              console.log(error, '====error');
            }
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
                deviceType: getDeviceType(),
              });
              console.log(req, '===req');
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        />
        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
