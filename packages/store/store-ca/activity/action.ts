import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivities } from './api';
import { ActivityStateType, IActivitiesApiParams } from './type';

export const setActivityListAction = createAction<any>('activity/setActivityListAction');
export const setActivityAction = createAction<any>('activity/setActivityAction');

export const getActivityListAsync = createAsyncThunk(
  'activity/getActivityList',
  async (params: IActivitiesApiParams, { getState, dispatch }): Promise<ActivityStateType> => {
    const { activity } = getState() as { activity: ActivityStateType };
    const response = await fetchActivities(params).catch(error => {
      if (error?.type) throw Error(error.type);
      if (error?.error?.message) throw Error(error.error.message);
      throw Error(JSON.stringify(error));
    });
    if (!response?.data || !response?.totalRecordCount) throw Error('No data');

    return {
      ...activity,
      data: response.data,
      totalRecordCount: response.totalRecordCount,
      maxResultCount: params.maxResultCount,
      skipCount: params.skipCount,
    };
  },
);
