import { guardiansSlice } from './slice'
import {
  resetVerifierState, 
  setVerifierListAction, 
  setGuardiansAction, 
  setCurrentGuardianAction, 
  setUserGuardianItemStatus
} from './actions'
import { LoginType } from '@portkey/types/types-ca/wallet'
const reducer = guardiansSlice.reducer


describe('resetVerifierState', () => {
  test('state should contain only verifierMap', () => {
    const state = {
      verifierMap: {
          'verifier1': {
              name: 'verifier1',
              imageUrl: 'imageUrl',
              url: 'url',
          }
      }
    }
    expect(reducer({
      userGuardiansList: [],
      ...state,
    }, resetVerifierState())).toEqual(state)
  })
})

describe('setVerifierListAction', () => {
  const state = {
    verifierMap: {
      'verifier1': {
        name: 'verifier1',
        imageUrl: 'imageUrl',
        url: 'url',
      }
    }
  }
  test('action.payload is null', () => {
    expect(reducer(state, setVerifierListAction(null))).toEqual({verifierMap: {}})
  })
  test('action.payload exist', () => {
    const verifier = [{
      name: 'verifier2',
      imageUrl: 'imageUrl',
      url: 'url',
    }]
    expect(reducer(state, setVerifierListAction(verifier))).toEqual({verifierMap: {
      'verifier2': {
        name: 'verifier2',
        imageUrl: 'imageUrl',
        url: 'url',
      },
    }})
  })
})

describe('setGuardiansAction', () => {
  test('The action.payload is null', () => {
  })
  test('The action.payload exist', () => {
  })
})

describe('setPreGuardianAction', () => {
  test('The action.payload is null', () => {
  })
  test('The action.payload exist', () => {
  })
})

describe('setOpGuardianAction', () => {
  test('The action.payload is null', () => {
  })
  test('The action.payload exist', () => {
  })
})

describe('setCurrentGuardianAction', () => {
  test('This action will update currentGuardian and userGuardianStatus', () => {
  })
})

describe('setUserGuardianStatus', () => {
  test('This action will update userGuardianStatus', () => {
  })
})

describe('setUserGuardianItemStatus', () => {
  test('The key is null, then there will throw an error', () => {
  })
  test('The key exists, then there will be updated guardianItemStatus', () => {
  })
})

describe('resetUserGuardianStatus', () => {
  test('This action will reset userGuardianStatus', () => {
  })
})

describe('setUserGuardianSessionIdAction', () => {
  test('The key is null', () => {
  })
  test('The key exists, currentGuardian`key is equal to key', () => {
  })
  test('The key exists, currentGuardian`key is not equal to key', () => {
  })
})