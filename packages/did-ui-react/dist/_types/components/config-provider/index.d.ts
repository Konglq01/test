import _BaseConfigProvider from './BaseConfigProvider';
declare const ConfigProvider: {
    config: import("./types").GlobalConfigProps;
    getGlobalConfig: () => import("./types").GlobalConfigProps;
    getConfig: (key: keyof import("./types").GlobalConfigProps) => import("@portkey/types/storage").IStorage | {
        networkList?: import("@portkey/types/types-ca/network").NetworkItem[] | undefined;
        defaultNetwork?: string | undefined;
    } | import("antd/lib/locale-provider").Locale | undefined;
    setGlobalConfig: (_config: Partial<import("./types").GlobalConfigProps>) => void;
    setNetwork: (network: string) => void;
};
export declare const BaseConfigProvider: typeof _BaseConfigProvider;
export default ConfigProvider;
