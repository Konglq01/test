import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RateBaseType, NFTCollectionItemShowType } from '@portkey/types/types-ca/assets';
import { fetchAssetList, fetchNFTSeriesList, fetchNFTList, fetchTokenList, fetchTokenPrices } from './api';
import { AccountAssets, TokenItemShowType } from '@portkey/types/types-ca/token';

// asset = token + nft
export type AssetsStateType = {
  accountToken: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountTokenList: TokenItemShowType[];
    totalRecordCount: number;
  };
  accountNFT: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountNFTList: NFTCollectionItemShowType[];
    totalRecordCount: number;
  };
  tokenPrices: {
    isFetching: boolean;
    tokenPriceObject: {
      [symbol: string]: number;
    };
  };
  accountAssets: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountAssetsList: AccountAssets;
    totalRecordCount: number;
  };
  accountBalance: number;
};

const initialState: AssetsStateType = {
  accountToken: {
    isFetching: false,
    skipCount: 0,
    maxResultCount: 10,
    accountTokenList: [],
    totalRecordCount: 0,
  },
  accountNFT: {
    isFetching: false,
    skipCount: 0,
    maxResultCount: 10,
    accountNFTList: [],
    totalRecordCount: 0,
  },
  accountAssets: {
    isFetching: false,
    skipCount: 0,
    maxResultCount: 10,
    accountAssetsList: [],
    totalRecordCount: 0,
  },
  tokenPrices: {
    isFetching: false,
    tokenPriceObject: {},
  },
  accountBalance: 0,
};

// fetch tokenList on Dashboard
export const fetchTokenListAsync = createAsyncThunk(
  'fetchTokenListAsync',
  async (
    {
      caAddresses,
      skipCount = 0,
      maxResultCount = 1000,
    }: { caAddresses: string[]; skipCount?: number; maxResultCount?: number },
    { getState, dispatch },
  ) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountToken: { totalRecordCount, accountTokenList },
    } = assets;

    // if (totalRecordCount === 0 || totalRecordCount > accountTokenList.length) {
    const response = await fetchTokenList({ caAddresses, skipCount, maxResultCount });
    return { list: response.data, totalRecordCount: response.totalRecordCount };
    // }

    // return { list: [], totalRecordCount };
  },
);

// fetch nftSeriesList on Dashboard
export const fetchNFTCollectionsAsync = createAsyncThunk(
  'fetchNFTCollectionsAsync',
  async (
    {
      caAddresses,
    }: // skipCount = 0,
    // maxResultCount = 1000,
    {
      caAddresses: string[];
      // skipCount: number;
      // maxResultCount: number;
    },
    { getState, dispatch },
  ) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { totalRecordCount, accountNFTList, skipCount, maxResultCount },
    } = assets;

    // if (totalRecordCount === 0 || totalRecordCount > accountNFTList.length) {
    const response = await fetchNFTSeriesList({ caAddresses, skipCount: 0, maxResultCount });
    return { list: response.data, totalRecordCount: response.totalRecordCount };
    // }

    return { list: [], totalRecordCount };
  },
);

// fetch current nftSeries on Dashboard
export const fetchNFTAsync = createAsyncThunk(
  'fetchNFTAsync',
  async (
    {
      symbol,
      caAddresses,
    }: // skipCount = 0,
    // maxResultCount = 9,
    {
      symbol: string;
      caAddresses: string[];
      // skipCount: number;
      // maxResultCount: number;
    },
    { getState, dispatch },
  ) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { accountNFTList },
    } = assets;
    const targetNFTCollection = accountNFTList.find(item => item.symbol === symbol);
    if (!targetNFTCollection) return;
    const { skipCount, maxResultCount, totalRecordCount, children } = targetNFTCollection;
    if (totalRecordCount === 0 || totalRecordCount > children.length) {
      const response = await fetchNFTList({ symbol, caAddresses, skipCount, maxResultCount });
      return { symbol, list: response.data, totalRecordCount: response.totalRecordCount };
    }
    return { symbol, list: [], totalRecordCount };
  },
);

// fetch current assets when add sent button
export const fetchAssetAsync = createAsyncThunk(
  'fetchAssetsAsync',
  async ({ caAddresses, keyword }: { caAddresses: string[]; keyword: string }, { getState, dispatch }) => {
    // const { assets } = getState() as { assets: AssetsStateType };
    // const {
    //   accountAssets: { totalRecordCount, accountAssetsList },
    // } = assets;

    // if (totalRecordCount === 0 || totalRecordCount > accountAssetsList.length) {
    const response = await fetchAssetList({ caAddresses, keyword, skipCount: 1, maxResultCount: 1000 });

    return { list: response.data, totalRecordCount: response.totalRecordCount };
    // }

    // return { list: [], totalRecordCount };
  },
);

// fetch current tokenRate
export const fetchTokensPriceAsync = createAsyncThunk(
  'fetchTokensPriceAsync',
  async ({ symbols = ['ELF', 'CPU'] }: { symbols?: string[] }, { getState, dispatch }) => {
    const {
      assets: {
        accountToken: { accountTokenList },
      },
    } = getState() as { assets: AssetsStateType };
    // const {
    //   accountAssets: { totalRecordCount, accountAssetsList },
    // } = assets;

    const response = await fetchTokenPrices({ symbols: symbols || accountTokenList.map(ele => ele.symbol) });

    return { list: response.items };

    // return { list: [], totalRecordCount };
  },
);

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    clearState: state => (state = initialState),
    addTokenInCurrentAccount: (state, action: PayloadAction<{}>) => {},
    deleteTokenInCurrentAccount: (state, action: PayloadAction<{}>) => {},
    clearMarketToken: (state, action: PayloadAction<any>) => {},
    clearAssets: (state, action: PayloadAction<any>) => {
      state = initialState;
    },
    clearNftItem: (state, action: PayloadAction<any>) => {
      const symbol = action.payload;
      if (symbol) {
        const newAccountNFTList = state.accountNFT.accountNFTList.map(item => {
          if (item.symbol === symbol) {
            return {
              ...item,
              skipCount: 0,
              maxResultCount: 9,
              totalRecordCount: 0,
              children: [],
            };
          }
          return item;
        });
        state.accountNFT.accountNFTList = newAccountNFTList;
      } else {
        const newAccountNFTList = state.accountNFT.accountNFTList.map(item => ({
          ...item,
          skipCount: 0,
          maxResultCount: 9,
          totalRecordCount: 0,
          children: [],
        }));
        state.accountNFT.accountNFTList = newAccountNFTList;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTokenListAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchTokenListAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;

        // calc total;
        let totalBalance: number = 0;
        list.map((ele: any) => {
          totalBalance += ele.amountUsd;
        });

        state.accountBalance = totalBalance;

        // state.accountToken.accountTokenList = [...state.accountToken.accountTokenList, ...list];
        state.accountToken.accountTokenList = list;
        state.accountToken.skipCount = state.accountToken.accountTokenList.length;
        state.accountToken.totalRecordCount = totalRecordCount;
        state.accountToken.isFetching = false;
      })
      .addCase(fetchTokenListAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchNFTCollectionsAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchNFTCollectionsAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;
        const newAccountList: NFTCollectionItemShowType[] = list.map(item => ({
          isFetching: false,
          skipCount: 0,
          maxResultCount: 9,
          totalRecordCount: 0,
          children: [],
          ...item,
        }));
        state.accountNFT.accountNFTList = newAccountList;
        // state.accountNFT.accountNFTList = [...state.accountNFT.accountNFTList, ...newAccountList];
        // state.accountNFT.skipCount = state.accountNFT.accountNFTList.length;
        state.accountNFT.totalRecordCount = totalRecordCount;
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTCollectionsAsync.rejected, state => {})
      .addCase(fetchNFTAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchNFTAsync.fulfilled, (state, action) => {
        if (!action.payload) return;
        const { list, totalRecordCount, symbol } = action.payload;
        const currentNFTSeriesItem = state.accountNFT.accountNFTList.find(ele => ele.symbol === symbol);
        if (!currentNFTSeriesItem) return;
        // if (!currentNFTSeriesItem?.children) currentNFTSeriesItem.children = [];

        currentNFTSeriesItem.children = [...currentNFTSeriesItem?.children, ...list];
        currentNFTSeriesItem.skipCount = currentNFTSeriesItem.children.length;
        currentNFTSeriesItem.totalRecordCount = totalRecordCount;
        currentNFTSeriesItem.isFetching = false;
      })
      .addCase(fetchNFTAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchAssetAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchAssetAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;

        state.accountAssets.accountAssetsList = list as AccountAssets;
        // state.accountAssets.accountAssetsList = [...state.accountAssets.accountAssetsList, ...list];
        state.accountAssets.skipCount = state.accountAssets.accountAssetsList.length;
        state.accountAssets.totalRecordCount = totalRecordCount;
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchTokensPriceAsync.pending, state => {
        state.accountToken.isFetching = true;
      })
      .addCase(fetchTokensPriceAsync.fulfilled, (state, action) => {
        const { list } = action.payload;

        list.map(ele => {
          state.tokenPrices.tokenPriceObject[ele?.symbol] = ele?.priceInUsd;
        });
        // state.accountAssets.accountAssetsList = [...state.accountAssets.accountAssetsList, ...list];
        state.accountAssets.skipCount = state.accountAssets.accountAssetsList.length;
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchTokensPriceAsync.rejected, state => {
        state.accountToken.isFetching = false;
      });
  },
});

export const { addTokenInCurrentAccount, clearNftItem } = assetsSlice.actions;

export default assetsSlice;
