import {memo} from 'react';
import { statusEnum } from '../../features/files/filesSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlakyIcon from '@mui/icons-material/Flaky';
import { useAppDispatch } from '../../app/hooks';
import { readFileAsync } from '../../features/thunks/thunks';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TabsForSideBarAndTopBar from '../../shared/components/Tabs';
import CircleIcon from '@mui/icons-material/Circle';

export interface SideBarInterface {
    name: string;
    status: statusEnum;
    reviewLater: Boolean;
    isActive: Boolean;
    isDataModified: Boolean
}

function SideBar({name, status, reviewLater, isActive, isDataModified} : SideBarInterface){
    const dispatch = useAppDispatch()

let statusIcon = function(status: statusEnum){
    if(status === statusEnum.NOT_COMPLETED) return <ErrorOutlineIcon sx={{color: 'yellow'}}/>
    if(status === statusEnum.COMPLETED) return <CheckCircleIcon sx={{color: 'green'}}/>
    return <FlakyIcon />
}

function openFileFun(fileName: string){
    !isActive && dispatch(readFileAsync(fileName))
}

return (
<TabsForSideBarAndTopBar 
onClick={() => openFileFun(name)}
type = "sideBarTab"
isActive={isActive}
style={{
    backgroundColor: isActive ? 'rgb(26 26 26)': '',
}}
fileName = {name}
>
    <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
    {isDataModified && <CircleIcon sx = {{fontSize: 10}}/>}
    <Typography component="h6" className='fileName' 
    title={name}
    sx={{
        color: isActive? 'rgb(0, 120, 212)': 'white',
        fontSize: 13
    }}> {name}</Typography>
    </div>

    <div className='iconsStyle'>
        <Tooltip title={status}>
    {statusIcon(status)}
        </Tooltip>
    {reviewLater?<Tooltip 
    title= "Review Later"
    placement='right'
    >
        <VisibilityIcon/>
    </Tooltip>: null}
    </div>
</TabsForSideBarAndTopBar>
)
}

export default memo(SideBar)