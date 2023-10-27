import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

export function RadioGrpBtns({options, onChange, formLabel, answer} : {options: any, onChange: any, formLabel: string, answer: string}){

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>){
    onChange((event.target as HTMLInputElement).value);
  }

   return <div>
  <FormControl>
    <FormLabel id="demo-radio-buttons-group-label">{formLabel}</FormLabel>
    <RadioGroup         
      onChange = {changeHandler}
      aria-labelledby="demo-radio-buttons-group-label"
      name="radio-buttons-group"
      value={answer}
    >
        {options.map((el: string, index: number) => <FormControlLabel key={el} value={String(index + 1)} control={<Radio />} label={el} />)}
    </RadioGroup>
  </FormControl>
   </div>
 
}