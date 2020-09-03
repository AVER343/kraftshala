import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import Error_Reducer from './error/error.reducers';
import MeetingReducer from './meeting/meetings.reducer';
import userReducer from './users/users.reducers';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
};

const rootReducer = combineReducers({
  user: userReducer,
  errors:Error_Reducer,
  meetings:MeetingReducer
});

export default persistReducer(persistConfig, rootReducer);