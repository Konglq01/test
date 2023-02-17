import { eventBus } from './index';
import { OpacityType } from '@portkey/types';
import { SET_GLOBAL_LOADING } from '../constants/events';

export const setLoading = (loading: boolean | OpacityType) => eventBus.emit(SET_GLOBAL_LOADING, loading);
