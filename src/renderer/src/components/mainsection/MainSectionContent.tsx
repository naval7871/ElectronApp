import { memo } from "react"

function MainSectionContent({supportText, maxHeight} : {supportText: string, maxHeight: string}){
    return  <pre 
    style={{whiteSpace: 'pre-wrap', 
    fontSize: 16, 
    lineHeight: 1.5,
    padding: 5,
    margin: '10px 0px',
    maxHeight: maxHeight,
    overflow: 'auto',
    backgroundColor: 'rgb(43 43 43)'
    }}>{supportText}</pre>
}

export default memo(MainSectionContent)