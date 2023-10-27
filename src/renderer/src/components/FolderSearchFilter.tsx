import { Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useAppSelector } from "../app/hooks";
import { selectFolderName } from "../features/files/filesSlice";

export function FolderSearchFilter(){
    const folderName = useAppSelector(selectFolderName)
    return (
        <div 
        style={{display: 'flex', 
        backgroundColor: 'rgb(43 43 43)', 
        color: 'white',
        lineHeight: 2.85,
        justifyContent: "space-between",
        alignItems: 'center',
        padding: 12,
        borderBottom: '1px solid rgb(31 31 31)'
        }}>
            <Typography component={'h6'} variant="h6" sx = {{fontSize: 15, fontStyle: 'italic', fontWeight: 'bold'}}>{folderName.toUpperCase()}</Typography>
            <div style={{display: 'flex', gap: 10}}>
            <SearchIcon color="disabled"/>
            <FilterAltIcon color="disabled" />
            </div>
        </div>
    );
}