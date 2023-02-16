import { ReactNode } from 'react';
export interface TitleWrapperProps {
    title?: ReactNode;
    className?: string;
    leftElement?: ReactNode | boolean;
    rightElement?: ReactNode;
    leftCallBack?: () => void;
}
export default function TitleWrapper({ title, className, leftElement, rightElement, leftCallBack }: TitleWrapperProps): JSX.Element;
