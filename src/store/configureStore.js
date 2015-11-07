import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import auth from '../reducers/auth';
import event from '../reducers/event';
import member from '../reducers/member';

const logger = createLogger();
const reducer = combineReducers(
    {
        auth, event, member
    }
);

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware, logger]
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(reducer, initialState);
}
