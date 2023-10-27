import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useAppDispatch } from "@renderer/app/hooks";
import { resetStore } from "@renderer/features/files/filesSlice";

export function Menu(){
    const dispatch = useAppDispatch();
return (
    <Box className="menu">
        {/* <Button color = 'inherit' disabled>Save All</Button> */}
        <Button onClick={() => dispatch(resetStore())}>Home</Button>
        {/* <div style={{display: 'flex', marginRight: 30}}>
        <Switch defaultChecked />
        <Button color="inherit">Open Folder</Button>
        </div> */}
    </Box>
)
}