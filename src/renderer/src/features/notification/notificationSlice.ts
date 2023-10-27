import { SnackbarOrigin } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";


interface initialStateNotification extends SnackbarOrigin {
    open: boolean;
    message: string
    isSuccess: boolean | undefined
  }

const initialState : initialStateNotification = {
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    message: '',
    isSuccess: true
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        showNotification(state, action){
            let {message , isSuccess} = action.payload
            state.open = true;
            state.message = message;
            state.isSuccess = isSuccess;
            return state;
        },
// @ts-ignore
        removeNotification(state, action){
            state.open = false;
            state.message = ''
            state.isSuccess = undefined;
            return state;
        }
    }
})



export const { showNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
