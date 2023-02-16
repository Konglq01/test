import { LoginType } from '@portkey/types/types-ca/wallet';
import clsx from 'clsx';
import BaseVerifierIcon from '../BaseVerifierIcon';
import CustomSvg from '../CustomSvg';
import './index.less';

interface VerifierPairProps {
  guardianType?: LoginType;
  verifierSrc?: string;
  wrapperClassName?: string;
  size?: number;
}
export default function VerifierPair({
  guardianType = LoginType.email,
  size = 32,
  verifierSrc,
  wrapperClassName,
}: VerifierPairProps) {
  return (
    <div className={clsx('flex-row-center icon-pair', wrapperClassName)}>
      <CustomSvg
        type={guardianType === LoginType.phone ? ('phone' as any) : 'Email'}
        style={{ width: size, height: size, fontSize: size }}
      />
      <BaseVerifierIcon width={size} height={size} src={verifierSrc} />
    </div>
  );
}
