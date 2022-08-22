import { Container, Grid, Typography } from "@mui/material"
import { Outlet } from "react-router-dom"
import "./App.css"
import Footer from "./components/Footer"

export default function App() {
  return (
    <>
      <Container className="content">
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <header>
              <Typography variant="h2" style={{ margin: "0.2em 0", textAlign: "center" }}>
                Mic Authentificator
              </Typography>
            </header>
          </Grid>
          <Grid item xs={12} component="main">
            <Outlet />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}
