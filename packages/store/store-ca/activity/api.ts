// import { ActivityItemType } from '@portkey/types/types-ca/activity';

import { request } from '@portkey/api/api-did';
import { IActivitysApiParams } from './type';

export function fetchActivities(params: IActivitysApiParams): Promise<any> {
  try {
    return request.activity.activityList({
      // baseURL: baseUrl,
      params: params,
    });
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
}
