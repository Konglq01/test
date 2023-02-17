import { CodeVerifyProps } from '../../../CodeVerify/index.component';
import './index.less';
export default function VerifierPage({ onBack, ...props }: CodeVerifyProps & {
    onBack: () => void;
}): JSX.Element;
