import { memo, useState } from "react";
import { useAppDispatch } from "../../app/hooks"
import { readFileAsync } from "../../features/thunks/thunks";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography";
import TabsForSideBarAndTopBar from "../../shared/components/Tabs";
import { closeFile } from "../../features/files/filesSlice";

function TopBar({name, isActive} : {name: string, isActive: boolean}){
    const dispatch = useAppDispatch();
    const [isHover, setIsHover] = useState(false)

    function closeFileFun(e: any, fileName: string){
        dispatch(closeFile({fileName: fileName, isActive: isActive}))
        e.stopPropagation();
    }

    function showCloseIcon(isActive: any){
        return (isHover || isActive)
    }

    return(<>
        <TabsForSideBarAndTopBar
        type="topBar"
        isActive = {isActive}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        // className="topBarEachTab"
        onClick={() => !isActive && dispatch(readFileAsync(name))}
        style={{
            backgroundColor: isActive? 'rgb(31 31 31)': 'rgb(24 24 24)',
            color: isActive? 'white': '#9d9d9d',
            borderTop: isActive? '2px solid #0078d4': '',
            width: 220,
            flexShrink: 0,
            borderRight: '1px solid gray',
            gap: 5
        }}
            fileName = {name}
            >
                <div style={{overflow: 'hidden', width: '80%', display: 'flex'}}>
                <Typography component="h6" 
                title={name}
                sx={{fontSize: 14, flexShrink: 0}}>{name}</Typography>
                </div>
                {showCloseIcon(isActive) &&<CloseIcon onClick ={(e) => closeFileFun(e, name)}/>}
            </TabsForSideBarAndTopBar>
    </>)
}

export default memo(TopBar)