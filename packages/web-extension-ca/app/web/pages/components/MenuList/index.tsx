import MenuItem from 'components/MenuItem';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface MenuItemInfo {
  label: string;
  key: number;
  click: () => void;
}

export interface IMenuItemProps {
  list: MenuItemInfo[];
  height?: number;
  className?: string;
  isShowSelectedColor?: boolean;
  selected?: number;
}

export default function MenuList({
  list,
  height = 64,
  className,
  isShowSelectedColor = false,
  selected,
}: IMenuItemProps) {
  const { t } = useTranslation();

  return (
    <div className={clsx(['menu-list', className])}>
      {list.map((item) => (
        <MenuItem
          key={item.key + item.label}
          className={isShowSelectedColor && selected === item.key ? 'item-selected' : undefined}
          height={height}
          onClick={item.click}>
          {t(item.label)}
        </MenuItem>
      ))}
    </div>
  );
}
