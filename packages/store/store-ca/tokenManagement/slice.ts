import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChainItemType } from '@portkey/types/chain';
import { AccountAssets, TokenItemType, TokenState } from '@portkey/types/types-ca/token';
import { AccountType } from '@portkey/types/wallet';
// import { isSameTypeToken } from '@portkey/utils/token';
import { fetchAllTokenListAsync } from './action';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';

const initialState: TokenState = {
  // addedTokenData: {},
  tokenDataShowInMarket: [],
  isFetching: false,
  skipCount: 0,
  maxResultCount: 1000,
  totalRecordCount: 0,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const tokenManagementSlice = createSlice({
  name: 'tokenManagement',
  initialState,
  reducers: {
    addTokenInCurrentAccount: (
      state,
      action: PayloadAction<{
        tokenItem: TokenItemType;
        currentChain: ChainItemType;
        currentAccount: AccountType;
      }>,
    ) => {
      // const { tokenItem, currentChain } = action.payload;
      // const chainKey = currentChain.rpcUrl;
      // state.addedTokenData[chainKey].push(tokenItem);
      // state.tokenDataShowInMarket = state.tokenDataShowInMarket.map(ele => {
      //   return {
      //     ...ele,
      //     isAdded: isSameTypeToken(ele, tokenItem) ? true : ele.isAdded,
      //   };
      // });
      // state.addedTokenData = state.addedTokenData;
    },
    deleteTokenInCurrentAccount: (
      state,
      action: PayloadAction<{
        tokenItem: TokenItemType;
        currentChain: ChainItemType;
      }>,
    ) => {
      // const { tokenItem, currentChain } = action.payload;
      // const chainKey = currentChain.rpcUrl;
      // state.addedTokenData[chainKey] = state.addedTokenData[chainKey].filter(ele => !isSameTypeToken(ele, tokenItem));
      // state.tokenDataShowInMarket = state.tokenDataShowInMarket.map(ele => {
      //   return {
      //     ...ele,
      //     isAdded: isSameTypeToken(ele, tokenItem) ? false : ele.isAdded,
      //   };
      // });
      // state.addedTokenData = state.addedTokenData;
    },
    clearMarketToken: (state, action: PayloadAction<any>) => {
      console.log('initCurrentAccountToken');
      state.tokenDataShowInMarket = [];
    },
    resetToken: state => {
      // state.addedTokenData = {};
      state.tokenDataShowInMarket = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllTokenListAsync.pending, state => {
        state.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchAllTokenListAsync.fulfilled, (state, action) => {
        const { list } = action.payload;
        const tmpToken: TokenItemShowType[] = list.map(item => ({
          isAdded: item.isDisplay,
          isDefault: item.isDefault,
          userTokenId: item.id,
          chainId: item.token.chainId,
          decimals: item.token.decimals,
          address: item.token.address,
          symbol: item.token.symbol,
          tokenName: item.token.symbol,
          id: item.token.id,
          name: item.token.symbol,
        }));

        state.tokenDataShowInMarket = tmpToken;
        state.isFetching = false;
      })
      .addCase(fetchAllTokenListAsync.rejected, state => {
        state.isFetching = false;
        // state.status = 'failed';
      });
  },
});

export const { addTokenInCurrentAccount, deleteTokenInCurrentAccount, clearMarketToken, resetToken } =
  tokenManagementSlice.actions;

export default tokenManagementSlice;
