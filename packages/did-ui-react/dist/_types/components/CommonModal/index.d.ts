import { ModalProps } from 'antd';
import { ReactNode } from 'react';
import './styles.less';
export interface CommonModalProps extends ModalProps {
    className?: string;
    leftCallBack?: () => void;
    leftElement?: ReactNode;
    transitionName?: string;
}
export default function CommonModal(props: CommonModalProps): JSX.Element;
