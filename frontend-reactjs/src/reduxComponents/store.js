import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './videoSlice' //export default do it a' m
import selectedItemReducer from './selectedItemSlice' //export default do it a' m
import subDataReducer from './subDataSlice';
import userAndProjectSlice from './userAndProjectSlice';
import loadingStatusSlice from './loadingStatusSlice';

export const store = configureStore({
  reducer: {
    videoPath: videoReducer,
    selectedItem: selectedItemReducer,
    subData: subDataReducer,
    currentUser: userAndProjectSlice,
    loadingStatus: loadingStatusSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
