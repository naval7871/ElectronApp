import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import filesReducer from '../features/files/filesSlice'
import notificationReducer from '../features/notification/notificationSlice'

export const store = configureStore({
  reducer: {
    files: filesReducer,
    notification: notificationReducer
  },
})


export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// @ts-ignore
window.store = store;
