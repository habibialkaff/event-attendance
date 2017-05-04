import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';

import auth from '../reducers/auth';
import event from '../reducers/event';
import member from '../reducers/member';
import phoneList from '../reducers/phoneList';

// const logger = createLogger();
const reducer = combineReducers(
  {
    auth, event, member, phoneList
  }
);

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware];
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
