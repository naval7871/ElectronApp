import { useMemo, useState, useEffect, useRef, memo } from "react";
import { SpecificityArr, annotatorDetailsSeparator, instructionArr, supportArr } from "../../constants/maliciousConstants";
import { contentBtwSeparators } from "./helper";
import { Box, Button, Typography } from "@mui/material";
import { RadioGrpBtns } from "../../shared/components/RadioBtns/RadioGrpBtns";
import { SideHeading } from "../../shared/components/sideHeadings/SideHeading";
import MainSectionContent from "./MainSectionContent";
import { OpenModal } from "../../shared/components/Modals/OpenModal";
import { CopyComponent } from "../../shared/components/copyComponent/CopyComponent";
import { TempSavedDataInterface, changesAreDoneToMainSection, reviewLater, saveFileTemp } from "../../features/files/filesSlice";
import { useAppDispatch } from "../../app/hooks";
import { saveFileAsync } from "../../features/thunks/thunks";
import {cloneDeep} from 'lodash'
import { InputComponent } from "../../shared/components/InputComponent/InputComponent";
import { showNotification } from "../../features/notification/notificationSlice";


enum ChangeableValuesEnum {
    ANSWER = 'answer',
    ANNOTATOR_NAME = 'annotator_name',
    TIME_TAKEN = 'time_taken'
}

function setTempVals(isDataModified: boolean, obj: any){
    if(isDataModified) return obj.temp;
    else if(!!obj.other1) return obj.other1;
    else return obj.other2
}


function MainSection({textContent, name, tempData, annotatorNameFromStore, isDataModified}: {textContent: string, name: string, tempData: TempSavedDataInterface, annotatorNameFromStore: string, isDataModified: boolean}){

    const dispatch = useAppDispatch();
    const { answer : tempAns, time: timeTemp, annotatorName: annotatorNameTemp } = tempData;

    const {instructionText, supportText, specificityRatingJson, annotatorsDetails, answer,  timeFromFile, annotatorNameFromFile}
    = useMemo(() => {
    let instructionText = contentBtwSeparators([...instructionArr, textContent])
    let supportText = contentBtwSeparators([...supportArr, textContent])
    let specificityRatingJson = JSON.parse(contentBtwSeparators([...SpecificityArr, textContent]))
    let answer = specificityRatingJson.answer
    let annotatorsDetails = JSON.parse(textContent.split(annotatorDetailsSeparator)[1]);
    let timeFromFile = annotatorsDetails["Time taken to complete the task (in mins)"]
    let annotatorNameFromFile = annotatorsDetails["Annotator name"]

    return {instructionText, supportText, specificityRatingJson, annotatorsDetails, answer, timeFromFile, annotatorNameFromFile}
    }, [textContent])  
    

    const localAnsRef = useRef(tempAns || answer);
    const localTimeRef = useRef(setTempVals(isDataModified, {temp: timeTemp, other1: timeFromFile}))
    const localAnnotatorNameRef = useRef(setTempVals(isDataModified, {temp: annotatorNameTemp, other1: annotatorNameFromFile, other2: annotatorNameFromStore}))

    const [localAns, setLocalAns] = useState<string>(tempAns || answer);
    const [localTime, setLocalTime] = useState<string>(setTempVals(isDataModified, {temp: timeTemp, other1: timeFromFile}));
    const [ localAnnotatorName , setLocalAnnotatorName ] = useState<string>(setTempVals(isDataModified, {temp: annotatorNameTemp, other1: annotatorNameFromFile, other2: annotatorNameFromStore}));

    function getNewStringForReplace(type?: string){

        if(type === 'annotatorDetails')
        {
            let annotatorsDetailsCopy = cloneDeep(annotatorsDetails);
            annotatorsDetailsCopy["Annotator name"] = localAnnotatorName.trim()
            annotatorsDetailsCopy["Time taken to complete the task (in mins)"] = localTime
    
            let newAnnotatorDetails = JSON.stringify(annotatorsDetailsCopy, null, 4)
            return newAnnotatorDetails
        }

        let specificityRatingJsonCopy = cloneDeep(specificityRatingJson);
        specificityRatingJsonCopy.answer = localAns;
        let newString = JSON.stringify(specificityRatingJsonCopy, null, 4)
        return newString;
    }

    function saveFun(){
        // if(!answer && !tempAns && !Number(timeTemp) && 
        // !Number(annotatorsDetails["Time taken to complete the task (in mins)"])
        // ) return;

        if(!!localAns && !!localAnnotatorName && !!localTime && Number(localTime) >= 5) 
        {
            
       let newString = getNewStringForReplace() // for answers
       let annotatorDetailsReplace = getNewStringForReplace('annotatorDetails')
        dispatch(saveFileAsync({fileName: name, newString: newString, annotatorDetailsReplace: annotatorDetailsReplace}))   
            return;
        }

        let message = Number(localTime) < 5 ? "Minimum time should be above 5 min": 'All the fields needs to be filled';

        dispatch(showNotification({message: message, isSuccess: false}))     
    }

    function reviewLaterFun(){
        if(!answer) return;
        let obj = { 
            fileName: name,
            answer: answer

        }
        dispatch(reviewLater(obj))
    }

    function displayAnnotatorName(){

         return <div
        style={{display: 'flex', gap: 5, alignItems: 'center'}}><p>Name:</p>
         <InputComponent 
         value = {localAnnotatorName}
         label = ''
         onChange = {(name: any) => detailsModifiedFun(name , setLocalAnnotatorName, ChangeableValuesEnum.ANNOTATOR_NAME)}
         />
        </div>

    }


    function detailsModifiedFun(ans : any , setStateMethod : Function, changeableEnums: ChangeableValuesEnum){
            setStateMethod(ans);

            switch(changeableEnums) {
                case ChangeableValuesEnum.ANNOTATOR_NAME:
                    localAnnotatorNameRef.current = ans;
                    break;

                case ChangeableValuesEnum.ANSWER:
                    localAnsRef.current = ans;
                    break;

                case ChangeableValuesEnum.TIME_TAKEN:
                    localTimeRef.current = ans;
                    break;
                
            }

            dispatch(changesAreDoneToMainSection({isDataModified : true}))
            
    }


    useEffect(() => {
    return () => {        
            let obj = {
                fileName: name,
                answer: localAnsRef.current,
                time: localTimeRef.current,
                annotatorName: localAnnotatorNameRef.current.trim(),
             }
             
        dispatch(saveFileTemp(obj))
        }

    }, [])

    return <div style={{
        backgroundColor: 'rgb(31 31 31)',
        color: 'white',
        padding: 15,
        overflow: 'auto',
        position: 'relative',
        flex: 1
        }}>
    <Box sx={{position: 'absolute', 
    right: 15, 
    top: 15,
    zIndex: 20,
    display: 'flex',
    gap: 1
    }}>
        <Button onClick = {saveFun}>Save</Button>
        <Button onClick = {reviewLaterFun} disabled>Review Later</Button>

    </Box>
    <div style={{display: 'flex', gap: 10, alignItems: 'baseline'}}>
    <SideHeading content="Instruction"/>
    <CopyComponent textToCopy = {instructionText}/>
    </div>
    <Typography paragraph = {true}>{instructionText}</Typography>
    <Box>
        <div style={{display: 'flex', gap: 10, alignItems: 'baseline'}}>
        <SideHeading content="Suppport Content"/>
        <OpenModal>
       <MainSectionContent supportText = {supportText} maxHeight = '55vh' />
        </OpenModal>
        </div>
       <MainSectionContent supportText = {supportText} maxHeight = '25vh' />
        <Box sx={{display: 'flex', gap : 15}}>
            <div>
            <SideHeading content="Refusal Rating"/>
            <RadioGrpBtns 
            options={Object.values(specificityRatingJson.options)}
            onChange={(ans: any) => {detailsModifiedFun(ans , setLocalAns, ChangeableValuesEnum.ANSWER)}}
            formLabel = {specificityRatingJson.question}
            answer = {localAns}
            />
            </div>
            <div>
            <SideHeading content="Annotator Details"/>                
                {displayAnnotatorName()}              
                <InputComponent 
                type="number" 
                value = {localTime}
                label = 'Time Taken in Min'
                onChange = {(time: any) => {detailsModifiedFun(time , setLocalTime, ChangeableValuesEnum.TIME_TAKEN)}}
                />
            </div>
        </Box>
    </Box>
    </div>
    
}

export default memo(MainSection)