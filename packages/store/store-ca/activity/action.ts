import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivities, fetchActivity } from './api';
import { ActivityStateType, IActivityApiParams, IActivitysApiParams } from './type';

export const setActivityListAction = createAction<any>('activity/setActivityListAction');
export const setActivityAction = createAction<any>('activity/setActivityAction');

export const getActivityListAsync = createAsyncThunk(
  'activity/getActivityList',
  async (params: IActivitysApiParams): Promise<ActivityStateType> => {
    const response = await fetchActivities(params);
    console.log('activities response========', response);
    if (!response?.data || !response?.totalRecordCount) throw Error('No data');

    // dispatch(addPage(type));
    return {
      data: response.data,
      totalRecordCount: response.totalRecordCount,
      maxResultCount: params.maxResultCount,
      skipCount: params.skipCount,
    };
  },
);

export const getActivityAsync = createAsyncThunk(
  'activity/getActivity',
  async (params: IActivityApiParams): Promise<ActivityItemType> => {
    const response = await fetchActivity(params);
    console.log('activity response========', response);
    if (!response?.transactionId) throw Error('No data');
    // dispatch(setActivityAction({ activity: response }));
    return response;
  },
);
