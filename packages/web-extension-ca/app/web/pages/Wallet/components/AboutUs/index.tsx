import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import MenuItem from 'components/MenuItem';
import { IconType } from 'types/icon';
import { useTranslation } from 'react-i18next';
import './index.less';

interface IMenuItem {
  icon: IconType;
  link: string;
  label: string;
}

export default function AboutUs() {
  const { t } = useTranslation();
  const version = 'V 1.2.0 beta';

  const MenuList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Aelf',
        label: 'Terms of service',
        link: '',
      },
      {
        icon: 'Aelf',
        label: 'Follow us on Twitter',
        link: '',
      },
      {
        icon: 'Aelf',
        label: 'Join us on Discord',
        link: '',
      },
    ],
    [],
  );

  return (
    <div className="about-us-drawer">
      <div className="flex-column-center header">
        <CustomSvg type="PortKey" />
        <span className="version">{version}</span>
      </div>
      <div className="content">
        {MenuList.map((item) => (
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
  );
}
