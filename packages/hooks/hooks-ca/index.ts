import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CACommonState } from '@portkey/types/types-ca/store';

export const useAppCASelector: TypedUseSelectorHook<CACommonState> = useSelector;
