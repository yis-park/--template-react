import "./App.scss";
import { createContext, useMemo, useState } from "react";
import {
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Home from "./Home";
import BreakOut from "./BreakOut";
import { Route, Routes } from "react-router-dom";
import Memory from "./Memory";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
      },
    })
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            bgcolor: "divider",
            color: "text.primary",
            borderRadius: 1,
            p: 3,
            height: "100vh",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {theme.palette.mode} mode
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </div>
          <div>
            <Routes>
              <Route path="/" element={<Home theme={theme} />} />
              <Route path="/breakOut" element={<BreakOut />} />
              <Route path="/memory" element={<Memory />} />
            </Routes>
          </div>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
