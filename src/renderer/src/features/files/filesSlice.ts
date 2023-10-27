import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { readFileAsync, saveFileAsync } from "../thunks/thunks";

export enum statusEnum {
    NOT_COMPLETED = 'notCompleted',
    PARTIALLY_COMPLETED = 'partiallyCompleted',
    COMPLETED = 'completed'
}

export interface TempSavedDataInterface {
    answer? : string;
    time?: string;
    annotatorName?: string;
}

interface StatusOfEachFile {
    name: string;
    status: statusEnum;
    reviewLater: Boolean;
    isinTab: Boolean;
    isActive: Boolean;
    textContent: string;
    isSaved: boolean;
    isError: boolean;
    tempSavedData: TempSavedDataInterface;
    isDataModified: boolean;
}

export interface FilesNameForTopBarInterface {
    name: string;
    isActive: Boolean;
}


interface InitialStateInterface {
    showHomeComp: boolean;
    folderName: string;
    statusOfAllFiles: StatusOfEachFile[];
    filesNameForTopBar: FilesNameForTopBarInterface[];
    annotatorName: string;
}

// get these data from .json file -- file reader

const statusOfAllFiles: StatusOfEachFile[] = [];

const initialState: InitialStateInterface = {
    showHomeComp: !statusOfAllFiles.length,
    folderName: '',
    statusOfAllFiles : statusOfAllFiles,
    filesNameForTopBar: [],
    annotatorName: ''
}


function openFile(state: any, action: any){
    let textContent = action.payload?.textContent
    let fileName = action.payload?.name;

    let oldActIndexInAllFiles = state.statusOfAllFiles.findIndex((el: StatusOfEachFile) => !!el.isActive);
    let indexInStatusOfAllFiles = state.statusOfAllFiles.findIndex((el: StatusOfEachFile) => el.name === fileName);

    let oldActIndexInTopBar = state.filesNameForTopBar.findIndex((el: any) => !!el.isActive)
    let indexInFilesForTopBar = state.filesNameForTopBar.findIndex((el: any) => el.name === fileName)


    // Directly changing the isActive property here(statusOfAllFiles) instead of looping

    if(oldActIndexInAllFiles !== -1)  state.statusOfAllFiles[oldActIndexInAllFiles].isActive = false
    state.statusOfAllFiles[indexInStatusOfAllFiles] = 
    {...state.statusOfAllFiles[indexInStatusOfAllFiles], textContent: textContent, isActive: true,}


    if(indexInFilesForTopBar !== -1){
        state.filesNameForTopBar[oldActIndexInTopBar].isActive = false;
        state.filesNameForTopBar[indexInFilesForTopBar].isActive = true;
    }
    else {
        let activeFileIndex = state.filesNameForTopBar.findIndex((el: any) => !!el.isActive);
        activeFileIndex !==-1 && (state.filesNameForTopBar[activeFileIndex].isActive = false);
        state.filesNameForTopBar.splice(activeFileIndex + 1, 0, {name: fileName, isActive: true})
        state.statusOfAllFiles[indexInStatusOfAllFiles].isinTab = true;
    }

    return state;

}

const filesSlice = createSlice({
    name: 'files',
    initialState: initialState,
    reducers: {
        // @ts-ignore
        initialLoad(state, action){
            const {showHomeComp, folderName, statusOfAllFiles, filesNameForTopBar, annotatorName} = action.payload;
            return {
                showHomeComp, folderName, statusOfAllFiles, filesNameForTopBar, annotatorName
            }
        },

        resetStore(){
            return initialState;
        },

        saveFileTemp(state, action){
            let {fileName, answer, time, annotatorName} = action.payload;
            let activeFile = state.statusOfAllFiles.find(el => el.name === fileName);

            if(activeFile){
              activeFile.tempSavedData = {...activeFile.tempSavedData, answer, time, annotatorName}
            }
            return state;
        },

        // @ts-ignore
        reviewLater(state, action){ 

        },

        // @ts-ignore
        changesAreDoneToMainSection(state, action) {
            let activeFile = state.statusOfAllFiles.find(el => !!el.isActive);

            if(activeFile)
            activeFile.isDataModified = true;

            return state;
        },

        closeFile(state, action){
            let {fileName, isActive} = action.payload;

            if(isActive){
                // if closed file is active, we are making isActive true to its previous indexed element in topFiles
                let index = state.filesNameForTopBar.findIndex(el => !!el.isActive);

                let indexInStatusOfAllFiles = state.statusOfAllFiles.findIndex((el: StatusOfEachFile) => el.name === fileName);
                state.statusOfAllFiles[indexInStatusOfAllFiles].isActive = false;

                // if index === 0
                if(!index) {
                    state.filesNameForTopBar = state.filesNameForTopBar.filter(el => el.name !== fileName);
                    
                    if(state.filesNameForTopBar.length === 0)
                    return state;
                    
                    else {
                        state.filesNameForTopBar[0].isActive = true;
                        let activeFileName = state.filesNameForTopBar[0].name

                        let newActIndexInAllFiles = state.statusOfAllFiles.findIndex((el: StatusOfEachFile) => el.name === activeFileName)
                        state.statusOfAllFiles[newActIndexInAllFiles].isActive = true;
                        return state;
                    }
                }

                let newActIndex = index - 1;
                state.filesNameForTopBar[newActIndex].isActive = true;
                let activeFileName = state.filesNameForTopBar[newActIndex].name

                let newActIndexInAllFiles = state.statusOfAllFiles.findIndex((el: StatusOfEachFile) => el.name === activeFileName)
                state.statusOfAllFiles[newActIndexInAllFiles].isActive = true;

            }

            state.filesNameForTopBar = state.filesNameForTopBar.filter(el => el.name !== fileName);
            return state;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(readFileAsync.fulfilled, (state, action) => {
            return openFile(state, action)
        })

        builder.addCase(saveFileAsync.fulfilled, (state, action) => {
            
            // @ts-ignore
            const {textContent, fileName} = action.payload
            let activeFile = state.statusOfAllFiles.find(el => el.name === fileName);
            
            if(!!activeFile){

                activeFile.textContent = textContent
                activeFile.isDataModified = false;
                activeFile.status = statusEnum.COMPLETED;
                activeFile.reviewLater = false;
                activeFile.isSaved = true;
                activeFile.tempSavedData = {}

            }
          

            return state;
        })

    }
})


export const selectFilesStatus = (state: RootState) => state.files.statusOfAllFiles
export const selectFilesNameForTopBar = (state: RootState) => state.files.filesNameForTopBar;
export const selectHomePageShow = (state: RootState) => state.files.showHomeComp;
export const selectFolderName = (state: RootState) => state.files.folderName;
export const selectAnnotatorName = (state: RootState) => state.files.annotatorName;

export const {saveFileTemp, reviewLater, initialLoad, closeFile, changesAreDoneToMainSection, resetStore} = filesSlice.actions;
export default filesSlice.reducer;