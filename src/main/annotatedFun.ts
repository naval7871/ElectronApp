import { SpecificityArr, annotatorDetailsSeparator } from "./constants";
import { contentBtwSeparators } from "./helper";

export function isAnnotatedOrNotFun(textContent){

try {
    
let annotatorsDetails = JSON.parse(textContent.split(annotatorDetailsSeparator)[1]);
let SpecificityObj = JSON.parse(contentBtwSeparators([...SpecificityArr, textContent]));        

return !!Number(annotatorsDetails["Time taken to complete the task (in mins)"].trim()) && !! annotatorsDetails["Annotator name"].trim()  && !!SpecificityObj.answer.trim()
}
catch(e){
return false;
}
}
