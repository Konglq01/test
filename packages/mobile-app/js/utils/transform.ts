import R from 'ramda';
import Immutable from 'seamless-immutable';

// is this object already Immutable?
const isImmutable = R.has('asMutable');

// change this Immutable object into a JS object
const convertToJs = (state: any) => state.asMutable({ deep: true });

// optionally convert this object into a JS object if it is Immutable
const fromImmutable = R.when(isImmutable, convertToJs);

// convert this JS object into an Immutable object
const toImmutable = (raw: any) => Immutable(raw);

export const immutablePersistenceTransform = {
  out: (state: any) => {
    return toImmutable(state);
  },
  in: (raw: any) => {
    return fromImmutable(raw);
  },
};
