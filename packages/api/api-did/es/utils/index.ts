import { request } from '@portkey/api/api-did';

export const getContactList = (
  baseUrl: string,
  { userId, page, size, modificationTime }: { userId?: string; page: number; size: number; modificationTime: string },
) => {
  return request.es.getContactList({
    baseURL: baseUrl,
    params: {
      // TODO: add userId filter
      filter: `modificationTime: [0 TO ${modificationTime}] AND isDeleted: false`,
      sort: 'modificationTime',
      sortType: 0,
      skipCount: (page - 1) * size,
      maxResultCount: size,
    },
  });
};

export const getContactEventList = (
  baseUrl: string,
  { userId, modificationTime, fetchTime }: { userId?: string; modificationTime: string; fetchTime: string },
) => {
  return request.es.getContactList({
    baseURL: baseUrl,
    params: {
      // TODO: add userId filter
      filter: `modificationTime: [${modificationTime} TO ${fetchTime}]`,
      sort: 'modificationTime',
      sortType: 0,
    },
  });
};
