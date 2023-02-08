import {
  ContactIndexType,
  ContactItemType,
  ContactMapType,
  GetContractListApiType,
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

const OTHER_INDEX = 26;
export const transContactsToIndexes = (contacts: ContactItemType[]) => {
  // A~Z & #
  const contactIndexList: ContactIndexType[] = new Array(27).fill('').map((_, i) => {
    const index = i === OTHER_INDEX ? '#' : String.fromCharCode(charCodeOfA + i);
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

export const executeEventToContactIndexList = (
  contactIndexList: ContactIndexType[],
  eventList: ContactItemType[],
): ContactIndexType[] => {
  eventList.forEach(event => {
    if (event.isDeleted) {
      // Delete
      for (let i = 0; i < contactIndexList.length; i++) {
        const contactIndex = contactIndexList[i];
        const contactIdx = contactIndex.contacts.findIndex(contact => contact.id === event.id);
        if (contactIdx !== -1) {
          contactIndex.contacts.splice(contactIdx, 1);
          break;
        }
      }
    } else {
      const contactIndex = contactIndexList.find(item => item.index === event.index);
      if (contactIndex === undefined) return;
      const contactIdx = contactIndex.contacts.findIndex(item => item.id === event.id);
      if (contactIdx === -1) {
        // Add
        contactIndex.contacts.push(event);
      } else {
        contactIndex.contacts[contactIdx] = event;
      }
    }
  });

  return contactIndexList;
};

// TODO: delete test data
const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@$ ';

const getRandomChar = () => {
  return randomChars[Math.floor(Math.random() * randomChars.length)];
};

// export const getMockContact = (indexContactLength: number = 250): ContactItemType[] =>
//   Array(27)
//     .fill('')
//     .map((_, i) => {
//       const index = i === 26 ? '#' : String.fromCharCode(charCodeOfA + i);
//       return Array(i === 1 ? 0 : indexContactLength)
//         .fill('')
//         .map((__, itemIdx) => ({
//           id: `${index}${itemIdx}`,
//           name: `${index}~${getRandomChar()}${getRandomChar()}${getRandomChar()}${getRandomChar()}`,
//           index,
//           isDeleted: false,
//           modificationTime: Date.now() - 1000000,
//           addresses: [
//             {
//               id: `${index}${itemIdx}_addr_1`,
//               chainId: 'AELF',
//               address: 'ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B',
//               chainType: 'TESTNET' as any,
//             },
//             {
//               id: `${index}${itemIdx}_addr_2`,
//               chainId: 'AELF',
//               address: 'ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B',
//               chainType: 'TESTNET' as any,
//             },
//           ],
//         }));
//     })
//     .reduce((pre, cv) => pre.concat(cv));

// const _indexContactLength = 25;
// const originData = getMockContact(_indexContactLength);
// export const mockFetchContractList = (page: number, size: number): Promise<GetContractListApiType> => {
//   console.log('mockFetchContractList', page, size);

//   const offset = (page - 1) * size;
//   const response: GetContractListApiType = originData.slice(offset, offset + size);

//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(response);
//     }, 200);
//   });
// };

// export const mockGetContactEventList = (startTime: number): Promise<GetContractListApiType> => {
//   console.log('mockGetContactEventList, startTime=', startTime);
//   const response: GetContractListApiType = [];

//   // add
//   const addId = 'A_' + Date.now();
//   response.push({
//     ...originData[0],
//     name: 'A_Add_' + addId.slice(2, 6),
//     id: addId,
//     modificationTime: startTime - 10,
//   });

//   // update
//   console.log('update contact:', JSON.stringify(originData[1]));
//   response.push({
//     ...originData[0],
//     name: 'A_testUpdate',
//     modificationTime: startTime - 10,
//   });

//   // delete
//   console.log('delete contact:', JSON.stringify(originData[2]));
//   response.push({
//     ...originData[1],
//     isDeleted: true,
//   });

//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(response);
//     }, 500);
//   });
// };
