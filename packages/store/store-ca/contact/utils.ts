import { ContactIndexType, ContactItemType, ContactMapType } from '@portkey/types/types-ca/contact';

const CHAR_CODE_A = 'A'.charCodeAt(0);

export const transIndexesToContactMap = (contactIndexList: ContactIndexType[]) => {
  const contactMap: ContactMapType = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contact => {
      const addressList = Array.from(new Set(contact.addresses.map(addressItem => addressItem.address)));
      addressList.forEach(address => {
        if (contactMap[address]) contactMap[address].push(contact);
        else contactMap[address] = [contact];
      });
    });
  });
  return contactMap;
};

const OTHER_INDEX = 26;
export const transContactsToIndexes = (contacts: ContactItemType[]) => {
  // A~Z & #
  const contactIndexList: ContactIndexType[] = new Array(27).fill('').map((_, i) => {
    const index = i === OTHER_INDEX ? '#' : String.fromCharCode(CHAR_CODE_A + i);
    return {
      index,
      contacts: [],
    };
  });
  contacts.forEach(contact => {
    if (contact.index === '#') {
      contactIndexList[OTHER_INDEX].contacts.push(contact);
      return;
    }
    const idx = contact.index.charCodeAt(0) - CHAR_CODE_A;
    contactIndexList[idx].contacts.push(contact);
  });
  return contactIndexList;
};

export const sortContactIndexList = (contactIndexList: ContactIndexType[]) => {
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.sort((a, b) => a.name.localeCompare(b.name));
  });
  return contactIndexList;
};

export const executeEventToContactIndexList = (
  contactIndexList: ContactIndexType[],
  eventList: ContactItemType[],
): ContactIndexType[] => {
  eventList.forEach(event => {
    const { contactIndex, contactItemIndex } = findPathFromContactIndexList(contactIndexList, event);
    if (!contactIndex) return;
    if (event.isDeleted && contactItemIndex !== -1) {
      // Delete
      contactIndex.contacts.splice(contactItemIndex, 1);
    } else if (contactItemIndex === -1) {
      // Add
      contactIndex.contacts.push(event);
    } else if (event.modificationTime > contactIndex.contacts[contactItemIndex].modificationTime) {
      // Edit
      contactIndex.contacts[contactItemIndex] = event;
    } else {
      console.log('expired event:', {
        event,
        contactIndex,
        contactItemIndex,
      });
    }
  });

  return contactIndexList;
};

export const findPathFromContactIndexList = (
  contactIndexList: ContactIndexType[],
  contactItem: ContactItemType,
): { contactIndex?: ContactIndexType; contactItemIndex: number; contactItem?: ContactItemType } => {
  let contactItemIndex = -1,
    contactItemResult;
  const contactIndex = contactIndexList.find(item => item.index === contactItem.index);
  if (contactIndex !== undefined) {
    contactItemIndex = contactIndex.contacts.findIndex(item => item.id === contactItem.id);
    if (contactItemIndex !== -1) contactItemResult = contactIndex.contacts[contactItemIndex];
  }
  return {
    contactIndex,
    contactItemIndex,
    contactItem: contactItemResult,
  };
};
