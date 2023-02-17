import { ValidatorHandler } from '../../types';
import './index.less';
interface EmailTabProps {
    onSuccess?: (email: string) => void;
    isTermsChecked?: boolean;
    inputValidator?: ValidatorHandler;
}
export default function EmailTab({ inputValidator, onSuccess }: EmailTabProps): JSX.Element;
export {};
