import TransitionsModal from "./Modal"
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {useState} from 'react';

export function OpenModal(props: any){
    const {children} = props
    const [expand, setExpand] = useState(false)
    return <>
    <OpenInFullIcon sx={{fontSize: 16, cursor: 'pointer'}} onClick = {() => setExpand(true)}/>
    {expand &&  <TransitionsModal handler = {setExpand}>
        {children}
    </TransitionsModal>}
    </> 
}