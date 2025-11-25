import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import metricsReducer from './slices/metricsSlice';
import uiReducer from './slices/uiSlice';


const rootReducer = combineReducers({
  metrics: metricsReducer,
  ui: uiReducer,
});

const persistConfig = { key: 'root', storage, whitelist: ['ui'] };
const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,        
    }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
