import { contentBtwSeparators } from "../../components/mainsection/helper";
import { SpecificityArr } from "../../constants/maliciousConstants";

export function extractAnserFromTextContent(textContent: string){
    let specificityRatingJson = JSON.parse(contentBtwSeparators([...SpecificityArr, textContent]))
    return specificityRatingJson.answer;
}