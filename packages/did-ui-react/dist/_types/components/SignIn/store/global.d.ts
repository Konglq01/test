import { LoginType } from '@portkey/types/types-ca/wallet';
interface GlobalState {
    network: string;
    loginType: LoginType;
}
declare class Global {
    state: GlobalState;
    constructor(state?: GlobalState);
    getState: (key: keyof GlobalState) => string | LoginType;
    setState: (key: keyof GlobalState, value: GlobalState[keyof GlobalState]) => void;
}
export declare const globalState: Global;
export {};
