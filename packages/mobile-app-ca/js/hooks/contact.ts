import { request } from '@portkey/api/api-did';
import { apiTarget } from '@portkey/api/api-did/contact';
import { CheckContactNameResponseType } from '@portkey/api/api-did/contact/type';
import { customFetch } from '@portkey/utils/fetch';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { AddContactItemApiType, ContactItemType, EditContactItemApiType } from '@portkey/types/types-ca/contact';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { addContractAction, deleteContractAction, editContractAction } from '@portkey/store/store-ca/contact/actions';

export const useAddContact = () => {
  const dispatch = useAppDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: AddContactItemApiType): Promise<ContactItemType> => {
      const response = await request.contact.addContact({
        baseURL: currentNetworkInfo.apiUrl,
        params: contactItem,
      });
      dispatch(addContractAction(response));
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useEditContact = () => {
  const dispatch = useAppDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: EditContactItemApiType): Promise<ContactItemType> => {
      const response = await customFetch(`${currentNetworkInfo.apiUrl}${apiTarget.editContact}/${contactItem.id}`, {
        params: contactItem,
        method: 'PUT',
      });
      dispatch(editContractAction(response));
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useDeleteContact = () => {
  const dispatch = useAppDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: EditContactItemApiType): Promise<ContactItemType> => {
      const response = await customFetch(`${currentNetworkInfo.apiUrl}${apiTarget.editContact}/${contactItem.id}`, {
        method: 'DELETE',
      });
      dispatch(deleteContractAction(response));
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useCheckContactName = () => {
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    (contactName: string): Promise<CheckContactNameResponseType> => {
      return request.contact.checkContactName({
        baseURL: currentNetworkInfo.apiUrl,
        params: {
          name: contactName,
        },
      });
    },
    [currentNetworkInfo.apiUrl],
  );
};
