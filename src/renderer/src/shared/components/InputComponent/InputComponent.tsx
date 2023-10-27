import { TextField } from "@mui/material";

export function InputComponent({type, value, label, onChange, sx}: {type?: string, value: any, label: string, onChange: any, sx?: any}){
    
    function changeHandler(event: React.ChangeEvent<HTMLInputElement>){
        onChange((event.target as HTMLInputElement).value)
    
    }


    if(type === 'number') return <TextField 
    sx={sx}
    type="number"
    variant="standard"
    value={value}
    onChange={changeHandler}
    InputProps={{
    inputProps: { 
        min: 5 
        }
        }}
    label={label}
    />

    else return <TextField 
    sx={sx}
    variant="standard"
    value={value}
    onChange={changeHandler}
    label={label}
    />

}