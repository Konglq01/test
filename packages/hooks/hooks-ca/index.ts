import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';

export const useAppCASelector: TypedUseSelectorHook<CACommonState> = useSelector;
