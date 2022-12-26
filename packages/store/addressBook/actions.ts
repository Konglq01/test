import { createAction } from '@reduxjs/toolkit';
import type { ChainItemType } from '@portkey/types/chain';
import type { AddressBookItem } from '@portkey/types/addressBook';
import type { UpdateType } from '@portkey/types';

export const addressBookUpdate = createAction<{
  addressBook: AddressBookItem;
  type: UpdateType;
  currentChain: ChainItemType;
}>('addressBook/updateCurrentChainAddressBook');

export const resetAddressBook = createAction('addressBook/resetAddressBook');
