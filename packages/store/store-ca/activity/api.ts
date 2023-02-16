import { request } from '@portkey/api/api-did';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { IActivityApiParams, IActivitysApiParams, IActivitysApiResponse } from './type';

export function fetchActivities(params: IActivitysApiParams): Promise<IActivitysApiResponse> {
  return request.activity.activityList({
    params: params,
  });
}

export function fetchActivity(params: IActivityApiParams): Promise<ActivityItemType> {
  return request.activity.activity({
    params: params,
  });
}
