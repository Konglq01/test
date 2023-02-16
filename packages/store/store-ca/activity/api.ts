import { request } from '@portkey/api/api-did';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { IActivityApiParams, IActivitysApiParams, IActivitysApiResponse } from './type';

export function fetchActivities(params: IActivitysApiParams): Promise<IActivitysApiResponse> {
  try {
    return request.activity.activityList({
      params: params,
    });
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
}

export function fetchActivity(params: IActivityApiParams): Promise<ActivityItemType> {
  try {
    return request.activity.activity({
      params: params,
    });
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
}
