import './index.less';
export interface EmailLoginProps {
    onLogin?: (value: string) => void;
    inputValidator?: (value?: string) => Promise<any>;
}
export default function EmailLogin({ onLogin, inputValidator }: EmailLoginProps): JSX.Element;
