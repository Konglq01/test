// import React, { useEffect, useState } from 'react';
// import {
//   CodeVerify,
//   GuardianApproval,
//   GuardianList,
//   SetPinAndAddManager,
//   SignIn,
//   SignUpAndLogin,
//   SignUpBase,
//   VerifierSelect,
// } from '@portkey-wallet/did-ui-react';
// import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
// import { Button } from 'antd';

// export default function ExampleUI() {
//   const [open, setOpen] = useState<boolean>();
//   return (
//     <>
//       <VerifierSelect guardianAccount="peijuan.yao@aelf.io" />
//       <CodeVerify
//         chainId={'AELF'}
//         verifier={{
//           id: 'string', // aelf.Hash
//           name: 'string',
//           imageUrl: 'string',
//           endPoints: ['string'],
//           verifierAddresses: ['string'],
//         }}
//         guardianAccount={'guardianAccount'}
//         verifierSessionId={'verifierSessionId'}
//       />
//       <SignUpBase />
//       <SignUpAndLogin />
//       <SignIn
//         open={open}
//         sandboxId="portkey-ui-sandbox"
//         // chainInfo={{ ...(currentChain as any), contractAddress: currentChain?.caContractAddress || '' }}
//         // onCancel={() => setOpen(false)}
//         onFinish={wallet => {
//           console.log(wallet, 'onFinish===');
//         }}
//         onError={err => {
//           //TODO
//           console.error(err, 'onError==');
//         }}
//         onCancel={() => {
//           setOpen(false);
//         }}
//       />
//       <SetPinAndAddManager guardianAccount="" verificationType={0} guardianApprovedList={[]} />
//       <GuardianList />
//       <GuardianApproval chainId={'AELF'} />
//       <Button
//         onClick={() => {
//           setOpen(true);
//         }}>
//         BUtton
//       </Button>
//     </>
//   );
// }

import React from 'react';

export default function ExampleUI() {
  return <div>ExampleUI</div>;
}
