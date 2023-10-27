import { useState } from "react";
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export function CopyComponent({textToCopy} : {textToCopy : string}){
const [clicked, setClicked] = useState(false);
let CopyIcon = clicked ? LibraryAddCheckIcon : ContentCopyIcon

function copyFun(){
    let timeRef;   
    if(timeRef) {
        clearTimeout(timeRef);
    }
    setClicked(true);
    navigator.clipboard.writeText(textToCopy)
    timeRef = setTimeout(() => {
        setClicked(false)
    }, 1000)
}

return <CopyIcon onClick = {copyFun} sx={{fontSize: 16, cursor: 'pointer'}} titleAccess="copy"/>
}