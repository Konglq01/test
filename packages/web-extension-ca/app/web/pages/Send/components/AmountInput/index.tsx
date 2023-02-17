import { BaseToken } from '@portkey/types/types-ca/token';
import NftInput from './NftInput';
import TokenInput from './TokenInput';

export default function AmountInput({
  fromAccount,
  type = 'token',
  toAccount,
  value,
  token,
  onChange,
  onTxFeeChange,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  type: 'token' | 'nft';
  toAccount: { address: string };
  value: string;
  token: BaseToken;
  onChange: (amount: string) => void;
  onTxFeeChange?: (fee: string) => void;
}) {
  return type === 'token' ? (
    <TokenInput
      fromAccount={fromAccount}
      toAccount={toAccount}
      value={value}
      token={token}
      onChange={onChange}
      onTxFeeChange={onTxFeeChange}
    />
  ) : (
    <NftInput
      fromAccount={fromAccount}
      toAccount={toAccount}
      value={value}
      token={token}
      onChange={onChange}
      onTxFeeChange={onTxFeeChange}
    />
  );
}
