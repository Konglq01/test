import { SelectProps } from 'antd';
import { ReactNode } from 'react';
import './index.less';
export interface CommonSelectProps extends SelectProps {
    items?: {
        value: string;
        label: ReactNode;
        icon?: ReactNode;
        disabled?: boolean;
    }[];
}
export default function CommonSelect({ items, className, ...props }: CommonSelectProps): JSX.Element;
