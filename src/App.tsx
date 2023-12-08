import "./App.scss";
import { createContext, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import Memory from "./Memory";
import Mario from "./Mario";
import Suberunker from "./Suberunker";
import BreakOutCopy from "BreakOutCopy";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  // 빌드시 콘솔 삭제
  if (process.env.NODE_ENV === "production") {
    console = window.console || {};
    console.log = function no_console() {};
    console.warn = function no_console() {};
    console.error = function () {};
  }

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
            minHeight: "100vh",
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
              <Route path="/breakOut" element={<BreakOutCopy />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/suberunker" element={<Suberunker />} />
              <Route path="/mario" element={<Mario />} />
            </Routes>
          </div>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
