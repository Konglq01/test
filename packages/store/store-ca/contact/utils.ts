import { ContactIndexType, ContactItemType, ContactMapType } from '@portkey/types/types-ca/contact';

type IContactIdMap = Record<string, ContactItemType>;
const CHAR_CODE_A = 'A'.charCodeAt(0);
const OTHER_INDEX = 26;

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

const getIndexFromChar = (char: string) => {
  return char === '#' ? OTHER_INDEX : char.charCodeAt(0) - CHAR_CODE_A;
};

const getInitContactIndexList = (): ContactIndexType[] => {
  // A~Z & #
  return new Array(27).fill('').map((_, i) => {
    const index = i === OTHER_INDEX ? '#' : String.fromCharCode(CHAR_CODE_A + i);
    return {
      index,
      contacts: [],
    };
  });
};

export const transContactsToIndexes = (contacts: ContactItemType[]) => {
  const contactIndexList: ContactIndexType[] = getInitContactIndexList();
  contacts.forEach(contact => {
    const idx = getIndexFromChar(contact.index);
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

export const getContactIdMap = (contactIndexList: ContactIndexType[]) => {
  const contactIdMap: IContactIdMap = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contactItem => {
      contactIdMap[contactItem.id] = contactItem;
    });
  });
  return contactIdMap;
};

export const executeEventToContactIndexList = (
  contactIndexList: ContactIndexType[],
  eventList: ContactItemType[],
): ContactIndexType[] => {
  const contactIdMap = getContactIdMap(contactIndexList);
  eventList.forEach(event => {
    const contactIndex = contactIndexList[getIndexFromChar(event.index)];
    if (!contactIdMap[event.id]) {
      //ADD
      contactIdMap[event.id] = event;
      contactIndex.contacts.push(event);
      return;
    }

    const contactItemIndex = contactIndex.contacts.findIndex(item => item.id === event.id);
    if (event.isDeleted) {
      // Delete
      delete contactIdMap[event.id];
      contactIndex.contacts.splice(contactItemIndex, 1);
      return;
    }

    // Edit
    const preContactItem = contactIdMap[event.id];
    if (preContactItem.modificationTime > event.modificationTime) {
      console.log('expired event:', {
        event,
        contactIndex,
        contactItemIndex,
      });
      return;
    }

    if (preContactItem.index !== event.index) {
      // delete preContactItem & add event
      const preContactIndex = contactIndexList[getIndexFromChar(preContactItem.index)];
      const preContactItemIndex = preContactIndex.contacts.findIndex(item => item.id === preContactItem.id);
      preContactIndex.contacts.splice(preContactItemIndex, 1);
      contactIndex.contacts.push(event);
    } else {
      // replace contactItem
      contactIndex.contacts[contactItemIndex] = event;
    }
    contactIdMap[event.id] = event;
  });

  return contactIndexList;
};
