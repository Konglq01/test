import { Dropdown, DropdownProps, Input, InputProps } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface DropdownSearchProps extends DropdownProps {
  inputProps: InputProps;
  wrapperClassName?: string;
}

export default function DropdownSearch({ inputProps, wrapperClassName, ...props }: DropdownSearchProps) {
  return (
    <div className={clsx('dropdown-search-wrapper', wrapperClassName)}>
      <Dropdown overlayClassName="empty-dropdown" {...props}>
        <Input allowClear prefix={<CustomSvg type="SearchBlur" style={{ width: 20, height: 20 }} />} {...inputProps} />
      </Dropdown>
    </div>
  );
}
