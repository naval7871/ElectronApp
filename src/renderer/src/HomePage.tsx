import UploadFileIcon from "@mui/icons-material/UploadFile"
import { Box, Button, TextField, Typography } from "@mui/material"
import { ipcRenderer } from "./globalVariables"
import { useAppDispatch } from "./app/hooks"
import {
  FilesNameForTopBarInterface,
  initialLoad,
  statusEnum,
} from "./features/files/filesSlice"
import { useState } from "react";

export function HomePage() {
  const dispatch = useAppDispatch();
  const [annotatorNameState, setAnnotatorNameState] = useState(() => {
    let annotatorName = localStorage.getItem('annotatorName')
    if(!!annotatorName) return annotatorName;
    else return ''
  });

  const [data, setData] = useState(null);

  function uploadHandler() {
    ipcRenderer.send("selectFolder")
    ipcRenderer.on("initial-load-success", (event: any) => {
      setData(event);
    })
  }

  function submitHandler(){

    if(!data || !annotatorNameState) return;

    let { filesDetailsArr, folderName } : {filesDetailsArr: [], folderName: string} = data

    let filesNameForTopBar: FilesNameForTopBarInterface[] = []
    let showHomeComp = !filesDetailsArr.length
    let annotatorName = annotatorNameState
    let statusOfAllFiles = filesDetailsArr.map((el: any) => ({
      name: el.fileName,
      textContent: el.isSuccess ? el.textContent : "",
      status: el.isAnnotatedOrNot
        ? statusEnum.COMPLETED
        : statusEnum.NOT_COMPLETED,
      reviewLater: false,
      isinTab: false,
      isActive: false,
      isSaved: true,
      tempSavedData: {},
      isError: !el.isSuccess,
      isDataModified: false
    }))

    let initialState = {
      showHomeComp,
      folderName,
      statusOfAllFiles,
      filesNameForTopBar,
      annotatorName,
    }
    // dispatch action to load initial store of the application;
    dispatch(initialLoad(initialState))
  }

  function setAnnotatorNameFun(e: any){
    let name = e.target.value;
    setAnnotatorNameState(name);
  }

  function saveToLocalStorage(){
    //@ts-ignore
    localStorage.setItem('annotatorName', annotatorNameState?.trim());
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <TextField id="standard-basic" label="Enter Name" variant="standard" 
      value={annotatorNameState}
      onChange={setAnnotatorNameFun}
      onBlur={saveToLocalStorage}
      />
      <div style={{display:'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
      <UploadFileIcon
        sx={{ fontSize: 46, cursor: "pointer" }}
        onClick={uploadHandler}
      />
      <Typography component="h5" variant="h5">
        Upload Folder
      </Typography>

      <Button onClick={submitHandler}>
        Submit
      </Button>
      </div>
    </Box>
  )
}
