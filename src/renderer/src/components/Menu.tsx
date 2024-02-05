import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { useAppDispatch } from '@renderer/app/hooks'
import { resetStore } from '@renderer/features/files/filesSlice'

export function Menu(): React.ReactElement {
  const dispatch = useAppDispatch()
  return (
    <Box className="menu">
      <Button
        onClick={(): void => {
          dispatch(resetStore())
        }}
      >
        Home
      </Button>
    </Box>
  )
}
