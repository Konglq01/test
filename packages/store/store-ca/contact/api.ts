import { CONTACT_API_FETCH_SIZE } from '@portkey/constants/contact';
import {
  getContactList as getContactListEs,
  getContactEventList as getContactEventListEs,
} from '@portkey/api/api-did/es/utils';
import { GetContractListApiType } from '@portkey/types/types-ca/contact';

export const getContactList = async ({
  baseUrl,
  userId,
  page,
  size = CONTACT_API_FETCH_SIZE,
  modificationTime,
}: {
  baseUrl: string;
  userId: string;
  page: number;
  size: number;
  modificationTime: number;
}): Promise<GetContractListApiType> => {
  try {
    const response = await getContactListEs(baseUrl, {
      userId,
      page,
      size,
      modificationTime: new Date(modificationTime).toISOString(),
    });
    console.log('response', response);
    return response;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};

export const getContactEventList = async ({
  baseUrl,
  userId,
  modificationTime,
  fetchTime,
}: {
  baseUrl: string;
  userId: string;
  modificationTime: number;
  fetchTime: number;
}): Promise<GetContractListApiType> => {
  try {
    const response = await getContactEventListEs(baseUrl, {
      userId,
      modificationTime: new Date(modificationTime).toISOString(),
      fetchTime: new Date(fetchTime).toISOString(),
    });
    console.log('response', response);
    return response;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
