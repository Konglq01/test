import { request } from '@portkey-wallet/api/api-did';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { IActivityApiParams, IActivitiesApiParams, IActivitiesApiResponse } from './type';

export function fetchActivities(params: IActivitiesApiParams): Promise<IActivitiesApiResponse> {
  return request.activity.activityList({
    params: params,
  });
}

export function fetchActivity(params: IActivityApiParams): Promise<ActivityItemType> {
  return request.activity.activity({
    params: params,
  });
}
