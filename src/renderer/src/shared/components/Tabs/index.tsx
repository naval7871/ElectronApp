import {StyledTab} from './Tabs';
import {useRef, useEffect, memo} from 'react'

interface TabsForSideBarAndTopBarInterface {
    onClick: any;
    children: any;
    onMouseOver?: any;
    onMouseOut?: any;
    style?: any;
    type: string;
    isActive?: Boolean;
    fileName: string;
}

function TabsForSideBarAndTopBar(props: TabsForSideBarAndTopBarInterface){
    const ref = useRef(null);
    const countRef = useRef(0);
    console.log(countRef.current++)

    useEffect(() => {
        // ref.current.scrollIntoView({behavior: "smooth", block: "center", inline: "start"})
        if(!!props.isActive){
            
        // @ts-ignore
            ref.current?.scrollIntoView({behavior: "smooth", inline: "center", block: 'start'});
        }
        
    }, [props.fileName, props.isActive])

    return <StyledTab 
    ref = {ref}
    onClick={props.onClick}
    onMouseOver = {props.onMouseOver? () => props.onMouseOver(): () => {}}
    onMouseOut={props.onMouseOut? () => props.onMouseOut(): () => {}}
    style={props.style}
    >{props.children}</StyledTab>
}

export default memo(TabsForSideBarAndTopBar)