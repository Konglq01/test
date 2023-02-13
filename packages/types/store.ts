import chainSlice from '@portkey/store/network/slice';
import { ChainState } from '@portkey/store/network/types';
import { settingsSlice } from '@portkey/store/settings/slice';
import { SettingsState } from '@portkey/store/settings/types';
import { contactSlice, ContactState } from '@portkey/store/store-ca/contact/slice';
import { tradeSlice, TradeState } from '@portkey/store/trade/slice';

export type RootCommonState = {
  [chainSlice.name]: ChainState;
  [settingsSlice.name]: SettingsState;
  [tradeSlice.name]: TradeState;
  [contactSlice.name]: ContactState;
};
