import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivities } from './api';
import { ActivityStateType, IActivitysApiParams } from './type';

export const setActivityListAction = createAction<any>('activity/setActivityListAction');
export const setActivityAction = createAction<any>('activity/setActivityAction');

export const getActivityListAsync = createAsyncThunk(
  'activity/getActivityList',
  async (params: IActivitysApiParams, { dispatch }): Promise<ActivityStateType> => {
    const response = await fetchActivities(params);
    if (!response?.data || !response?.totalRecordCount) throw Error('No data');

    return {
      data: response.data,
      totalRecordCount: response.totalRecordCount,
      maxResultCount: params.maxResultCount,
      skipCount: params.skipCount,
    };
  },
);
