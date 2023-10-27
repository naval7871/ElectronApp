import { createAsyncThunk } from "@reduxjs/toolkit";
import { ipcRenderer } from "../../globalVariables";
import { showNotification } from "../notification/notificationSlice";

export const readFileAsync = createAsyncThunk('readFileAsync', async (fileName: any, thunkAPI) => {
const state: any = thunkAPI.getState();
const file = state.files.statusOfAllFiles.find((el: any) => el.name === fileName);

if(!!file && !!file.textContent) return {textContent: file.textContent, name: fileName};
else {
// make async opearation of reading local file and returning the data

ipcRenderer.send('readFile', fileName)

// @ts-ignore
return new Promise((res, rej) => {
// @ts-ignore
    ipcRenderer.on('readFile', (event : any, args : any) => {
        // @ts-ignore
        res( {textContent: event, name: fileName})
    
    })
})
}
})


export const saveFileAsync = createAsyncThunk('saveFileAsync', async (fileData: any, thunkAPI) => {

    const {dispatch} = thunkAPI;

    let {fileName, newString, annotatorDetailsReplace} = fileData

    ipcRenderer.send('saveFile', {fileName, newString, annotatorDetailsReplace});
    return new Promise((res, rej) => {
        ipcRenderer.on('fileSaved', (event: any) => {
            let {status, data} = event;
            if(status === 'success'){
                // @ts-ignore
                res({textContent: data, fileName: fileName});
                dispatch(showNotification({message: 'File Saved Successfully', isSuccess: true}))
            }
            else rej('failed');
        })
    })

})