import { customFetch } from '@portkey/utils/fetch';
// import { baseUrl, contactApi } from '@portkey/api';
import { mockFetchContractList, mockGetContactEventList } from './utils';
import { CONTACT_API_FETCH_SIZE } from '@portkey/constants/contact';

export const fetchContactList = async (page: number, size: number = CONTACT_API_FETCH_SIZE) => {
  try {
    // const data = await customFetch(`${baseUrl}${contactApi.fetchContactList}`, {
    //   params: {},
    // });
    const response = await mockFetchContractList(page, size);

    if (Math.random() > 0.7) {
      throw Error('mock error: fetchContactList');
    }

    return response;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};

export const getContactEventList = async (lastModified: number) => {
  try {
    // const data = await customFetch(`${baseUrl}${contactApi.getContactEventList}`, {
    //   params: {},
    // });
    const response = await mockGetContactEventList(lastModified);
    if (Math.random() > 0.85) {
      throw Error('mock error: getContactEventList');
    }

    return response;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
