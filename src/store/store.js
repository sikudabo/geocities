import { createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux'; //Module to combine all of the reducers in our reducers folder.
import storage from 'redux-persist/lib/storage';
import counterReducer from '../reducers/counterReducer';
import userReducer from '../reducers/userReducer';
import themeReducer from '../reducers/themeReducer';
import userThemeReducer from '../reducers/userThemeReducer';
import userPostsReducer from '../reducers/userPostsReducer';
import userModeReducer from '../reducers/userModeReducer';
import visitorPostsReducer from '../reducers/visitorPostsReducer';

const persistConfig = {
    key: 'root',
    storage,
};

const myReducers = combineReducers({
    counterReducer: counterReducer,
    userReducer: userReducer,
    themeReducer: themeReducer,
    userThemeReducer: userThemeReducer,
    userPostsReducer: userPostsReducer,
    userModeReducer: userModeReducer,
    visitorPostsReducer: visitorPostsReducer,
});

const persistedReducers = persistReducer(persistConfig, myReducers);

const store = createStore(persistedReducers);

export default store;