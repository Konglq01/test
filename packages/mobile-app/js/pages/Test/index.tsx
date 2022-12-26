import { Button } from '@rneui/base';
import React from 'react';
import { useCredentials, useWallet } from 'hooks/store';
import { useCurrentNetwork } from '@portkey/hooks/network';
import { rsaEncryptObj } from 'utils/rsaEncrypt';
import PageContainer from 'components/PageContainer';
import { request } from 'api';
import { signMessage } from 'utils/wallet';
import { PUB_KEY } from 'constants/api';

const Test = () => {
  const credentials = useCredentials();
  const { currentAccount } = useWallet();
  const currentNetwork = useCurrentNetwork();

  return (
    <PageContainer>
      <Button
        title="test address"
        onPress={async () => {
          if (!currentAccount || !credentials) return;
          const signObj = signMessage(currentAccount.address, credentials.password);

          const obj = {
            public_key: JSON.stringify(currentAccount?.publicKey),
            currency: 'USD',
            chainid: currentNetwork.chainId,
            chain_id: currentNetwork.chainId,
            signature: signObj?.sha256Sign,
            udid: 'E59651DE-2162-48DC-8792-44DBA3BE1B6A',
            version: '1.1.6',
            device: 'iOS',
            address: currentAccount.address,

            p: '1', // 1当前页码 // 必传
            type: '0', // 0类型标识=0全部=1转出=2接收 // 必传
            symbol: undefined, // 币种ELF,
          };
          console.log(signObj, obj, '=====signObj');

          console.log('qqqqq', rsaEncryptObj(obj, PUB_KEY)[0]);
          try {
            const data = rsaEncryptObj(obj, PUB_KEY)[0];
            console.log('encryptodata', data);
            const req = await request.wallet.transactionNotice({ data, networkType: 'TESTNET' }); // todo  delete type
            console.log(req, '=====req');
          } catch (error) {
            console.log(error, '=====error');
          }
        }}
      />
    </PageContainer>
  );
};

export default Test;
