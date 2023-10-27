import { useAppSelector } from "../../app/hooks"
import { selectFilesStatus } from "../../features/files/filesSlice";
import SideBar, { SideBarInterface } from "./SideBar";

export function SideBarComponent(){
    const fileSStatus = useAppSelector(selectFilesStatus)
    const filesForSideBar: any[] = fileSStatus.map(el => ({name: el.name, status: el.status, reviewLater: el.reviewLater, isActive: el.isActive, isDataModified: el.isDataModified}))
   

return (<div className="sideBar">
<div>
    {filesForSideBar.map((el: SideBarInterface) => <SideBar
    key = {el.name}
    name={el.name} 
    status= {el.status} 
    reviewLater={el.reviewLater}
    isActive = {el.isActive}
    isDataModified = {el.isDataModified}
    />)}
</div>
</div>
   
)
}