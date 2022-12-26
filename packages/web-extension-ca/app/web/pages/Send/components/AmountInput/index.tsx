import { BaseToken } from '@portkey/types/types-ca/token';
import NftInput from './NftInput';
import TokenInput from './TokenInput';

export default function AmountInput({
  fromAccount,
  type,
  toAccount,
  value,
  token,
  onChange,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey?: string };
  type: 'token' | 'nft';
  toAccount: { address: string };
  value: string;
  token: BaseToken;
  onChange: (amount: string) => void;
}) {
  return type === 'token' ? (
    <TokenInput
      toAccount={{
        address: '',
      }}
      value={value}
      token={token}
      onChange={onChange}
    />
  ) : (
    <NftInput
      toAccount={{
        address: '',
      }}
      value={value}
      token={token}
      onChange={onChange}
    />
  );
}
