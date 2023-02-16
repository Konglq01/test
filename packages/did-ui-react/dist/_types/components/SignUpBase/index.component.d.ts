import './index.less';
export interface SignUpBaseProps {
    onBack?: () => void;
    inputValidator?: (value?: string) => Promise<any>;
    onSignUp?: (value: string) => void;
}
export default function SignUpBase({ onBack, inputValidator, onSignUp }: SignUpBaseProps): JSX.Element;
