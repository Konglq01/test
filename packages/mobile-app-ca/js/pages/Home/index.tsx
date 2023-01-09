import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'navigation';
import * as React from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import { useTokenContract } from 'contexts/useInterface/hooks';
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
import { baseRequest } from 'api';
import descriptor from '@aelfqueen/protobufjs/ext/descriptor';
import AElf from 'aelf-sdk';
import { useGetHolderInfo } from 'hooks/guardian';

function fileDescriptorSetFormatter(result: any) {
  const buffer = Buffer.from(result, 'base64');
  return descriptor.FileDescriptorSet.decode(buffer);
}
export const getServicesFromFileDescriptors = (descriptors: any) => {
  const root = AElf.pbjs.Root.fromDescriptor(descriptors, 'proto3').resolveAll();
  return descriptors.file
    .filter((f: any) => f.service.length > 0)
    .map((f: any) => {
      const sn = f.service[0].name;
      const fullName = f.package ? `${f.package}.${sn}` : sn;
      return root.lookupService(fullName);
    });
};
export default function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const tokenContract = useTokenContract();
  const dispatch = useAppDispatch();
  const wallet = useCurrentWalletInfo();
  const getHolderInfo = useGetHolderInfo();
  const { pin } = useCredentials() || {};
  const chainInfo = useCurrentChain('AELF');
  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>Test Screen</Text>
        {/* <Button title="Go to Element" onPress={() => navigation.navigate('Element')} /> */}
        {/* <Button title="Go to I18n" onPress={() => navigation.navigate('I18n')} /> */}
        <Button title="Go to ContactsHome" onPress={() => navigation.navigate('ContactsHome')} />
        <Button title="Go to Token" onPress={() => navigation.navigate('ManageTokenList')} />
        <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
        <Button
          title="getBalance"
          onPress={async () => {
            const balance = await tokenContract?.callViewMethod('GetBalance', {
              symbol: 'ELF',
              owner: '5xC4AXHmVqaRNhN5LPMe9hU8t51QeHyVaUDJ6Ph6gs5mEuBNF',
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
        <Button
          title="instance"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            const instance = getAelfInstance(chainInfo.endPoint);
            const base64 = await baseRequest({
              method: 'GET',
              url: `${chainInfo.endPoint}/api/blockChain/contractFileDescriptorSet`,
              params: { address: chainInfo.caContractAddress },
            });
            const fds = fileDescriptorSetFormatter(base64);
            console.log(fds, '===fds');
            console.log(JSON.stringify(fds.toJSON()), '===fds-toJSON');

            const services = getServicesFromFileDescriptors(fds);
            console.log(services[0].methods.AddGuardian.resolve(), '===services');

            const obj: any = {};
            Object.keys(services).forEach(key => {
              const service = services[key];
              // eslint-disable-next-line @typescript-eslint/no-shadow
              Object.keys(service.methods).forEach(key => {
                const method = service.methods[key].resolve();
                obj[method.name] = method.resolvedRequestType;
              });
            });
            console.log(base64, fds, obj, '===instance');
          }}
        />

        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
