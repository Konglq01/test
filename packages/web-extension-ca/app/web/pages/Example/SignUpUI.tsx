import { CustomSvg, SignIn } from '@portkey/did-ui-react';
import { useState } from 'react';

export default function SignUpUI() {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div>
      <CustomSvg type="Aelf" />
      <SignIn
        open={open}
        sandboxId="portkey-ui-sandbox"
        // chainInfo={{ ...(currentChain as any), contractAddress: currentChain?.caContractAddress || '' }}
        // onCancel={() => setOpen(false)}
        onFinish={(wallet: any) => {
          console.log(wallet, 'onFinish===');
        }}
        onError={(err: any) => {
          //TODO

          console.error(err, 'onError==');
        }}
      />
    </div>
  );
}
