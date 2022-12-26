import { LoginType } from '@portkey/types/verifier';
import clsx from 'clsx';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface VerifierPairProps {
  guardiansType?: LoginType;
  verifierSrc?: string;
  wrapperClassName?: string;
  size?: number;
}
export default function VerifierPair({
  guardiansType = LoginType.email,
  size = 32,
  verifierSrc,
  wrapperClassName,
}: VerifierPairProps) {
  return (
    <div className={clsx('flex-row-center icon-pair', wrapperClassName)}>
      <CustomSvg
        type={guardiansType === LoginType.phone ? ('phone' as any) : 'email'}
        style={{ width: size, height: size, fontSize: size }}
      />
      <BaseVerifierIcon width={size} height={size} src={verifierSrc} />
    </div>
  );
}
