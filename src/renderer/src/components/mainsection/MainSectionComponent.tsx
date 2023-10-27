import ErrorBoundary from "../../ErrorBoundary";
import { useAppSelector } from "../../app/hooks";
import { selectAnnotatorName, selectFilesStatus } from "../../features/files/filesSlice";
import  MainSection  from "./MainSection";

export function MainSectionComponent(){

    const fileSStatus = useAppSelector(selectFilesStatus);
    const annotatorNameFromStore = useAppSelector(selectAnnotatorName)
    const activeFile = fileSStatus.find(el => !!el.isActive);
    return <>
    {!!activeFile? 
    // @ts-ignore
    <ErrorBoundary key={activeFile.name}>
    <MainSection 
    textContent = {activeFile.textContent} 
    name = {activeFile.name} 
    tempData = {activeFile.tempSavedData}
    annotatorNameFromStore = {annotatorNameFromStore}
    isDataModified = {activeFile.isDataModified}
    />
    </ErrorBoundary>
    : null}
    </>
}