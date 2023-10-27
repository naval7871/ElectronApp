import { Typography } from "@mui/material";

export function SideHeading({content} : {content: string}){
    return <Typography component={'h6'}
            variant="h6"
            color='rgb(0, 120, 212)'
            sx={{
                mb: 1
            }}>
        {content}
    </Typography>
}