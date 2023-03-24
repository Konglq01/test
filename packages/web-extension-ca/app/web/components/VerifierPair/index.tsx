import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import clsx from 'clsx';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface VerifierPairProps {
  guardianType?: LoginType;
  verifierSrc?: string;
  verifierName?: string;
  wrapperClassName?: string;
  size?: number;
}

const GuardianTypeIcon = {
  [LoginType.Email]: 'email',
  [LoginType.Phone]: 'GuardianPhone',
  [LoginType.Google]: 'Google',
  [LoginType.Apple]: 'Apple',
};

export default function VerifierPair({
  guardianType = LoginType.Email,
  size = 32,
  verifierSrc,
  verifierName,
  wrapperClassName,
}: VerifierPairProps) {
  return (
    <div className={clsx('flex-row-center icon-pair', wrapperClassName)}>
      <CustomSvg
        type={guardianType === LoginType.Phone ? ('phone' as any) : 'email'}
        style={{ width: size, height: size, fontSize: size }}
      />
      <div className="verifier-icon-border">
        <BaseVerifierIcon src={verifierSrc} fallback={verifierName?.[0]} />
      </div>
    </div>
  );
}
