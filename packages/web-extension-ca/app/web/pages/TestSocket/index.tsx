import React from 'react';

import Socket from '@portkey/socket/socket-did';
import { SocketUrl } from '@portkey/constants/constants-ca/socket';
import { randomId } from '@portkey/utils';
import AElf from 'aelf-sdk';
import { Button, Divider } from 'antd';
import { request } from '@portkey/api/api-did';

// const wallet = AElf.wallet.createNewWallet();
const clientId = '2b5MrMC6TeikE2akJJgKbyMj2dzz9EQQfRaJDs41tCNdyXwA2j';
const requestId = '76cf96e9d59a4dbca9c0cb5233c653da';

Socket.doOpen({
  url: SocketUrl,
  clientId: clientId,
});

Socket.onSinAndAck(
  {
    clientId,
    requestId: requestId,
  },
  (data) => {
    console.log(data, 'Socket ===Sin');
  },
);

export default function TestSocket() {
  return (
    <div>
      <Button
        onClick={async () => {
          const result = await request.wallet.hubPing({
            method: 'post',
            params: {
              context: {
                clientId,
                requestId: clientId,
              },
            },
          });
          console.log(result, clientId, 'result===');
        }}>
        hubPing
      </Button>
      <Divider />
      <Button
        onClick={() => {
          try {
            Socket.stop();
          } catch (error) {
            console.log(error, 'Socket stop error ==');
          }
        }}>
        Stop
      </Button>
      <Divider />
      <Button
        onClick={async () => {
          const res = await Socket.doOpen({
            url: SocketUrl,
            clientId: clientId,
          });
          console.log(res, 'Socket===reStart');
        }}>
        reStart
      </Button>
      <Divider />
      <Button
        onClick={async () => {
          try {
            const result = await request.wallet.getResponse({
              method: 'post',
              params: {
                context: {
                  clientId,
                  requestId: clientId,
                },
              },
            });
            console.log(result, clientId, 'result===');
          } catch (error) {
            console.log('Socket = getResponse = error', error);
          }
        }}>
        getResponse
      </Button>
      <Button
        onClick={async () => {
          try {
            const result = await request.wallet.setWalletName({
              baseURL: '',
            });
            console.log(result, clientId, 'result===');
          } catch (error) {
            console.log('Socket = getResponse = error', error);
          }
        }}>
        getResponse
      </Button>
      <Divider />
    </div>
  );
}
