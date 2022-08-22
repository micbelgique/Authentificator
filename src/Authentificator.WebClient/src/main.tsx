import { CssBaseline, Zoom } from "@mui/material"
import { SnackbarProvider } from "notistack"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "./App"
import Home from "./routes/Home"
import Preferences from "./routes/Preferences"
import Register from "./routes/Register"
import Scan from "./routes/Scan"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={Zoom}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/register" element={<Register />} />
            <Route path="/preferences" element={<Preferences />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  </React.StrictMode>
)

