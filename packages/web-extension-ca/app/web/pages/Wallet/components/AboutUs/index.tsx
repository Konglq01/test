import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'types/icon';
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
        link: '',
      },
      {
        icon: 'Discord',
        label: 'Join us on Discord',
        link: '',
      },
    ],
    [],
  );

  const serviceList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Basic',
        label: 'Terms of service',
        link: '',
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
        <div className="content-item">
          {socialList.map((item) => (
            <MenuItem
              key={item.label}
              height={53}
              icon={<CustomSvg type={item.icon || 'Aelf'} />}
              onClick={() => {
                // navigate(item.link);
              }}>
              {t(item.label)}
            </MenuItem>
          ))}
        </div>
        <div className="content-item">
          {serviceList.map((item) => (
            <MenuItem
              key={item.label}
              height={53}
              icon={<CustomSvg type={item.icon || 'Aelf'} />}
              onClick={() => {
                // navigate(item.link);
              }}>
              {t(item.label)}
            </MenuItem>
          ))}
        </div>
      </div>
    </div>
  );
}
