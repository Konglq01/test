import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storeConfig from './config';
import rootReducer from './rootReducer';
import { rateApi } from '@portkey/store/rate/api';

const persistedReducer = persistReducer(storeConfig.reduxPersistConfig, rootReducer);

const middlewareList: any[] = [];
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createDebugger = require('redux-flipper').default;
  middlewareList.push(createDebugger());
}
middlewareList.push(rateApi.middleware);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(storeConfig.defaultMiddlewareOptions).concat(middlewareList),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
