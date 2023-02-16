import { GlobalConfigProps } from './types';
type ConfigKey = keyof GlobalConfigProps;
declare class LocalConfigProvider {
    config: GlobalConfigProps;
    constructor(config: GlobalConfigProps);
    getGlobalConfig: () => GlobalConfigProps;
    getConfig: (key: ConfigKey) => import("@portkey/types/storage").IStorage | {
        networkList?: import("@portkey/types/types-ca/network").NetworkItem[] | undefined;
        defaultNetwork?: string | undefined;
    } | import("antd/lib/locale-provider").Locale | undefined;
    setGlobalConfig: (_config: Partial<GlobalConfigProps>) => void;
    setNetwork: (network: string) => void;
}
export declare const localConfigProvider: LocalConfigProvider;
export {};
