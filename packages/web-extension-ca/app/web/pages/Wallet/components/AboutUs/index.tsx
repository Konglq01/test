import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import MenuItem from 'components/MenuItem';
import { IconType } from 'types/icon';
import { useTranslation } from 'react-i18next';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import './index.less';

interface IMenuItem {
  icon: IconType;
  link: string;
  label: string;
}

export default function AboutUs() {
  const { t } = useTranslation();

  const socialList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Twitter',
        label: 'Follow us on Twitter',
        link: 'https://twitter.com/Portkey_DID',
      },
      {
        icon: 'Discord',
        label: 'Join us on Discord',
        link: 'https://discord.com/invite/EUBq3rHQhr',
      },
    ],
    [],
  );

  const serviceList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Basic',
        label: 'Terms of service',
        link: `${OfficialWebsite}/terms-of-service`,
      },
    ],
    [],
  );

  return (
    <div className="about-us-drawer">
      <div className="flex-column-center header">
        <div className="flex-center logo">
          <CustomSvg type="PortKey" />
        </div>
        <span className="name">{t('Portkey')}</span>
        <span className="version">{`${process.env.SDK_VERSION?.toUpperCase()} beta`}</span>
      </div>
      <div className="content">
        <div className="content-item social">
          {socialList.map((item) => (
            <MenuItem key={item.label} height={56} icon={<CustomSvg type={item.icon || 'Aelf'} />}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {t(item.label)}
              </a>
            </MenuItem>
          ))}
        </div>
        <div className="content-item service">
          {serviceList.map((item) => (
            <MenuItem key={item.label} height={56} icon={<CustomSvg type={item.icon || 'Aelf'} />}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {t(item.label)}
              </a>
            </MenuItem>
          ))}
        </div>
      </div>
    </div>
  );
}
