import { FormInstance } from 'antd';
import { ReactNode } from 'react';
import './index.less';
type ValidateFieldsType = FormInstance<any>['validateFields'];
interface ConfirmPasswordProps {
    value?: string;
    onChange?: (value: string) => void;
    validateFields?: ValidateFieldsType;
    isPasswordLengthTipShow?: boolean;
    label?: {
        password?: ReactNode;
        newPlaceholder?: string;
        confirmPassword?: ReactNode;
        confirmPlaceholder?: string;
    };
}
export default function ConfirmPassword({ validateFields, value, onChange, isPasswordLengthTipShow, label, }: ConfirmPasswordProps): JSX.Element;
export {};
