import { BaseConfig } from '../../types';

const BASE_URL = `/api/app/contacts`;
const KeyList = ['addContact', 'editContact', 'deleteContact', 'checkContactName'] as const;

export const apiTarget: Record<typeof KeyList[number], string> = {
  addContact: `${BASE_URL}`,
  editContact: `${BASE_URL}`,
  deleteContact: `${BASE_URL}`,
  checkContactName: `${BASE_URL}/exist`,
};

const ApiObject: Record<typeof KeyList[number], BaseConfig> = {
  addContact: {
    target: apiTarget.addContact,
    config: { method: 'POST' },
  },
  editContact: {
    target: apiTarget.editContact,
    config: { method: 'PUT' },
  },
  deleteContact: {
    target: apiTarget.deleteContact,
    config: { method: 'DELETE' },
  },
  checkContactName: {
    target: apiTarget.checkContactName,
    config: { method: 'GET' },
  },
};

export default ApiObject;
