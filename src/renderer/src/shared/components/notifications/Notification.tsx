import { AlertProps, Snackbar } from "@mui/material";
import { RootState } from "../../../app/store";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { removeNotification } from "../../../features/notification/notificationSlice";
import React from "react";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  // function severityFun(isSuccess : boolean | undefined){
  //   if(isSuccess === undefined) return ''
  // }

export function Notification(){

    const {open, vertical, horizontal, message, isSuccess} = useAppSelector((store: RootState) => store.notification);
    const dispatch = useAppDispatch();

    function handleClose(){
        dispatch(removeNotification({open: false}))
    }

    if(isSuccess === undefined) return null;

    return <Snackbar
    autoHideDuration={4000}
    anchorOrigin={{ vertical, horizontal }}
    open={open}
    onClose={handleClose}
    message= {message}
  >
    <Alert 
    onClose={handleClose} 
    severity={isSuccess ? 'success' : 'error'} 
    sx={{ width: '100%', color: 'white' }}>
          {message}
        </Alert>
  </Snackbar>
}