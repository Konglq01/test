import React from 'react';

import Socket from '@portkey/socket/socket-did';
import { SocketUrl } from '@portkey/constants/constants-ca/socket';
import { randomId } from '@portkey/utils';
import AElf from 'aelf-sdk';
import { Button, Divider } from 'antd';
import { request } from '@portkey/api/api-did';

// const wallet = AElf.wallet.createNewWallet();
const clientId = 'XSQZXDxnPZzX7ybFnXAsSkU83q1krPrbNmnv6TQoPRWQ7fYpu';
// let requestId = randomId();

Socket.doOpen({
  url: SocketUrl,
  clientId: clientId,
});

Socket.onSinAndAck(
  {
    clientId,
    requestId: clientId,
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
            baseURL: 'http://192.168.10.163:5588',
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
              baseURL: 'http://192.168.10.163:5588',
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
      <Divider />
    </div>
  );
}
