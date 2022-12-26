import { Select, SelectProps } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { ReactNode, useMemo } from 'react';
import './index.less';

interface CommonSelectProps extends SelectProps {
  items: { value: string; label: ReactNode; icon?: string; iconUrl?: string; disabled?: boolean }[];
}

export default function CommonSelect1({ items, className, ...props }: CommonSelectProps) {
  const selectOptions = useMemo(
    () =>
      items?.map((item) => ({
        value: item.value,
        disabled: item.disabled,
        label: (
          <div className="flex-row-center label-item">
            {item?.iconUrl ? (
              <img src={item.iconUrl} className="label-icon" />
            ) : (
              <CustomSvg className="label-icon" type={item.icon as any} />
            )}
            <span className="title">{item.label}</span>
          </div>
        ),
      })),
    [items],
  );
  return (
    <Select
      className={clsx('common-select1', className)}
      showArrow={false}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ width: '100%' }}
      options={selectOptions}
      {...props}
    />
  );
}
