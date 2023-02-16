import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RateBaseType, NFTBaseItemType, NFTSeriesBaseItemType } from '@portkey/types/types-ca/assets';
import { fetchAssetList, fetchNFTSeriesList, fetchNFTList, fetchTokenList } from './api';
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
    accountNFTList: NFTSeriesBaseItemType[];
    totalRecordCount: number;
  };
  tokenRate: {
    isFetching: boolean;
    tokenRateObject: {
      [symbol: string]: RateBaseType;
    };
  };
  accountBalance: number;
  accountAssets: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountAssetsList: AccountAssets;
    totalRecordCount: number;
  };
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
  tokenRate: {
    isFetching: false,
    tokenRateObject: {},
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
export const fetchNFTSeriesAsync = createAsyncThunk(
  'fetchNFTSeriesAsync',
  async (
    {
      caAddresses,
      skipCount = 0,
      maxResultCount = 1000,
    }: {
      caAddresses: string[];
      skipCount: number;
      maxResultCount: number;
    },
    { getState, dispatch },
  ) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { totalRecordCount, accountNFTList },
    } = assets;
    // if (totalRecordCount === 0 || totalRecordCount > accountNFTList.length) {
    const response = await fetchNFTSeriesList({ caAddresses, skipCount, maxResultCount });
    return { list: response.data, totalRecordCount: response.totalRecordCount };
    // }

    return { list: [], totalRecordCount };
  },
);

// fetch current nftSeries on Dashboard

export const fetchNFTAsync = createAsyncThunk(
  'fetchNFTsAsync',
  async ({ type, id }: { type: any; id: string }, { getState, dispatch }) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { totalRecordCount, accountNFTList },
    } = assets;

    if (totalRecordCount === 0 || totalRecordCount > accountNFTList.length) {
      const response = await fetchNFTList({ networkType: type, pageNo: 1, pageSize: 1000, id });
      return { list: response.data, totalRecordCount: response.totalRecordCount };
    }

    return { type, list: [], totalRecordCount, id };
  },
);

// fetch current assets when add sent button
export const fetchAssetAsync = createAsyncThunk(
  'fetchAssetsAsync',
  async ({ caAddresses, keyWord }: { caAddresses: string[]; keyWord: string }, { getState, dispatch }) => {
    // const { assets } = getState() as { assets: AssetsStateType };
    // const {
    //   accountAssets: { totalRecordCount, accountAssetsList },
    // } = assets;

    // if (totalRecordCount === 0 || totalRecordCount > accountAssetsList.length) {
    const response = await fetchAssetList({ caAddresses, keyWord, skipCount: 1, maxResultCount: 1000 });

    return { list: response.data, totalRecordCount: response.totalRecordCount };
    // }

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
      .addCase(fetchNFTSeriesAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchNFTSeriesAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;

        state.accountNFT.accountNFTList = [...state.accountNFT.accountNFTList, ...list];
        state.accountNFT.skipCount = state.accountNFT.accountNFTList.length;
        state.accountNFT.totalRecordCount = totalRecordCount;
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTSeriesAsync.rejected, state => {})
      .addCase(fetchNFTAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchNFTAsync.fulfilled, (state, action) => {
        const { type, list, totalRecordCount, id } = action.payload;

        const currentNFTSeriesItem = state.accountNFT.accountNFTList.find(ele => ele.id === id);
        if (!currentNFTSeriesItem) return;
        if (!currentNFTSeriesItem?.children) currentNFTSeriesItem.children = [];

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

        state.accountAssets.accountAssetsList = list;
        // state.accountAssets.accountAssetsList = [...state.accountAssets.accountAssetsList, ...list];
        state.accountAssets.skipCount = state.accountAssets.accountAssetsList.length;
        state.accountAssets.totalRecordCount = totalRecordCount;
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetAsync.rejected, state => {
        state.accountToken.isFetching = false;
      });
  },
});

export const { addTokenInCurrentAccount } = assetsSlice.actions;

export default assetsSlice;
