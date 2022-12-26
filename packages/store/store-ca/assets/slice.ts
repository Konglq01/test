import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TokenBaseItemType,
  RateBaseType,
  NFTBaseItemType,
  NFTSeriesBaseItemType,
} from '@portkey/types/types-ca/assets';
import { fetchAssetList, fetchNFTSeriesList, fetchNFTList, fetchTokenList } from './api';

// asset = token + nft
export type AssetsStateType = {
  accountToken: {
    isFetching: boolean;
    SkipCount: number;
    MaxResultCount: number;
    accountTokenList: TokenBaseItemType[];
    totalCount: number;
  };
  accountNFT: {
    isFetching: boolean;
    SkipCount: number;
    MaxResultCount: number;
    accountNFTList: NFTSeriesBaseItemType[];
    totalCount: number;
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
    SkipCount: number;
    MaxResultCount: number;
    accountAssetsList: (TokenBaseItemType | NFTBaseItemType)[];
    totalCount: number;
  };
};

const initialState: AssetsStateType = {
  accountToken: {
    isFetching: false,
    SkipCount: 0,
    MaxResultCount: 10,
    accountTokenList: [],
    totalCount: 0,
  },
  accountNFT: {
    isFetching: false,
    SkipCount: 0,
    MaxResultCount: 10,
    accountNFTList: [],
    totalCount: 0,
  },
  accountAssets: {
    isFetching: false,
    SkipCount: 0,
    MaxResultCount: 10,
    accountAssetsList: [],
    totalCount: 0,
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
  async ({ type }: { type: any }, { getState, dispatch }) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountToken: { totalCount, accountTokenList },
    } = assets;

    if (totalCount === 0 || totalCount > accountTokenList.length) {
      const response = await fetchTokenList({ networkType: type, pageNo: 1, pageSize: 1000 });

      return { type, list: response.data.items, totalCount: response.data.totalCount };
    }

    return { type, list: [], totalCount };
  },
);

// fetch nftSeriesList on Dashboard
export const fetchNFTSeriesAsync = createAsyncThunk(
  'fetchNFTSeriesAsync',
  async ({ type }: { type: any }, { getState, dispatch }) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { totalCount, accountNFTList },
    } = assets;

    if (totalCount === 0 || totalCount > accountNFTList.length) {
      const response = await fetchNFTSeriesList({ networkType: type, pageNo: 1, pageSize: 1000 });
      return { type, list: response.data.list, totalCount: response.data.count };
    }

    return { type, list: [], totalCount };
  },
);

// fetch current nftSeries on Dashboard

export const fetchNFTAsync = createAsyncThunk(
  'fetchNFTsAsync',
  async ({ type, id }: { type: any; id: string }, { getState, dispatch }) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { totalCount, accountNFTList },
    } = assets;

    if (totalCount === 0 || totalCount > accountNFTList.length) {
      const response = await fetchNFTList({ networkType: type, pageNo: 1, pageSize: 1000, id });
      return { type, list: response.data.list, totalCount: response.data.count };
    }

    return { type, list: [], totalCount, id };
  },
);

// fetch current assets when add sent button
export const fetchAssetAsync = createAsyncThunk(
  'fetchAssetsAsync',
  async ({ type }: { type: any }, { getState, dispatch }) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountAssets: { totalCount, accountAssetsList },
    } = assets;

    if (totalCount === 0 || totalCount > accountAssetsList.length) {
      const response = await fetchAssetList({ networkType: type, pageNo: 1, pageSize: 1000 });
      return { type, list: response.data.list, totalCount: response.data.count };
    }

    return { type, list: [], totalCount };
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
        const { type, list, totalCount } = action.payload;

        // calc total;
        let totalBalance: number = 0;
        list.map((ele: any) => {
          totalBalance += ele.amountUsd;
        });

        state.accountBalance = totalBalance;

        // state.accountToken.accountTokenList = [...state.accountToken.accountTokenList, ...list];
        state.accountToken.accountTokenList = list;
        state.accountToken.SkipCount = state.accountToken.accountTokenList.length;
        state.accountToken.totalCount = totalCount;
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
        const { type, list, totalCount } = action.payload;

        state.accountNFT.accountNFTList = [...state.accountNFT.accountNFTList, ...list];
        state.accountNFT.SkipCount = state.accountNFT.accountNFTList.length;
        state.accountNFT.totalCount = totalCount;
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTSeriesAsync.rejected, state => {})
      .addCase(fetchNFTAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchNFTAsync.fulfilled, (state, action) => {
        const { type, list, totalCount, id } = action.payload;

        const currentNFTSeriesItem = state.accountNFT.accountNFTList.find(ele => ele.id === id);
        if (!currentNFTSeriesItem) return;
        if (!currentNFTSeriesItem?.children) currentNFTSeriesItem.children = [];

        currentNFTSeriesItem.children = [...currentNFTSeriesItem?.children, list];
        currentNFTSeriesItem.SkipCount = currentNFTSeriesItem.children.length;
        currentNFTSeriesItem.totalCount = totalCount;
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
        const { type, list, totalCount } = action.payload;

        state.accountAssets.accountAssetsList = [...state.accountAssets.accountAssetsList, ...list];
        state.accountAssets.SkipCount = state.accountAssets.accountAssetsList.length;
        state.accountAssets.totalCount = totalCount;
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetAsync.rejected, state => {
        state.accountToken.isFetching = false;
      });
  },
});

export const { addTokenInCurrentAccount } = assetsSlice.actions;

export default assetsSlice;
