import { BaseToken } from '@portkey/types/types-ca/token';
import NftInput from './NftInput';
import TokenInput from './TokenInput';

export default function AmountInput({
  fromAccount,
  type = 'token',
  toAccount,
  value,
  token,
  errorMsg,
  onChange,
  onTxFeeChange,
  onCheckValue,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  type: 'token' | 'nft';
  toAccount: { address: string };
  value: string;
  token: BaseToken;
  errorMsg: string;
  onChange: (amount: string) => void;
  onTxFeeChange?: (fee: string) => void;
  onCheckValue?: (params: { balance: string; fee: string; amount: string }) => void;
}) {
  return type === 'token' ? (
    <TokenInput
      fromAccount={fromAccount}
      toAccount={toAccount}
      value={value}
      token={token}
      errorMsg={errorMsg}
      onChange={onChange}
      onTxFeeChange={onTxFeeChange}
      onCheckValue={onCheckValue}
    />
  ) : (
    <NftInput
      fromAccount={fromAccount}
      toAccount={toAccount}
      value={value}
      token={token}
      errorMsg={errorMsg}
      onChange={onChange}
      onTxFeeChange={onTxFeeChange}
      onCheckValue={onCheckValue}
    />
  );
}
