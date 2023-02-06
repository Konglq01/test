import { guardiansSlice } from './slice';
import {
  resetGuardiansState,
  setVerifierListAction,
  setGuardiansAction,
  setCurrentGuardianAction,
  setUserGuardianStatus,
  setUserGuardianItemStatus,
  setPreGuardianAction,
  setOpGuardianAction,
  resetUserGuardianStatus,
  setUserGuardianSessionIdAction,
} from './actions';
import { VerifyStatus } from '@portkey/types/verifier';
const reducer = guardiansSlice.reducer;

const mockUserGuardiansListItem1 = {
  guardianAccount: '1@q.com',
  guardianType: 0,
  isLoginAccount: true,
  key: '1@q.com&Gauss',
  verifier: {
    endPoints: ['http://192.168.0.250:5555'],
    id: 'Gauss',
    imageUrl: 'https://x/Gauss.png',
    name: 'Gauss',
    verifierAddresses: ['5M5sG4'],
  },
};
const mockUserGuardiansListItem2 = {
  guardianAccount: '2@q.com',
  guardianType: 0,
  isLoginAccount: false,
  key: '2@q.com&Gauss',
  verifier: {
    endPoints: ['http://192.168.0.250:5555'],
    id: 'Gauss',
    imageUrl: 'https://x/Gauss.png',
    name: 'Gauss',
    verifierAddresses: ['5M5sG4'],
  },
};
const mockUserGuardiansListItem3 = {
  guardianAccount: '3@q.com',
  guardianType: 0,
  isLoginAccount: false,
  key: '3@q.com&Gauss',
  verifier: {
    endPoints: ['http://192.168.0.250:5555'],
    id: 'Gauss',
    imageUrl: 'https://x/Gauss.png',
    name: 'Gauss',
    verifierAddresses: ['5M5sG4'],
  },
};
const mockVerifierItem = {
  endPoints: ['http://192.168.0.250:5555'],
  id: 'Gauss',
  imageUrl: 'https://x/Gauss.png',
  name: 'Gauss',
  verifierAddresses: ['5M5sG4'],
};
const mockUserGuardianStatus = {
  '1@q.com&Gauss': {
    guardianAccount: '1@q.com',
    guardianType: 0,
    isLoginAccount: true,
    key: '1@q.com&Gauss',
    verifier: {
      endPoints: ['http://192.168.0.250:5555'],
      id: 'Gauss',
      imageUrl: 'https://x/Gauss.png',
      name: 'Gauss',
      verifierAddresses: ['5M5sG4'],
    },
  },
  '2@q.com&Minerva': {
    guardianAccount: '2@q.com',
    guardianType: 0,
    isLoginAccount: false,
    key: '2@q.com&Minerva',
    verifier: {
      endPoints: ['http://192.168.0.250:5577'],
      id: 'Minerva',
      imageUrl: 'https://x/Minerva.png',
      name: 'Minerva',
      verifierAddresses: ['3sWGDJ'],
    },
  },
};
const mockCurrentGuardian = {
  ...mockUserGuardiansListItem1,
};
const mockVerifierMap = {
  Gauss: { ...mockVerifierItem },
};
const mockGuardianAccounts = [
  {
    guardian: {
      type: 0,
      verifier: { id: 'Gauss' },
    },
    isLoginAccount: true,
    value: '1@q.com',
  },
  {
    guardian: {
      type: 0,
      verifier: { id: 'Gauss' },
    },
    isLoginAccount: false,
    value: '2@q.com',
  },
];

describe('resetGuardiansState', () => {
  test('state should contain only verifierMap', () => {
    const state = reducer(
      {
        currentGuardian: mockCurrentGuardian,
        verifierMap: mockVerifierMap,
      },
      resetGuardiansState(),
    );
    expect(Object.keys(state)).toHaveLength(1);
    expect(state).toHaveProperty('verifierMap');
  });
});

describe('setVerifierListAction', () => {
  test('action.payload is null, verifierMap should be an empty object', () => {
    expect(reducer({ verifierMap: mockVerifierMap }, setVerifierListAction(null))).toMatchObject({ verifierMap: {} });
  });
  test('action.payload exist', () => {
    expect(reducer({ verifierMap: {} }, setVerifierListAction([mockVerifierItem]))).toEqual({
      verifierMap: {
        Gauss: mockVerifierItem,
      },
    });
  });
});

describe('setGuardiansAction', () => {
  test('action.payload is null, userGuardiansList and userGuardianStatus will be reset', () => {
    expect(
      reducer(
        {
          userGuardiansList: [mockUserGuardiansListItem1],
          userGuardianStatus: mockUserGuardianStatus,
        },
        setGuardiansAction(null),
      ),
    ).toEqual({ userGuardiansList: [], userGuardianStatus: {} });
  });
  test('action.payload exist, userGuardianStatus exist', () => {
    expect(
      reducer(
        {
          verifierMap: mockVerifierMap,
          userGuardiansList: [],
          userGuardianStatus: {
            '3@q.com&Gauss': mockUserGuardiansListItem3,
          },
        },
        setGuardiansAction({
          loginGuardianAccountIndexes: [0],
          guardianAccounts: mockGuardianAccounts,
        }),
      ),
    ).toEqual({
      verifierMap: mockVerifierMap,
      userGuardiansList: [mockUserGuardiansListItem1, mockUserGuardiansListItem2],
      userGuardianStatus: {
        '1@q.com&Gauss': mockUserGuardiansListItem1,
        '2@q.com&Gauss': mockUserGuardiansListItem2,
        '3@q.com&Gauss': mockUserGuardiansListItem3,
        guardianExpiredTime: undefined,
      },
    });
  });
  test('action.payload exist, userGuardianStatus does not exist', () => {
    expect(
      reducer(
        {
          verifierMap: mockVerifierMap,
          userGuardiansList: [],
        },
        setGuardiansAction({
          loginGuardianAccountIndexes: [0],
          guardianAccounts: mockGuardianAccounts,
        }),
      ),
    ).toEqual({
      verifierMap: mockVerifierMap,
      userGuardiansList: [mockUserGuardiansListItem1, mockUserGuardiansListItem2],
      userGuardianStatus: {
        '1@q.com&Gauss': mockUserGuardiansListItem1,
        '2@q.com&Gauss': mockUserGuardiansListItem2,
        guardianExpiredTime: undefined,
      },
    });
  });
  test('action.payload exist, verifierMap is null, verifier of guardianItem will be undefined', () => {
    expect(
      reducer(
        {
          userGuardiansList: [],
        },
        setGuardiansAction({
          loginGuardianAccountIndexes: [0],
          guardianAccounts: mockGuardianAccounts,
        }),
      ),
    ).toEqual({
      guardianExpiredTime: undefined,
      userGuardiansList: [
        {
          guardianAccount: '1@q.com',
          guardianType: 0,
          isLoginAccount: true,
          key: '1@q.com&undefined',
          verifier: undefined,
        },
        {
          guardianAccount: '2@q.com',
          guardianType: 0,
          isLoginAccount: false,
          key: '2@q.com&undefined',
          verifier: undefined,
        },
      ],
      userGuardianStatus: {
        '1@q.com&undefined': {
          guardianAccount: '1@q.com',
          guardianType: 0,
          isLoginAccount: true,
          key: '1@q.com&undefined',
          status: undefined,
          verifier: undefined,
        },
        '2@q.com&undefined': {
          guardianAccount: '2@q.com',
          guardianType: 0,
          isLoginAccount: false,
          key: '2@q.com&undefined',
          status: undefined,
          verifier: undefined,
        },
        guardianExpiredTime: undefined,
      },
    });
  });
});

describe('setPreGuardianAction', () => {
  test('action.payload is null, preGuardian will be reset', () => {
    expect(reducer({ preGuardian: mockCurrentGuardian }, setPreGuardianAction())).toEqual({
      preGuardian: undefined,
    });
  });
  test('action.payload exist, userGuardianStatus exist', () => {
    expect(
      reducer(
        {
          preGuardian: undefined,
          userGuardianStatus: {
            '1@q.com&Gauss': {
              ...mockUserGuardiansListItem1,
              status: undefined,
            },
          },
        },
        setPreGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...mockUserGuardiansListItem1,
          status: undefined,
        },
      },
      preGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
  test('action.payload exist, userGuardianStatus does not exist', () => {
    expect(
      reducer(
        {
          preGuardian: undefined,
        },
        setPreGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      preGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
});

describe('setOpGuardianAction', () => {
  test('action.payload is null, opGuardian will be reset', () => {
    expect(reducer({ opGuardian: mockCurrentGuardian }, setOpGuardianAction())).toEqual({
      opGuardian: undefined,
    });
  });
  test('action.payload exist, userGuardianStatus exist', () => {
    expect(
      reducer(
        {
          opGuardian: undefined,
          userGuardianStatus: {
            '1@q.com&Gauss': {
              ...mockUserGuardiansListItem1,
              status: undefined,
            },
          },
        },
        setOpGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...mockUserGuardiansListItem1,
          status: undefined,
        },
      },
      opGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
  test('action.payload exist, userGuardianStatus does not exist', () => {
    expect(
      reducer(
        {
          opGuardian: undefined,
        },
        setOpGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      opGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
});

describe('setCurrentGuardianAction', () => {
  test('this action will update currentGuardian and userGuardianStatus', () => {
    const guardianItem = {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
    };
    const payload = {
      ...guardianItem,
      key: '1@q.com&Gauss',
      status: 'Verified',
    };
    expect(
      reducer(
        {
          currentGuardian: guardianItem,
          userGuardianStatus: {
            '1@q.com&Gauss': guardianItem,
          },
        },
        setCurrentGuardianAction(payload),
      ),
    ).toEqual({
      currentGuardian: { ...guardianItem, status: 'Verified' },
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...guardianItem,
          status: 'Verified',
        },
      },
    });
    expect(
      reducer(
        {
          currentGuardian: guardianItem,
        },
        setCurrentGuardianAction(payload),
      ),
    ).toEqual({
      currentGuardian: { ...guardianItem, status: 'Verified' },
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...guardianItem,
          status: 'Verified',
        },
      },
    });
  });
});

describe('setUserGuardianStatus', () => {
  test('this action will update userGuardianStatus', () => {
    const payload = {
      '1@q.com&Gauss': {
        key: '1@q.com&Gauss',
        isLoginAccount: false,
        guardianAccount: '1@q.com',
        guardianType: 0,
      },
    };
    expect(reducer({ userGuardianStatus: {} }, setUserGuardianStatus(payload))).toEqual({
      userGuardianStatus: payload,
    });
  });
});

describe('setUserGuardianItemStatus', () => {
  const userGuardianStatus = {
    '1@q.com&Gauss': {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
    },
  };
  const payload = {
    key: '1@q.com&Gauss',
    signature: 'signature',
    verificationDoc: 'verificationDoc',
  };
  test('the key does not match, then there will throw an error', () => {
    expect(() =>
      reducer(
        { userGuardianStatus },
        setUserGuardianItemStatus({
          ...payload,
          key: '2@q.com&Gauss',
          status: 'Verifying' as VerifyStatus,
        }),
      ),
    ).toThrow;
  });
  test('the key does not match, userGuardianStatus does not exist', () => {
    expect(() =>
      reducer(
        { userGuardianStatus: undefined },
        setUserGuardianItemStatus({
          ...payload,
          key: '2@q.com&Gauss',
          status: 'Verifying' as VerifyStatus,
        }),
      ),
    ).toThrow;
  });
  test('the key exists, then there will be updated guardianItemStatus', () => {
    expect(
      reducer(
        { userGuardianStatus, guardianExpiredTime: 1111 },
        setUserGuardianItemStatus({
          ...payload,
          key: '1@q.com&Gauss',
          status: 'Verifying' as VerifyStatus,
        }),
      ),
    ).toEqual({
      userGuardianStatus: {
        '1@q.com&Gauss': {
          isLoginAccount: false,
          guardianAccount: '1@q.com',
          guardianType: 0,
          key: '1@q.com&Gauss',
          status: 'Verifying',
          signature: 'signature',
          verificationDoc: 'verificationDoc',
        },
      },
      guardianExpiredTime: 1111,
    });
  });
  test('the key exists, then generate guardianExpiredTime', () => {
    const state = reducer(
      { userGuardianStatus, guardianExpiredTime: undefined },
      setUserGuardianItemStatus({
        ...payload,
        status: 'Verifying' as VerifyStatus,
      }),
    );
    expect(state).toMatchObject({
      userGuardianStatus,
      guardianExpiredTime: expect.any(Number),
    });
  });
});

describe('resetUserGuardianStatus', () => {
  test('this action will reset userGuardianStatus', () => {
    expect(reducer({ userGuardianStatus: mockUserGuardianStatus }, resetUserGuardianStatus())).toEqual({
      userGuardianStatus: {},
    });
  });
});

describe('setUserGuardianSessionIdAction', () => {
  const payload = {
    key: '1@q.com&Gauss',
    verifierInfo: {
      sessionId: 'sessionId',
      endPoint: 'endPoint',
    },
  };
  const userGuardianStatus = {
    '1@q.com&Gauss': {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
    },
  };
  const guardian2 = {
    isLoginAccount: false,
    guardianAccount: '1@q.com',
    guardianType: 0,
    key: '2@q.com&Gauss',
  };
  const newUserGuardianStatus = {
    '1@q.com&Gauss': {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
      verifierInfo: {
        sessionId: 'sessionId',
        endPoint: 'endPoint',
      },
    },
  };
  test('the key does not exist', () => {
    const currentGuardian = guardian2;
    expect(() => reducer({ currentGuardian }, setUserGuardianSessionIdAction(payload))).toThrow;
    expect(() => reducer({ userGuardianStatus, currentGuardian }, setUserGuardianSessionIdAction(payload))).toThrow;
  });
  test('the key exists, currentGuardian`key is equal to key', () => {
    expect(
      reducer({ userGuardianStatus, currentGuardian: guardian2 }, setUserGuardianSessionIdAction(payload)),
    ).toEqual({
      userGuardianStatus: newUserGuardianStatus,
      currentGuardian: guardian2,
    });
  });
  test('the key exists, currentGuardian`key is not equal to key', () => {
    const currentGuardian = guardian2;
    expect(reducer({ userGuardianStatus, currentGuardian }, setUserGuardianSessionIdAction(payload))).toEqual({
      userGuardianStatus: newUserGuardianStatus,
      currentGuardian,
    });
    expect(reducer({ userGuardianStatus }, setUserGuardianSessionIdAction(payload))).toEqual({
      userGuardianStatus: newUserGuardianStatus,
    });
  });
});
