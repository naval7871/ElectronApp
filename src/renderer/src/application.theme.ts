import { createTheme } from "@mui/material";

// const applicationTheme = {
//     typography: {
//       fontFamily: 'Roboto, sans-serif !important',
//     },
//     palette: {
//       primary: {
//         contrastText: "#FFF",
//         main: "#FFF",
//         // main: 'white'
//       },
//       secondary: {
//         main: "#2689EB",
//       },
//       background: {
//         main: 'rgb(43 43 43);'
//       },

//     },
//   };

  export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
      },
  })

  export const muiTheme = createTheme(darkTheme)