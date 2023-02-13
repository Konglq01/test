import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivities } from './api';
import { ActivityStateType } from './slice';

export const setActivityListAction = createAction<any>('activity/setActivityListAction');

export const getActivityListAsync = createAsyncThunk(
  'activity/getActivityList',
  async (params: any, { getState, dispatch }) => {
    const { activity } = getState() as { activity: ActivityStateType };
    // const _networkType = type ? type : currentNetwork;
    // const baseUrl = NetworkList.find(item => item.networkType === _networkType)?.apiUrl;
    // if (!baseUrl) throw Error('Unable to obtain the corresponding network');

    const response = await fetchActivities(params);
    // if (!response?.items) throw Error('No data');
    // dispatch(setActivityListAction({ activity: response }));
    return [response];
  },
);

// export const fetchActivitiesAsync = createAsyncThunk(
//   '/api/app/user-activities',
//   async ({ type }: { type: NetworkType }, { getState, dispatch }) => {
//     const { activity } = getState() as { activity: ActivityStateType };
//     const state = activity;
//     const { skipCount, totalCount, MaxResultCount } = state;
//     if (skipCount < totalCount || totalCount === 0) {
//       dispatch(addPage(type));
//       const response = await fetchActivities({ start: skipCount, limit: MaxResultCount });
//       return { type, list: response.data.items, totalCount: response.data.total };
//     }
//     return { type, list: [], totalCount };
//   },
// );
