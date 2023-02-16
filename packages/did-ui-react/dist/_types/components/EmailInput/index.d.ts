/// <reference types="react" />
import { ValidatorHandler } from '../../types';
import './index.less';
interface EmailInputProps {
    wrapperClassName?: string;
    error?: string;
    val?: string;
    onChange?: (val: string) => void;
    inputValidator?: ValidatorHandler;
}
export interface EmailInputInstance {
    validateEmail: ValidatorHandler;
}
declare const EmailInput: import("react").ForwardRefExoticComponent<EmailInputProps & import("react").RefAttributes<unknown>>;
export default EmailInput;
