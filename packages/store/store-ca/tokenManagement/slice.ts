import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChainItemType } from '@portkey/types/chain';
import { AccountAssets, TokenItemType, TokenState } from '@portkey/types/types-ca/token';
import { AccountType } from '@portkey/types/wallet';
// import { isSameTypeToken } from '@portkey/utils/token';
import { fetchTokenListAsync } from './action';

const initialState: TokenState = {
  addedTokenData: {},
  tokenDataShowInMarket: [],
  tokenDataShowInReceive: [],
  isFetchingTokenList: false,
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
      state.addedTokenData = {};
      state.tokenDataShowInMarket = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTokenListAsync.pending, state => {
        state.isFetchingTokenList = true;
        // state.status = 'loading';
      })
      .addCase(fetchTokenListAsync.fulfilled, (state, action) => {
        const { list } = action.payload;
        const formatList: AccountAssets = list.map(item => ({
          chainId: item.token.chainId,
          symbol: item.token.symbol,
          address: item.token.address,
        }));
        state.tokenDataShowInReceive = formatList;
        state.tokenDataShowInMarket = list;
        state.isFetchingTokenList = false;
      })
      .addCase(fetchTokenListAsync.rejected, state => {
        state.isFetchingTokenList = false;
        // state.status = 'failed';
      });
  },
});

export const { addTokenInCurrentAccount, deleteTokenInCurrentAccount, clearMarketToken, resetToken } =
  tokenManagementSlice.actions;

export default tokenManagementSlice;
