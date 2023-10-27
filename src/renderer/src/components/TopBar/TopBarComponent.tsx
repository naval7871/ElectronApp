import { useAppSelector } from "../../app/hooks"
import { selectFilesNameForTopBar } from "../../features/files/filesSlice"
import TopBar from "./TopBar"

export function TopBarComponent() {
  const topBarFiles = useAppSelector(selectFilesNameForTopBar)
  const filesForTopBar = topBarFiles.map((el) => ({
    name: el.name,
    isActive: el.isActive,
  }))

  return (
    <div className="topBar">
      {filesForTopBar.map((el) => (
        <TopBar key={el.name} name={el.name} isActive={el.isActive} />
      ))}
    </div>
  )
}
