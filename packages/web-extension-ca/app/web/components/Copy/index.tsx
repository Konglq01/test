import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export default function Copy({
  toCopy,
  children,
  className,
  iconType,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  iconType?: string;
}) {
  const { t } = useTranslation();
  const [, setCopied] = useCopyToClipboard();

  return (
    <span
      onClick={() => {
        setCopied(toCopy);
        message.success(t('Copy Success'));
      }}
      className={clsx('flex-row-center copy-wrapper', className)}
      style={{ cursor: 'pointer' }}>
      <CustomSvg type={(iconType as any) || 'Copy2'} className="icon" />
      {children}
    </span>
  );
}
