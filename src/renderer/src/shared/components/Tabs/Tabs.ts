import { Box, styled } from "@mui/material";

export const StyledTab = styled(Box)`
color: inherit;
cursor: pointer;
display: flex;
cursor: pointer;
justify-content: space-between;
width: 100%;
padding-left: 10px;
padding-top: 8px;
padding-bottom: 8px;
&:hover {
    background-color: rgb(54, 54, 54)
}
`

// width: ${props => props.type === 'topBar' ? '250px': '100%'}
// background-color: ${props => props.isActive && props.type === 'topBar'? 'rgb(31 31 31)': 'inherit' }

