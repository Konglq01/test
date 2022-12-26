import { CONTACT_EVENT_TYPE } from '@portkey/constants/contact';
import {
  ContactEventItem,
  ContactIndexType,
  ContactItemType,
  ContactMapType,
  FetchContractListApiType,
  GetContactEventListApiType,
} from '@portkey/types/types-ca/contact';

const charCodeOfA = 'A'.charCodeAt(0);

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

export const transContactsToIndexes = (contacts: ContactItemType[]) => {
  // A~Z & #
  const contactIndexList: ContactIndexType[] = new Array(27).fill('').map((_, i) => {
    const index = i === 26 ? '#' : String.fromCharCode(charCodeOfA + i);
    return {
      index,
      contacts: [],
    };
  });
  contacts.forEach(contact => {
    if (contact.index === '#') {
      contactIndexList[26].contacts.push(contact);
      return;
    }
    const idx = contact.index.charCodeAt(0) - charCodeOfA;
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

export const aggregateEvent = (eventList: ContactEventItem[]): ContactEventItem[] => {
  const eventMap: { [key: string]: ContactEventItem } = {};
  eventList.forEach(event => {
    if (eventMap[event.contactId]) {
      if (eventMap[event.contactId].type !== CONTACT_EVENT_TYPE.Delete) {
        eventMap[event.contactId] = event;
      }
    } else {
      eventMap[event.contactId] = event;
    }
  });
  return Object.values(eventMap);
};

export const executeEventToContactIndexList = (
  contactIndexList: ContactIndexType[],
  eventList: ContactEventItem[],
): ContactIndexType[] => {
  eventList.forEach(event => {
    if (event.type === CONTACT_EVENT_TYPE.Delete) {
      // Delete
      for (let i = 0; i < contactIndexList.length; i++) {
        const contactIndex = contactIndexList[i];
        const contactIdx = contactIndex.contacts.findIndex(contact => contact.id === event.contactId);
        if (contactIdx !== -1) {
          contactIndex.contacts.splice(contactIdx, 1);
          break;
        }
      }
    } else {
      if (event.contact === undefined) return;
      const contactIndex = contactIndexList.find(item => item.index === event.contact?.index);
      if (contactIndex === undefined) return;
      if (event.type === CONTACT_EVENT_TYPE.Add) {
        // Add
        contactIndex.contacts.push(event.contact);
      } else {
        // Update
        const contactIdx = contactIndex.contacts.findIndex(item => item.id === event.contactId);
        if (contactIdx !== -1) {
          contactIndex.contacts[contactIdx] = event.contact;
        }
      }
    }
  });

  return contactIndexList;
};

// TODO: delete test data
const randomChars = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '_',
  '@',
  '$',
  ' ',
];

const plugZeroToString = (num: number, length: number = 6) => {
  return (Array(length).join('0') + num).slice(-length);
};

const getRandomChar = () => {
  return randomChars[Math.floor(Math.random() * randomChars.length)];
};

export const getMockContact = (indexContactLength: number = 250): ContactItemType[] =>
  Array(27)
    .fill('')
    .map((_, i) => {
      const index = i === 26 ? '#' : String.fromCharCode(charCodeOfA + i);
      return Array(i === 1 ? 0 : indexContactLength)
        .fill('')
        .map((__, itemIdx) => ({
          id: `${index}${itemIdx}`,
          name: `${index}${getRandomChar()}${getRandomChar()}${getRandomChar()}${getRandomChar()}`,
          index,
          isDelete: false,
          addresses: [
            {
              id: `${index}${itemIdx}_addr_1`,
              chainId: 'AELF',
              address: 'ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B',
              chainType: 'TESTNET' as any,
            },
            {
              id: `${index}${itemIdx}_addr_2`,
              chainId: 'AELF',
              address: 'ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B',
              chainType: 'TESTNET' as any,
            },
          ],
        }));
    })
    .reduce((pre, cv) => pre.concat(cv));

const _indexContactLength = 25;
const originData = getMockContact(_indexContactLength);
export const mockFetchContractList = (page: number, size: number): Promise<FetchContractListApiType> => {
  console.log('mockFetchContractList', page, size);

  const offset = (page - 1) * size;
  const response: FetchContractListApiType = originData.slice(offset, offset + size);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, 200);
  });
};

export const mockGetContactEventList = (startTime: number): Promise<GetContactEventListApiType> => {
  console.log('mockGetContactEventList, startTime=', startTime);
  const response: GetContactEventListApiType = [];

  // add
  // const addId = 'A_' + Date.now();
  // response.push({
  //   type: CONTACT_EVENT_TYPE.Add,
  //   contactId: addId,
  //   updateTime: Date.now(),
  //   contact: {
  //     ...originData[0],
  //     name: 'A_testAdd',
  //     id: addId,
  //   },
  // });
  // update
  // console.log('update contact:', JSON.stringify(originData[1]));
  // response.push({
  //   type: CONTACT_EVENT_TYPE.Update,
  //   contactId: originData[1].id,
  //   updateTime: Date.now(),
  //   contact: {
  //     ...originData[0],
  //     name: 'A_testUpdate',
  //   },
  // });

  // delete
  // console.log('delete contact:', JSON.stringify(originData[2]));
  // response.push({
  //   type: CONTACT_EVENT_TYPE.Delete,
  //   contactId: originData[2].id,
  //   updateTime: Date.now(),
  // });

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, 500);
  });
};
